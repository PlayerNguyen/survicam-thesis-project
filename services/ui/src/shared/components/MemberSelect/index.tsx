import { Select, SelectProps } from "@mantine/core";
import useMemberRequest from "../../hooks/useMemberRequest";

export type MemberSelectProps = SelectProps;

export default function MemberSelect(props: MemberSelectProps) {
  const { data: members, isPending } = useMemberRequest().createQueryGetAllMembers();

  const data: SelectProps["data"] = isPending
    ? []
    : [
        { value: "null", label: "Unknown" },
        ...(members?.data?.members?.map((member) => ({
          value: String(member.id), // Ensure value is a string
          label: member.name,
        })) || []), // Fallback to an empty array if undefined
      ];

  return (
    <Select
      searchable
      clearable // Correct prop instead of `allowDeselect`
      disabled={isPending}
      data={data}
      {...props}
    />
  );
}
