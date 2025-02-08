import React from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: {
    created_at: Date;
    email: string;
    name: string;
    role: {
      name: string;
      permissions: number[];
      _id: string;
    };
    username: string;
    _id: string;
    __v: number;
  };
};

const AuthContext = React.createContext<{
  auth?: AuthContextType;
  setAuth?: (auth: AuthContextType) => void;
}>({
  auth: {
    isAuthenticated: false,
    isLoading: true,
  },
  setAuth: undefined,
});

export default AuthContext;
