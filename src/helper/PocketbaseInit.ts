import Pocketbase from "pocketbase";
import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

export default async function pocketbaseInit(
  req: IncomingMessage & { cookies: NextApiRequestCookies }
) {
  const pb = new Pocketbase("http://127.0.0.1:8090");

  pb.authStore.loadFromCookie(req.headers.cookie ?? "");

  try {
    pb.authStore.isValid && pb.collection("users").authRefresh();
  } catch {
    pb.authStore.clear();
  }
  return pb;
}
