import { NavLink, Paper } from "@mantine/core";
import clsx from "clsx";

export default function AppSidebar() {
  return (
    <Paper className={clsx(``)} w={"100%"} shadow="md" withBorder radius={"md"}>
      <NavLink label="Device" />
      <NavLink label="Device" />
      <NavLink label="Device" />
      <NavLink label="Device" />
    </Paper>
  );
}
