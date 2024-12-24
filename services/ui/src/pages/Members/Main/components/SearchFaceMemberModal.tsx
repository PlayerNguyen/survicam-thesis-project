import {
  Button,
  Divider,
  Flex,
  Group,
  Modal,
  ModalProps,
  Stack,
  Text,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  RiCloudFill,
  RiFileDamageFill,
  RiImage2Fill,
  RiImageAddLine,
} from "react-icons/ri";
import useMemberRequest from "../../../../shared/hooks/useMemberRequest";
import { SearchMemberViaImagesResponse } from "../../../../shared/request/members";
import SearchFaceMemberResultItem from "./SearchFaceMemberResultItem";
export type SearchFaceMemberModalProps = ModalProps & {};

export default function SearchFaceMemberModal({
  onClose,
  opened,
}: SearchFaceMemberModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const { mutateAsync: searchMemberAsync, isPending: isSearchingMember } =
    useMemberRequest().createMutateSearchMember();

  const [searchResult, setSearchResult] = useState<
    SearchMemberViaImagesResponse | undefined
  >(undefined);

  const [recentSearchImages, setRecentSearchImages] = useState<
    string[] | undefined
  >(undefined);

  useEffect(() => {
    return () => {
      setFiles([]);
      setSearchResult(undefined);
    };
  }, []);

  const handleSearchMember = async () => {
    console.log(`Searching for member in ${files.length} files`);
    const searchResult = await searchMemberAsync({ files: files });
    setSearchResult(searchResult);
    setRecentSearchImages(
      await Promise.all(
        files?.map(async (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            // @ts-ignore
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
          });
        })
      )
    );

    setFiles([]);
  };

  return (
    <Modal
      size={"xl"}
      transitionProps={{ transition: "pop" }}
      opened={opened}
      onClose={onClose}
      title={<Text fw={"bold"}>Search by images</Text>}
    >
      <Stack>
        <Dropzone
          loading={isSearchingMember}
          accept={["image/png", "image/jpeg"]}
          onDrop={(files) => setFiles(files)}
          onReject={() => toast.error(`The file is not accepted.`)}
        >
          <Group>
            <Dropzone.Accept>
              <RiImageAddLine size={26} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <RiFileDamageFill size={26} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <RiImage2Fill size={26} />
            </Dropzone.Idle>

            <Stack gap={0}>
              <Text size="md" fw={"500"}>
                Drag images into this box or click to upload
              </Text>
              <Text size="xs">Accept .jpg and .png file with max 100mb</Text>
              <Dropzone.Reject>
                <Text size="xs" fw={"bold"}>
                  This file is not supported
                </Text>
              </Dropzone.Reject>
            </Stack>
          </Group>
        </Dropzone>
        <Flex justify={`end`} align={`center`} gap={12}>
          <Text size="xs" fw={"500"}>
            {files.length === 0
              ? "Upload file to search"
              : `Pending ${files.length} file${
                  (files.length > 1 && "s") || ""
                }`}
          </Text>
          <Button
            disabled={files.length === 0}
            loading={isSearchingMember}
            onClick={handleSearchMember}
            size="sm"
            leftSection={<RiCloudFill />}
          >
            Search
          </Button>
        </Flex>
      </Stack>
      <Divider my={"md"} />
      {recentSearchImages && (
        <>
          <Text size="xl" fw={"500"} my={"md"}>
            Results
          </Text>
          <Stack className={clsx(`overflow-y-scroll max-h-[50vh]`)}>
            {recentSearchImages.map((image, idx) => {
              console.log(searchResult && searchResult.data[idx]);

              return (
                <SearchFaceMemberResultItem
                  imageDatumn={
                    (searchResult && searchResult.data[idx]) || undefined
                  }
                  key={`search-result-member-face-index-${idx}`}
                  previewImageSrc={image}
                />
              );
            })}
          </Stack>
        </>
      )}
    </Modal>
  );
}
