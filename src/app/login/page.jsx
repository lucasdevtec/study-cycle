import { Suspense } from "react";
import LoginPage from "./Login";

export const metadata = {
	title: "Entrar na sua Conta",
	description: "Acesse sua conta no StudyCycle e continue seus ciclos de estudo.",
	alternates: {
		canonical: "/login",
	},
};

export default function Page() {
	return (
		<Suspense>
			<LoginPage />
		</Suspense>
	);
}
