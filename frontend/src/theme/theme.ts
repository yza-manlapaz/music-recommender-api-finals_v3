import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#1ed760",
      contrastText: "#000000",
    },

    background: {
      default: "#0b0b0b",
      paper: "#181818",
    },

    text: {
      primary: "#ffffff",
      secondary: "#a7a7a7",
    },

    divider: "#282828",
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',

    h3: {
      fontWeight: 800,
      letterSpacing: "-1px",
    },

    h6: {
      fontWeight: 700,
    },

    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 5,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default theme;