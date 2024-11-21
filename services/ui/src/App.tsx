import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";

import AppRouter from "./routers";
import themes from "./themes";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={themes.default} defaultColorScheme="auto">
        <RouterProvider router={AppRouter} />
        <Toaster />
      </MantineProvider>
    </QueryClientProvider>
  );
}
