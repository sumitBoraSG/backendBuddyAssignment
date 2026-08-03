import {Role} from "./role";

export interface User {
    email: string;
    password: string;
    role: Role;
}

export interface JwtPayload {
  uid: string;
  role: Role;
}