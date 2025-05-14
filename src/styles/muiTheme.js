import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  typography: {
    fontFamily: ["Pixelify Sans", "sans-serif"].join(","),
    button: {
      fontFamily: "Pixelify Sans, sans-serif",
    },
  },
});

export default muiTheme;
