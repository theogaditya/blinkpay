import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
// import { PrismaClient, OnRampingStatus } from "@repo/db/client";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

type incomming = {
  amount: number;
  email: string;
};
const secret = process.env.JWT_SECRET || "your-secret-key";


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

// export const POST = auth(async function POST(req) {
//   if (!req.auth) {
//     return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//   }
//   const session = req.auth;
//   const senderEmail = session.user?.email || "";
//   const sender = await prisma.user.findUnique({
//     where: { email: senderEmail },
//     select: {
//       id: true,
//     },
//   });
//   if (!sender) {
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   const payload = (await req.json()) as incomming;

//   if (!payload.email || !payload.amount) {
//     return NextResponse.json(
//       { error: "email & amount required" },
//       { status: 400 }
//     );
//   }
//   if (payload.amount <= 0 || typeof payload.amount !== "number") {
//     return NextResponse.json(
//       { error: "Amount must be greater than zero" },
//       { status: 400 }
//     );
//   }
//   const receiverEmail = payload.email;

//   const receiver = await prisma.user.findUnique({
//     where: { email: receiverEmail },
//   });

//   if (!receiver) {
//     return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
//   }

//   console.log("Sender ID:", sender.id);
//   console.log("Receiver ID:", receiver.id);
//   console.log("Transfer Amount:", payload.amount);

//   try {
//     const token = jwt.sign(
//       {
//         senderId: sender.id,
//         receiverId: receiver.id,
//         amount: payload.amount,
//       },
//       JWT_SECRET,
//       { expiresIn: "1h" }
//     );
//     await prisma.$transaction(async (tx) => {

//       const senderBalance = await tx.$queryRawUnsafe<
//         { id: number; user_id: number; amount: number }[]
//       >(
//         `SELECT id, user_id, amount
//        FROM "Balance"
//        WHERE user_id = $1
//        FOR UPDATE`,
//         sender.id
//       );
//       const receiverBalance = await tx.$queryRawUnsafe<
//         { id: number; user_id: number; amount: number }[]>
//         (`SELECT id, user_id, amount
//        FROM "Balance"
//        WHERE user_id = $1
//        FOR UPDATE`,
//         receiver.id
//       );

//       if (!senderBalance) throw new Error("Sender has no balance row");
//       if (senderBalance[0].amount < payload.amount)
//         throw new Error("Insufficient balance");
//       if (senderBalance[0].amount <= 0)
//         throw new Error("Balance is zero");

//       const offRamping = await tx.offRamping.create({
//         data: {
//           user_id: sender.id,
//           OffRampingStatus: "Approved",
//           amount: payload.amount,
//           token,
//           provider: receiver.email,
//         },
//       });

//       const onRamping = await tx.onRamping.create({
//         data: {
//           user_id: receiver.id,
//           OnRampingStatus: "Approved",
//           amount: payload.amount,
//           token,
//           provider: senderEmail,
//         },
//       });

//       if (!offRamping || !onRamping) {
//         throw new Error("Failed to create offRamping and onRamping");
//       }

//       const senderBalanceUpdate = await tx.balance.update({
//         where: { user_id: sender.id },
//         data: { amount: { decrement: payload.amount } },
//       });

//       const receiverBalanceUpdate = await tx.balance.upsert({
//         where: { user_id: receiver.id },
//         create: { user_id: receiver.id, amount: payload.amount },
//         update: { amount: { increment: payload.amount } },
//       });

//       if (!senderBalanceUpdate || !receiverBalanceUpdate) {
//         throw new Error("Failed to update balances");
//       }
//     });
//       return NextResponse.json({
//     message: "P2P transfer successful",
//     sender: senderEmail,
//     receiver: receiverEmail,
//     amount: payload.amount,
//   }, { status: 200 });
//   } catch (err: any) {
//     return NextResponse.json(
//       { message: "ptp failed + " + err.message },
//       { status: 500 }
//     );
//   }
//});
