import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeviceCreateDeviceRequestBody } from "../../types";
import DeviceRequest from "../request/devices";

export default function useDeviceRequest() {
  const keys = {
    getListDevices: "device-api-get-device-list",
    createDevice: "post-api-create-device",
    deleteDevice: "delete-api-delete-device",
    activeDevice: "post-active-device",
    deactivateDevice: "post-deactivate-device",
  };

  const queryClient = useQueryClient();

  function createQueryGetDeviceList() {
    return useQuery({
      queryKey: [keys.getListDevices],
      queryFn: () => DeviceRequest.getListDevices(),
    });
  }

  function createMutateCreateDevice() {
    return useMutation({
      mutationKey: [keys.createDevice],
      mutationFn: (body: DeviceCreateDeviceRequestBody) =>
        DeviceRequest.createDevice(body),
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
      mutationKey: [keys.activeDevice],
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
    createMutateDeleteDevice,
    createMutateActiveDevice,
    createMutateDeactivateDevice,
  };
}
