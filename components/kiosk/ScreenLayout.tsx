"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useKiosk } from "@/lib/store";

interface Props {
  title: string;
  children: ReactNode;
  showBack?: boolean;
}

const S = {
  wrap: {
    position: "fixed" as const, inset: 0,
    display: "flex", flexDirection: "column" as const,
    background: "#060606", overflow: "hidden",
  },
  topbar: {
    flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 40px", height: 64,
    background: "#0C0C0E",
    borderBottom: "1px solid rgba(200,164,90,0.1)",
  },
  logo: {
    fontFamily: "Georgia,serif", fontSize: 18,
    fontWeight: 700, letterSpacing: 6, color: "#C8A45A",
  },
  logoLight: { color: "rgba(244,239,228,0.7)", fontWeight: 300 },
  titleBar: {
    flexShrink: 0,
    padding: "12px 40px",
    borderBottom: "1px solid rgba(200,164,90,0.06)",
  },
  titleText: {
    fontFamily: "Georgia,serif", fontSize: 22,
    fontWeight: 300, color: "rgba(244,239,228,0.88)",
    letterSpacing: 1, margin: 0,
  },
  content: { flex: 1, display: "flex", flexDirection: "column" as const, overflow: "hidden", minHeight: 0 },
  idleTrack: { flexShrink: 0, height: 2, background: "rgba(200,164,90,0.07)" },
};

export default function ScreenLayout({ title, children, showBack }: Props) {
  const { dispatch, state } = useKiosk();
  const idlePct = Math.max(0, 100 - (state.idleSeconds / 60) * 100);

  return (
    <motion.div
      style={S.wrap}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* TOP BAR */}
      <div style={S.topbar}>
        {/* Left — back */}
        <div style={{ width: 160, display: "flex", alignItems: "center" }}>
          {showBack && (
            <button
              onClick={() => dispatch({ type: "BACK" })}
              style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11,
                letterSpacing: 3, textTransform: "uppercase",
                color: "rgba(244,239,228,0.38)", background: "none", border: "none",
                transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#C8A45A"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(244,239,228,0.38)"}
            >
              <span style={{ fontSize: 18 }}>←</span> Back
            </button>
          )}
        </div>

        {/* Centre — logo */}
        <div style={S.logo}>
          ABANA<span style={S.logoLight}>CARS</span>
        </div>

        {/* Right — compare + home */}
        <div style={{ width: 160, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
          {state.compareList.length > 0 && (
            <button
              onClick={() => dispatch({ type: "GO", screen: "compare" })}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10,
                letterSpacing: 2, textTransform: "uppercase", color: "#C8A45A",
                border: "1px solid rgba(200,164,90,0.32)", padding: "6px 14px",
                background: "rgba(200,164,90,0.07)" }}
            >
              ⚖️ {state.compareList.length}
            </button>
          )}
          <button
            onClick={() => dispatch({ type: "RESET" })}
            style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
              color: "rgba(244,239,228,0.22)", background: "none", border: "none",
              transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(244,239,228,0.55)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(244,239,228,0.22)"}
          >
            ⌂ Home
          </button>
        </div>
      </div>

      {/* SCREEN TITLE */}
      <div style={S.titleBar}>
        <h1 style={S.titleText}>{title}</h1>
      </div>

      {/* CONTENT */}
      <div style={S.content}>{children}</div>

      {/* IDLE BAR */}
      <div style={S.idleTrack}>
        <div style={{ height: "100%", background: "#C8A45A", width: `${idlePct}%`, transition: "width 1s linear" }} />
      </div>
    </motion.div>
  );
}
