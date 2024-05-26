import axios from "axios";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";

const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      id: "credentials",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.identifier || !credentials.password) {
          throw Error("Invalid Credentials");
        }
        try {
          const { data: user } = await axios(
            `${process.env.AUTHENTICATION_BASE_URL}/login`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
              data: credentials,
            }
          );
          // check it it returns a user and the response is 200
          if (user.success && user) return user;
        } catch (error) {
          console.log(error);
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async session({ session, user, token }) {
      session.user = token.user!;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) token.user = user;
      return token;
    },
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
