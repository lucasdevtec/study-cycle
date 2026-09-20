import { Suspense } from "react";
import SignupPage from "./Signup";

export const metadata = {
	title: "Criar Conta Gratuita",
	description: "Cadastre-se no StudyCycle e comece a planejar seus ciclos de estudo gratuitamente.",
	alternates: {
		canonical: "/signup",
	},
};

export default function Page() {
	return (
		<Suspense>
			<SignupPage />
		</Suspense>
	);
}
