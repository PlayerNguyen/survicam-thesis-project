import { createBrowserRouter } from "react-router-dom";
import DebuggerRouter from "./pages/Debugger/router";
import DeviceRouter from "./pages/Devices/router";
import MembersRouter from "./pages/Members/router";
import ProtectedRouter from "./protected";
import UnauthenticatedRouter from "./routers/UnauthenticatedRouter";
import AppLayout from "./shared/components/AppLayout";

/**
 * This function is a switch case
 * to response router
 * - if the token is exists, return the main endpoints.
 * - otherwise, return unauthenticated router.
 */
function buildRouter() {
  const currentUserToken = localStorage.getItem("user-token");
  console.log(`The current user token is: `, currentUserToken);

  if (currentUserToken === null) {
    return [...UnauthenticatedRouter];
  }

  return [
    {
      element: <AppLayout />,
      children: [
        {
          index: true,
        },
        ...DeviceRouter,
        ...DebuggerRouter,
        ...MembersRouter,
      ],
    },
  ];
}

const AppRouter = createBrowserRouter([
  {
    element: <ProtectedRouter />,
    children: [...buildRouter()],
  },
]);

export default AppRouter;
