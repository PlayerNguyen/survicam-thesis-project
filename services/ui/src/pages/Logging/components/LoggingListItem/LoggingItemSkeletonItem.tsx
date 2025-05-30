import {
  ActionIcon,
  AspectRatio,
  Divider,
  Flex,
  Paper,
  Skeleton,
  Stack,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import clsx from "clsx";
import { RiQuestionMark } from "react-icons/ri";

export default function LoggingItemSeketonItem() {
  return (
    <Paper
      className={clsx(``)}
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
          <Stack gap={6} className="flex-1">
            <Text fw={"600"} size="xs">
              <Skeleton h={24} w={120} />
            </Text>
            <Text size="xs">
              <Skeleton h={12} w={32} />
            </Text>
          </Stack>

          <Stack gap={0}>
            <Text size="xs" fw={"bold"}>
              Predict Result
            </Text>
            {/* <Pill>{props.item.}</Pill> */}
          </Stack>
        </Flex>

        <Divider />
        <Flex gap={"md"}>
          <AspectRatio w={"30%"} ratio={1}>
            <Skeleton h={128} w={128} />
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
              <Table.Tbody></Table.Tbody>
            </Table>
          </Flex>
        </Flex>
      </Flex>
    </Paper>
  );
}
