"use client";

import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import MenuIcon from "@mui/icons-material/Menu";
import { Logout } from "@mui/icons-material";
import { AppBar, Avatar, Box, Button, Container, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

const navItems = [
	{ href: "/", label: "Home" },
	{ href: "/login", label: "Login" },
];

const navItemsLogged = [
	{ href: "/dashboard", label: "Dashboard" },
	{ href: "/ciclo/criar", label: "Criar Ciclo" },
];

export default function AppHeader() {
	const pathname = usePathname();
	const { data: session, status } = useSession();
	const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const isAuthenticated = status === "authenticated";
	const currentNavItems = isAuthenticated ? navItemsLogged : navItems;

	function isActivePath(href) {
		if (href === "/ciclo/criar") {
			return pathname.startsWith("/ciclo/criar");
		}
		return pathname === href;
	}

	const handleOpenUserMenu = e => {
		setUserMenuAnchorEl(e.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setUserMenuAnchorEl(null);
	};

	const handleOpenMobileMenu = () => {
		setIsMobileMenuOpen(true);
	};

	const handleCloseMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	const handleLogout = async () => {
		handleCloseUserMenu();
		handleCloseMobileMenu();
		await signOut({ callbackUrl: "/login" });
	};

	return (
		<AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: "1px solid rgba(12, 107, 88, 0.12)" }}>
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
						<Box sx={{ display: "flex", alignItems: "center", gap: 1, pr: 2 }}>
							<AutoGraphIcon color="primary" />
							<Typography variant="h6" fontWeight={800}>
								StudyCycle
							</Typography>
						</Box>
					</Link>

					<Box
						sx={{
							display: { xs: "none", md: "flex" },
							gap: 1,
							alignItems: "center",
						}}
					>
						{currentNavItems.map(item => {
							const active = isActivePath(item.href);

							return (
								<Button key={item.href} component={Link} href={item.href} color={active ? "primary" : "inherit"} variant={active ? "contained" : "text"}>
									{item.label}
								</Button>
							);
						})}

						{isAuthenticated && (
							<>
								<Button onClick={handleOpenUserMenu} sx={{ textTransform: "none", ml: 2 }}>
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

								<Menu anchorEl={userMenuAnchorEl} open={Boolean(userMenuAnchorEl)} onClose={handleCloseUserMenu}>
									<MenuItem disabled>
										<Typography variant="body2" color="text.secondary">
											{session?.user?.email}
										</Typography>
									</MenuItem>
									<MenuItem onClick={handleLogout}>
										<Logout sx={{ mr: 1 }} />
										Sair
									</MenuItem>
								</Menu>
							</>
						)}
					</Box>

					<Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
						<IconButton onClick={handleOpenMobileMenu} color="primary">
							<MenuIcon />
						</IconButton>
					</Box>
				</Toolbar>
			</Container>

			<Drawer anchor="right" open={isMobileMenuOpen} onClose={handleCloseMobileMenu}>
				<Box sx={{ width: 280, px: 2, py: 2.5 }}>
					<Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
						Menu
					</Typography>

					<Divider sx={{ mb: 1 }} />

					<List disablePadding>
						{currentNavItems.map(item => {
							const active = isActivePath(item.href);

							return (
								<ListItem disablePadding key={item.href}>
									<ListItemButton component={Link} href={item.href} onClick={handleCloseMobileMenu} sx={{ borderRadius: 2, mb: 0.5 }}>
										<ListItemText
											primary={
												<Typography fontWeight={active ? 700 : 500} color={active ? "primary.main" : "text.primary"}>
													{item.label}
												</Typography>
											}
										/>
									</ListItemButton>
								</ListItem>
							);
						})}
					</List>

					{isAuthenticated && (
						<>
							<Divider sx={{ my: 1.5 }} />
							<Typography variant="body2" color="text.secondary">
								{session?.user?.name}
							</Typography>
							<Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
								{session?.user?.email}
							</Typography>

							<Button variant="outlined" fullWidth onClick={handleLogout} startIcon={<Logout />}>
								Sair
							</Button>
						</>
					)}
				</Box>
			</Drawer>
		</AppBar>
	);
}
