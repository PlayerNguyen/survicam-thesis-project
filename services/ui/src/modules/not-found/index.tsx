import { Button, Center, Stack, Title } from "@mantine/core";

export default function NotFoundPage() {
  return (
    <Center className="min-h-[100vh] min-w-[100vh] items-center justify-center">
      <Stack className="w-[40vw] sm:w-[50vw] md:w-[60vw]">
        <Title>The current page is unavailable or not found.</Title>
        <a href="/">
          <Button>Go to home</Button>
        </a>
      </Stack>
    </Center>
  );
}
