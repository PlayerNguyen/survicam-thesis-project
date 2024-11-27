import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MemberRequest, {
  CreateEmptyMemberParams,
  GetAllMembersParams,
} from "../request/members";

export default function useMemberRequest() {
  const keys = {
    getAllMembers: "get-members-all",
    createEmptyMember: "post-create-empty-member",
  };
  const queryClient = useQueryClient();

  function createQueryGetAllMembers(params?: GetAllMembersParams) {
    return useQuery({
      queryKey: [
        keys.getAllMembers,
        "page",
        params?.page || 1,
        "limit",
        params?.limit || 1,
      ],
      queryFn: (ctx) => MemberRequest.getAllMembers(params, ctx.signal),
    });
  }

  function createMutateCreateEmptyMember() {
    return useMutation({
      mutationKey: [keys.createEmptyMember],
      mutationFn: (params: CreateEmptyMemberParams) =>
        MemberRequest.createEmptyMember(params),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [keys.getAllMembers],
        });
      },
    });
  }

  return {
    keys,
    createQueryGetAllMembers,
    createMutateCreateEmptyMember,
  };
}
