import crypto from "crypto";

const TOKEN_TTL_MINUTES = 30;

function getSecret() {
	if (!process.env.NEXTAUTH_SECRET) {
		throw new Error("NEXTAUTH_SECRET não configurado");
	}

	return process.env.NEXTAUTH_SECRET;
}

function base64UrlEncode(value) {
	return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value) {
	return Buffer.from(value, "base64url").toString();
}

function signPayload(payload, passwordHash) {
	return crypto.createHmac("sha256", getSecret()).update(`${payload}.${passwordHash}`).digest("base64url");
}

export function createPasswordResetToken({ userId, email, passwordHash }) {
	const expiresAt = Date.now() + TOKEN_TTL_MINUTES * 60 * 1000;
	const payload = base64UrlEncode(JSON.stringify({ userId, email, expiresAt }));
	const signature = signPayload(payload, passwordHash);

	return `${payload}.${signature}`;
}

export function verifyPasswordResetToken(token, passwordHash) {
	const [payload, signature] = String(token || "").split(".");

	if (!payload || !signature) {
		throw new Error("Token inválido");
	}

	const expectedSignature = signPayload(payload, passwordHash);
	if (signature !== expectedSignature) {
		throw new Error("Token inválido ou expirado");
	}

	const parsed = JSON.parse(base64UrlDecode(payload));

	if (!parsed?.userId || !parsed?.email || !parsed?.expiresAt) {
		throw new Error("Token inválido");
	}

	if (Date.now() > Number(parsed.expiresAt)) {
		throw new Error("Token inválido ou expirado");
	}

	return {
		userId: Number(parsed.userId),
		email: String(parsed.email),
	};
}
