import {Role} from "./role.js";

export interface User {
    email: string;
    password: string;
}

export interface JwtPayload {
  id: string;
  role: Role;
}