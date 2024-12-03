import {
  AspectRatio,
  Button,
  Flex,
  Image,
  Popover,
  Skeleton,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import clsx from "clsx";
import useMemberRequest from "../../../../shared/hooks/useMemberRequest";
import { SearchMemberViaImagesResponseData } from "../../../../shared/request/members";

type SearchFaceMemberResultItemInfoPillProps = {
  memberId?: any;
  distance?: number;
};

function SearchFaceMemberResultItemInfoPill({
  memberId,
  distance,
}: SearchFaceMemberResultItemInfoPillProps) {
  const [opened, { close, open }] = useDisclosure(false);
  const { data: memberData, isFetching: loadingMemberData } =
    useMemberRequest().createQueryGetMemberById((memberId && memberId) || null);
  console.log(memberData, distance);

  return (
    <Popover
      transitionProps={{ transition: "pop" }}
      withArrow
      opened={opened}
      position="top"
    >
      <Popover.Target>
        <Button
          onMouseEnter={open}
          onMouseLeave={close}
          radius={"xl"}
          variant="subtle"
          className={"flex flex-col"}
        >
          <Text fw={"500"} size="sm">
            {(memberId !== undefined && memberData === undefined && (
              <Skeleton>Nguyen Huynh Nguyen (0.75)</Skeleton>
            )) || (
              <Skeleton visible={loadingMemberData}>
                {memberData?.data.member.name} ({distance?.toLocaleString()})
              </Skeleton>
            )}
          </Text>
        </Button>
      </Popover.Target>
      <Popover.Dropdown w={"260px"}>
        <Skeleton>Loading</Skeleton>
      </Popover.Dropdown>
    </Popover>
  );
}

export type SearchFaceMemberResultItemProps = {
  memberId?: string;
  imageDatumn?: SearchMemberViaImagesResponseData[];
  previewImageSrc?: string;
};

export default function SearchFaceMemberResultItem({
  memberId,
  imageDatumn,
  previewImageSrc,
}: SearchFaceMemberResultItemProps) {
  const memberSearchResponseAtFlattenList =
    (imageDatumn && imageDatumn?.flatMap((c) => c.result).flat()) || [];

  console.log(memberSearchResponseAtFlattenList, memberId);

  return (
    <Flex direction={`row`} gap={"md"}>
      <AspectRatio ratio={16 / 9} className={clsx(`w-5/12`)}>
        {previewImageSrc === undefined ? (
          <Skeleton>
            <Image src="https://placehold.co/600x400" />
          </Skeleton>
        ) : (
          <Image src={previewImageSrc} />
        )}
      </AspectRatio>
      <Flex direction={`column`}>
        <Text size="xs" fw={"500"}>
          {imageDatumn && imageDatumn.length > 0 ? (
            <>Found {imageDatumn?.length} faces</>
          ) : (
            <>No face was detected</>
          )}
        </Text>
        {imageDatumn && memberSearchResponseAtFlattenList?.length === 0 && (
          <>But no one was registered into the database.</>
        )}
        <div className={clsx(`flex-1 w-7/12`)}>
          {memberSearchResponseAtFlattenList!.map((v) => {
            return (
              <SearchFaceMemberResultItemInfoPill
                memberId={v.id}
                distance={v.distance}
                key={`member-pill-info-${v.id}`}
              />
            );
          })}
        </div>
      </Flex>
    </Flex>
  );
}
