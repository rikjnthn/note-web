
export interface ReducerActionType {
  type: "SET_USERNAME" | "SET_EMAIL" | "SET_PASSWORD" | "SET_CONFIRM_PASSWORD";
  payload: string;
}

export interface SignupActionType {
  SET_USERNAME: "SET_USERNAME";
  SET_EMAIL: "SET_EMAIL";
  SET_PASSWORD: "SET_PASSWORD";
  SET_CONFIRM_PASSWORD: "SET_CONFIRM_PASSWORD";
}

export interface SignUpInputType {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface ErrType {
  username: boolean;
  email: boolean;
  confirm_password: boolean;
}