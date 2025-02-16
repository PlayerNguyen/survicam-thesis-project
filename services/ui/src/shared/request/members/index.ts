// import axiosInstance from "../axios";

import axios from "axios";

const VITE_API_FACE_RECOGNITION_URL = import.meta.env
  .VITE_API_FACE_RECOGNITION_URL;

const axiosInstance = axios.create({
  baseURL: VITE_API_FACE_RECOGNITION_URL,
});

export type GetAllMembersParams = Partial<{
  limit: number;
  page: number;
}>;

export type MemberResponse = {
  _id: string;
  avatar: string | null;
  name: string;
  updated_at: number;
  createdAt: string;
  updatedAt: string;
  resources: {
    _id: string;
    imageAbsolutePath: string;
    resourceRef: string;
    createdAt: string;
    updatedAt: string;
  }[];
};

export type GetAllMembersResponse = {
  // success: true;
  // data: {

  //   total: number;
  // };
  members: MemberResponse[];
};

async function getAllMembers(
  params?: GetAllMembersParams,
  signal?: AbortSignal
): Promise<GetAllMembersResponse> {
  return (await axiosInstance.get(`/members`, { params, signal })).data;
}

export type CreateEmptyMemberParams = {
  name: string;
};

async function createEmptyMember(
  params: CreateEmptyMemberParams,
  signal?: AbortSignal
): Promise<{}> {
  return (
    await axiosInstance.post(
      `/members`,
      { name: params.name },
      {
        signal,
      }
    )
  ).data;
}

export type UploadFaceImageAssetParams = {
  id: string;
  files: File[];
};

async function uploadFaceImageAssets(
  params: UploadFaceImageAssetParams,
  signal?: AbortSignal
) {
  const { id, ...otherParams } = params;

  const formData = new FormData();
  for (let file of otherParams.files) {
    formData.append("files", file);
  }

  return (
    await axiosInstance.put(`/members/${params.id}/resources`, formData, {
      signal,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  ).data;
}
export type GetMemberByIdHistory = {
  created_at: number;
  id: string;
  image: string;
  owner: string;
};
export type GetMemberByIdResponse = {
  member: {
    avatar: string | null;
    name: string;
    _id: string;
    resources: {
      _id: string;
      resourceRef: string;
    }[];
  };
};

async function getMemberById(
  id: string,
  signal?: AbortSignal
): Promise<GetMemberByIdResponse> {
  return (
    await axiosInstance.get(`/members/${id}`, {
      signal: signal,
    })
  ).data;
}

export interface SearchMemberViaImagesResponse {
  data: SearchMemberViaImagesResponseData[][];
}

export interface SearchMemberViaImagesResponseData {
  face_area: number[];
  confidence: number;
  result: any[][];
}

async function postSearchMemberViaImages(
  params: Pick<UploadFaceImageAssetParams, "files">
): Promise<SearchMemberViaImagesResponse> {
  const { files } = params;

  const formData = new FormData();
  for (let file of files) {
    formData.append("files", file);
  }

  return (
    await axiosInstance.post(`/members/search`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  ).data;
}

const MemberRequest = {
  getAllMembers,
  createEmptyMember,
  uploadFaceImageAssets,
  getMemberById,
  postSearchMemberViaImages,
};

export default MemberRequest;
