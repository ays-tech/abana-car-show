"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useKiosk } from "@/lib/store";
import ScreenLayout from "../kiosk/ScreenLayout";

/* ── minimal SVG QR placeholder ── */
function QRCode({ size = 200 }: { size?: number }) {
  const cells = 21;
  const cs = size / cells;
  const pattern = (r: number, c: number): boolean => {
    const inCorner = (rr: number, cc: number) =>
      (rr === 0 || rr === 6 || cc === 0 || cc === 6) ||
      (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4);
    if (r < 7 && c < 7) return inCorner(r, c);
    if (r < 7 && c >= cells - 7) return inCorner(r, c - (cells - 7));
    if (r >= cells - 7 && c < 7) return inCorner(r - (cells - 7), c);
    return (r * 3 + c * 7 + (r ^ c)) % 3 === 0;
  };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <rect width={size} height={size} fill="white" />
      {Array.from({ length: cells }, (_, r) =>
        Array.from({ length: cells }, (_, c) =>
          pattern(r, c) ? (
            <rect key={`${r}-${c}`} x={c * cs} y={r * cs} width={cs} height={cs} fill="#060606" />
          ) : null
        )
      )}
    </svg>
  );
}

export default function ShareScreen() {
  const { state, dispatch } = useKiosk();
  const car = state.selectedCar;
  const [done, setDone] = useState(false);

  function handleShare() {
    setDone(true);
    setTimeout(() => dispatch({ type: "RESET" }), 3800);
  }

  const waMsg = car
    ? `Hi Abanacars! I'm interested in the ${car.year} ${car.brand} ${car.model} (${car.priceLabel}). Seen at your showroom — can you send details?`
    : "Hi Abanacars! I visited your showroom and would like more information.";

  if (done) {
    return (
      <ScreenLayout title="Done!" showBack={false}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 10, stiffness: 120 }}
            style={{ fontSize: 80, marginBottom: 24 }}>✅</motion.div>
          <div style={{ fontFamily: "Georgia,serif", fontSize: 36, color: "#fff", marginBottom: 12 }}>Details Sent!</div>
          <div style={{ fontSize: 13, color: "rgba(244,239,228,0.42)", marginBottom: 6 }}>Check your WhatsApp for the full car details.</div>
          <div style={{ fontSize: 10, color: "rgba(244,239,228,0.25)", letterSpacing: 2 }}>Returning to home in a moment…</div>
        </div>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Save & Share" showBack>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 40px", gap: 0 }}>

        {/* ── QR PANEL ── */}
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 40px" }}>
          <div style={{ fontSize: 9, letterSpacing: 5, textTransform: "uppercase", color: "rgba(244,239,228,0.35)", marginBottom: 24 }}>
            Scan QR Code
          </div>
          <div style={{ padding: 16, background: "rgba(20,20,22,0.85)", border: "1px solid rgba(200,164,90,0.15)", marginBottom: 20 }}>
            <QRCode size={200} />
          </div>
          <div style={{ fontSize: 11, color: "rgba(244,239,228,0.38)", textAlign: "center", maxWidth: 220, lineHeight: 1.6, marginBottom: 24 }}>
            Scan with your phone camera to view{car ? ` the ${car.brand} ${car.model}` : " our full collection"} online
          </div>
          <button onClick={handleShare}
            style={{ border: "1px solid rgba(200,164,90,0.3)", color: "rgba(244,239,228,0.55)",
              background: "none", padding: "12px 32px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase" }}>
            Done — I Scanned It ✓
          </button>
        </motion.div>

        {/* ── DIVIDER ── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ width: 1, height: 80, background: "rgba(200,164,90,0.14)" }} />
          <span style={{ fontSize: 10, color: "rgba(244,239,228,0.22)", letterSpacing: 2 }}>OR</span>
          <div style={{ width: 1, height: 80, background: "rgba(200,164,90,0.14)" }} />
        </div>

        {/* ── WHATSAPP PANEL ── */}
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.12 }}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 40px" }}>
          <div style={{ fontSize: 9, letterSpacing: 5, textTransform: "uppercase", color: "rgba(244,239,228,0.35)", marginBottom: 24 }}>
            Send to WhatsApp
          </div>

          {/* Car card */}
          <div style={{ width: "100%", maxWidth: 280, background: "rgba(20,20,22,0.85)",
            border: "1px solid rgba(200,164,90,0.14)", padding: "24px 20px", textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
            {car ? (
              <>
                <div style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "#C8A45A", marginBottom: 4 }}>{car.brand}</div>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 20, color: "#fff", marginBottom: 6 }}>{car.model}</div>
                <div style={{ fontFamily: "Georgia,serif", fontSize: 22, color: "#C8A45A", marginBottom: 12 }}>{car.priceLabel}</div>
              </>
            ) : (
              <div style={{ fontFamily: "Georgia,serif", fontSize: 20, color: "#fff", marginBottom: 12 }}>All Cars</div>
            )}
            <div style={{ fontSize: 10, color: "rgba(244,239,228,0.35)", lineHeight: 1.6 }}>
              We'll send full specs, photos &amp; financing options directly to your WhatsApp
            </div>
          </div>

          {/* WhatsApp button */}
          <button onClick={handleShare}
            style={{ width: "100%", maxWidth: 280, background: "#25D366", color: "#fff", border: "none",
              padding: "17px 0", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>💬</span> Send via WhatsApp
          </button>

          <div style={{ marginTop: 12, fontSize: 9, color: "rgba(244,239,228,0.22)", textAlign: "center", letterSpacing: 1 }}>
            +234 800 ABANACARS · Victoria Island, Lagos
          </div>
        </motion.div>
      </div>

      {/* ── SAVED CARS ── */}
      <AnimatePresence>
        {state.savedCars.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ flexShrink: 0, borderTop: "1px solid rgba(200,164,90,0.1)", padding: "14px 40px", background: "#0C0C0E" }}>
            <div style={{ fontSize: 8, letterSpacing: 4, textTransform: "uppercase", color: "rgba(244,239,228,0.25)", marginBottom: 10 }}>
              Saved Cars ({state.savedCars.length})
            </div>
            <div className="ks-x" style={{ display: "flex", gap: 10 }}>
              {state.savedCars.map(c => (
                <button key={c.id} onClick={() => dispatch({ type: "GO", screen: "detail", car: c })}
                  style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                    background: "rgba(20,20,22,0.85)", border: "1px solid rgba(200,164,90,0.14)" }}>
                  <div style={{ fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: "#C8A45A" }}>{c.brand}</div>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 14, color: "#F4EFE4" }}>{c.model}</div>
                  <div style={{ fontSize: 11, color: "rgba(244,239,228,0.38)" }}>{c.priceLabel}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenLayout>
  );
}
