import type { User } from "../userServices/user.types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  message?: string;
  token: string;
  user: User;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  enrollment?: string;
  phoneNumber?: string;
  masterConfirm?: boolean;
}

export interface RegisterResponse {
  message: string;
  requiresEmailVerification: boolean;
  token?: string;
  user?: User;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface MessageResponse {
  message: string;
}

export class ApiRequestError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}
