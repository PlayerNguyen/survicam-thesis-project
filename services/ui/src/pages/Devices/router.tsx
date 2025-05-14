import { RouteObject } from "react-router-dom";
import AppRoutes from "../../routes";
import DeviceMain from "./Main";

const DeviceRouter: RouteObject[] = [
  {
    path: AppRoutes.Device.Index(),
    element: <DeviceMain />,
  },
];

export default DeviceRouter;
