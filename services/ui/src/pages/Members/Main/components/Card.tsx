import {
  AspectRatio,
  Button,
  Group,
  Image,
  Paper,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import { MemberResponse } from "../../../../shared/request/members";

export type MemberCardProps = {
  isLoading?: boolean;
  member?: MemberResponse;
};

export default function MemberCard({ isLoading, member }: MemberCardProps) {
  console.log(member);

  return (
    <Paper withBorder p={12} radius={"md"}>
      <AspectRatio ratio={16 / 9}>
        <Image src={`https://placehold.co/800x600?text=Unknown+Faces`} />
      </AspectRatio>

      <Stack p={4} py={8}>
        <Stack gap={2}>
          <Text size="md" fw={"500"} c={"primary.9"}>
            <Skeleton visible={isLoading}>
              {member?.name || "Unknown member"}
            </Skeleton>
          </Text>
          <Text size="xs">
            <Skeleton visible={isLoading}>
              Updated at: {dayjs.unix(member?.updated_at || 0).fromNow()}
            </Skeleton>
          </Text>
        </Stack>
        <Group justify="end">
          <Button size="compact-sm" radius={"xl"}>
            Update faces
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
