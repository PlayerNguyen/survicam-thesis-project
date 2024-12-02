import { Button, Divider, Flex, Paper, SimpleGrid, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import clsx from "clsx";
import { RiAddCircleFill, RiCamera3Line } from "react-icons/ri";
import useDeviceRequest from "../../../shared/hooks/useDeviceRequest";
import CreateDeviceDrawer from "./components/CreateDeviceDrawer";
import DeviceInfoCard from "./components/DeviceInfoCard";

export default function DeviceMain() {
  const { data: devicesResponse, isFetching } =
    useDeviceRequest().createQueryGetDeviceList();
  const [isCreateDrawerOpened, createDrawerHandlers] = useDisclosure(false);

  const devices = (devicesResponse && devicesResponse.data) || [];
  console.log(devices);

  return (
    <Paper
      radius={"md"}
      withBorder
      className={clsx(`min-h-[85vh]`)}
      p={"md"}
      shadow="md"
    >
      <Flex direction={`column`}>
        {/* Header */}
        <Flex align={`center`} gap={"md"}>
          <RiCamera3Line size={20} />
          <Title order={3}>Device</Title>
          <Flex className={clsx(`flex-1`)} justify={"end"}>
            <Button
              radius={"xl"}
              size="xs"
              leftSection={<RiAddCircleFill />}
              className="transition-colors"
              onClick={() => createDrawerHandlers.open()}
            >
              Add device
            </Button>
          </Flex>
        </Flex>
        <Divider my={12} />
        {/* Device list */}
        <SimpleGrid cols={3}>
          {isFetching
            ? [...new Array(9)].fill(1).map((_, _idx) => {
                return (
                  <DeviceInfoCard
                    isLoading={true}
                    key={`dummy-device-info-card-${_idx}`}
                  />
                );
              })
            : devices &&
              devices.map((device) => {
                return (
                  <DeviceInfoCard
                    key={device._id.$oid}
                    device={{
                      id: device._id.$oid,
                      name: device.name,
                      url: device.url,
                      last_opened: device.last_opened,
                    }}
                  />
                );
              })}
        </SimpleGrid>
      </Flex>

      {/* Create a new device drawer */}
      <CreateDeviceDrawer
        opened={isCreateDrawerOpened}
        onClose={() => createDrawerHandlers.close()}
      />
    </Paper>
  );
}
