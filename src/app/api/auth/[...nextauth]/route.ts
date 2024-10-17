import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma"; // Seu prisma client
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Encontre o usuário no banco de dados com base no email (username)
        const user = await prisma.user.findUnique({
          where: { email: credentials?.username },
        });

        if (!user) {
          throw new Error("Usuário não encontrado!");
        }

        // Verifica se a senha informada bate com a senha armazenada no banco de dados
        const isPasswordValid = await bcrypt.compare(credentials!.password, user.senha);

        if (!isPasswordValid) {
          throw new Error("Senha inválida!");
        }

        // Retorna o usuário autenticado (sem senha)
        return {
          id: user.id,
          name: user.nome,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login", // Página de login personalizada
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
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Certifique-se de definir essa variável no .env
});

export { handler as GET, handler as POST };
