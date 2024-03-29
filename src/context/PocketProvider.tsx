import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

import Pocketbase, { Record, Admin } from "pocketbase";
import jwtDecode from "jwt-decode";

import useInterval from "@/hooks/useInterval";
import type { PocketContextType, TokenType } from "@/types/PocketProvider";

const fiveMinutesInMs: number = 300_000; // 5 * 60 * 1000
const twoMinutesInMs: number = 120_000; // 2 * 60 * 1000

const PocketContext = createContext<PocketContextType>({});

const PocketBase = ({
  apiUrl,
  children,
}: {
  apiUrl: string;
  children: JSX.Element | JSX.Element[];
}) => {
  const pb = useMemo(() => new Pocketbase(apiUrl), [apiUrl]);
  const date = useMemo(() => new Date(), []);

  const [token, setToken] = useState<string>(pb.authStore.token);
  const [user, setUser] = useState<Record | Admin | null>(pb.authStore.model);

  useEffect(() => {
    pb.authStore.loadFromCookie(document.cookie);
    pb.authStore.onChange((token, user) => {
      setToken(() => token);
      setUser(() => user);

      if (user) {
        date.setDate(date.getDate() + 30);
        document.cookie = pb.authStore.exportToCookie({
          httpOnly: false,
          expires: date,
        });
      }
    });
  }, [pb.authStore, date]);

  useEffect(() => {
    if (pb.authStore.model) {
      date.setDate(date.getDate() + 30);
      document.cookie = pb.authStore.exportToCookie({
        httpOnly: false,
        expires: date,
      });
    }
  }, [pb.authStore, date]);

  const register = async (
    username: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) => {
    return await pb
      .collection("users")
      .create({ username, email, password, passwordConfirm });
  };

  const login = async (usernameOrEmail: string, password: string) => {
    return await pb
      .collection("users")
      .authWithPassword(usernameOrEmail, password);
  };

  const logout = () => {
    pb.authStore.clear();
  };

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.isValid) return;
    const decode: TokenType = jwtDecode(token);
    const tokenExpiration = decode?.exp;
    const expirationWithBuffer = (decode?.exp + fiveMinutesInMs) / 1000;
    if (tokenExpiration < expirationWithBuffer)
      await pb.collection("users").authRefresh();
  }, [token, pb]);

  useInterval(refreshSession, token ? twoMinutesInMs : null);
  return (
    <PocketContext.Provider
      value={{ login, register, logout, user, token, pb }}
    >
      {children}
    </PocketContext.Provider>
  );
};

export const usePocket = () => useContext<PocketContextType>(PocketContext);

export default PocketBase;
