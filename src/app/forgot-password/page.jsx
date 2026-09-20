import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata = {
	title: "Esqueci Minha Senha",
	robots: {
		index: false,
		follow: false,
	},
};

export default function ForgotPasswordPage() {
	return <ForgotPasswordForm />;
}
