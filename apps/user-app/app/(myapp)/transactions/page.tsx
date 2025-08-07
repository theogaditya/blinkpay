"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OnRampTransaction {
  id: number;
  OnRampingStatus: string;
  amount: number;
  created_at: string;
  updated_at: string;
  provider: string;
}

interface OffRampTransaction {
  OffRampingStatus: string;
  amount: number;
  created_at: string;
  updated_at: string;
  provider: string;
}

type TransactionType = {
  id?: number;
  unifiedId: string;
  type: 'on-ramp' | 'off-ramp';
  status: string;
  amount: number;
  created_at: string;
  updated_at: string;
  provider: string;
};

const AllTransPage = () => {
  const [onRampTransactions, setOnRampTransactions] = useState<OnRampTransaction[]>([]);
  const [offRampTransactions, setOffRampTransactions] = useState<OffRampTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const [onRampRes, offRampRes] = await Promise.all([
          axios.get<OnRampTransaction[]>("/api/getAllTrans"),
          axios.get<OffRampTransaction[]>("/api/getoffRamp")
        ]);
        setOnRampTransactions(onRampRes.data);
        setOffRampTransactions(offRampRes.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const unifiedTransactions = useMemo(() => {
    const onRamp = onRampTransactions.map(tx => ({
      ...tx,
      unifiedId: `on-${tx.id}`,
      type: 'on-ramp' as const,
      status: tx.OnRampingStatus
    }));
    
    const offRamp = offRampTransactions.map((tx, index) => ({
      ...tx,
      unifiedId: `off-${tx.created_at}-${tx.amount}-${index}`,
      type: 'off-ramp' as const,
      status: tx.OffRampingStatus,
      amount: -tx.amount
    }));

    return [...onRamp, ...offRamp].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [onRampTransactions, offRampTransactions]);

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
      <div className="min-h-screen bg-black text-white pt-24 px-4 pb-8">
        <div className="max-w-6xl mx-auto py-6 text-center">
          Loading transactions...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-2 sm:px-4 pb-8">
      <div className="max-w-6xl mx-auto py-6">
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <motion.h1
            className="text-3xl sm:text-5xl font-extrabold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Transactions
          </motion.h1>
        </div>
        
        {/* Desktop Table */}
        <motion.div
          className="hidden md:block bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {unifiedTransactions.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No transactions found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm sm:text-base">
                <thead>
                  <tr className="text-left text-gray-400">
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Amount (NR)</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Source</th>
                    <th className="pb-3 pr-4">Created At</th>
                    <th className="pb-3">Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {unifiedTransactions.map((tx) => (
                    <tr key={tx.unifiedId} className="border-b border-gray-800">
                      <td className="py-2 pr-4">{tx.type === 'on-ramp' ? 'Incoming' : 'Outgoing'}</td>
                      <td className={cn(
                        "py-2 pr-4 font-medium",
                        tx.type === 'on-ramp' ? 'text-green-400' : 'text-red-400'
                      )}>
                        {tx.type === 'on-ramp' ? '+' : ''}{tx.amount}
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs sm:text-sm",
                            getStatusColor(tx.status)
                          )}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        <span className="bg-gray-800/50 px-2 py-0.5 rounded-full text-xs sm:text-sm">
                          {tx.provider}
                        </span>
                      </td>
                      <td className="py-2 pr-4">{formatDate(tx.created_at)}</td>
                      <td className="py-2">{formatDate(tx.updated_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Mobile Card View */}
        <motion.div
          className="md:hidden space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {unifiedTransactions.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No transactions found
            </div>
          ) : (
            unifiedTransactions.map(tx => (
              <div
                key={tx.unifiedId}
                className="bg-[#1a1a1a] p-4 rounded-2xl border border-white/10"
              >
                <div className="flex justify-between mb-1 text-sm sm:text-base">
                  <span className="font-medium">Type</span>
                  <span>{tx.type === 'on-ramp' ? 'Incoming' : 'Outgoing'}</span>
                </div>
                <div className="flex justify-between mb-1 text-sm sm:text-base">
                  <span className="font-medium">Amount</span>
                  <span className={cn(
                    tx.type === 'on-ramp' ? 'text-green-400' : 'text-red-400'
                  )}>
                    {tx.type === 'on-ramp' ? '+' : ''}{tx.amount}
                  </span>
                </div>
                <div className="flex justify-between mb-1 text-sm sm:text-base">
                  <span className="font-medium">Status</span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs sm:text-sm",
                      getStatusColor(tx.status)
                    )}
                  >
                    {tx.status}
                  </span>
                </div>
                <div className="flex justify-between mb-1 text-sm sm:text-base">
                  <span className="font-medium">Provider</span>
                  <span>{tx.provider}</span>
                </div>
                <div className="flex justify-between mb-1 text-xs sm:text-sm text-gray-400">
                  <span>Created</span>
                  <span>{formatDate(tx.created_at)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-400">
                  <span>Updated</span>
                  <span>{formatDate(tx.updated_at)}</span>
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AllTransPage;
