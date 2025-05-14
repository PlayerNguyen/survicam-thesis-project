import { Divider, Paper, Stack, Tabs, Title } from "@mantine/core";
import { useSearchParams } from "react-router-dom";
import GeneralSettings from "./GeneralSettings";
import { RiSettingsLine, RiUserSettingsLine } from "react-icons/ri";
import AccountSettings from "./AccountSettings";

export default function AppSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <Paper
      withBorder
      shadow="md"
      p="sm"
      w={{ base: "100%", sm: "90%", md: "70%" }}
    >
      <Stack gap={`xs`}>
        <Title order={4}>Settings</Title>
        <Divider />
        <Tabs
          value={searchParams.get(`tabs`) || "general"}
          onChange={(v) => {
            setSearchParams((prev) => {
              if (v === null) {
                prev.delete("tabs");
              } else {
                prev.set("tabs", v);
              }
              return prev;
            });
          }}
          orientation="vertical"
        >
          <Tabs.List>
            <Tabs.Tab value="general" leftSection={<RiSettingsLine />}>
              General
            </Tabs.Tab>
            <Tabs.Tab value="account" leftSection={<RiUserSettingsLine />}>
              Account
            </Tabs.Tab>
            {/* <Tabs.Tab value="settings">Settings</Tabs.Tab> */}
          </Tabs.List>

          <Tabs.Panel value="general" p="md">
            <GeneralSettings />
          </Tabs.Panel>
          <Tabs.Panel value="account" p="md">
            <AccountSettings />
          </Tabs.Panel>
          {/* <Tabs.Panel value="settings">Settings tab content</Tabs.Panel> */}
        </Tabs>
      </Stack>
    </Paper>
  );
}
