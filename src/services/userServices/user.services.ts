import { AxiosError } from "axios";
import api from "../api";
import {
  ApiRequestError,
  type RegisterCredentials,
  type RegisterResponse,
} from "../authServices/auth.types";
import type { UpdateEmailResponse, UserProfileResponse } from "./user.types";

function extractUserError(error: unknown, fallbackMessage: string): ApiRequestError {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data as { message?: string; code?: string } | undefined;
    return new ApiRequestError(data?.message || fallbackMessage, status, data?.code);
  }
  if (error instanceof Error) {
    return new ApiRequestError(error.message);
  }
  return new ApiRequestError(fallbackMessage);
}

export const createUser = async (user: RegisterCredentials): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>("/users", user);
    return response.data;
  } catch (error: unknown) {
    throw extractUserError(error, "Erro ao criar conta");
  }
};

export const getUserProfile = async (): Promise<UserProfileResponse> => {
  const response = await api.get<UserProfileResponse>("/users/profile");
  return response.data;
};

export const updateUserProfile = async (data: { name?: string; phoneNumber?: string }) => {
  const response = await api.patch("/users/profile", data);
  return response.data;
};

export const updateUserPassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.patch("/users/password", data);
  return response.data;
};

export const updateUserEmail = async (data: {
  currentPassword: string;
  newEmail: string;
}): Promise<UpdateEmailResponse> => {
  const response = await api.patch<UpdateEmailResponse>("/users/email", data);
  return response.data;
};

export const searchUserByEmail = async (email: string) => {
  const response = await api.get(`/users/search?email=${encodeURIComponent(email)}`);
  return response.data;
};
