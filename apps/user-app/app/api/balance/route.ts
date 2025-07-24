import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stringify } from "querystring";

export const GET = auth(async function GET(req) {
  if (req.auth) {
    const session = req.auth;
    const email = String(session.user?.email);

    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
      },
    });
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    const userid = user.id;
    let result;

    try {
        result = await prisma.balance.findMany({
            where: { user_id: userid },
            select: {
                amount: true,
            },
        });
    } catch (error) {
      console.error("Error in getAllTrans route", error);
      return new Response("Internal server error", { status: 500 });
    }
     console.log("🔐 Received result:", result);

    return NextResponse.json(result, { status: 200 });
  } else {
    return NextResponse.json({ user: "Not authenticated" }, { status: 401 });
  }
});
