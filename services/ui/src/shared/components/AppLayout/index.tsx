import { useMantineColorScheme } from "@mantine/core";
import cx from "clsx";
import { Outlet } from "react-router-dom";
import AppHeader from "../AppHeader";
import AppSidebar from "../AppSidebar";

export default function AppLayout() {
  const { colorScheme } = useMantineColorScheme();
  console.log(`current color scheme: ${colorScheme}`);

  return (
    <>
      <AppHeader />

      {/* Sidebar and content */}
      <main className={cx(`app-main mx-2 my-4 flex flex-row gap-4`)}>
        <div className={cx(`app-sidebar-wrapper w-1/5 min-h-[80vh]`)}>
          <AppSidebar />
        </div>

        <div className={cx(`app-content-wrapper w-4/5`)}>
          <Outlet />
        </div>
      </main>
    </>
  );
}
