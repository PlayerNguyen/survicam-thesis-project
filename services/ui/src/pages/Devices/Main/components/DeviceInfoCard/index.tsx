import {
  ActionIcon,
  AspectRatio,
  Badge,
  Divider,
  Flex,
  Group,
  Image,
  NavLink,
  Paper,
  Popover,
  Skeleton,
  Text,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import toast from "react-hot-toast";
import { RiMore2Line } from "react-icons/ri";
import useDeviceRequest from "../../../../../shared/hooks/useDeviceRequest";

export type Device = {
  name: string;
  id: string;
  url: string;
};

export type DeviceInfoCardProps = {
  isLoading?: boolean;
  device?: Device;
};

export default function DeviceInfoCard({
  device,
  isLoading,
}: DeviceInfoCardProps) {
  const { keys } = useDeviceRequest();
  const { mutateAsync: deleteAsync } =
    useDeviceRequest().createMutateDeleteDevice();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      await deleteAsync(device!.id);
      queryClient.invalidateQueries({ queryKey: [keys.getListDevices] });
      toast.success(`Successfully deleted a device.`);
    } catch (err: any) {
      toast.error(`Failed to delete a device. ${err.message}`);
    }
  };

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
              <Image
                fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                className={clsx(`rounded-t-xl`)}
                src={`http://localhost/devices/api/stream/${
                  device && device.id
                }`}
              />
            )}
          </Skeleton>
        </AspectRatio>
        <Divider />
        {/* Info */}
        <Group px={"xs"} py={4}>
          <Skeleton visible={isLoading !== undefined && isLoading}>
            <Group gap={6}>
              <Text c={"primary.8"} size="xs" fw={"bold"}>
                {device && device.name}
              </Text>
              <Badge color="red.6" size="xs">
                On
              </Badge>
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
                  <Popover.Dropdown>
                    <NavLink
                      c="red.6"
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
