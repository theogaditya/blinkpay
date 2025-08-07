import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'; 

export async function POST(req: Request) {
    const { email } = await req.json();
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          email: true,
          name: true,
        },
      });
      if (!user) {
        return NextResponse.json({ status: "error", message: "User not found" }, { status: 404 });
      }
      return NextResponse.json(
        { status: "ok", data: user },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { status: "error", message: (error as Error).message },
        { status: 503 }
      );
    }
}