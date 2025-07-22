
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import prisma from '@/lib/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  
  providers: [Google],
  callbacks: {
    async signIn({ user, account, profile }) {
      const exitst = await prisma.user.findUnique({
        where: {
          email: user.email!,
        },
      })
      if (!exitst) {
        await prisma.user.create({
          data: {
            email: user.email!,
            name: user.name,
            auth_type: "Google",
          },
        })
      }
      return true;
    }
  },
})