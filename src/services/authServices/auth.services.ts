import api from "../api";
import type { User } from "../userServices/user.types";
import { AxiosError } from "axios";
import {
  ApiRequestError,
  type LoginCredentials,
  type AuthResponse,
  type MessageResponse,
  type ResetPasswordPayload,
} from "./auth.types";

function toApiRequestError(error: unknown, fallbackMessage: string): ApiRequestError {
  if (error instanceof ApiRequestError) {
    return error;
  }

  if (error instanceof AxiosError) {
    if (error.code === "ERR_NETWORK" || error.message?.includes("CORS")) {
      return new ApiRequestError(
        "Erro de conexão: Verifique se o servidor backend está rodando em http://localhost:3001"
      );
    }

    const status = error.response?.status;
    const data = error.response?.data as { message?: string; code?: string } | undefined;
    const code = data?.code;
    const message =
      data?.message ||
      (status === 400 || status === 401 ? "Email ou senha incorretos" : undefined) ||
      fallbackMessage;

    return new ApiRequestError(message, status, code);
  }

  if (error instanceof Error) {
    return new ApiRequestError(error.message);
  }

  return new ApiRequestError(fallbackMessage);
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/users/authenticate", credentials);
      return response.data;
    } catch (error: unknown) {
      throw toApiRequestError(error, "Erro ao fazer login");
    }
  },

  verifyEmail: async (token: string): Promise<MessageResponse> => {
    try {
      const response = await api.post<MessageResponse>("/users/verify-email", { token });
      return response.data;
    } catch (error: unknown) {
      throw toApiRequestError(error, "Não foi possível verificar o e-mail");
    }
  },

  resendVerification: async (email: string): Promise<{ sent: boolean }> => {
    try {
      const response = await api.post<{ sent: boolean }>("/users/resend-verification", { email });
      return response.data;
    } catch (error: unknown) {
      throw toApiRequestError(error, "Não foi possível reenviar o link de verificação");
    }
  },

  forgotPassword: async (email: string): Promise<MessageResponse> => {
    try {
      const response = await api.post<MessageResponse>("/users/forgot-password", { email });
      return response.data;
    } catch (error: unknown) {
      throw toApiRequestError(error, "Não foi possível solicitar a recuperação de senha");
    }
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<MessageResponse> => {
    try {
      const response = await api.post<MessageResponse>("/users/reset-password", payload);
      return response.data;
    } catch (error: unknown) {
      throw toApiRequestError(error, "Não foi possível redefinir a senha");
    }
  },

  logout: () => {
    localStorage.removeItem("@Auth:token");
    localStorage.removeItem("@Auth:user");
    delete api.defaults.headers.common["Authorization"];
  },

  setAuthToken: (token: string) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("@Auth:user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: (): string | null => {
    return localStorage.getItem("@Auth:token");
  },
};
