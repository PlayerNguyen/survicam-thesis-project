import {
  AspectRatio,
  Flex,
  Image,
  Paper,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { MemberResponse } from "../../../../shared/request/members";
import CardMenu from "./CardMenu";

export type MemberCardProps = {
  isLoading?: boolean;
  member?: MemberResponse;
  onClickUpdateFaceButton?: (member: MemberResponse) => void;
  onClickDelete?: (member: MemberResponse) => void;
};

const VITE_API_FACE_RECOGNITION_URL = import.meta.env
  .VITE_API_FACE_RECOGNITION_URL;

export default function MemberCard({
  isLoading,
  member,
  onClickUpdateFaceButton,
  onClickDelete,
}: MemberCardProps) {
  return (
    <Paper withBorder p={12} radius={"md"}>
      <AspectRatio ratio={1}>
        {/* <Image src={`https://placehold.co/800x600?text=Unknown+Faces`} /> */}
        {!member || member.resources.length === 0 ? (
          <Image src={`https://placehold.co/800x600?text=Unknown+Faces`} />
        ) : (
          <Image
            radius={"md"}
            src={`${VITE_API_FACE_RECOGNITION_URL}/members/${member._id}/resources/${member.resources[0]._id}`}
          />
        )}
      </AspectRatio>

      <Flex p={4} py={8} justify={"start"} align={"center"}>
        <Stack gap={2} flex={1}>
          <Text size="md" fw={"500"} c={"primary.9"}>
            <Skeleton visible={isLoading}>
              {member?.name || "Unknown member"}
            </Skeleton>
          </Text>
          <Text size="xs">
            <Skeleton visible={isLoading}>
              {(member && member?.resources.length) || "Unregistered"} faces
              registered
            </Skeleton>
          </Text>
        </Stack>
        {member !== undefined && (
          <CardMenu
            member={member}
            onDelete={() => onClickDelete && onClickDelete(member)}
            onUpdateFace={() =>
              onClickUpdateFaceButton && onClickUpdateFaceButton(member)
            }
          />
        )}
      </Flex>
    </Paper>
  );
}
