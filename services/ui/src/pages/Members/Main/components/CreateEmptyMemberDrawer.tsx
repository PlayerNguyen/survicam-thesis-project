import {
  Button,
  Drawer,
  DrawerProps,
  FileInput,
  Flex,
  Group,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { RiPriceTag3Line, RiUserAddLine } from "react-icons/ri";

export type CreateEmptyMemberFormTypes = {
  name: string;
};

export type CreateEmptyMemberDrawerProps = DrawerProps & {
  onTrigger: (values: CreateEmptyMemberFormTypes) => void;
};

export default function CreateEmptyMemberDrawer({
  onClose,
  opened,
  onTrigger,
}: CreateEmptyMemberDrawerProps) {
  const form = useForm<CreateEmptyMemberFormTypes>({
    initialValues: {
      name: "",
    },
    validate: {
      name: (val) => (val === "" ? `Name cannot be empty` : null),
    },
  });

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Text size="xl" fw={"500"}>
          Create member
        </Text>
      }
      position="right"
    >
      <form onSubmit={form.onSubmit(onTrigger)}>
        <Flex direction={"column"} gap={"md"}>
          <TextInput
            label="Member name"
            leftSection={<RiPriceTag3Line />}
            {...form.getInputProps("name")}
          />

          <FileInput label={`Avatar`} />
          <Group justify="end">
            <Button
              type="submit"
              size="compact-md"
              color="primary.4"
              leftSection={<RiUserAddLine />}
            >
              Create new member
            </Button>
          </Group>
        </Flex>
      </form>
    </Drawer>
  );
}
