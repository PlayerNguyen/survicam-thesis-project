import {
  AspectRatio,
  Button,
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
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useState } from "react";
import toast from "react-hot-toast";
import { RiCloudLine, RiImage2Line } from "react-icons/ri";
import useMemberRequest from "../../../../shared/hooks/useMemberRequest";
import { MemberResponse } from "../../../../shared/request/members";

export type UpdateFaceMemberModalProps = ModalProps & {
  onUpdate: () => void;
  member?: MemberResponse;
  onFileUploaded?: () => void;
};

export default function UpdateFaceMemberModal({
  opened,
  onClose,
  member,
}: UpdateFaceMemberModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const { mutateAsync: uploadFaceImageAsset, isPending: isUploading } =
    useMemberRequest().createMutateUploadAsset();
  const queryClient = useQueryClient();
  const { data: memberData, isFetching: isMemberDataFetching } =
    useMemberRequest().createQueryGetMemberById((member && member.id) || null);
  const { keys } = useMemberRequest();
  const handleFileChange = (files: File[]) => {
    console.log(files);

    setFiles(files);
  };

  const handleSubmitUpload = async () => {
    if (member === undefined)
      throw new Error(`Unable to get the id from undefined member.`);

    uploadFaceImageAsset({ id: member?.id, files: files })
      .then(() => {
        toast.success(
          `Successfully update the face of member's ${member.name}`
        );
        queryClient.invalidateQueries({
          queryKey: [keys.getMemberById, member.id],
        });
        setFiles([]);
      })
      .catch((err) => {
        toast.error(`${err.message}. [${err.response.data.detail.message}]`);
      });
  };

  return (
    <Modal
      size={"lg"}
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
      <Flex direction={"column"} gap={"xs"} my="md">
        <Text size="xl" fw={"bold"}>
          Upload images
        </Text>
        <Text size="sm">
          Please upload the image that contains only one frontal face. The
          system will automatically reject if there are more than one face, or
          no face was detected.
        </Text>
      </Flex>
      <Flex direction={`column`} gap={"md"}>
        <FileButton
          onChange={handleFileChange}
          accept="image/png,image/jpeg"
          multiple
        >
          {(props) => (
            <UnstyledButton {...props} className="w-full">
              <Paper
                withBorder
                shadow="md"
                p={"md"}
                className={clsx(
                  `transition-colors hover:bg-[var(--mantine-color-primary-2)]  hover:text-[var(--mantine-color-primary-8)]`,
                  `justify-center flex items-center`
                )}
              >
                <Flex align={`center`} justify={`center`} gap={"md"}>
                  <RiImage2Line />
                  <Text>Select files to upload</Text>
                </Flex>
              </Paper>
            </UnstyledButton>
          )}
        </FileButton>
        <Flex justify={`end`} align={`center`} gap={"md"}>
          <Text size="xs" fw={`500`}>
            {files.length !== 0 && (
              <>
                Uploaded <>{files.length} files</>
              </>
            )}
          </Text>
          <Button
            className="w-[120px]"
            disabled={files.length === 0}
            loading={isUploading}
            leftSection={<RiCloudLine />}
            onClick={handleSubmitUpload}
          >
            Upload
          </Button>
        </Flex>
      </Flex>
      <Divider my={"sm"} />
      <Text size="xl" fw={"bold"} my={"sm"}>
        Recent data
      </Text>

      <SimpleGrid cols={3} className="max-h-[50vh] overflow-x-scroll">
        {isMemberDataFetching || memberData === undefined ? (
          [...Array(12)].map(() => {
            return <Image src={`https://placehold.co/600x400`} />;
          })
        ) : memberData!.data.history.length === 0 ? (
          <>Empty</>
        ) : (
          memberData.data.history.map((image) => (
            <AspectRatio ratio={1 / 1}>
              <Image
                src={`${
                  import.meta.env.VITE_API_GATEWAY_BASE_URL
                }/faces/assets/${image.image}`}
              />
            </AspectRatio>
          ))
        )}
      </SimpleGrid>
    </Modal>
  );
}
