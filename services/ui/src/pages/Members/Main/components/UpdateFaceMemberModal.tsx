import {
  Divider,
  FileButton,
  Flex,
  Image,
  Modal,
  ModalProps,
  Paper,
  SimpleGrid,
  Text,
  UnstyledButton,
} from "@mantine/core";
import clsx from "clsx";
import { RiImage2Line } from "react-icons/ri";
import { MemberResponse } from "../../../../shared/request/members";

export type UpdateFaceMemberModalProps = ModalProps & {
  onUpdate: () => void;
  member?: MemberResponse;
};

export default function UpdateFaceMemberModal({
  opened,
  onClose,
  member,
}: UpdateFaceMemberModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={"bold"} size="md">
          Update face member
        </Text>
      }
    >
      <Paper>{(member && member.name) || "Undefined user name"}</Paper>
      <Divider my={`md`} />
      <Flex>
        <FileButton onChange={() => {}} accept="image/png,image/jpeg">
          {(props) => (
            <UnstyledButton {...props} className="w-full">
              <Paper
                withBorder
                shadow="md"
                p={"md"}
                className={clsx(
                  `transition-colors hover:bg-[var(--mantine-color-primary-3)]  hover:text-[var(--mantine-color-primary-8)]`,
                  `justify-center flex items-center`
                )}
              >
                <Flex align={`center`} justify={`center`} gap={"md"}>
                  <RiImage2Line />
                  <Text>Upload a new image</Text>
                </Flex>
              </Paper>
            </UnstyledButton>
          )}
        </FileButton>
      </Flex>
      <Divider my={"md"} />

      <SimpleGrid cols={3} className="max-h-[50vh] overflow-x-scroll">
        <Image src={`https://placehold.co/600x400`} />
        <Image src={`https://placehold.co/600x400`} />
        <Image src={`https://placehold.co/600x400`} />
        <Image src={`https://placehold.co/600x400`} />
        <Image src={`https://placehold.co/600x400`} />
        <Image src={`https://placehold.co/600x400`} />
        <Image src={`https://placehold.co/600x400`} />
        <Image src={`https://placehold.co/600x400`} />
        <Image src={`https://placehold.co/600x400`} />
        <Image src={`https://placehold.co/600x400`} />
        <Image src={`https://placehold.co/600x400`} />
        <Image src={`https://placehold.co/600x400`} />
        <Image src={`https://placehold.co/600x400`} />
        <Image src={`https://placehold.co/600x400`} />
        <Image src={`https://placehold.co/600x400`} />
        <Image src={`https://placehold.co/600x400`} />
        <Image src={`https://placehold.co/600x400`} />
        <Image src={`https://placehold.co/600x400`} />
      </SimpleGrid>
    </Modal>
  );
}
