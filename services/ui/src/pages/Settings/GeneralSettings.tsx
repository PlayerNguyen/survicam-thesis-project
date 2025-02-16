import {
  Grid,
  MantineColorScheme,
  Select,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function GeneralSettings() {
  const { setColorScheme } = useMantineColorScheme();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "auto");
  const [threshold, setThreshold] = useLocalStorage<string>({
    key: `face-recognition-threshold`,
    defaultValue: "Low",
  });

  useEffect(() => {
    setColorScheme(theme as unknown as MantineColorScheme);
    localStorage.setItem("theme", theme);
  }, [theme, setColorScheme]);

  return (
    <Stack w={"100%"} gap={`md`}>
      <Title order={5}>General</Title>
      <Grid>
        <Grid.Col span={8}>
          <Text fw={"bold"}>Face Recognition Threshold</Text>
          <Text size="xs" fw={"normal"} color="gray.7">
            Adjust the confidence threshold for face recognition. A lower value
            increases sensitivity, allowing more matches but with a higher
            chance of false positives. A higher value reduces false positives
            but may reject valid matches.
          </Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Select
            size="xs"
            data={["Low", "Medium", "Strict"]}
            defaultValue={threshold}
            allowDeselect={false}
            onChange={(value) => {
              setThreshold(value!);
              toast.success(`Set the face recognition threshold ${value}`);
            }}
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={8}>
          <Text fw={"bold"}>Theme color</Text>
          <Text size="xs" fw={"normal"} color="gray.7">
            Set the theme color for the application. The Light theme offers a
            bright interface for clarity, Dark reduces eye strain in low-light
            conditions, and Auto adapts based on system settings for a seamless
            experience.
          </Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Select
            size="xs"
            data={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "auto", label: "Auto" },
            ]}
            defaultValue={"Low"}
            allowDeselect={false}
            value={theme}
            onChange={(value) => setTheme(value || "auto")}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
