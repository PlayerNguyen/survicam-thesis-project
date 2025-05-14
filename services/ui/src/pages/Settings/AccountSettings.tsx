import { Button, Flex, Stack, Table, Text, Title } from "@mantine/core";
import { useContext } from "react";
import AppUserContext from "../../shared/contexts/AppUserContex";
import { RiLockPasswordLine } from "react-icons/ri";
import dayjs from "dayjs";
import UpdatePasswordModal from "./UpdatePasswordModal";
import { useDisclosure } from "@mantine/hooks";

export default function AccountSettings() {
  const { user } = useContext(AppUserContext);
  const [isChangePasswordVisible, { open, close }] = useDisclosure()
  return (
    <>
      <Stack w={"100%"} gap={`md`}>
        <Title order={5}>Account</Title>
        <Flex align={`center`} gap={"md"}>
          <Text fw={"bold"}>Profile information</Text>
          <Flex justify={`end`} className="flex-1" gap={"xs"}>
            {/* <Button size="xs" leftSection={<RiUser2Line />}>
              Edit profile
            </Button> */}
            <Button size="xs" leftSection={<RiLockPasswordLine />} onClick={open}>
              Update password
            </Button>
          </Flex>
        </Flex>

        <Table
          variant="vertical"
          withRowBorders
          withTableBorder
          withColumnBorders
          layout="fixed"
        >
          <Table.Tbody>
            <Table.Tr>
              <Table.Th w={160}>Id</Table.Th>
              <Table.Td>{user?.user?.id}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th w={160}>User name</Table.Th>
              <Table.Td>{user?.user?.name}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Th w={160}>Email</Table.Th>
              <Table.Td>{user?.user?.email}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Th w={160}>Created at</Table.Th>
              <Table.Td>
                {dayjs(user?.user?.created_at).format("DD/MM/YY - HH:mm")}
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Stack>
      <UpdatePasswordModal opened={isChangePasswordVisible} onClose={close} />
    </>
  );
}
