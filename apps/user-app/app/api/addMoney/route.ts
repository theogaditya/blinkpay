import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import axios from "axios";

const BANK_SERVER=process.env.BANK_SERVER;

export async function POST(req: Request) {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  try {
    const { amount } = await req.json();

    if (!amount || amount <= 0 ) {
      return new Response("Invalid amount", { status: 400 });
    }

    const session = await auth();
    const email = session?.user?.email;
    if (!session || !email) {
      return new Response("Unauthorized", { status: 401 });
    }
    const userID = await prisma.user.findUnique({
  where: { email },
});

if (!userID) {
  return new Response("User not found", { status: 404 });
}

    const token = jwt.sign(
  { userId: userID.id, amount },
  secret,
  { expiresIn: "1h" }
);
    console.log("Generated token:", token);

        await axios.post(`${BANK_SERVER}/api/receive`, {
      token,
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
    return NextResponse.json(
      { message: "Token stored and bank notified" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing addMoney request:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
