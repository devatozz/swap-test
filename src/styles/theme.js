import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    body: `'Red Hat Display', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: "#05201b",
      },
    },
  },
});

export default theme;
