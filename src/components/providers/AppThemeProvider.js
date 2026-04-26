"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import createCache from "@emotion/cache";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { CacheProvider } from "@emotion/react";

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

export default function AppThemeProvider({ children, session }) {
	const [cache] = useState(() => {
		const cache = createCache({ key: "mui", prepend: true });
		cache.compat = true;
		return cache;
	});

	return (
		<SessionProvider session={session}>
			<CacheProvider value={cache}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					{children}
				</ThemeProvider>
			</CacheProvider>
		</SessionProvider>
	);
}
