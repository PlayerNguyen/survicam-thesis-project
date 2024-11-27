import { DeviceCreateDeviceRequestBody } from "../../../types";
import axiosInstance from "../axios";

export type DeviceResponse = {
  _id: {
    $oid: string;
  };
  name: string;
  url: string;
  resize_factor: number;
};

async function getListDevices(): Promise<{
  success: boolean;
  data: DeviceResponse[];
}> {
  return (await axiosInstance.get(`/devices/api/`)).data;
}

async function createDevice(body: DeviceCreateDeviceRequestBody) {
  return await axiosInstance.post(`/devices/api/`, { ...body });
}

async function deleteDevice(id: string) {
  return await axiosInstance.delete(`/devices/api/${id}`);
}

const DeviceRequest = {
  getListDevices,
  createDevice,
  deleteDevice,
};

export default DeviceRequest;
