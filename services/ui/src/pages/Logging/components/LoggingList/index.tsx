import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Loader,
  Pagination,
  Paper,
  ScrollArea,
  Select,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useLocalStorage } from "@mantine/hooks";
import clsx from "clsx";
import { RiFilterFill, RiFilterOffLine } from "react-icons/ri";
import { useSearchParams } from "react-router-dom";
import MemberSelect from "../../../../shared/components/MemberSelect";
import {
  LoggingPagination,
  LoggingResult,
} from "../../../../shared/request/logging";
import LoggingListItem from "../LoggingListItem";
import LoggingItemSeketonItem from "../LoggingListItem/LoggingItemSkeletonItem";

export type LoggingListType = {
  data: LoggingResult[];
  pagination?: LoggingPagination;
  isPending: boolean;
};

export default function LoggingList(props: LoggingListType) {
  const [isFilterVisible, setVisibleFilter] = useLocalStorage({
    key: "visibleFilter",
    defaultValue: false,
  });
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChangeSearchParams = (key: string, value?: string | null) => {
    setSearchParams((params) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      return params;
    });
  };

  return (
    <Paper
      className={clsx(``)}
      w={{ base: "100%", sm: `50%`, md: `60%` }}
      shadow="md"
      withBorder
      radius={"md"}
      p={"md"}
      mih={"85vh"}
    >
      <Flex direction={`column`} gap={"sm"}>
        <Flex>
          <Title order={4}>Logging List</Title>
          <Flex justify={"end"} className="flex-1">
            <ActionIcon onClick={() => setVisibleFilter((v) => !v)}>
              <RiFilterFill />
            </ActionIcon>
          </Flex>
        </Flex>

        {/* Action bars  */}
        {isFilterVisible && (
          <Flex direction={`column`} gap={"xs"}>
            <Flex gap={"md"} align={"center"}>
              <TextInput
                label="Id"
                w={"25%"}
                placeholder="Search with ID"
                onChange={(event) =>
                  handleChangeSearchParams("id", event.target.value)
                }
                defaultValue={searchParams.get("id") || ""}
              />

              <DatePickerInput
                clearable
                label="From date"
                w={"37.5%"}
                placeholder="From date"
                defaultValue={
                  searchParams.get("fromDate")
                    ? new Date(searchParams.get("fromDate")!)
                    : undefined
                }
                onChange={(date) =>
                  handleChangeSearchParams(
                    "fromDate",
                    (date && date.toISOString()) || null,
                  )
                }
                maxDate={
                  searchParams.get("toDate")
                    ? new Date(searchParams.get("toDate")!)
                    : undefined
                }
              />
              <DatePickerInput
                clearable
                label="To date"
                w={"37.5%"}
                placeholder="To date"
                defaultValue={
                  searchParams.get("toDate")
                    ? new Date(searchParams.get("toDate")!)
                    : undefined
                }
                minDate={
                  searchParams.get("fromDate")
                    ? new Date(searchParams.get("fromDate")!)
                    : undefined
                }
                onChange={(date) =>
                  handleChangeSearchParams(
                    "toDate",
                    (date && date.toISOString()) || null,
                  )
                }
              />
            </Flex>

            <Flex align={"end"} gap="md">
              <MemberSelect
                label="Filter by member"
                onClear={() => {
                  setSearchParams((params) => {
                    params.delete("predicted");
                    return params;
                  });
                }}
                onChange={(value) =>
                  handleChangeSearchParams("predicited", value)
                }
              />
              <Select
                label="Sort"
                data={[
                  {
                    label: "Latest",
                    value: "1",
                  },
                  {
                    label: "Oldest",
                    value: "2",
                  },
                ]}
              />
              <Button
                leftSection={<RiFilterOffLine />}
                onClick={() => {
                  setSearchParams({});
                }}
              >
                Clear
              </Button>
            </Flex>

            {/* <ActionIcon /> */}
          </Flex>
        )}

        <Divider />
        {/* List */}
        <ScrollArea h={"70vh"}>
          {props.isPending ? (
            [...new Array(2)].map((_,idx) => {
              return <LoggingItemSeketonItem key={`dummy-skeleton-logging-${idx}`} />
            })
          ) : (
            props.data.map((logging: LoggingResult) => {
              return <LoggingListItem item={logging} key={logging._id} />;
            })
          )}
        </ScrollArea>
        <Pagination
          size={"sm"}
          total={props.pagination?.totalPages || 1}
          onChange={(page) => handleChangeSearchParams("page", String(page))}
          value={
            (searchParams.get("page") && Number(searchParams.get("page"))) || 1
          }
        />
      </Flex>
    </Paper>
  );
}
