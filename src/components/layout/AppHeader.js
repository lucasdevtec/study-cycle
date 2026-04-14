"use client";

import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Landing" },
  { href: "/login", label: "Login" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ciclo/criar", label: "Criar Ciclo" },
];

export default function AppHeader() {
  const pathname = usePathname();

  function isActivePath(href) {
    if (href === "/ciclo/criar") {
      return pathname.startsWith("/ciclo");
    }

    return pathname === href;
  }

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1, gap: 2 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}
          >
            <AutoGraphIcon color="primary" />
            <Typography variant="h6" fontWeight={800}>
              StudyCycle
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                color={isActivePath(item.href) ? "primary" : "inherit"}
                variant={isActivePath(item.href) ? "contained" : "text"}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
