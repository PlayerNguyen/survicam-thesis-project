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

const MemberRequest = {
  getAllMembers,
  createEmptyMember,
};

export default MemberRequest;
