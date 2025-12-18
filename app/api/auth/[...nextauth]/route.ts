import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema"; // adjust to your User table
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        // Google({
        //     clientId: process.env.GOOGLE_CLIENT_ID!,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        // }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const [user] = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, credentials.email.toLowerCase()))
                    .limit(1);

                if (!user || !user.passwordHash) return null;

                const valid = await compare(credentials.password, user.passwordHash);
                if (!valid) return null;

                return {
                    id: String(user.id),
                    email: user.email,
                    name: user.name,
                    role: user.role ?? "USER",
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Runs on login and subsequent calls
            if (user) {
                token.id = (user as any).id;
                token.role = (user as any).role ?? "USER";
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role ?? "USER";
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
