import axios from "axios";
import TokenStorage from "../../../utils/TokenStorage";

const VITE_API_GATEWAY_AUTH = import.meta.env.VITE_API_GATEWAY_AUTH;

const authRequester = axios.create({
  baseURL: VITE_API_GATEWAY_AUTH,
});

authRequester.interceptors.request.use(
  (config) => {
    const rawToken = TokenStorage.getToken();
    if (rawToken) {
      const token = JSON.parse(rawToken);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export type LoginBodyRequestType = {
  username: string;
  password: string;
};

async function login(body: LoginBodyRequestType) {
  return authRequester.post(`/login`, body);
}

export type RegisterBodyRequestType = {
  username: string;
  password: string;
  email: string;
  name: string;
};
async function register(body: RegisterBodyRequestType) {
  return authRequester.post(`/`, body);
}

export type UpdateProfileRequestType = {
  name?: string;
  username?: string;
  email?: string;
  avatar?: string;
};

async function updateProfile(token: string, body: UpdateProfileRequestType) {
  return authRequester.put(`/profile`, body, {
    headers: { Authorization: `Bearer ${token}` }, // Added authorization header
  });
}

export type ChangePasswordRequestType = {
  oldPassword: string;
  newPassword: string;
};

async function changePassword(body: ChangePasswordRequestType) {
  return authRequester.put(`/password`, body);
}

export interface TokenInformationUser {
  _id: string;
  email: string;
  username: string;
  created_at: string;
  name: string;
  __v: number;
  role: TokenInformationUserRole;
}

export interface TokenInformationUserRole {
  _id: string;
  name: string;
  permissions: number[];
}

export type TokenInformationResponse = {
  user: TokenInformationUser;
};

async function getTokenInformation(token: string) {
  return (
    await authRequester.get<TokenInformationResponse>(`/token?token=${token}`)
  ).data;
}

const AuthRequest = {
  login,
  register,
  getTokenInformation,
  updateProfile,
  changePassword,
};

export { AuthRequest };

export default authRequester;
