import React, { Dispatch, SetStateAction } from "react";

export type AppUserType = {
  isLoading?: boolean;
  user?: {
    email: string;
    name: string;
    /**
    * The unique id (mongoid)
    */
    id: string;
    created_at: Date
  };
};

export type AppUserContextType = {
  setAppUser?: Dispatch<SetStateAction<AppUserType>>;
  user?: AppUserType;
};

const AppUserContext = React.createContext<AppUserContextType>({
  setAppUser: undefined,
  user: undefined,
});

export default AppUserContext;
