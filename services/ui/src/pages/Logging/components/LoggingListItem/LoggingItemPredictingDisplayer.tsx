import { Pill, Skeleton } from "@mantine/core";
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
    return <Pill>Unknown</Pill>;
  }

  if (isPending) {
    return <Skeleton h={14} />;
  }

  return <Pill>{data?.data.member.name}</Pill>;
}
