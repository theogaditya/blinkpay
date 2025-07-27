import express from "express";
const app = express();
import { OnRampingStatus, PrismaClient } from "@repo/db/client";
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
app.use(express.json());

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET || "your-secret-key";

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3003",
      "http://localhost:3004",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.send({ status: 200, message: "webHook service is running" });
});

app.get("/health", async (req, res) => {
  console.log("Health check endpoint hit");
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ok", db: "connected", api: "ok" });
  } catch (error) {
    console.error("DB health check failed:", error);
    res.status(503).json({
      status: "error",
      db: "unreachable",
      message: (error as Error).message,
    });
  }
});

interface MyJwtPayload extends JwtPayload {
  Xtoken: {
    userId: number;
    amount: string;
  };
}

app.post("/webhook", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
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
    try {
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: userId },
        });
        if (!user) {
          throw new Error("User not found during webhook onRamping processing");
        }

        const onRamping = await tx.onRamping.updateMany({
          where: { token: Xtoken, OnRampingStatus: OnRampingStatus.Processing },
          data: {
            OnRampingStatus: OnRampingStatus.Approved,
            updated_at: new Date(),
          },
        });

        if (!onRamping) {
          throw new Error("OnRamping not found during webhook processing");
        }

        if (onRamping.count === 0) {
          throw new Error(
            "This token has already been processed or is invalid."
          );
        }

        const balance = await tx.balance.upsert({
          where: { user_id: userId },
          update: {
            amount: { increment: Number(amount) },
          },
          create: {
            user_id: userId,
            currency: "INR",
          },
        });

        if (!balance) {
          throw new Error("Balance not found during webhook processing");
        }

        console.log("Balance updated:", balance);
      });
    } catch (error) {
      console.error("Error processing prisma webhook payload:", error);
      return res
        .status(400)
        .json({ status: "error", message: "payload - prisma call webhook" });
    }

    res.status(200).json({
      status: "success",
      message: "Webhook received and balance updated",
    });
  } catch (error) {
    console.error("Error processing webhook route", error);
    res
      .status(500)
      .json({ status: "error", message: "Internal server  - webhook route" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("SIGINT", async () => {
  console.log("Received SIGINT. Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});
