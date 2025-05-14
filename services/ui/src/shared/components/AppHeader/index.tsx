import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Paper,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import clsx from "clsx";
import {
  RiCamera2Line,
  RiMoonLine,
  RiSettings2Line,
  RiSunLine,
} from "react-icons/ri";
import AppHeaderMenuTrigger from "./components/AppHeaderMenuTrigger";

export default function AppHeader() {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  function handleChangeTheme() {
    setColorScheme(
      colorScheme === "auto"
        ? "light"
        : colorScheme === "light"
        ? "dark"
        : colorScheme === "dark"
        ? "auto"
        : "light"
    );
  }
  return (
    <Paper shadow="sm">
      <Group
        className={clsx(`app-header`)}
        p={12}
        // bg={"background.1"}
        // c={"primary.7"}
      >
        <Button variant="subtle" radius={"xl"}>
          <Flex justify={`center`} align={`center`} gap={"xs"}>
            <RiCamera2Line />

            <Title order={4}>SuviCam</Title>
          </Flex>
        </Button>
        {/*  */}
        <Flex>
          {/* <Popover>
            <Popover.Target>
              <Button size="compact-xs" variant="subtle">
                Device
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Stack>
                <Button size="compact-md" variant="subtle">
                  Add device
                </Button>
              </Stack>
            </Popover.Dropdown>
          </Popover> */}
        </Flex>

        <Flex
          justify={"end"}
          align={`center`}
          className={clsx(`flex-1`)}
          gap={"md"}
        >
          <ActionIcon onClick={handleChangeTheme}>
            {colorScheme === "auto" ? (
              <RiSettings2Line />
            ) : colorScheme === "light" ? (
              <RiSunLine />
            ) : (
              <RiMoonLine />
            )}
          </ActionIcon>
          <AppHeaderMenuTrigger />
        </Flex>
      </Group>
    </Paper>
  );
}
