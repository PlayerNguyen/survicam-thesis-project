import { Grid, Select, Stack, Text, Title } from "@mantine/core";

export default function GeneralSettings() {
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
            defaultValue={"Low"}
            allowDeselect={false}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
