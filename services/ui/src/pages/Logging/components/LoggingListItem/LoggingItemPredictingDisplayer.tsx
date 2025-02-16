import { Flex, Pill, Skeleton } from "@mantine/core";
import useMemberRequest from "../../../../shared/hooks/useMemberRequest";

export type LoggingItemPredictingDisplayerProps = {
  id: string | null;
};

export default function LoggingItemPredictingDisplayer(
  props: LoggingItemPredictingDisplayerProps,
) {
  const { isPending, data } = useMemberRequest().createQueryGetMemberById(
    props.id,
  );

  if (props.id === null) {
    return (
      <Flex justify={`end`}>
        <Pill bg={"yellow.5"} c={"black"} size="xs">
          Unknown
        </Pill>
      </Flex>
    );
  }

  if (isPending) {
    return <Skeleton h={14} />;
  }

  return (
    <Flex justify={`end`}>
      <Pill bg={props.id === null ? "red.5" : "green.5"} c={"black"} size="xs">
        {data?.data.member.name}
      </Pill>
    </Flex>
  );
}
