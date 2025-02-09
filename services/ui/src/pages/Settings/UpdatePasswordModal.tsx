import { Button, Modal, PasswordInput, Title, Flex } from "@mantine/core";
import useAuthRequest from "../../shared/hooks/useAuthenticateRequest";
import { useForm } from "@mantine/form";
import toast from "react-hot-toast";

export type UpdatePasswordModalFormValues = {
  oldPassword: string;
  newPassword: string;
};

export default function UpdatePasswordModal({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const { mutateAsync: changePasswordAsync, isPending } =
    useAuthRequest().useMutateChangePassword();
  const form = useForm<UpdatePasswordModalFormValues>({
    initialValues: {
      oldPassword: "",
      newPassword: "",
    },
    validate: {
      oldPassword: (value) =>
        value.length > 0 ? null : "Old password is required",
      newPassword: (value) =>
        value.length >= 6
          ? null
          : "New password must have at least 6 characters",
    },
  });

  const handleFormSubmit = async (values: UpdatePasswordModalFormValues) => {
    try {
      await changePasswordAsync({ body: values });
      toast.success("Password updated successfully.");
      form.reset();
      onClose(); // Close modal after success
    } catch (error: any) {
      const responseMessage =
        error?.response?.data?.message || "Something went wrong";
      toast.error(`Failed to update password: ${responseMessage}`);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={5}>Update Password</Title>}
    >
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Flex direction="column" gap="md">
          <PasswordInput
            label="Old Password"
            placeholder="Enter your old password"
            key={form.key("oldPassword")}
            {...form.getInputProps("oldPassword")}
          />
          <PasswordInput
            label="New Password"
            placeholder="Enter a new password"
            key={form.key("newPassword")}
            {...form.getInputProps("newPassword")}
          />
          <Button type="submit" loading={isPending}>
            Update Password
          </Button>
        </Flex>
      </form>
    </Modal>
  );
}
