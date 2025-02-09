import { Flex } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useSearchParams } from "react-router-dom";
import useLoggingRequest from "../../shared/hooks/useLoggingRequest";
import LoggingList from "./components/LoggingList";

export default function LoggingMain() {
  const [searchParams] = useSearchParams();
  const [debouncedSearchParams] = useDebouncedValue(searchParams, 400);
  const { data: loggingData, isFetching } = useLoggingRequest().useGetLogging({
    id: debouncedSearchParams.get("id") || undefined,
    fromDate: debouncedSearchParams.get("fromDate")
      ? new Date(debouncedSearchParams.get("fromDate")!)
      : undefined,
    toDate: debouncedSearchParams.get("toDate")
      ? new Date(debouncedSearchParams.get("toDate")!)
      : undefined,
    predicted: debouncedSearchParams.get("predicited") || undefined,
    page:
      debouncedSearchParams.get("page") !== null
        ? Number(debouncedSearchParams.get("page"))
        : undefined,
  });
  console.log(loggingData);
  return (
    <>
      <Flex direction={"row"} gap={"xl"}>
        <LoggingList
          isPending={isFetching}
          data={(loggingData && loggingData.data.loggings) || []}
          pagination={loggingData && loggingData.data.pages}
        />
      </Flex>
    </>
  );
}
