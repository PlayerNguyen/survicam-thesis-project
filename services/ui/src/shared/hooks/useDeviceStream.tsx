import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DeviceStream from "../request/device-stream";

export default function useDeviceStream() {
  const keys = {
    startStream: "post-api-start-stream",
    stopStream: "post-api-stop-stream",
    getDeviceLogs: "get-api-device-logs",
  };

  const queryClient = useQueryClient();

  function createMutateStartStream() {
    return useMutation({
      mutationKey: [keys.startStream],
      mutationFn: (id: string) => DeviceStream.startStream(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [keys.getDeviceLogs] });
      },
    });
  }

  function createMutateStopStream() {
    return useMutation({
      mutationKey: [keys.stopStream],
      mutationFn: (id: string) => DeviceStream.stopStream(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [keys.getDeviceLogs] });
      },
    });
  }

  function createQueryGetDeviceLogs(id: string) {
    return useQuery({
      queryKey: [keys.getDeviceLogs, id],
      queryFn: () => DeviceStream.getDeviceLogs(id),
      enabled: !!id, // Prevents execution if no ID is provided
    });
  }

  return {
    keys,
    createMutateStartStream,
    createMutateStopStream,
    createQueryGetDeviceLogs,
  };
}