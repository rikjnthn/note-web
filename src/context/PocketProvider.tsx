import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import Pocketbase, { RecordAuthResponse, Record, Admin } from "pocketbase";
import jwtDecode from "jwt-decode";

import useInterval from "@/hooks/useInterval";

const fiveMinutesInMs: number = 300_000; // 5 * 60 * 1000
const twoMinutesInMs: number = 120_000; // 2 * 60 * 1000
const BASE_URL: "http://127.0.0.1:8090" = "http://127.0.0.1:8090";

interface PocketContextType {
  login?: (
    usernameOrEmail: string,
    password: string
  ) => Promise<RecordAuthResponse<Record>>;
  register?: (
    username: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) => Promise<Record>;
  logout?: () => void;
  user?: Record | Admin | null;
  token?: string;
  pb?: Pocketbase;
}

const PocketContext = createContext<PocketContextType>({});

const PocketBase = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const pb = new Pocketbase(BASE_URL);
  const date = new Date();

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
  }, [pb.authStore]);

  useEffect(() => {
    if (pb.authStore.model) {
      date.setDate(date.getDate() + 30);
      document.cookie = pb.authStore.exportToCookie({
        httpOnly: false,
        expires: date,
      });
    }
  }, []);

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

  interface TokenType {
    exp: number;
  }

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.isValid) return;
    const decode: TokenType = jwtDecode(token);
    const tokenExpiration = decode?.exp;
    const expirationWithBuffer = (decode?.exp + fiveMinutesInMs) / 1000;
    if (tokenExpiration < expirationWithBuffer)
      await pb.collection("users").authRefresh();
  }, [token]);

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
