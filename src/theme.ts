import { extendTheme } from "@chakra-ui/react";

const breakpoints = {
  sm: "30em",
  md: "48em",
  lg: "62em",
  xl: "80em",
  "2xl": "96em",
};
const Drawer = {
  sizes: {
    menu: {
      dialog: { maxWidth: "380px" }
    }
  }
};;

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  breakpoints,
  config,
  components: {
    Drawer: {
      // Provide your custom width value here
      baseStyle: {
        dialog: {
          width: "300px", // Customize the width as per your requirement
        },
      },
    },
  },
});

export default theme;
