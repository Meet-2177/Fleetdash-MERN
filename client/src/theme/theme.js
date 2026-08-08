import { createTheme } from "@mui/material/styles";

const primaryIndigo = {
  main: "#4F46E5",
  light: "#818CF8",
  dark: "#312E81",
  contrastText: "#ffffff",
};

const secondaryCyan = {
  main: "#0F766E",
  light: "#2DD4BF",
  dark: "#115E59",
  contrastText: "#ffffff",
};

export const getTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      primary: primaryIndigo,
      secondary: secondaryCyan,
      background: {
        default: mode === "light" ? "#f7f7ff" : "#07111f",
        paper: mode === "light" ? "#ffffff" : "#112340",
      },
      success: { main: "#16A34A" },
      warning: { main: "#F59E0B" },
      error: { main: "#DC2626" },
      info: { main: "#0EA5E9" },
      divider: mode === "light" ? "#e5ebf5" : "#22364d",
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 650 },
      subtitle1: { fontWeight: 600 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    shape: { borderRadius: 14 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            boxShadow: "none",
            textTransform: "none",
            px: 1.4,
            py: 0.8,
            fontWeight: 600,
          },
          contained: { boxShadow: "none", "&:hover": { boxShadow: "none" } },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            boxShadow:
              mode === "light"
                ? "0 16px 38px rgba(15, 23, 42, 0.07)"
                : "0 12px 28px rgba(0,0,0,0.26)",
            border: mode === "light" ? "1px solid #E6ECF6" : "1px solid #22364d",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiTextField: {
        defaultProps: { variant: "outlined" },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#f1f5ff" : "#1b365d",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: { fontWeight: 700, color: mode === "light" ? "#334155" : "#B9D0E8" },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: mode === "light" ? "1px solid #E6ECF6" : "1px solid #22364d",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            borderBottom: mode === "light" ? "1px solid #E6ECF6" : "1px solid #22364d",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, borderRadius: 999 },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
    },
  });

export default getTheme("light");
