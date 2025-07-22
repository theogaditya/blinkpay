import prisma  from '@/lib/prisma';
import { m } from 'framer-motion';
import { NextResponse } from 'next/server'


export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", db: "connected", api:"ok" }, { status: 200 },);
  } catch (error) {
    console.error("DB health check failed:", error);
    return NextResponse.json(
      { status: "error", db: "unreachable", message: (error as Error).message },
      { status: 503 }
    );
  }
}