import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
 
export const GET = auth(function GET(req) {
  if (req.auth) return NextResponse.json(req.auth,{ status: 200 })
  return NextResponse.json({ user: "Not authenticated" }, { status: 401 })
})
