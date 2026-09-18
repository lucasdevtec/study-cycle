import test from "node:test";
import assert from "node:assert/strict";
import { createPasswordResetToken, verifyPasswordResetToken } from "../src/lib/modules/auth/passwordResetToken.js";

// Mock do secret para ambiente de teste
process.env.NEXTAUTH_SECRET = "super-secret-test-key-32-chars-long";

test("createPasswordResetToken gera token que pode ser verificado com o mesmo hash", () => {
	const user = { userId: 42, email: "teste@example.com", passwordHash: "hashedPassword123" };
	const token = createPasswordResetToken(user);

	assert.ok(typeof token === "string");
	assert.ok(token.includes("."));

	const verified = verifyPasswordResetToken(token, user.passwordHash);
	assert.equal(verified.userId, 42);
	assert.equal(verified.email, "teste@example.com");
});

test("verifyPasswordResetToken rejeita se passwordHash for diferente (ex: senha já alterada)", () => {
	const user = { userId: 42, email: "teste@example.com", passwordHash: "hashedPassword123" };
	const token = createPasswordResetToken(user);

	assert.throws(() => verifyPasswordResetToken(token, "differentHashedPassword"), /Token inválido ou expirado/);
});

test("verifyPasswordResetToken rejeita token malformado ou corrompido", () => {
	assert.throws(() => verifyPasswordResetToken("not-a-token", "someHash"), /Token inválido/);

	assert.throws(() => verifyPasswordResetToken("invalidBase64.invalidSig", "someHash"), /Token inválido/);
});
