
"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { ArrowDown, ArrowUp, Lock, Plus, Send } from "lucide-react";
import { useState, useEffect } from "react";
const axios = require('axios').default;

const TransfersPage = () => {
  const [amountState, setAmount] = useState<string>(''); 
  const [balance, setBalance] = useState<number>(0);

  function addMoneyOnClick() {
    try {
      axios.post('http://localhost:3000/api/addMoney', {
        amount: amountState,
      })
    } catch (error) {
      console.error('Error sending amount while adding money:', error); 
    }
    window.location.replace('mockHDFC');
  }

useEffect(() => {
  const fetchBalance = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/balance");
      const balances = response.data;
      if (balances.length > 0) {
        setBalance(balances[0].amount);
        console.log("🔐 Received balance:", balances[0].amount);
      } else {
        console.warn("No balance records found for user");
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  fetchBalance();
}, []);

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
            Transfer
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Add Money */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Plus size={20} /> Add Money 
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Amount</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amountState}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#333] text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-white"
                  />

                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Bank</label>
                  <div className="relative">
                    <select className="w-full bg-[#333] text-white rounded-lg py-3 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-white">
                      <option>HDFC Bank</option>
                      <option>Other Bank</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button onClick={addMoneyOnClick} className="w-full px-4 py-2 text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full shadow-[0_0_10px_rgba(160,160,160,0.4)] hover:from-gray-200 hover:to-gray-400 hover:shadow-[0_0_20px_rgba(160,160,160,0.6)] transition-all duration-300">
                  Add Money
                </button>


              </div>
            </motion.div>
          </div>

          {/* Right Column - Balance */}
          <div className="space-y-6">
            {/* Balance Card */}
            <motion.div
              className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4">Balance</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Lock size={14} /> Total Locked Balance
                  </span>
                  <span>{balance} INR</span>
                </div>

                <div className="flex justify-between pt-3 border-t border-gray-800 mt-3">
                  <span className="text-gray-200 font-medium">Total Balance</span>
                  <span className="font-medium">{balance} INR</span>
                </div>
              </div>
            </motion.div>

            {/* Two Balance Boxes */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="bg-gray-800 p-3 rounded-full mb-3">
                  <ArrowDown className="text-blue-400" />
                </div>
                <span className="text-gray-400 text-sm mb-1">Received</span>
                <span className="text-xl">0 NR</span>
              </motion.div>

              <motion.div
                className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <div className="bg-gray-800 p-3 rounded-full mb-3">
                  <ArrowUp className="text-purple-400" />
                </div>
                <span className="text-gray-400 text-sm mb-1">Sent</span>
                <span className="text-xl">0 NR</span>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center bg-gray-800 rounded-xl py-4 hover:bg-gray-700 transition-colors">
                  <div className="bg-blue-500/20 p-2 rounded-lg mb-2">
                    <Send className="text-blue-400" size={20} />
                  </div>
                  <span>Send</span>
                </button>

                <button className="flex flex-col items-center justify-center bg-gray-800 rounded-xl py-4 hover:bg-gray-700 transition-colors">
                  <div className="bg-purple-500/20 p-2 rounded-lg mb-2">
                    <ArrowDown className="text-purple-400" size={20} />
                  </div>
                  <span>Request</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransfersPage;