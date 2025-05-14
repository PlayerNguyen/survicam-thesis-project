import { ActionIcon, Menu } from "@mantine/core";
import { RiDeleteBin4Fill, RiMore2Fill, RiUpload2Fill } from "react-icons/ri";
import { MemberResponse } from "../../../../shared/request/members";

export type CardMenuProps = {
  member: MemberResponse;
  onDelete?: (member: MemberResponse) => void;
  onUpdateFace?: (member: MemberResponse) => void;
};

export default function CardMenu({
  member,
  onDelete,
  onUpdateFace,
}: CardMenuProps) {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon radius={"lg"} variant="light">
          <RiMore2Fill />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<RiUpload2Fill size={14} />}
          onClick={() => onUpdateFace && onUpdateFace(member)}
        >
          Update face
        </Menu.Item>

        <Menu.Item
          color="red"
          leftSection={<RiDeleteBin4Fill size={14} />}
          onClick={() => onDelete && onDelete(member)}
        >
          Delete member
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
