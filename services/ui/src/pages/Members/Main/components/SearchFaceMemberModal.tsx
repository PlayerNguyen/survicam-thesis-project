import { Modal, ModalProps, Text } from "@mantine/core";

export type SearchFaceMemberModalProps = ModalProps & {};

export default function SearchFaceMemberModal({
  onClose,
  opened,
}: SearchFaceMemberModalProps) {
  return (
    <Modal
      transitionProps={{ transition: "pop" }}
      opened={opened}
      onClose={onClose}
      title={<Text fw={"bold"}>Search by images</Text>}
    >
      SearchFaceMemberModalProps
    </Modal>
  );
}
