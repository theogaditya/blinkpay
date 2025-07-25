import axios from "axios";
const BANK_SERVER=process.env.BANK_SERVER;

export async function POST(req: Request) {
  try {
    axios.post(`${BANK_SERVER}/api/webhook/sender`);
  } catch (error) {
    console.error("Error sending amount while adding money:", error);
  }
}
