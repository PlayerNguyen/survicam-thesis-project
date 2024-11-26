import {
  AspectRatio,
  Image,
  Paper,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";

export type MemberCardProps = {
  isLoading?: boolean;
};

export default function MemberCard({ isLoading }: MemberCardProps) {
  return (
    <Paper withBorder p={12} radius={"md"}>
      <AspectRatio ratio={16 / 9}>
        <Image />
      </AspectRatio>

      <Stack gap={4} p={4} py={8}>
        <Text size="sm" fw={"500"} c={"primary.9"}>
          <Skeleton visible={isLoading}>member_name</Skeleton>
        </Text>
      </Stack>
    </Paper>
  );
}
