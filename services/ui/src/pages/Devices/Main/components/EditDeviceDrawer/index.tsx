import {
  Button,
  Drawer,
  Flex,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { RiEdit2Fill, RiAtLine, RiCodeLine } from "react-icons/ri";
import useDeviceRequest from "../../../../../shared/hooks/useDeviceRequest";

export type EditDeviceDrawerProps = {
  opened: boolean;
  onClose: () => void;
  device?: { _id: string; name: string; url: string; resize_factor?: number };
};

export default function EditDeviceDrawer({
  opened,
  onClose,
  device,
}: EditDeviceDrawerProps) {
  const form = useForm({
    initialValues: {
      name: (device && device.name) || "",
      url: (device && device.url) || "",
      resize_factor: (device && device.resize_factor?.toString()) || "1",
    },
    validate: {
      name: (value: string) =>
        value.length === 0 ? "The name of device cannot be empty" : null,
      url: (value: string) =>
        value.length === 0 ? "The URL of device cannot be empty" : null,
    },
  });

  const { keys } = useDeviceRequest();
  const { mutateAsync: updateDeviceAsync, isPending } =
    useDeviceRequest().createMutateUpdateDevice();
  const queryClient = useQueryClient();

  const handleEditDeviceSubmit = async (values: typeof form.values) => {
    if (!device) {
      throw new Error(`Cannot edit the undefined device.`);
    }
    try {
      await updateDeviceAsync({
        id: device && device._id,
        body: {
          ...values,
          resize_factor: Number.parseFloat(values.resize_factor || "1"),
        }
      });
      toast.success(`Successfully updated device`);
      queryClient.invalidateQueries({ queryKey: [keys.getListDevices] });

      if (onClose !== undefined) {
        onClose();
      }
    } catch (err) {
      toast.error(`Failed to update device. ${(err as Error).message}`);
    }
  };

  return (
    <Drawer
      opened={opened}
      position="right"
      onClose={onClose}
      title={
        <Text size="xl" fw={"bold"}>
          Edit device
        </Text>
      }
    >
      <form onSubmit={form.onSubmit(handleEditDeviceSubmit)}>
        <Stack>
          <TextInput
            label={`Name`}
            placeholder={`Camera #1`}
            leftSection={<RiAtLine />}
            withAsterisk
            {...form.getInputProps("name")}
          />

          <TextInput
            label={`URL`}
            placeholder={`rtsp://localhost:1234`}
            leftSection={<RiCodeLine />}
            withAsterisk
            {...form.getInputProps("url")}
          />

          <Select
            allowDeselect={false}
            withAsterisk
            label="Video quality"
            data={[
              { label: "High", value: "1" },
              { label: "Medium", value: "0.8" },
              { label: "Low", value: "0.6" },
            ]}
            {...form.getInputProps("resize_factor")}
          />

          <Flex justify="end" w="100%">
            <Button
              type="submit"
              size="sm"
              radius={"xl"}
              leftSection={<RiEdit2Fill />}
              loaderProps={{ type: "dots" }}
              loading={isPending}
            >
              Update device
            </Button>
          </Flex>
        </Stack>
      </form>
    </Drawer>
  );
}
