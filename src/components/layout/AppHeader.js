"use client";

import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { LogOut as LogOutIcon } from "@mui/icons-material";
import { AppBar, Box, Button, Container, Toolbar, Typography, Menu, MenuItem, Avatar } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

const navItems = [
	{ href: "/", label: "Landing" },
	{ href: "/login", label: "Login" },
];

const navItemsLogged = [
	{ href: "/dashboard", label: "Dashboard" },
	{ href: "/ciclo/criar", label: "Criar Ciclo" },
];

export default function AppHeader() {
	const pathname = usePathname();
	const { data: session, status } = useSession();
	const [anchorEl, setAnchorEl] = useState(null);

	const isAuthenticated = status === "authenticated";

	function isActivePath(href) {
		if (href === "/ciclo/criar") {
			return pathname.startsWith("/ciclo");
		}

		return pathname === href;
	}

	const handleOpenMenu = e => {
		setAnchorEl(e.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const handleLogout = async () => {
		handleCloseMenu();
		await signOut({ callbackUrl: "/login" });
	};

	return (
		<AppBar position="static" color="transparent" elevation={0}>
			<Container maxWidth="lg">
				<Toolbar
					disableGutters
					sx={{
						py: 1,
						gap: 2,
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<Link href="/">
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<AutoGraphIcon color="primary" />
							<Typography variant="h6" fontWeight={800}>
								StudyCycle
							</Typography>
						</Box>
					</Link>

					<Box
						sx={{
							display: "flex",
							gap: 1,
							flexWrap: "wrap",
							justifyContent: "flex-end",
							alignItems: "center",
						}}
					>
						{isAuthenticated ? (
							<>
								{navItemsLogged.map(item => (
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
								<Button onClick={handleOpenMenu} sx={{ textTransform: "none", ml: 2 }}>
									<Avatar
										sx={{
											width: 32,
											height: 32,
											bgcolor: "primary.main",
											mr: 1,
										}}
									>
										{session?.user?.name?.charAt(0).toUpperCase()}
									</Avatar>
									<Typography variant="body2">{session?.user?.name}</Typography>
								</Button>
								<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
									<MenuItem disabled>
										<Typography variant="body2" color="text.secondary">
											{session?.user?.email}
										</Typography>
									</MenuItem>
									<MenuItem onClick={handleLogout}>
										<LogOutIcon sx={{ mr: 1 }} />
										Sair
									</MenuItem>
								</Menu>
							</>
						) : (
							navItems.map(item => (
								<Button
									key={item.href}
									component={Link}
									href={item.href}
									color={isActivePath(item.href) ? "primary" : "inherit"}
									variant={isActivePath(item.href) ? "contained" : "text"}
								>
									{item.label}
								</Button>
							))
						)}
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
