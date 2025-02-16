import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MemberRequest, {
  CreateEmptyMemberParams,
  GetAllMembersParams,
  UploadFaceImageAssetParams,
} from "../request/members";

export default function useMemberRequest() {
  const keys = {
    getAllMembers: "get-members-all",
    getMemberById: "get-member-by-id",
    createEmptyMember: "post-create-empty-member",
    uploadAssetMember: "post-upload-asset-member",
    searchMember: "post-search-members",
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
      placeholderData: (prev) => prev,
      refetchOnWindowFocus: false,
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

  function createQueryGetMemberById(id: string | null) {
    return useQuery({
      queryKey: [keys.getMemberById, id],
      queryFn: ({ signal }) => MemberRequest.getMemberById(id!, signal),
      enabled: id !== null,
    });
  }

  function createMutateUploadAsset() {
    return useMutation({
      mutationKey: [keys.uploadAssetMember],
      mutationFn: (params: UploadFaceImageAssetParams) =>
        MemberRequest.uploadFaceImageAssets(params),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [keys.getAllMembers],
        });
      },
    });
  }

  function createMutateSearchMember() {
    return useMutation({
      mutationKey: [keys.searchMember],
      mutationFn: (params: Pick<UploadFaceImageAssetParams, "files">) =>
        MemberRequest.postSearchMemberViaImages({ files: params.files }),
      onSuccess: () => {},
    });
  }

  return {
    keys,
    createQueryGetAllMembers,
    createMutateCreateEmptyMember,
    createMutateUploadAsset,
    createQueryGetMemberById,
    createMutateSearchMember,
  };
}
