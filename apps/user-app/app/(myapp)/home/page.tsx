"use client";
import { MiniNavbar } from "../components/shadcn/sign-in-flow-1";
import { ChartAreaInteractive } from "../components/shadcn/chart";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="flex w-[100%] flex-col min-h-screen bg-black relative py-31">
      <MiniNavbar />
      {/* Header */}
      <div className="flex justify-center items-center mb-8 text-white">
        <motion.h1
          className="text-5xl font-extrabold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Home
        </motion.h1>
      </div>
      <div>
        <ChartAreaInteractive />
      </div>
    </div>
  );
}