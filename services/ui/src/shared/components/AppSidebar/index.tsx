import { NavLink, Paper } from "@mantine/core";
import clsx from "clsx";
import AppRoutes from "../../../routes";

const SIDER_NAVLINK = [
  {
    label: `Device`,
    path: AppRoutes.Device.Index(),
  },
  {
    label: `Members`,
    path: AppRoutes.Members.Index(),
  },
];

export default function AppSidebar() {
  return (
    <Paper className={clsx(``)} w={"100%"} shadow="md" withBorder radius={"md"}>
      {[...SIDER_NAVLINK].map((nl) => (
        <NavLink key={nl.path} href={nl.path} label={nl.label} />
      ))}
    </Paper>
  );
}
