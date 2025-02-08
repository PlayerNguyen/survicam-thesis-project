import { Skeleton, Table } from "@mantine/core";
import useMemberRequest from "../../../../shared/hooks/useMemberRequest";

export type LoggingItemCompareType = {
  id: string;
  distance: number;
};

export default function LoggingItemCompare(props: LoggingItemCompareType) {
  const { data, isPending } = useMemberRequest().createQueryGetMemberById(
    props.id,
  );

  if (isPending) {
    return (
      <Table.Tr>
        <Table.Td>
          <Skeleton h={32} />
        </Table.Td>
        <Table.Td>
          <Skeleton h={32} />
        </Table.Td>
      </Table.Tr>
    );
  }

  return (
    <Table.Tr>
      <Table.Td>{data?.data.member.name}</Table.Td>
      <Table.Td>{props.distance.toFixed(4)}</Table.Td>
    </Table.Tr>
    // <Flex direction="column">
    //   <Text>{data?.data.member.name}</Text>
    //   <Text>{props.distance.toFixed(5)}</Text>
    // </Flex>
  );
}
