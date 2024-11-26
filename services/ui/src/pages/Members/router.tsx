import { RouteObject } from "react-router-dom";
import MembersMain from "./Main";
import AppRoutes from "../../routes";

const MembersRouter: RouteObject[] = [
  {
    path: AppRoutes.Members.Index(),
    element: <MembersMain />,
  },
];

export default MembersRouter;
