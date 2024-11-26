import {
  Button,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { RiUser2Line, RiUserAddLine, RiUserSearchLine } from "react-icons/ri";
import MemberCard from "./components/Card";

export default function MembersMain() {
  return (
    <Paper p={"md"} withBorder radius={"md"} shadow="md" mih={"80vh"}>
      <Group>
        <RiUser2Line size={18} />
        <Title order={4}>Members</Title>

        <Group className="flex-1" justify="end">
          <TextInput
            leftSection={<RiUserSearchLine />}
            placeholder="Search by user's name"
            radius={"xl"}
          />
          <Button radius={"xl"} leftSection={<RiUserAddLine size={16} />}>
            Add member
          </Button>
        </Group>
      </Group>
      <Divider my={"md"} />
      <Stack>
        <SimpleGrid className="flex-1" cols={4}>
          <MemberCard />
          <MemberCard />
          <MemberCard />
          <MemberCard />
        </SimpleGrid>
      </Stack>
    </Paper>
  );
}
