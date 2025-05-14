import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AuthRequest,
  ChangePasswordRequestType,
  LoginBodyRequestType,
  RegisterBodyRequestType,
  UpdateProfileRequestType,
} from "../request/auth";

export default function useAuthRequest() {
  const keys = {
    getTokenInformation: "auth-api-get-token-information",
    login: "post-api-auth-login",
    register: "post-api-auth-register",
    updateProfile: "put-api-auth-update-profile",
    changePassword: "put-api-auth-change-password",
  };

  const queryClient = useQueryClient();

  function useQueryGetTokenInformation(token: string) {
    return useQuery({
      queryKey: [keys.getTokenInformation, token],
      queryFn: () => AuthRequest.getTokenInformation(token),
      enabled: !!token, // Only runs if the token is provided
    });
  }

  function useMutateLogin() {
    return useMutation({
      mutationKey: [keys.login],
      mutationFn: (body: LoginBodyRequestType) => AuthRequest.login(body),
    });
  }

  function useMutateRegister() {
    return useMutation({
      mutationKey: [keys.register],
      mutationFn: (body: RegisterBodyRequestType) => AuthRequest.register(body),
    });
  }

  function useMutateUpdateProfile() {
    return useMutation({
      mutationKey: [keys.updateProfile],
      mutationFn: ({
        token,
        body,
      }: {
        token: string;
        body: UpdateProfileRequestType;
      }) => AuthRequest.updateProfile(token, body),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [keys.getTokenInformation] });
      },
    });
  }

  function useMutateChangePassword() {
    return useMutation({
      mutationKey: [keys.changePassword],
      mutationFn: ({ body }: { body: ChangePasswordRequestType }) =>
        AuthRequest.changePassword(body),
    });
  }

  return {
    keys,
    useQueryGetTokenInformation,
    useMutateLogin,
    useMutateRegister,
    useMutateUpdateProfile,
    useMutateChangePassword,
  };
}
