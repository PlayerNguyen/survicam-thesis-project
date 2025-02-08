import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";

import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import themes from "./themes";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import AuthContext, { AuthContextType } from "./contexts/AuthContext";
import AppRouter from "./routers";

// Register dayjs extension
dayjs.extend(relativeTime);

const queryClient = new QueryClient();

export default function App() {
  const [auth, setAuth] = useState<AuthContextType>();

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={themes.default} defaultColorScheme="auto">
        <AuthContext.Provider
          value={{
            auth,
            setAuth,
          }}
        >
          <RouterProvider router={AppRouter} />;
          <Toaster />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </AuthContext.Provider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
