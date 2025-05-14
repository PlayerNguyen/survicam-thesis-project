import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import { Toaster } from "react-hot-toast";
import "./index.css";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// Register dayjs extension
dayjs.extend(relativeTime);

import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import resolveRouter from "./routers/Resolve";
import themes from "./themes";

const globalQueryClient = new QueryClient({
  defaultOptions: {},
});

export default function App() {
  return (
    <QueryClientProvider client={globalQueryClient}>
      <MantineProvider theme={themes.default} defaultColorScheme="auto">
        <RouterProvider router={resolveRouter()} />
        <Toaster />
      </MantineProvider>
    </QueryClientProvider>
  );
}
