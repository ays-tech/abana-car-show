"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useKiosk } from "@/lib/store";

interface Props {
  title: string;
  children: ReactNode;
  showBack?: boolean;
}

export default function ScreenLayout({ title, children, showBack }: Props) {
  const { dispatch, state } = useKiosk();

  return (
    <motion.div
      className="w-screen h-screen flex flex-col bg-[#060606]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-8 py-5 border-b border-[rgba(200,164,90,0.1)] bg-[#0C0C0E]">
        {/* Left */}
        <div className="flex items-center gap-6 w-52">
          {showBack && (
            <button
              onClick={() => dispatch({ type: "BACK" })}
              className="flex items-center gap-2 text-[rgba(244,239,228,0.4)] hover:text-[#C8A45A] transition-colors active:scale-95"
            >
              <span className="text-lg">←</span>
              <span className="text-xs tracking-[3px] uppercase">Back</span>
            </button>
          )}
        </div>

        {/* Center — logo */}
        <div className="font-serif text-lg font-bold tracking-[5px] text-[#C8A45A]">
          ABANA<span className="text-[rgba(244,239,228,0.7)] font-light">CARS</span>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-4 w-52 justify-end">
          {state.compareList.length > 0 && (
            <button
              onClick={() => dispatch({ type: "GO", screen: "compare" })}
              className="flex items-center gap-1.5 text-xs tracking-[2px] text-[#C8A45A] uppercase border border-[rgba(200,164,90,0.3)] px-4 py-2"
            >
              ⚖️ {state.compareList.length}
            </button>
          )}
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="text-xs tracking-[2px] text-[rgba(244,239,228,0.25)] uppercase hover:text-[rgba(244,239,228,0.5)] transition-colors"
          >
            Home
          </button>
        </div>
      </div>

      {/* Screen title */}
      <div className="flex-shrink-0 px-8 py-4 border-b border-[rgba(200,164,90,0.06)]">
        <h1 className="font-serif text-2xl font-light text-[rgba(244,239,228,0.9)] tracking-wide">
          {title}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>

      {/* Idle bar */}
      <div className="flex-shrink-0 h-[2px] bg-[rgba(200,164,90,0.1)]">
        <div
          className="h-full bg-[#C8A45A] transition-all duration-1000"
          style={{ width: `${Math.max(0, 100 - (state.idleSeconds / 60) * 100)}%` }}
        />
      </div>
    </motion.div>
  );
}
