import express from "express";
const app = express();
import { PrismaClient } from '@repo/db/client'
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { isExportDeclaration } from "typescript";
import axios from "axios";

const prisma = new PrismaClient();

app.use(express.json());

let Xtoken:string; 

app.use(
  cors({
    origin: ["http://localhost:3000","http://localhost:3003","http://localhost:3004"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.send({ status: 200, message: "bank server service is running" });
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
    userId: number;
    amount: string;
}


app.post("/api/receive", async (req, res) => {
    const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  let decoded; 
  let secret = process.env.JWT_SECRET || "your-secret-key"
  
 try {
    decoded = jwt.verify(token, secret) as MyJwtPayload;
    console.log("decoded", decoded); //new

    res.status(200).json({ message: "Token received and verified" });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
  
  try{
    const userId = decoded.userId; 
    const amount = decoded.amount;
    console.log("userId", userId); //new
    console.log("amount", amount); //new

    Xtoken = jwt.sign({ Xtoken:  {userId: userId , amount: amount} }, secret, { expiresIn: "1h" });


  }catch(error){
    console.error("Error processing receive route", error);
    return res.status(500).json({ status: "error", message: "Internal server  - receive route" });
  }
  try{
    await axios.post('http://localhost:3000/api/addTokenDB', {
      token: Xtoken,
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Xtoken}`,
      }
    });
  }catch(error){
    console.error("Error in webhook call",error);
  }
});

app.post("/api/webhook/sender", async (req, res) => {

  try{
    await axios.post('http://localhost:3003/webhook', {
      token: Xtoken,
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Xtoken}`,
      }
    });
    res.status(200)
  }catch(error){
    console.error("Error in webhook call",error);
  }

}); 

const PORT = process.env.PORT || 3004;
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
