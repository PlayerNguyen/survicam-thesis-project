import { useMantineColorScheme } from "@mantine/core";
import cx from "clsx";
import { Outlet } from "react-router-dom";
import AppHeader from "../AppHeader";
import AppSidebar from "../AppSidebar";
import AppUserContext, { AppUserType } from "../../contexts/AppUserContex";
import { useEffect, useState } from "react";
import { TOKEN_KEY } from "../../../utils/TokenStorage";
import { useLocalStorage } from "@mantine/hooks";
import { AuthRequest } from "../../request/auth";
import toast from "react-hot-toast";

export default function AppLayout() {
  const { colorScheme } = useMantineColorScheme();
  console.log(`current color scheme: ${colorScheme}`);
  const [token] = useLocalStorage({ key: TOKEN_KEY });

  // App user
  const [appUser, setAppUser] = useState<AppUserType>({
    isLoading: true,
    user: undefined,
  });

  // Use a effect hook to validate auth
  useEffect(() => {
    if (token) {
      console.log(`Current token on AppLayout.tsx: ${token}`);
      AuthRequest.getTokenInformation(token)
        .then((result) => {
          setAppUser({
            user: {
              name: result.user.name,
              email: result.user.email,
              id: result.user._id,
              created_at: new Date(result.user.created_at),
            },
            isLoading: false,
          });
        })
        .catch((err) => {
          console.error(err);
          toast.error(`Forbidden: The token is invalid or expired.`);
        });
    }
  }, [token]);

  return (
    <>
      <AppUserContext.Provider value={{ setAppUser, user: appUser }}>
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
      </AppUserContext.Provider>
    </>
  );
}
