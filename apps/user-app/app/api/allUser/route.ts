import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'; 

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
      },
    });

    return NextResponse.json(
      { status: "ok", data: users },
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
