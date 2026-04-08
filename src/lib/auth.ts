import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import prisma from "@/lib/prisma";

// =============================================================================
// TYPE AUGMENTATION
// Tambah field `id` ke session user bawaan NextAuth
// =============================================================================

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
  }
}

// =============================================================================
// NEXTAUTH CONFIG
// =============================================================================

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<{ id: string; name: string; email: string } | null> {
        // Validasi: credentials harus ada dan bertipe string
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          return null;
        }

        // Ambil admin dari database — type dari Prisma langsung (include password)
        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });

        if (!admin) return null;

        // Cek password
        const isValid = await bcryptjs.compare(
          credentials.password,
          admin.password
        );

        if (!isValid) return null;

        // Return user object — id harus string untuk NextAuth
        return {
          id: String(admin.id),
          name: admin.name,
          email: admin.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Simpan id admin ke JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // Expose id dari token ke session
    async session({ session, token }) {
      if (typeof token.id === "string") {
        session.user.id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },
});