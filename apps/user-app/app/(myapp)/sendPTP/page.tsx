// app/dashboard/p2p/page.tsx
"use client";

import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface User {
  email: string;
  name: string;
}
interface APIRES{
  status: string;
  data: User;
}

const P2PTransferPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const verifyUser = async () => {
    if (!recipientEmail.trim()) {
      setError("Please enter an email address");
      return;
    }
    
    setLoading(true);
    setError("");
    setFoundUser(null);
    
    try {
      const response = await axios.post<APIRES>("/api/findUser", { email: recipientEmail });
      
      if (response.data.status === "ok") {
        setFoundUser(response.data.data);
        setSuccess("User verified successfully");
      } else {
        setError( "User not found");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to verify user");
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!foundUser) {
      setError("Please verify the recipient first");
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount))) {
      setError("Please enter a valid amount");
      return;
    }
    
    const transferAmount = parseFloat(amount);
    if (transferAmount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post("/api/ptp", {
        amount: transferAmount,
        email: recipientEmail
      });
      
      if (response.status === 200) {
        setSuccess(`Successfully sent ${transferAmount} NR to ${foundUser.name}`);
        setTimeout(() => router.push("/home"), 2000);
      } else {
        setError( "Transfer failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-16 px-4 pb-8 pt-31">
      <div className="max-w-md mx-auto w-full py-4">
        <motion.div
          className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-center mb-4">
            <motion.h1
              className="text-2xl md:text-3xl font-bold"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Send Money
            </motion.h1>
          </div>

          <div className="space-y-4">
            {/* Recipient Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Recipient Email
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                  disabled={loading}
                />
                <button
                  onClick={verifyUser}
                  disabled={loading || !recipientEmail.trim()}
                  className={cn(
                    "px-4 py-3 rounded-lg font-medium transition-colors",
                    loading || !recipientEmail.trim()
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
              </div>
            </div>

            {/* Verified User Info */}
            {foundUser && (
              <motion.div
                className="p-3 bg-gray-800/30 rounded-lg border border-green-500/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-700 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shrink-0">
                    <span className="font-bold">
                      {foundUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{foundUser.name}</div>
                    <div className="text-sm text-gray-400 truncate">{foundUser.email}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Amount Input */}
            {foundUser && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Amount (NR)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                  disabled={loading}
                />
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="pt-2">
              {foundUser ? (
                <button
                  onClick={handleTransfer}
                  disabled={loading || !amount}
                  className={cn(
                    "w-full py-3 rounded-lg font-bold transition-colors",
                    loading || !amount
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  )}
                >
                  {loading ? "Sending..." : `Send ${amount || 0} NR`}
                </button>
              ) : (
                <div className="text-center py-3 text-gray-400 text-sm">
                  Verify a user to send money
                </div>
              )}
            </div>

            {/* Status Messages */}
            <div className="text-center">
              {error && (
                <motion.div
                  className="text-red-500 py-1 text-sm sm:text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  className="text-green-500 py-1 text-sm sm:text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {success}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mt-6 w-full py-2 text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default P2PTransferPage;