import axiosInstance from "../axios";

export type GetAllMembersParams = Partial<{
  limit: number;
  page: number;
}>;

async function getAllMembers(params: GetAllMembersParams) {
  return axiosInstance.get(`/faces/members/`, { params });
}

const MemberRequest = {
  getAllMembers,
};

export default MemberRequest;
