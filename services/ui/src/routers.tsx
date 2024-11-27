import { createBrowserRouter } from "react-router-dom";
import DebuggerRouter from "./pages/Debugger/router";
import DeviceRouter from "./pages/Devices/router";
import MembersRouter from "./pages/Members/router";
import AppLayout from "./shared/components/AppLayout";

const AppRouter = createBrowserRouter([
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
]);

export default AppRouter;
