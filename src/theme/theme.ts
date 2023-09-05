import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        backgroundColor: "black",
        color: "white",
      },
      a: {
        _hover: {
          textDecoration: "underline",
        },
      },
    },
  },
  components: {
    Card: {
      baseStyle: {
        backgroundColor: "gray.900",
      },
    },
  },
});
