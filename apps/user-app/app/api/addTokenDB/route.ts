import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";

const secret = process.env.JWT_SECRET || "your-secret-key"

interface MyJwtPayload extends JwtPayload {
  Xtoken:{
    userId: number;
    amount: string;
  }
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  const Xtoken = authHeader.split(" ")[1];
  console.log("🔐 Received Xtoken:", Xtoken);
  let decoded;
  try {
    decoded = jwt.verify(Xtoken, secret) as MyJwtPayload;
    console.log("decoded", decoded); //new
  } catch (err) {
    return new Response("Invalid or expired token", { status: 401 });
  }
  const userId = decoded.Xtoken.userId;
  const amount = decoded.Xtoken.amount;
  console.log("userId", userId); //new
  console.log("amount", amount); //new

  try{
    await prisma.$transaction([
      prisma.onRamping.create({ 
        data: {                         
          user_id:          userId,
          token:            Xtoken,
          amount :          (Number(amount)),
          OnRampingStatus:  "Processing",
          created_at:       new Date(),
          updated_at:       new Date(),
          provider:         "HDFC",
        },
      }),
    ])
    return NextResponse.json(
      { message: "Token stored and bank notified" },
      { status: 200 }
    );
  }catch(error){
    console.error("Error to add token to db",error);
  }

  return NextResponse.json(
    { message: "Token stored and bank notified" },
    { status: 200 }
  );
}
