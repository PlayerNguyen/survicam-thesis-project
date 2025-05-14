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
import { RiAddFill, RiAtLine, RiCodeLine } from "react-icons/ri";
import useDeviceRequest from "../../../../../shared/hooks/useDeviceRequest";

export type CreateDeviceDrawerProps = {
  opened: boolean;
  onClose: () => void;
};

export type CreateDeviceDrawerForm = {
  name: string;
  url: string;
  resize_factor?: string;
};

export default function CreateDeviceDrawer({
  opened,
  onClose,
}: CreateDeviceDrawerProps) {
  const form = useForm<CreateDeviceDrawerForm>({
    initialValues: {
      name: "",
      url: "",
      resize_factor: "1",
    },
    validate: {
      name: (value: string) =>
        value.length === 0 ? "The name of device cannot be empty" : null,
      url: (value: string) =>
        value.length === 0 ? "The URL of device cannot be empty" : null,
    },
  });
  const { keys } = useDeviceRequest();
  const { mutateAsync: createDeviceAsync, isPending } =
    useDeviceRequest().createMutateCreateDevice();
  const queryClient = useQueryClient();

  const handleCreateDeviceSubmit = async (values: CreateDeviceDrawerForm) => {
    try {
      await createDeviceAsync({
        ...values,
        resize_factor: Number.parseFloat(values.resize_factor || "1"),
      });
      toast.success(`Successfully created a new device`);
      queryClient.invalidateQueries({ queryKey: [keys.getListDevices] });
      onClose && onClose();
    } catch (err: any) {
      toast.error(`Failed to create device. ${err.message}`);
    }
  };

  return (
    <Drawer
      opened={opened}
      position="right"
      onClose={onClose}
      title={
        <Text size="xl" fw={"bold"}>
          Add new device
        </Text>
      }
    >
      <form onSubmit={form.onSubmit(handleCreateDeviceSubmit)}>
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
              leftSection={<RiAddFill />}
              loaderProps={{ type: "dots" }}
              loading={isPending}
            >
              Add new device
            </Button>
          </Flex>
        </Stack>
      </form>
    </Drawer>
  );
}
