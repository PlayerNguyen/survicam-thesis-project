import {
  ActionIcon,
  AspectRatio,
  Divider,
  Flex,
  Image,
  Paper,
  Stack,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import clsx from "clsx";
import { LoggingResult } from "../../../../shared/request/logging";
import dayjs from "dayjs";
import LoggingItemCompare from "./LoggingItemCompare";
import { RiQuestionMark } from "react-icons/ri";
import LoggingItemPredictingDisplayer from "./LoggingItemPredictingDisplayer";

export type LoggingListItemProps = {
  item: LoggingResult;
};

export default function LoggingListItem(props: LoggingListItemProps) {
  return (
    <Paper
      
      w={`100%`}
      shadow="md"
      withBorder
      radius={"md"}
      p={"xs"}
      mb={"md"}
    >
      <Flex gap={"sm"} direction={"column"}>
        {/* Header */}
        <Flex>
          <Stack gap={0} className="flex-1">
            <Text fw={"600"} size="xs">
              {props.item._id || "Unknown Id"}
            </Text>
            <Text size="xs">{dayjs(props.item.createdAt).fromNow()}</Text>
          </Stack>

          <Stack gap={0}>
            <Text size="xs" fw={"bold"}>
              Predict Result
            </Text>
            {/* <Pill>{props.item.}</Pill> */}
            <LoggingItemPredictingDisplayer
              id={
                (props.item.predict_result && props.item.predict_result.id) ||
                null
              }
            />
          </Stack>
        </Flex>

        <Divider />
        <Flex gap={"md"}>
          <AspectRatio w={"30%"} ratio={1}>
            <Image
              radius={"lg"}
              src={`data:image/png;base64, ${props.item.image}`}
            />
          </AspectRatio>
          {/* Content */}
          <Flex
            direction={"column"}
            m={{ base: "0", md: "0 12px" }}
            className="flex-1"
          >
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>
                    <Flex align={`center`} gap={`sm`}>
                      <Text fw={"600"}>Cosine Similarity</Text>
                      <Tooltip
                        label={
                          <Text size="xs">
                            Cosine Similarity measures the degree to which two
                            images have similar visual content by analyzing
                            their feature vectors and calculating the cosine of
                            the angle between them.
                          </Text>
                        }
                        multiline
                        w={220}
                        transitionProps={{ transition: "pop", duration: 300 }}
                      >
                        <ActionIcon
                          size={"xs"}
                          radius={"lg"}
                          variant="outline"
                          color="gray.6"
                        >
                          <RiQuestionMark size={10} />
                        </ActionIcon>
                      </Tooltip>
                    </Flex>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {props.item.result.map((member) => {
                  return (
                    <LoggingItemCompare
                      id={member.id}
                      key={`member-${member.id}`}
                      distance={member.distance}
                    />
                  );
                })}
              </Table.Tbody>
            </Table>
          </Flex>
        </Flex>
      </Flex>
    </Paper>
  );
}
