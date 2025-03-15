import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeviceCreateDeviceRequestBody } from "../../types";
import DeviceRequest, {
  DeviceResponse,
  GetListDeviceParams,
} from "../request/devices";

export default function useDeviceRequest() {
  const keys = {
    getListDevices: "device-api-get-device-list",
    createDevice: "post-api-create-device",
    deleteDevice: "delete-api-delete-device",
    activeDevice: "post-active-device",
    deactivateDevice: "post-deactivate-device",
    updateDevice: "put-api-update-device", // Added update key
  };

  const queryClient = useQueryClient();

  function createQueryGetDeviceList(params?: GetListDeviceParams) {
    return useQuery({
      queryKey: [keys.getListDevices, params],
      queryFn: () => DeviceRequest.getListDevices(params),
      placeholderData: (prev) => prev,
      refetchOnWindowFocus: false,
    });
  }

  function createMutateCreateDevice() {
    return useMutation({
      mutationKey: [keys.createDevice],
      mutationFn: (body: DeviceCreateDeviceRequestBody) =>
        DeviceRequest.createDevice(body),
    });
  }

  function createMutateUpdateDevice() {
    return useMutation({
      mutationKey: [keys.updateDevice], // Added mutation key
      mutationFn: ({
        id,
        body,
      }: {
        id: string;
        body: Partial<DeviceResponse>;
      }) => DeviceRequest.updateDevice(id, body),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [keys.getListDevices] });
      },
    });
  }

  function createMutateDeleteDevice() {
    return useMutation({
      mutationKey: [keys.deleteDevice],
      mutationFn: (id: string) => DeviceRequest.deleteDevice(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [keys.getListDevices] });
      },
    });
  }

  function createMutateActiveDevice() {
    return useMutation({
      mutationKey: [keys.activeDevice],
      mutationFn: (id: string) => DeviceRequest.activeDevice(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [keys.getListDevices] });
      },
    });
  }

  function createMutateDeactivateDevice() {
    return useMutation({
      mutationKey: [keys.deactivateDevice],
      mutationFn: (id: string) => DeviceRequest.deactivateDevice(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [keys.getListDevices] });
      },
    });
  }

  return {
    keys,
    createQueryGetDeviceList,
    createMutateCreateDevice,
    createMutateUpdateDevice,
    createMutateDeleteDevice,
    createMutateActiveDevice,
    createMutateDeactivateDevice,
  };
}
