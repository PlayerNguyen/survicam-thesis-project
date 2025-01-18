import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

const UnauthenticatedRouter = [
  { element: <Login />, index: true },
  {
    element: <Login />,
    path: "/login",
  },
  {
    path: `/register`,
    element: <Register />,
  },
];

export default UnauthenticatedRouter;
