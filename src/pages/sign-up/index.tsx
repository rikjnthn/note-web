import React, { useState, useReducer, useEffect, useCallback } from "react";
import Link from "next/link";
import Head from "next/head";

import { usePocket } from "@/context/PocketProvider";

import type {
  ReducerActionType,
  SignUpInputType,
  ErrType,
} from "@/types/Signup";
import { SIGNUP_ACTION } from "@/constant/Signup";
import style from "@/styles/Signup.module.css";
import SubmitButton from "@/components/SubmitButton";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

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
      const [registerResult] = await Promise.all([
        await register!(username, email, password, confirm_password),
        await login!(email ?? username, password),
      ]);
      const date = new Date()
      const time = date.getTime()
      const expired = time + 1000*3600*24*30
      date.setTime(expired)  
      document.cookie = pb?.authStore.exportToCookie({secure: true, expires: date}) ?? ''
      window.location.href = `${window.location.origin}/${registerResult.username}`;
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

  const MemoizedLink = useCallback(() => <Link href="/login">login</Link>, []);
  return (
    <>
      <Head>
        <title>Sign Up - Note Web</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
                {/* <MemoizedLink /> */}
              </div>
              <SubmitButton loading={loading} value="Sign up" />
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export async function getServerSideProps({
  req,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> {
  if (req.cookies.pb_auth) {
    return {
      redirect: {
        destination: `/${JSON.parse(req.cookies.pb_auth ?? "").model.username}`,
        permanent: false,
      },
      props: {},
    };
  }
  return {
    props: {},
  };
}
