import { useLocalStorage } from "@mantine/hooks";
import { useContext, useEffect } from "react";
import AuthContext from "../../contexts/AuthContext";
import { AuthRequest } from "../request/auth";

export default function useAuthenticateRequest() {
  const [userToken, _, removeUserToken] = useLocalStorage({
    key: "user-token",
  });
  const { setAuth } = useContext(AuthContext);

  useEffect(() => {
    console.log(`current token is: ${userToken}`);
    if (!userToken) {
      setAuth && setAuth({ isAuthenticated: false, isLoading: false });
      return;
    }

    // send a request to auth
    // setAuth && setAuth({ isAuthenticated: false, isLoading: true });
    setTimeout(() => {
      AuthRequest.getTokenInformation(userToken)
        .then((res) => {
          console.log(`Set auth to user:`, res.data.user);

          setAuth &&
            setAuth({
              isAuthenticated: true,
              isLoading: false,
              user: res.data.user,
            });
        })
        .catch((_) => {
          removeUserToken();
        });
    }, 3000);
  }, [userToken]);
}
