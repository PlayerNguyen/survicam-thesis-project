import {
  ActionIcon,
  AspectRatio,
  Badge,
  Divider,
  Flex,
  Group,
  NavLink,
  Paper,
  Popover,
  Skeleton,
  Text,
} from "@mantine/core";
import clsx from "clsx";
import toast from "react-hot-toast";
import {
  RiDeleteBin4Line,
  RiEyeLine,
  RiEyeOffLine,
  RiMore2Line,
  RiPencilLine,
} from "react-icons/ri";
import VideoJs from "../../../../../shared/components/VideoJs";
import useDeviceRequest from "../../../../../shared/hooks/useDeviceRequest";
import useDeviceStream from "../../../../../shared/hooks/useDeviceStream";

export type Device = {
  name: string;
  id: string;
  url: string;
  last_opened: boolean;
};

export type DeviceInfoCardProps = {
  isLoading?: boolean;
  device?: Device;
  onEdit?: () => void;
};

const VITE_API_DEVICE_STREAM_URL = import.meta.env
  .VITE_API_DEVICE_STREAM_URL as string;

export default function DeviceInfoCard({
  device,
  isLoading,
  onEdit,
}: DeviceInfoCardProps) {
  const { mutateAsync: deleteAsync } =
    useDeviceRequest().createMutateDeleteDevice();
  // const { mutateAsync: deactivateDeviceAsync } =
  //   useDeviceRequest().createMutateDeactivateDevice();
  // const { mutateAsync: activateDeviceAsync } =
  //   useDeviceRequest().createMutateActiveDevice();
  const { mutateAsync: activateDeviceAsync } =
    useDeviceStream().createMutateStartStream();
  const { mutateAsync: deactivateDeviceAsync } =
    useDeviceStream().createMutateStopStream();

  const handleDelete = async () => {
    try {
      await deleteAsync(device!.id);
      toast.success(`Successfully deleted a device.`);
    } catch (err) {
      toast.error(`Failed to delete a device. ${(err as Error).message}`);
    }
  };

  const handleToggle = async () => {
    if (device!.last_opened === true) {
      await deactivateDeviceAsync(device!.id);
    } else {
      await activateDeviceAsync(device!.id);
    }
    window.location.reload();
  };

  console.table(device);

  return (
    <Paper
      withBorder
      className={clsx(`device-info-card-wrapper min-h-[120px] w-full`)}
      shadow="xs"
    >
      <Flex direction={`column`} className={`device-info-card-content`}>
        {/* Preview */}
        <AspectRatio
          className={clsx(`device-info-card-preview`)}
          ratio={16 / 9}
        >
          <Skeleton
            animate={false}
            radius={0}
            visible={isLoading !== undefined && isLoading}
          >
            {device !== undefined && (
              // <Image
              //   fallbackSrc="https://placehold.co/600x400?text=No+connection"
              //   className={clsx(`rounded-t-xl`)}
              //   src={`${VITE_API_DEVICE_STREAM_URL}${
              //     device && device.id
              //   }/stream.m3u8`}
              // />
              <VideoJs
                options={{
                  autoplay: true,
                  controls: true,
                  responsive: true,
                  fluid: true,
                  muted: true,
                  sources: [
                    {
                      src: `${VITE_API_DEVICE_STREAM_URL}public/${
                        device && device.id
                      }/stream.m3u8`,

                      type: "application/x-mpegURL",
                    },
                  ],
                }}
              />
            )}
          </Skeleton>
        </AspectRatio>
        <Divider />
        {/* Info */}
        <Group px={"xs"} py={4}>
          <Skeleton visible={isLoading !== undefined && isLoading}>
            <Group gap={6}>
              <Flex direction="column">
                <Flex gap={"xs"}>
                  <Text c={"primary.8"} size="xs" fw={"bold"}>
                    {device && device.name}
                  </Text>
                  <Badge
                    color={device?.last_opened === false ? "red.6" : "green.6"}
                    size="xs"
                  >
                    {device?.last_opened === false ? `Off` : `On`}
                  </Badge>
                </Flex>
                {/* <Text c={"gray.8"} size="xs" className="overflow-hidden">
                  {device && device.id}
                </Text> */}
                <Flex gap={4} align={`center`}></Flex>
              </Flex>
              <Group justify="end" className="flex-1">
                <Popover
                  transitionProps={{ transition: "pop" }}
                  width={100}
                  position="left-end"
                  styles={{ dropdown: { padding: 0 } }}
                >
                  <Popover.Target>
                    <ActionIcon size={`xs`} variant="subtle" radius={`xl`}>
                      <RiMore2Line />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown w={"180"}>
                    <NavLink
                      leftSection={<RiPencilLine />}
                      label={<Text size="xs">Edit</Text>}
                      onClick={() => {
                        if (!onEdit) {
                          throw new Error(
                            `onEdit is not assigned to the current component`
                          );
                        }

                        onEdit();
                      }}
                    />
                    <NavLink
                      leftSection={
                        device?.last_opened === false ? (
                          <RiEyeLine size={14} />
                        ) : (
                          <RiEyeOffLine size={14} />
                        )
                      }
                      label={
                        <Text size="xs">
                          {device?.last_opened === false
                            ? `Active`
                            : `Deactive`}
                        </Text>
                      }
                      onClick={() => {
                        handleToggle();
                      }}
                    />
                    <NavLink
                      c="red.6"
                      leftSection={<RiDeleteBin4Line />}
                      label={<Text size="xs">Delete</Text>}
                      onClick={() => {
                        handleDelete();
                      }}
                    />
                  </Popover.Dropdown>
                </Popover>
              </Group>
            </Group>
          </Skeleton>
        </Group>
      </Flex>
    </Paper>
  );
}
