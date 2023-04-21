import React, { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import isEmail from "validator/lib/isEmail";

import { usePocket } from "@/context/PocketProvider";

import style from "@/styles/Login.module.css";
import SubmitButton from "@/components/SubmitButton";

export default function Login() {
  const { login, pb } = usePocket();
  const [error, setError] = useState<boolean>(false);
  const [loginInput, setLoginInput] = useState<{
    email_or_username: string;
    password: string;
  }>({
    email_or_username: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleInput = (
    key: "email_or_username" | "password",
    value: string
  ) => {
    setLoginInput((prevInput) => {
      return {
        ...prevInput,
        [key]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(() => true);
      const loginData = await login!(
        loginInput.email_or_username,
        loginInput.password
      );
      window.location.href = `${window.location.origin}/notes`;
    } catch (e) {
      setError(() => true);
    } finally {
      setLoading(() => false);
    }
  };

  useEffect(() => {
    setError(() => false);
  }, [loginInput.email_or_username, loginInput.password]);

  return (
    <>
      <Head>
        <title>Login - Note Web</title>
      </Head>
      <section className={style.login}>
        <div>
          <h2>Login</h2>
          <form onSubmit={handleSubmit} className={style.login_form}>
            <div>
              <label>Email / Username</label>
              <input
                onInput={(e) =>
                  handleInput(
                    "email_or_username",
                    e.currentTarget.value.replace(/ /g, "")
                  )
                }
                placeholder="Email or Username"
                value={loginInput.email_or_username}
                autoFocus
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                onInput={(e) =>
                  handleInput(
                    "password",
                    e.currentTarget.value.replace(/ /g, "")
                  )
                }
                type="password"
                placeholder="Password"
                value={loginInput.password}
                minLength={8}
                required
              />
              {error && (
                <em>
                  {isEmail(loginInput.email_or_username) ? "Email" : "Username"}{" "}
                  or password is incorrect
                </em>
              )}
            </div>
            <div>
              <div>
                <Link href="/sign-up">Create account</Link>
              </div>
              <SubmitButton loading={loading} value="Login" />
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
        destination: `/notes`,
        permanent: false,
      },
      props: {},
    };
  }
  return {
    props: {},
  };
}
