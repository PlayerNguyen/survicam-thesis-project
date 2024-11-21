import { generateColors } from "@mantine/colors-generator";
import { createTheme, virtualColor } from "@mantine/core";

const DefaultTheme = createTheme({
  primaryColor: "primary",
  colors: {
    // 4a7e85

    primary: generateColors("#4a7e85"),
    background: virtualColor({
      name: "background",
      light: "gray",
      dark: "dark",
    }),
  },
});

export default DefaultTheme;
