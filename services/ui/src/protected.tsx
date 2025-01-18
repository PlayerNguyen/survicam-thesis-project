import { useContext } from "react";
import { Outlet } from "react-router-dom";
import AuthContext from "./contexts/AuthContext";
import useAuthenticateRequest from "./shared/hooks/useAuthenticateRequest";

export default function ProtectedRouter() {
  const { auth } = useContext(AuthContext);
  useAuthenticateRequest();
  // console.log(auth);

  // if (auth?.isLoading) {
  //   return (
  //     <Flex justify={`center`} className="min-h-[100vh]" align={`center`}>
  //       <Loader />
  //     </Flex>
  //   );
  // }

  // if (
  //   auth &&
  //   !auth.isLoading &&
  //   !auth.isAuthenticated &&
  //   auth.user === undefined
  // ) {
  //   return <Navigate to={"/login"} replace />;
  // }

  return <Outlet />;
}
