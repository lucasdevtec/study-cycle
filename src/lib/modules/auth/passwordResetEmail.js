import { Resend } from "resend";

function getResendClient() {
	if (!process.env.RESEND_API_KEY) {
		throw new Error("RESEND_API_KEY não configurado");
	}

	return new Resend(process.env.RESEND_API_KEY);
}

export async function sendPasswordResetEmail({ to, resetLink }) {
	const resend = getResendClient();
	const from = process.env.RESEND_FROM || "StudyCycle <onboarding@resend.dev>";

	await resend.emails.send({
		from,
		to,
		subject: "Redefinição de senha - StudyCycle",
		html: `
			<div style="font-family: Arial, sans-serif; line-height: 1.5;">
				<h2>Redefinição de senha</h2>
				<p>Recebemos um pedido para redefinir sua senha.</p>
				<p>
					<a href="${resetLink}" style="display:inline-block;padding:10px 16px;background:#1b5e4f;color:#fff;text-decoration:none;border-radius:6px;">
						Redefinir senha
					</a>
				</p>
				<p>Se você não pediu essa alteração, ignore este e-mail.</p>
				<p>Este link expira em 30 minutos.</p>
			</div>
		`,
	});
}
