import {
  Button,
  Flex,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import toast from "react-hot-toast";
import {
  RiCheckDoubleFill,
  RiLockPasswordFill,
  RiLockPasswordLine,
  RiUser2Fill,
} from "react-icons/ri";
import { Link } from "react-router-dom";
import {
  AuthRequest,
  RegisterBodyRequestType,
} from "../../../shared/request/auth";

type RegisterFormType = {
  email: string;
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const { mutateAsync: registerAsync, isPending } = useMutation({
    mutationFn: (args: RegisterBodyRequestType) => AuthRequest.register(args),
  });

  const form = useForm<RegisterFormType>({
    initialValues: {
      email: "",
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email format",
      name: (value) =>
        value.length >= 2 ? null : "Name must have at least 2 characters",
      username: (value) =>
        value.length >= 2 ? null : "Username must have at least 2 characters",
      password: (value) =>
        value.length >= 5 ? null : "Password must have at least 5 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  });

  const handleRegister = (values: RegisterFormType) => {
    console.log(`Register a new account`);

    registerAsync(values)
      .then(() => {})
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message);
      });
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((err) => {
    //     toast.error("Failed to login: " + err.response.data.message);
    //   });
  };

  return (
    <Flex className="min-h-[100vh]" justify={`center`} align={`center`}>
      <Paper
        className={clsx(
          `md:min-w-[40vw] sm:md:min-w-[60vw] min-w-[80vw] xl:min-w-[30vw]`,
          `transition-all`
        )}
        shadow="md"
        p={`md`}
        withBorder
      >
        <form onSubmit={form.onSubmit(handleRegister)}>
          <Flex direction={`column`} gap={"md"}>
            <Title order={3}>Enter to the Survicam</Title>
            <TextInput
              leftSection={<RiUser2Fill />}
              label={`Email`}
              placeholder="nhng@gmail.com"
              type="email"
              {...form.getInputProps("email")}
            />

            <TextInput
              leftSection={<RiUser2Fill />}
              label={`Full name`}
              placeholder="Nguyen Nguyen Huynh"
              type="text"
              {...form.getInputProps("name")}
            />

            <TextInput
              leftSection={<RiUser2Fill />}
              label={`Username`}
              placeholder="nhng"
              type="text"
              {...form.getInputProps("username")}
            />

            <PasswordInput
              label={`Password`}
              placeholder="Enter your password"
              leftSection={<RiLockPasswordLine />}
              {...form.getInputProps("password")}
            />

            <PasswordInput
              label={`Confirm Password`}
              placeholder="Re-enter your password"
              leftSection={<RiLockPasswordFill />}
              {...form.getInputProps("confirmPassword")}
            />
            <Flex
              justify={`end`}
              className={clsx(`flex-col md:flex-row md:items-center`)}
              gap={"md"}
            >
              <Link to={`/`}>
                <Button size="sm" variant="transparent" disabled={isPending}>
                  I already have an account
                </Button>
              </Link>
              <Button
                leftSection={<RiCheckDoubleFill />}
                type="submit"
                loading={isPending}
              >
                Sign up
              </Button>
            </Flex>
          </Flex>
        </form>
      </Paper>
    </Flex>
  );
}
