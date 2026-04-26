import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { authService } from "@/lib/modules/auth/auth.service";

export const authOptions = {
	pages: {
		signIn: "/login",
	},

	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Senha", type: "password" },
			},

			async authorize(credentials) {
				try {
					if (!credentials?.email || !credentials?.password) {
						return null;
					}

					return await authService.login({
						email: credentials.email,
						password: credentials.password,
					});
				} catch (err) {
					console.error("AUTH ERROR:", err.message);
					return null;
				}
			},
		}),

		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		}),
	],

	callbacks: {
		async signIn({ user, account, profile }) {
			try {
				if (account?.provider === "google") {
					const dbUser = await authService.loginWithGoogle({
						email: user.email,
						name: user.name || profile?.name,
						providerId: account.providerAccountId,
					});

					user.id = dbUser.id.toString();
				}

				return true;
			} catch (error) {
				console.error("Sign in error:", error);
				return false;
			}
		},

		async jwt({ token, user, account }) {
			if (user) token.id = user.id;
			if (account) token.provider = account.provider;
			return token;
		},

		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id;
			}
			return session;
		},
	},

	session: {
		strategy: "jwt",
	},

	secret: process.env.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV === "development",
};
