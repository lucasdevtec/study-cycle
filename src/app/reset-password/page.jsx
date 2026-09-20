import { Suspense } from "react";
import ResetPasswordPage from "./ResetPage";

export const metadata = {
	title: "Redefinir Senha",
	robots: {
		index: false,
		follow: false,
	},
};

export default function Page() {
	return (
		<Suspense>
			<ResetPasswordPage />
		</Suspense>
	);
}
