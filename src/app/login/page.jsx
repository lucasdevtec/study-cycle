import { Suspense } from "react";
import LoginPage from "./Login";

export default function Page() {
	return (
		<Suspense>
			<LoginPage />
		</Suspense>
	);
}
