import { Roboto } from "next/font/google";
import "./globals.css";
import AppThemeProvider from "@/components/providers/AppThemeProvider";
import AppFooter from "@/components/layout/AppFooter";
import AppHeader from "@/components/layout/AppHeader";

const roboto = Roboto({
	variable: "--font-roboto",
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
});

export const metadata = {
	title: "StudyCycle",
	description: "Gerenciador inteligente de ciclos de estudo",
};

export default function RootLayout({ children }) {
	return (
		<html lang="pt-BR" className={roboto.variable}>
			<body>
				<AppThemeProvider>
					<div className="app-shell">
						<AppHeader />
						<main className="app-main">{children}</main>
						<AppFooter />
					</div>
				</AppThemeProvider>
			</body>
		</html>
	);
}
