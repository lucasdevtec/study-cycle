import NextAuth, { AuthOptions } from 'next-auth';
import bcrypt from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import userDAO from '@/DAO/users';
import { loginSchema } from '@/schemas/userSchema';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'login',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'seu@email.com' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          throw new Error(parsedCredentials.error.errors[0].message);
        }
        const { email, password } = parsedCredentials.data;
        const user = await userDAO.listarUserPorEmail(email);
        if (!user) {
          throw new Error('Usuário não encontrado.');
        }
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          throw new Error('Senha incorreta.');
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production', // Garantir que os cookies sejam seguros em produção
      },
    },
  },
  pages: { error: '/auth/error' },
  session: {
    strategy: 'jwt', // Garantindo que o JWT seja usado como estratégia
    maxAge: 60 * 60 * 4, // 4 horas para expiração do JWT
    updateAge: 60 * 60, // Atualizar o JWT a cada hora
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string | null,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
