import "@mantine/core/styles.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";

import AppRouter from "./routers";
import themes from "./themes";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Register dayjs extension
dayjs.extend(relativeTime);

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={themes.default} defaultColorScheme="auto">
        <RouterProvider router={AppRouter} />
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </MantineProvider>
    </QueryClientProvider>
  );
}
