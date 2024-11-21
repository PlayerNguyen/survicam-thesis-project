import { createBrowserRouter } from "react-router-dom";
import DebuggerRouter from "./pages/Debugger/router";
import AppLayout from "./shared/components/AppLayout";

const AppRouter = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        index: true,
      },
      ...DebuggerRouter,
    ],
  },
]);

export default AppRouter;
