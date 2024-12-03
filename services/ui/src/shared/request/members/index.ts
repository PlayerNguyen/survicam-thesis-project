import axiosInstance from "../axios";

export type GetAllMembersParams = Partial<{
  limit: number;
  page: number;
}>;

export type MemberResponse = {
  id: string;
  name: string;
  updated_at: number;
};

export type GetAllMembersResponse = {
  success: true;
  data: {
    members: MemberResponse[];
    total: number;
  };
};

async function getAllMembers(
  params?: GetAllMembersParams,
  signal?: AbortSignal
): Promise<GetAllMembersResponse> {
  return (await axiosInstance.get(`/faces/members/`, { params, signal })).data;
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
      `/faces/members/`,
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
    await axiosInstance.post(`/faces/members/${params.id}`, formData, {
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
  sucess: true;
  data: {
    history: GetMemberByIdHistory[];
    member: {
      id: string;
      name: string;
      updated_at: number;
    };
  };
};

async function getMemberById(
  id: string,
  signal?: AbortSignal
): Promise<GetMemberByIdResponse> {
  return (
    await axiosInstance.get(`/faces/members/${id}`, {
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
    await axiosInstance.post(`/faces/members/search`, formData, {
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
