import {
  Button,
  Divider,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import toast from "react-hot-toast";
import {
  RiUser2Line,
  RiUserAddLine,
  RiUserForbidFill,
  RiUserSearchLine,
} from "react-icons/ri";
import useMemberRequest from "../../../shared/hooks/useMemberRequest";
import MemberCard from "./components/Card";
import CreateEmptyMemberDrawer, {
  CreateEmptyMemberFormTypes,
} from "./components/CreateEmptyMemberDrawer";

export default function MembersMain() {
  const [createDrawerOpened, { toggle, close: closeCreateDrawer }] =
    useDisclosure(false);
  const { keys } = useMemberRequest();
  const queryClient = useQueryClient();
  const { data: members, isFetching } =
    useMemberRequest().createQueryGetAllMembers();

  const { mutateAsync: createEmptyMemberAsync } =
    useMemberRequest().createMutateCreateEmptyMember();

  const handleCreateMember = async (values: CreateEmptyMemberFormTypes) => {
    try {
      await createEmptyMemberAsync({ name: values.name });
      queryClient.invalidateQueries({ queryKey: [keys.getAllMembers] });
      closeCreateDrawer();
      toast.success(`Created a new member`);
    } catch (err) {
      toast.error(
        `Cannot create a new member. Because ${(err as unknown as any).message}`
      );
    }
  };

  return (
    <Paper
      className={clsx(`member-main-wrapper`)}
      p={"md"}
      withBorder
      radius={"md"}
      shadow="md"
      mih={"80vh"}
    >
      <Group>
        <RiUser2Line size={18} />
        <Title order={4}>Members</Title>

        <Group className="flex-1" justify="end">
          <TextInput
            leftSection={<RiUserSearchLine />}
            placeholder="Search by user's name"
            radius={"xl"}
          />
          <Button
            radius={"xl"}
            leftSection={<RiUserAddLine size={16} />}
            onClick={toggle}
          >
            Add member
          </Button>
        </Group>
      </Group>
      <Divider my={"md"} />
      <Stack>
        {isFetching ? (
          <SimpleGrid className="flex-1" cols={4}>
            {[...new Array(12)].fill(1).map((_, __) => (
              <MemberCard isLoading key={`dummy-member-card-key-index-${__}`} />
            ))}
          </SimpleGrid>
        ) : members?.data.members.length === 0 ? (
          <Flex
            mih={"70vh"}
            justify={`center`}
            align={`center`}
            w={"100% !important"}
            direction={`column`}
            c={`primary.6`}
            gap={"md"}
          >
            <RiUserForbidFill size={32} />
            <Title order={3}>There are no member was registered</Title>
          </Flex>
        ) : (
          <SimpleGrid className="flex-1" cols={4}>
            {members!.data.members.map((member) => (
              <MemberCard
                isLoading={false}
                member={member}
                key={`member-card-with-id-${member.id}`}
              />
            ))}
          </SimpleGrid>
        )}
      </Stack>

      {/* Drawer */}
      <CreateEmptyMemberDrawer
        opened={createDrawerOpened}
        onClose={closeCreateDrawer}
        onTrigger={(values) => handleCreateMember(values)}
      />
    </Paper>
  );
}
