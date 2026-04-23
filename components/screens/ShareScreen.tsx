"use client";
import { motion } from "framer-motion";
import { useKiosk } from "@/lib/store";
import ScreenLayout from "../kiosk/ScreenLayout";
import { useState, useEffect } from "react";

export default function ShareScreen() {
  const { state, dispatch } = useKiosk();
  const car = state.selectedCar;
  const [shared, setShared] = useState(false);
  const [qrSize, setQrSize] = useState(200);

  const carUrl = car
    ? `https://abanacars.com.ng/car/${car.id}?utm_source=kiosk`
    : "https://abanacars.com.ng?utm_source=kiosk";

  const waMsg = car
    ? `Hi Abanacars! I'm interested in the ${car.year} ${car.brand} ${car.model} (${car.priceLabel}). Seen at showroom. Can you send me more details?`
    : "Hi Abanacars! I visited your showroom and would like more information about your cars.";

  const waUrl = `https://wa.me/2348001234567?text=${encodeURIComponent(waMsg)}`;

  function handleShare(method: "qr" | "whatsapp") {
    setShared(true);
    if (method === "whatsapp") {
      // In real kiosk, open QR to WhatsApp or display QR for the WA link
      // For demo, just show confirmation
    }
    setTimeout(() => {
      dispatch({ type: "GO", screen: "home" });
    }, 4000);
  }

  // Generate a simple SVG QR placeholder (in production, use qrcode.react)
  const QrPlaceholder = ({ url, size }: { url: string; size: number }) => {
    // Simple QR-style grid for visual representation
    const cells = 21;
    const cellSize = size / cells;
    
    // Deterministic pattern based on URL
    const getCell = (row: number, col: number) => {
      // Finder patterns (corners)
      if (
        (row < 7 && col < 7) ||
        (row < 7 && col >= cells - 7) ||
        (row >= cells - 7 && col < 7)
      ) {
        if (row === 0 || row === 6 || col === 0 || col === 6) return true;
        if (row >= 2 && row <= 4 && col >= 2 && col <= 4) return true;
        if (row < 7 && col >= cells - 7) {
          const r2 = row, c2 = col - (cells - 7);
          if (r2 === 0 || r2 === 6 || c2 === 0 || c2 === 6) return true;
          if (r2 >= 2 && r2 <= 4 && c2 >= 2 && c2 <= 4) return true;
        }
        if (row >= cells - 7 && col < 7) {
          const r2 = row - (cells - 7), c2 = col;
          if (r2 === 0 || r2 === 6 || c2 === 0 || c2 === 6) return true;
          if (r2 >= 2 && r2 <= 4 && c2 >= 2 && c2 <= 4) return true;
          return false;
        }
        return false;
      }
      // Data cells — pseudo-random based on url and position
      const hash = (url.charCodeAt(row % url.length) + row * 7 + col * 13) % 3;
      return hash === 0;
    };

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="white" />
        {Array.from({ length: cells }).map((_, row) =>
          Array.from({ length: cells }).map((_, col) =>
            getCell(row, col) ? (
              <rect
                key={`${row}-${col}`}
                x={col * cellSize}
                y={row * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#060606"
              />
            ) : null
          )
        )}
      </svg>
    );
  };

  if (shared) {
    return (
      <ScreenLayout title="Done!" showBack={false}>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="text-8xl mb-6"
          >
            ✅
          </motion.div>
          <div className="font-serif text-4xl text-white mb-3">Details Sent!</div>
          <div className="text-sm text-[rgba(244,239,228,0.5)] mb-2">
            Check your WhatsApp for car details.
          </div>
          <div className="text-xs text-[rgba(244,239,228,0.3)] tracking-wider">
            Returning to home in a moment…
          </div>
        </div>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Save & Share" showBack>
      <div className="flex-1 flex items-start justify-center pt-8 px-10 gap-12">
        {/* QR Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="text-[10px] tracking-[4px] text-[rgba(244,239,228,0.4)] uppercase mb-5">
            Scan QR Code
          </div>
          <div className="glass p-6 mb-4">
            <QrPlaceholder url={carUrl} size={220} />
          </div>
          <div className="text-xs text-[rgba(244,239,228,0.4)] text-center max-w-[240px] leading-relaxed">
            Scan with your phone camera to view
            {car ? ` the ${car.brand} ${car.model}` : " our collection"} online
          </div>
          <button
            onClick={() => handleShare("qr")}
            className="mt-5 border border-[rgba(200,164,90,0.3)] text-[rgba(244,239,228,0.6)] px-8 py-3 text-xs tracking-[2px] uppercase active:scale-95 transition-transform"
          >
            Done — Scanned!
          </button>
        </motion.div>

        {/* Divider */}
        <div className="flex flex-col items-center gap-3 self-center">
          <div className="w-px h-24 bg-[rgba(200,164,90,0.15)]" />
          <div className="text-[10px] text-[rgba(244,239,228,0.25)] tracking-wider">OR</div>
          <div className="w-px h-24 bg-[rgba(200,164,90,0.15)]" />
        </div>

        {/* WhatsApp Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col items-center"
        >
          <div className="text-[10px] tracking-[4px] text-[rgba(244,239,228,0.4)] uppercase mb-5">
            Send to WhatsApp
          </div>

          <div className="glass p-8 mb-6 flex flex-col items-center text-center w-[280px]">
            <div className="text-6xl mb-4">💬</div>
            <div className="font-serif text-xl text-white mb-2">
              {car ? `${car.brand} ${car.model}` : "All Cars"}
            </div>
            {car && (
              <div className="font-serif text-2xl text-[#C8A45A] mb-3">{car.priceLabel}</div>
            )}
            <div className="text-xs text-[rgba(244,239,228,0.4)] leading-relaxed">
              We'll send full specs, photos, and financing options directly to your WhatsApp
            </div>
          </div>

          <button
            onClick={() => handleShare("whatsapp")}
            className="w-full bg-[#25D366] text-white py-5 text-sm tracking-[2px] uppercase font-semibold active:scale-95 transition-transform flex items-center justify-center gap-3"
          >
            <span className="text-xl">💬</span>
            Send via WhatsApp
          </button>

          <div className="mt-3 text-[10px] text-[rgba(244,239,228,0.25)] text-center">
            +234 800 ABANACARS · Victoria Island, Lagos
          </div>
        </motion.div>
      </div>

      {/* Saved cars section */}
      {state.savedCars.length > 0 && (
        <div className="flex-shrink-0 border-t border-[rgba(200,164,90,0.1)] p-6">
          <div className="text-[10px] tracking-[4px] text-[rgba(244,239,228,0.3)] uppercase mb-3">
            Your Saved Cars ({state.savedCars.length})
          </div>
          <div className="flex gap-3 overflow-x-auto kiosk-scroll">
            {state.savedCars.map((c) => (
              <div
                key={c.id}
                onClick={() => dispatch({ type: "GO", screen: "detail", car: c })}
                className="glass flex-shrink-0 p-3 flex items-center gap-3 active:scale-95 transition-transform"
              >
                <div className="text-[9px] tracking-[2px] text-[#C8A45A] uppercase">{c.brand}</div>
                <div className="font-serif text-sm text-white">{c.model}</div>
                <div className="text-xs text-[rgba(244,239,228,0.4)]">{c.priceLabel}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ScreenLayout>
  );
}
