import axios from "axios";
import { DeviceCreateDeviceRequestBody } from "../../../types";
// import axiosInstance from "../axios";

const BASE_URL = import.meta.env.VITE_API_DEVICE_URL || "http://localhost";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export type GetListDeviceParams = {
  name?: string;
};

export type DeviceResponse = {
  _id: string;
  name: string;
  url: string;
  resize_factor: number;
  last_opened: boolean;
};

async function getListDevices(params?: GetListDeviceParams): Promise<{
  success: boolean;
  devices: DeviceResponse[];
}> {
  return (await axiosInstance.get(`/devices/`, { params })).data;
}

async function createDevice(body: DeviceCreateDeviceRequestBody) {
  return await axiosInstance.post(`/devices/`, { ...body });
}

async function deleteDevice(id: string) {
  return await axiosInstance.delete(`/devices/${id}`);
}

async function activeDevice(id: string) {
  return await axiosInstance.post(`/devices/activate/${id}`);
}

async function deactivateDevice(id: string) {
  return await axiosInstance.post(`/devices/deactivate/${id}`);
}

async function updateDevice(id: string, body: Partial<DeviceResponse>) {
  console.log(`Current body: `, body);
  return await axiosInstance.put(`/devices/${id}`, body);
}

const DeviceRequest = {
  getListDevices,
  createDevice,
  deleteDevice,
  activeDevice,
  deactivateDevice,
  updateDevice,
};

export default DeviceRequest;
