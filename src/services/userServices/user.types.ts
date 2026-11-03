export type User = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  enrollment?: string | null;
  phoneNumber?: string | null;
  masterConfirm?: boolean;
  role?: string;
  isAdmin?: boolean;
  emailVerified?: boolean;
  googleId?: string | null;
};

export interface UpdateEmailResponse {
  message: string;
  pendingConfirmation: boolean;
  data: User;
}

export interface UserProfileResponse {
  message: string;
  data: {
    user: User;
  };
}
