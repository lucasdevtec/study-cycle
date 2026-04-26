import { Roboto } from "next/font/google";
import "./globals.css";
import AppThemeProvider from "@/components/providers/AppThemeProvider";

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
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
