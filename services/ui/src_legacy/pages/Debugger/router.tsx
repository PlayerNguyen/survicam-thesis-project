import { RouteObject } from "react-router-dom";
import Debugger from ".";
import AppRoutes from "../../routes";

const DebuggerRouter: RouteObject[] = [
  { path: AppRoutes.Debugger(), element: <Debugger /> },
];

export default DebuggerRouter;
