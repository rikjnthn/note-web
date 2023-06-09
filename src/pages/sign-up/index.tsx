import React, { useState, useReducer, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import Pocketbase from "pocketbase";

import { usePocket } from "@/context/PocketProvider";

import type {
  ReducerActionType,
  SignUpInputType,
  ErrType,
} from "@/types/Signup";
import { SIGNUP_ACTION } from "@/constant/Signup";
import style from "@/styles/Signup.module.css";
import SubmitButton from "@/components/SubmitButton";

const initialSignupInput: SignUpInputType = {
  username: "",
  email: "",
  password: "",
  confirm_password: "",
};

function reducer(
  state: SignUpInputType,
  action: ReducerActionType
): SignUpInputType {
  const { type, payload } = action;

  switch (type) {
    case SIGNUP_ACTION.SET_USERNAME:
      return {
        ...state,
        username: payload,
      };
    case SIGNUP_ACTION.SET_EMAIL:
      return {
        ...state,
        email: payload,
      };
    case SIGNUP_ACTION.SET_PASSWORD:
      return {
        ...state,
        password: payload,
      };
    case SIGNUP_ACTION.SET_CONFIRM_PASSWORD:
      return {
        ...state,
        confirm_password: payload,
      };
    default:
      return {
        ...state,
      };
  }
}

export default function SignUp() {
  const { register, login, pb } = usePocket();
  const [signupInput, dispacth] = useReducer(reducer, initialSignupInput);
  const [err, setErr] = useState<ErrType>({
    username: false,
    email: false,
    confirm_password: false,
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setErr(() => {
      return {
        username: false,
        email: false,
        confirm_password: signupInput.confirm_password !== signupInput.password,
      };
    });
  }, [
    signupInput.confirm_password,
    signupInput.password,
    signupInput.username,
  ]);

  async function signUp() {
    setLoading(() => true);
    try {
      const { username, confirm_password, email, password } = signupInput;
      Promise.all([
        await register!(username, email, password, confirm_password),
        await login!(email ?? username, password),
      ]);
      const date = new Date();
      date.setDate(date.getDate() + 30);
      document.cookie =
        pb?.authStore.exportToCookie({ secure: true, expires: date }) ?? "";
      window.location.href = `${window.location.origin}/notes`;
    } catch (e: any) {
      const responseErr = e.response.data;
      setErr(() => {
        return {
          username: Boolean(responseErr.username),
          email: Boolean(responseErr.email),
          confirm_password: Boolean(responseErr.passwordConfirm),
        };
      });
    } finally {
      setLoading(() => false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    signUp();

    e.preventDefault();
  };

  const handleInput = (
    e: React.FormEvent<HTMLInputElement>,
    type: "SET_USERNAME" | "SET_EMAIL" | "SET_PASSWORD" | "SET_CONFIRM_PASSWORD"
  ) => {
    dispacth({
      type,
      payload: e.currentTarget.value.replace(/ /g, ""),
    });
  };

  return (
    <>
      <Head>
        <title>Sign Up - Note Web</title>
      </Head>
      <section className={style.sign_up}>
        <div>
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit} className={style.sign_up_form}>
            <div>
              <label>Username</label>
              <input
                onInput={(e) => handleInput(e, SIGNUP_ACTION.SET_USERNAME)}
                type="text"
                placeholder="Username"
                value={signupInput.username}
                minLength={4}
                maxLength={20}
                autoFocus
                required
              />
              {err.username && (
                <em>
                  Username must not using spaces or it have been used by other
                  person
                </em>
              )}
            </div>
            <div>
              <label>Email</label>
              <input
                onInput={(e) => handleInput(e, SIGNUP_ACTION.SET_EMAIL)}
                type="email"
                value={signupInput.email}
                placeholder="Email"
                required
              />
              {err.email && <em>Email is not valid or have already sign up</em>}
            </div>
            <div>
              <label>Password</label>
              <input
                onInput={(e) => handleInput(e, SIGNUP_ACTION.SET_PASSWORD)}
                type="password"
                name="password"
                placeholder="Password"
                value={signupInput.password}
                minLength={8}
                required
              />
            </div>
            <div>
              <label>Confirm Password</label>
              <input
                onInput={(e) =>
                  handleInput(e, SIGNUP_ACTION.SET_CONFIRM_PASSWORD)
                }
                type="password"
                name="confirm_password"
                placeholder="Password"
                value={signupInput.confirm_password}
                minLength={8}
                required
              />
              {err.confirm_password && (
                <em>Values doesn&apos;t match with the password</em>
              )}
            </div>
            <div>
              <div>
                <span>Already have an account? </span>
                <Link href="/login">login</Link>
              </div>
              <SubmitButton loading={loading} value="Create" />
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export async function getServerSideProps({
  req
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> {
  const pb = new Pocketbase();

  pb.authStore.loadFromCookie(req.headers.cookie ?? "");

  if (pb.authStore.model) {
    return {
      redirect: {
        destination: `/notes`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
