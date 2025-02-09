import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_DEVICE_STREAM_URL || "http://localhost";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export type StreamResponse = {
  success: boolean;
  message: string;
};

async function startStream(id: string): Promise<StreamResponse> {
  return (await axiosInstance.post(`/device-management/start/${id}`)).data;
}

async function stopStream(id: string): Promise<StreamResponse> {
  return (await axiosInstance.post(`/device-management/stop/${id}`)).data;
}


async function getDeviceLogs(id: string): Promise<{ success: boolean; logs: string[] }> {
  return (await axiosInstance.get(`/device-management/logs/${id}`)).data;
}

const DeviceStream = {
  startStream,
  stopStream,
  getDeviceLogs,
};

export default DeviceStream;
