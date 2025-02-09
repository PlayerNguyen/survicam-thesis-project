import {
  Button,
  Divider,
  Flex,
  Paper,
  SimpleGrid,
  TextInput,
  Title,
} from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import clsx from "clsx";
import { RiAddCircleFill, RiCamera3Line } from "react-icons/ri";
import useDeviceRequest from "../../../shared/hooks/useDeviceRequest";
import CreateDeviceDrawer from "./components/CreateDeviceDrawer";
import DeviceInfoCard from "./components/DeviceInfoCard";
import "video.js/dist/video-js.css";
import { useSearchParams } from "react-router-dom";
import useSearchParamsOrDelete from "../../../shared/hooks/useSearchParamsOrDelete";
import { DeviceResponse } from "../../../shared/request/devices";
import EditDeviceDrawer from "./components/EditDeviceDrawer";
import { useState } from "react";

export default function DeviceMain() {
  // ======== Hooks and States Usage ========
  const [searchParams] = useSearchParams();
  const [debouncedSearchParams] = useDebouncedValue(searchParams, 300);
  const { data: devicesResponse, isFetching } =
    useDeviceRequest().createQueryGetDeviceList({
      name: debouncedSearchParams.get("name") || undefined,
    });
  const [isCreateDrawerOpened, createDrawerHandlers] = useDisclosure(false);
  const { handleChangeSearchParams } = useSearchParamsOrDelete();

  const [
    isVisibleEditDrawer,
    { open: openEditDrawer, close: closeEditDrawer },
  ] = useDisclosure();
  const [currentEditDevice, setCurrentEditDevice] = useState<
    DeviceResponse | undefined
  >(undefined);

  // ======== Progress and function ========
  const devices = (devicesResponse && devicesResponse.devices) || [];
  console.log(devices);

  // ======== Handler =================
  const handleEdit = (device: DeviceResponse) => {
    setCurrentEditDevice(device);
    openEditDrawer();
  };

  return (
    <Paper
      radius={"md"}
      withBorder
      w={"70%x"}
      className={clsx(`min-h-[85vh]`)}
      p={"md"}
      shadow="md"
    >
      <Flex direction={`column`}>
        {/* Header */}
        <Flex align={`center`} gap={"md"}>
          <RiCamera3Line size={20} />
          <Title order={3}>Device</Title>
          <Flex className={clsx(`flex-1`)} justify={"end"} gap={"sm"}>
            <TextInput
              size="xs"
              placeholder="Tapo Camera"
              onChange={(event) =>
                handleChangeSearchParams("name", event.target.value)
              }
              defaultValue={searchParams.get("name") || ""}
            />

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
        <SimpleGrid cols={{ base: 2, xl: 3 }}>
          {isFetching
            ? [...new Array(6)].fill(1).map((_, _idx) => {
                return (
                  <DeviceInfoCard
                    isLoading={true}
                    key={`dummy-device-info-card-${_idx}`}
                  />
                );
              })
            : devices &&
              devices.map((device: DeviceResponse) => {
                return (
                  <DeviceInfoCard
                    onEdit={() => {
                      handleEdit(device);
                    }}
                    key={device._id}
                    device={{
                      id: device._id,
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

      {currentEditDevice && isVisibleEditDrawer && (
        <EditDeviceDrawer
          opened={isVisibleEditDrawer}
          onClose={closeEditDrawer}
          device={currentEditDevice}
        />
      )}
    </Paper>
  );
}
