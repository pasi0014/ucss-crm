import { extendTheme } from "@chakra-ui/react";

const breakpoints = {
  sm: "30em",
  md: "48em",
  lg: "62em",
  xl: "80em",
  "2xl": "96em",
};
const Drawer = {
  parts: ['dialog', 'header', 'body'],
  baseStyle: {
    dialog: {
      height: '100vh',
      zIndex: 'modal',
      maxH: '100vh',
      boxShadow: 'hover'
    },
    body: {
      px: 6
    }
  },
  sizes: {
    '2xl': { dialog: { maxH: '100%', maxW: '70%' } },
    '3xl': { dialog: { maxH: '100%', maxW: '80%' } },
    '4xl': { dialog: { maxH: '100%', maxW: '90%' } }
  }
};

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  breakpoints,
  config,
  components: {
    Drawer: { ...Drawer }
  },
});

export default theme;
