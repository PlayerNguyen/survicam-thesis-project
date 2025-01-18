import axios from "axios";

const VITE_API_GATEWAY_AUTH = import.meta.env.VITE_API_GATEWAY_AUTH;

const authRequester = axios.create({
  baseURL: VITE_API_GATEWAY_AUTH,
});

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

async function getTokenInformation(token: string) {
  return authRequester.get(`/token?token=${token}`);
}

const AuthRequest = {
  login,
  register,
  getTokenInformation,
};

export { AuthRequest };

export default authRequester;
