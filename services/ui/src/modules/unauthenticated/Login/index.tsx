import {
  Button,
  Flex,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import toast from "react-hot-toast";
import { RiLoginBoxFill, RiUser2Fill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import {
  AuthRequest,
  LoginBodyRequestType,
} from "../../../shared/request/auth";
import { TOKEN_KEY } from "../../../utils/TokenStorage";

export type LoginFormType = {
  username: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();

  const [_, setToken] = useLocalStorage({ key: TOKEN_KEY });
  const { mutateAsync: loginAsync, isPending } = useMutation({
    mutationFn: (args: LoginBodyRequestType) =>
      AuthRequest.login({
        ...args,
      }),
    onError(err) {
      const response = (err as any).response.data.message;
      toast.error(
        `Failed to log in: ${err.message} [${
          (response !== undefined && response) || "No content found"
        }]`
      );
    },
    onSuccess(response) {
      toast.success(`Successfully logged in.`);
      const { token } = response.data;
      setToken(token);
      console.log(`Successfully loaded the token into the local storage.`);
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    },
  });

  const form = useForm<LoginFormType>({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      username: (value) =>
        value.length >= 2 ? null : "Username must have at least 2 characters",
      password: (value) =>
        value.length >= 5 ? null : "Password must have at least 5 characters",
    },
  });
  const handleLogin = async (body: LoginFormType) => {
    console.log(`Logging with the user ${body.username}`);

    await loginAsync({
      username: body.username,
      password: body.password,
    });
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
        <form onSubmit={form.onSubmit(handleLogin)}>
          <Flex direction={`column`} gap={"md"}>
            <Title order={3}>Login to Survicam</Title>
            <TextInput
              leftSection={<RiUser2Fill />}
              label={`Username`}
              placeholder="nhng"
              type="username"
              key={form.key("username")}
              {...form.getInputProps("username")}
            />
            <PasswordInput
              label={`Password`}
              placeholder="nhng"
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
            <Flex
              justify={`end`}
              className={clsx(`flex-col md:flex-row md:items-center`)}
              gap={"md"}
            >
              <Link to={`/register`}>
                <Button size="sm" variant="transparent" disabled={isPending}>
                  I do not have an account
                </Button>
              </Link>
              <Button
                loading={isPending}
                leftSection={<RiLoginBoxFill />}
                type="submit"
              >
                Sign in
              </Button>
            </Flex>
          </Flex>
        </form>
      </Paper>
    </Flex>
  );
}
