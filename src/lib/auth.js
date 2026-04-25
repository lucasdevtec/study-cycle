import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getDbModels } from "@/lib/db";
import bcrypt from "bcryptjs";

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
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				try {
					const { User } = await getDbModels();

					const user = await User.findOne({
						where: { email: credentials.email },
					});

					if (!user || !user.password) {
						return null;
					}

					const passwordMatch = await bcrypt.compare(credentials.password, user.password);

					if (!passwordMatch) {
						return null;
					}

					return {
						id: user.id.toString(),
						email: user.email,
						name: user.name,
					};
				} catch (error) {
					console.error("AUTH ERROR:", error);
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
					const { User } = await getDbModels();

					const [dbUser] = await User.findOrCreate({
						where: { email: user.email },
						defaults: {
							name: user.name || profile?.name || "Google User",
							email: user.email,
							provider: "google",
							provider_id: account.providerAccountId,
						},
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
