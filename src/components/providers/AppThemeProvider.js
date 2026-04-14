"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0c6b58",
      light: "#5ab89e",
      dark: "#064536",
    },
    secondary: {
      main: "#f0a202",
    },
    background: {
      default: "#f4f7f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "var(--font-roboto)",
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 14,
  },
});

export default function AppThemeProvider({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
