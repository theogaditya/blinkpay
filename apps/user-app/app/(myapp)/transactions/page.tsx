"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
interface Transaction {
  id: number;
  OnRampingStatus: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

const AllTransPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/api/getAllTrans"); 
        setTransactions(response.data as Transaction[]);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500/20 text-green-400";
      case "Processing":
        return "bg-yellow-500/20 text-yellow-400";
      case "Failed":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div>
      <div className="min-h-screen bg-black text-white pt-24 px-4 pb-8">
        <div className="max-w-6xl mx-auto py-6 text-center">
          Loading transactions...
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 pb-8">
      <div className="max-w-6xl mx-auto py-6">

                      {/* Header */}
              <div className="flex justify-center items-center mb-8">
                <motion.h1
                  className="text-5xl font-extrabold"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Transactions
                </motion.h1>
              </div>
        {/* Transactions Table */}
        <motion.div
          className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          
          {transactions.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No transactions found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-gray-400">
                    <th className="pb-3">Amount (NR)</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Created At</th>
                    <th className="pb-3">Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-800">
                      <td className="py-3">{tx.amount}</td>
                      <td className="py-3">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-sm",
                            getStatusColor(tx.OnRampingStatus)
                          )}
                        >
                          {tx.OnRampingStatus}
                        </span>
                      </td>
                      <td className="py-3">{formatDate(tx.created_at)}</td>
                      <td className="py-3">{formatDate(tx.updated_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AllTransPage;