import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../modules/not-found";
import Login from "../modules/unauthenticated/Login";
import Register from "../modules/unauthenticated/Register";
import DeviceMain from "../pages/Devices/Main";
import LoggingMain from "../pages/Logging";
import MembersMain from "../pages/Members/Main";
import AppRoutes from "../routes";
import AppLayout from "../shared/components/AppLayout";
import TokenStorage from "../utils/TokenStorage";
import AppSettings from "../pages/Settings";

export default function resolveRouter() {
  const router = TokenStorage.hasToken()
    ? /**
       * Authenticated router
       */
      createBrowserRouter([
        {
          element: <AppLayout />,
          path: "/",
          children: [
            {
              index: true,
              element: <>zhi</>,
            },
            {
              path: AppRoutes.Device.Index(),
              element: <DeviceMain />,
            },
            {
              path: AppRoutes.Members.Index(),
              element: <MembersMain />,
            },
            {
              path: AppRoutes.Logging.Index(),
              element: <LoggingMain />,
            },
            {
              path: AppRoutes.Settings.Index(),
              element: <AppSettings />,
            },
          ],
        },
      ])
    : /**
       * Unauthenticated router
       */
      createBrowserRouter([
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/",
          element: <Login />,
        },
        {
          index: true,
          path: "*",
          element: <NotFoundPage />,
        },
      ]);

  return router;
}
