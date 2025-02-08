import { useQuery } from "@tanstack/react-query";
import LoggingRequest, { LoggingRequestParamsType } from "../request/logging";

export default function useLoggingRequest() {
  const keys = {
    getLogging: "get-logging",
  };

  function useGetLogging(params?: LoggingRequestParamsType) {
    return useQuery({
      queryKey: [keys.getLogging, params],
      queryFn: () => LoggingRequest.getLogging(params),
      placeholderData: (prev) => prev,
    });
  }

  return {
    keys,
    useGetLogging,
  };
}
