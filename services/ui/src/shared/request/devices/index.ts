import axios from "axios";
import { DeviceCreateDeviceRequestBody } from "../../../types";
// import axiosInstance from "../axios";

const BASE_URL = import.meta.env.VITE_API_DEVICE_URL || "http://localhost";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export type DeviceResponse = {
  _id: {
    $oid: string;
  };
  name: string;
  url: string;
  resize_factor: number;
  last_opened: boolean;
};

async function getListDevices(): Promise<{
  success: boolean;
  devices: DeviceResponse[];
}> {
  return (await axiosInstance.get(`/devices/`)).data;
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

const DeviceRequest = {
  getListDevices,
  createDevice,
  deleteDevice,
  activeDevice,
  deactivateDevice,
};

export default DeviceRequest;
