"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useKiosk } from "@/lib/store";
import ScreenLayout from "../kiosk/ScreenLayout";

const ROWS = [
  { key: "price",        label: "Price",        get: (c: any) => c.priceLabel },
  { key: "engine",       label: "Engine",       get: (c: any) => c.engine },
  { key: "horsepower",   label: "Horsepower",   get: (c: any) => `${c.horsepower} hp`,  num: (c: any) => c.horsepower,            high: true  },
  { key: "fuel",         label: "Fuel Type",    get: (c: any) => c.fuel },
  { key: "consumption",  label: "Consumption",  get: (c: any) => c.consumption,          num: (c: any) => parseFloat(c.consumption), high: false },
  { key: "transmission", label: "Transmission", get: (c: any) => c.transmission },
  { key: "seats",        label: "Seats",        get: (c: any) => `${c.seats} seats` },
  { key: "accel",        label: "0–100 km/h",   get: (c: any) => c.specs.acceleration },
  { key: "topspeed",     label: "Top Speed",    get: (c: any) => c.specs.topSpeed },
  { key: "boot",         label: "Boot Space",   get: (c: any) => c.specs.bootSpace },
  { key: "warranty",     label: "Warranty",     get: (c: any) => c.specs.warranty },
];

export default function CompareScreen() {
  const { state, dispatch } = useKiosk();
  const list = state.compareList;

  if (list.length === 0) {
    return (
      <ScreenLayout title="Compare Cars" showBack>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 40px" }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>⚖️</div>
          <div style={{ fontFamily: "Georgia,serif", fontSize: 28, color: "rgba(244,239,228,0.42)", marginBottom: 10 }}>No cars selected</div>
          <div style={{ fontSize: 13, color: "rgba(244,239,228,0.28)", marginBottom: 32, lineHeight: 1.6 }}>
            Browse cars and tap the <strong style={{ color: "#C8A45A" }}>+</strong> button on any car to add it here
          </div>
          <button onClick={() => dispatch({ type: "GO", screen: "browse" })}
            style={{ background: "#C8A45A", color: "#060606", border: "none",
              padding: "15px 44px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700 }}>
            Browse Cars
          </button>
        </div>
      </ScreenLayout>
    );
  }

  const cols = Math.max(list.length, 1);
  const gridCols = `200px repeat(${cols}, 1fr)`;

  const best = (row: typeof ROWS[0]) => {
    if (!row.num) return null;
    const vals = list.map(c => row.num!(c));
    return row.high ? Math.max(...vals) : Math.min(...vals);
  };

  return (
    <ScreenLayout title="Compare Cars" showBack>
      <div className="ks" style={{ flex: 1 }}>

        {/* ── HEADER ROW (sticky) ── */}
        <div style={{ display: "grid", gridTemplateColumns: gridCols,
          position: "sticky", top: 0, zIndex: 20,
          background: "#0C0C0E", borderBottom: "1px solid rgba(200,164,90,0.12)" }}>

          {/* Add more cell */}
          <div style={{ padding: 16, display: "flex", alignItems: "flex-end" }}>
            {list.length < 3 && (
              <button onClick={() => dispatch({ type: "GO", screen: "browse" })}
                style={{ width: "100%", border: "1px solid rgba(200,164,90,0.3)", background: "none",
                  color: "#C8A45A", padding: "10px 0", fontSize: 9, letterSpacing: 2, textTransform: "uppercase" }}>
                + Add Car
              </button>
            )}
          </div>

          {/* Car header cells */}
          {list.map(car => (
            <div key={car.id} style={{ padding: 16, borderLeft: "1px solid rgba(200,164,90,0.08)" }}>
              <div style={{ width: "100%", height: 100, overflow: "hidden", marginBottom: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={car.images.hero} alt={car.model}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "#C8A45A", marginBottom: 3 }}>{car.brand}</div>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 16, color: "#F4EFE4", marginBottom: 10, lineHeight: 1.2 }}>{car.model}</div>
              <button onClick={() => dispatch({ type: "REMOVE_COMPARE", id: car.id })}
                style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase",
                  color: "rgba(244,239,228,0.28)", background: "none", border: "none",
                  transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#f87171"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(244,239,228,0.28)"}>
                ✕ Remove
              </button>
            </div>
          ))}
        </div>

        {/* ── SPEC ROWS ── */}
        {ROWS.map((row, i) => {
          const bestVal = best(row);
          return (
            <div key={row.key}
              style={{ display: "grid", gridTemplateColumns: gridCols,
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                background: i % 2 === 1 ? "rgba(255,255,255,0.018)" : "transparent" }}>

              {/* Label */}
              <div style={{ padding: "14px 16px", display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "rgba(244,239,228,0.35)", letterSpacing: 0.3 }}>{row.label}</span>
              </div>

              {/* Values */}
              {list.map(car => {
                const val    = row.get(car);
                const numVal = row.num ? row.num(car) : null;
                const isBest = bestVal !== null && numVal !== null && numVal === bestVal;
                return (
                  <div key={car.id}
                    style={{ padding: "14px 16px", display: "flex", alignItems: "center",
                      borderLeft: "1px solid rgba(200,164,90,0.06)",
                      background: isBest ? "rgba(200,164,90,0.07)" : "transparent" }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: isBest ? "#C8A45A" : "#F4EFE4" }}>
                      {val}
                      {isBest && (
                        <span style={{ marginLeft: 8, fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: "#C8A45A" }}>
                          {row.high ? "↑ Best" : "↓ Best"}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* ── ACTION ROW ── */}
        <div style={{ display: "grid", gridTemplateColumns: gridCols,
          padding: "20px 0", borderTop: "1px solid rgba(200,164,90,0.14)" }}>
          <div style={{ padding: "0 16px", display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "rgba(244,239,228,0.25)" }}>View Details</span>
          </div>
          {list.map(car => (
            <div key={car.id} style={{ padding: "0 12px" }}>
              <button onClick={() => dispatch({ type: "GO", screen: "detail", car })}
                style={{ width: "100%", background: "#C8A45A", color: "#060606", border: "none",
                  padding: "13px 0", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>
                View →
              </button>
            </div>
          ))}
        </div>

        {/* Bottom spacer */}
        <div style={{ height: 40 }} />
      </div>
    </ScreenLayout>
  );
}
