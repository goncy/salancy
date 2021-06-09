import {extendTheme, theme} from "@chakra-ui/react";

export default extendTheme({
  styles: {
    global: {
      "html, body, #__next": {
        height: "100%",
      },
    },
  },
  colors: {
    primary: theme.colors["purple"],
  },
});
