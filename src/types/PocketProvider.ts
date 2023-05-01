import Pocketbase, { Record, Admin, RecordAuthResponse } from "pocketbase";

export interface PocketContextType {
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

export interface TokenType {
  exp: number;
}
