import { createTheme } from "@mui/material/styles";

const primaryBlue = {
  main: "#1565C0",
  light: "#42A5F5",
  dark: "#0D47A1",
  contrastText: "#ffffff",
};

const secondaryTeal = {
  main: "#00838F",
  light: "#4FB3BF",
  dark: "#005662",
  contrastText: "#ffffff",
};

export const getTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      primary: primaryBlue,
      secondary: secondaryTeal,
      background: {
        default: mode === "light" ? "#F4F7FB" : "#0A1929",
        paper: mode === "light" ? "#FFFFFF" : "#132F4C",
      },
      success: { main: "#2E7D32" },
      warning: { main: "#ED6C02" },
      error: { main: "#D32F2F" },
      info: { main: "#0288D1" },
      divider: mode === "light" ? "#E3E8EF" : "#1E3A5F",
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 600 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            boxShadow: "none",
            textTransform: "none",
            px: 1.4,
            py: 0.8,
          },
          contained: { boxShadow: "none", "&:hover": { boxShadow: "none" } },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow:
              mode === "light"
                ? "0 14px 36px rgba(15, 23, 42, 0.06)"
                : "0 10px 24px rgba(0,0,0,0.25)",
            border: mode === "light" ? "1px solid #E3E8EF" : "1px solid #1E3A5F",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#F0F4F8" : "#1A365D",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: { fontWeight: 700, color: mode === "light" ? "#37474F" : "#B0BEC5" },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: mode === "light" ? "1px solid #E3E8EF" : "1px solid #1E3A5F",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            borderBottom: mode === "light" ? "1px solid #E3E8EF" : "1px solid #1E3A5F",
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
