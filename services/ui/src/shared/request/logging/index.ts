import axios, { AxiosResponse } from "axios";

const DEVICE_BASE_URL = import.meta.env.VITE_API_LOGGING_URL;

if (DEVICE_BASE_URL === undefined) {
  throw new Error(
    `Cannot resolve the LOGGING URL, please add VITE_API_LOGGING_URL into the environment variable.`,
  );
}
export type LoggingResult = {
  _id: string;
  updatedAt: Date;
  createdAt: Date;
  image: string;
  result: {
    id: string;
    distance: number;
  }[];
  predict_result: null | {
    id: string;
    distance: number;
  };
};

const axiosInstance = axios.create({
  baseURL: DEVICE_BASE_URL,
});

export type LoggingRequestParamsType = {
  id?: string;
  fromDate?: Date;
  toDate?: Date;
  predicted?: string;
  sortBy?: string;
  sortOrder?: string;

  page?: number;
  limit?: number;
};
export type LoggingPagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};
async function getLogging(params?: LoggingRequestParamsType) {
  return axiosInstance.get(`/logging`, { params }) as unknown as AxiosResponse<{
    loggings: LoggingResult[];
    pages: LoggingPagination;
    success: true;
  }>;
}

const LoggingRequest = {
  getLogging,
};

export default LoggingRequest;
