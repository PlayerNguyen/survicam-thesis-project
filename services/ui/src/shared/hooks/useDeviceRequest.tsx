import { useMutation, useQuery } from "@tanstack/react-query";
import { DeviceCreateDeviceRequestBody } from "../../types";
import DeviceRequest from "../request/devices";

export default function useDeviceRequest() {
  const keys = {
    getListDevices: "device-api-get-device-list",
    createDevice: "post-api-create-device",
    deleteDevice: "delete-api-delete-device",
  };

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
    });
  }

  return {
    keys,
    createQueryGetDeviceList,
    createMutateCreateDevice,
    createMutateDeleteDevice,
  };
}
