import { Roboto } from "next/font/google";
import "./globals.css";
import AppThemeProvider from "@/components/providers/AppThemeProvider";
import AppRouterEmotionCacheProvider from "@/components/providers/AppRouterEmotionCacheProvider";
import AppFooter from "@/components/layout/AppFooter";
import AppHeader from "@/components/layout/AppHeader";

const roboto = Roboto({
	variable: "--font-roboto",
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
});

const defaultUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "https://studycycle.com.br";

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: {
		default: "StudyCycle | Gerenciador Inteligente de Ciclos de Estudo",
		template: "%s | StudyCycle",
	},
	description: "Planeje seus estudos com distribuição inteligente de horas por matéria, cálculo automático de afinidade e pesos estratégicos para vestibulares e concursos.",
	keywords: ["ciclo de estudos", "método de ciclo de estudos", "planejamento de estudos", "estudo para concursos", "estudo para enem", "produtividade nos estudos", "organização de estudos", "horas líquidas de estudo", "cronograma de estudos"],
	authors: [{ name: "StudyCycle Team" }],
	creator: "StudyCycle",
	publisher: "StudyCycle",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: "StudyCycle | Gerenciador Inteligente de Ciclos de Estudo",
		description: "Distribua suas horas de estudo com estratégia. Ajuste afinidade, peso por matéria e acompanhe seu progresso sem horários engessados.",
		url: defaultUrl,
		siteName: "StudyCycle",
		locale: "pt_BR",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "StudyCycle | Gerenciador Inteligente de Ciclos de Estudo",
		description: "Distribua suas horas de estudo com estratégia. Ajuste afinidade, peso por matéria e acompanhe seu progresso sem horários engessados.",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export const viewport = {
	themeColor: "#0c6b58",
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({ children }) {
	return (
		<html lang="pt-BR" className={roboto.variable}>
			<body>
				<AppRouterEmotionCacheProvider>
					<AppThemeProvider>
						<div className="app-shell">
							<AppHeader />
							<main className="app-main">{children}</main>
							<AppFooter />
						</div>
					</AppThemeProvider>
				</AppRouterEmotionCacheProvider>
			</body>
		</html>
	);
}
