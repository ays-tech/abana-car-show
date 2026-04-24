"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { useKiosk } from "@/lib/store";
import ScreenLayout from "../kiosk/ScreenLayout";

export default function DetailScreen() {
  const { state, dispatch } = useKiosk();
  const car = state.selectedCar;

  /* ── all hooks before any return ── */
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [rotateIdx,  setRotateIdx]  = useState(0);
  const [mode,       setMode]       = useState<"gallery" | "rotate">("gallery");
  const [dragging,   setDragging]   = useState(false);
  const dragStart = useRef(0);

  const onDragStart = useCallback((x: number) => { dragStart.current = x; setDragging(true); }, []);
  const onDragEnd   = useCallback((x: number) => {
    if (!dragging) return;
    const diff = x - dragStart.current;
    if (Math.abs(diff) > 28) {
      const len = car?.images.rotate.length ?? 8;
      setRotateIdx(p => (p + (diff > 0 ? -1 : 1) + len) % len);
    }
    setDragging(false);
  }, [dragging, car]);

  /* ── early return after hooks ── */
  if (!car) {
    return (
      <ScreenLayout title="Vehicle Detail" showBack>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: 26, color: "rgba(244,239,228,0.38)" }}>No car selected</p>
            <button onClick={() => dispatch({ type: "BACK" })}
              style={{ marginTop: 24, background: "#C8A45A", color: "#060606", border: "none",
                padding: "12px 32px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700 }}>
              Go Back
            </button>
          </div>
        </div>
      </ScreenLayout>
    );
  }

  const saved     = state.savedCars.some(c => c.id === car.id);
  const inCompare = state.compareList.some(c => c.id === car.id);
  const currentImg = mode === "gallery" ? car.images.gallery[galleryIdx] : car.images.rotate[rotateIdx];

  const specs = [
    { label: "Price",        val: car.priceLabel,         gold: true  },
    { label: "Engine",       val: car.engine              },
    { label: "Power",        val: `${car.horsepower} hp`  },
    { label: "Fuel Type",    val: car.fuel                },
    { label: "Consumption",  val: car.consumption         },
    { label: "Transmission", val: car.transmission        },
    { label: "Seats",        val: `${car.seats} seats`    },
    { label: "0–100 km/h",   val: car.specs.acceleration  },
    { label: "Top Speed",    val: car.specs.topSpeed      },
    { label: "Boot Space",   val: car.specs.bootSpace     },
    { label: "Warranty",     val: car.specs.warranty      },
  ];

  return (
    <ScreenLayout title={`${car.brand} ${car.model}`} showBack>
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

        {/* ── LEFT: image viewer (55%) ── */}
        <div style={{ width: "55%", display: "flex", flexDirection: "column", borderRight: "1px solid rgba(200,164,90,0.1)", minHeight: 0 }}>

          {/* Mode tabs */}
          <div style={{ flexShrink: 0, display: "flex", borderBottom: "1px solid rgba(200,164,90,0.1)" }}>
            {(["gallery", "rotate"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                style={{
                  flex: 1, padding: "13px 0", fontSize: 10, letterSpacing: 3,
                  textTransform: "uppercase", border: "none",
                  color: mode === m ? "#C8A45A" : "rgba(244,239,228,0.3)",
                  borderBottom: mode === m ? "2px solid #C8A45A" : "2px solid transparent",
                  background: mode === m ? "rgba(200,164,90,0.05)" : "transparent",
                  transition: "all 0.2s",
                }}>
                {m === "gallery" ? "📷  Gallery" : "🔄  360° View"}
              </button>
            ))}
          </div>

          {/* Main image */}
          <div
            style={{ flex: 1, position: "relative", overflow: "hidden", background: "#141416", minHeight: 0 }}
            onMouseDown={e => { if (mode === "rotate") onDragStart(e.clientX); }}
            onMouseUp={e   => { if (mode === "rotate") onDragEnd(e.clientX);   }}
            onTouchStart={e => { if (mode === "rotate") onDragStart(e.touches[0].clientX); }}
            onTouchEnd={e   => { if (mode === "rotate") onDragEnd(e.changedTouches[0].clientX); }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImg}
                src={currentImg}
                alt={car.model}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                draggable={false}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            </AnimatePresence>

            {/* 360 hint */}
            {mode === "rotate" && (
              <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
                background: "rgba(12,12,14,0.82)", backdropFilter: "blur(8px)",
                padding: "8px 20px", fontSize: 9, letterSpacing: 3,
                textTransform: "uppercase", color: "rgba(244,239,228,0.45)", pointerEvents: "none" }}>
                ← Drag to rotate →
              </div>
            )}

            {/* Gallery arrows */}
            {mode === "gallery" && (
              <>
                {[{ dir: "prev", label: "←", side: "left" }, { dir: "next", label: "→", side: "right" }].map(arrow => (
                  <button key={arrow.dir}
                    onClick={() => setGalleryIdx(i => arrow.dir === "prev"
                      ? (i - 1 + car.images.gallery.length) % car.images.gallery.length
                      : (i + 1) % car.images.gallery.length)}
                    style={{
                      position: "absolute", top: "50%", transform: "translateY(-50%)",
                      [arrow.side]: 10, width: 48, height: 48,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20, background: "rgba(12,12,14,0.82)", border: "none",
                      color: "#F4EFE4", backdropFilter: "blur(8px)",
                    }}>
                    {arrow.label}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Thumbnail strip — explicit height */}
          <div style={{ flexShrink: 0, height: 72, display: "flex", gap: 6, padding: "8px 10px",
            borderTop: "1px solid rgba(200,164,90,0.08)", background: "#0C0C0E" }}>
            {car.images.gallery.map((img, i) => (
              <button key={i} onClick={() => { setMode("gallery"); setGalleryIdx(i); }}
                style={{
                  flex: 1, height: "100%", overflow: "hidden", border: "none", padding: 0,
                  outline: mode === "gallery" && i === galleryIdx ? "2px solid #C8A45A" : "none",
                  opacity: mode === "gallery" && i === galleryIdx ? 1 : 0.42,
                  transition: "opacity 0.2s",
                }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </button>
            ))}
          </div>

          {/* Rotate dots */}
          {mode === "rotate" && (
            <div style={{ flexShrink: 0, height: 36, display: "flex", alignItems: "center",
              justifyContent: "center", gap: 6, borderTop: "1px solid rgba(200,164,90,0.08)", background: "#0C0C0E" }}>
              {car.images.rotate.map((_, i) => (
                <button key={i} onClick={() => setRotateIdx(i)}
                  style={{
                    height: 4, border: "none", borderRadius: 2,
                    width: i === rotateIdx ? 24 : 8,
                    background: i === rotateIdx ? "#C8A45A" : "rgba(255,255,255,0.18)",
                    transition: "all 0.3s",
                  }} />
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: info (45%) ── */}
        <div style={{ width: "45%", display: "flex", flexDirection: "column", background: "#0C0C0E", minHeight: 0 }}>

          {/* Header */}
          <div style={{ flexShrink: 0, padding: "24px 28px", borderBottom: "1px solid rgba(200,164,90,0.1)" }}>
            <div style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: "#C8A45A", marginBottom: 4 }}>{car.brand}</div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 28, fontWeight: 300, color: "#fff", marginBottom: 6 }}>{car.model}</div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 22, color: "#C8A45A", marginBottom: 12 }}>{car.priceLabel}</div>
            <p style={{ fontSize: 11, color: "rgba(244,239,228,0.42)", lineHeight: 1.7, margin: 0 }}>{car.description}</p>
          </div>

          {/* Specs list */}
          <div className="ks" style={{ flex: 1, padding: "12px 28px" }}>
            <div style={{ fontSize: 8, letterSpacing: 4, textTransform: "uppercase",
              color: "rgba(244,239,228,0.26)", marginBottom: 10 }}>Specifications</div>
            {specs.map((s, i) => (
              <div key={s.label} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
                background: i % 2 === 1 ? "rgba(255,255,255,0.018)" : "transparent",
              }}>
                <span style={{ fontSize: 11, color: "rgba(244,239,228,0.38)", letterSpacing: 0.3 }}>{s.label}</span>
                <span style={{
                  fontSize: s.gold ? 15 : 13, fontWeight: 500,
                  fontFamily: s.gold ? "Georgia,serif" : "inherit",
                  color: s.gold ? "#C8A45A" : "#F4EFE4",
                }}>{s.val}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ flexShrink: 0, padding: "16px 28px", borderTop: "1px solid rgba(200,164,90,0.1)" }}>
            <button onClick={() => dispatch({ type: "GO", screen: "share" })}
              style={{ width: "100%", background: "#C8A45A", color: "#060606", border: "none",
                padding: "15px 0", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700,
                marginBottom: 10 }}>
              📱  Save &amp; Send to Phone
            </button>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                {
                  active: inCompare, label: inCompare ? "✓ In Compare" : "+ Compare",
                  onClick: () => inCompare ? dispatch({ type: "REMOVE_COMPARE", id: car.id }) : dispatch({ type: "ADD_COMPARE", car }),
                },
                {
                  active: saved, label: saved ? "♥ Saved" : "♡ Save",
                  onClick: () => saved ? dispatch({ type: "UNSAVE_CAR", id: car.id }) : dispatch({ type: "SAVE_CAR", car }),
                },
              ].map(btn => (
                <button key={btn.label} onClick={btn.onClick}
                  style={{
                    flex: 1, padding: "12px 0", fontSize: 10, letterSpacing: 2,
                    textTransform: "uppercase", border: "none",
                    background: btn.active ? "rgba(200,164,90,0.12)" : "rgba(255,255,255,0.05)",
                    color: btn.active ? "#C8A45A" : "rgba(244,239,228,0.42)",
                    outline: btn.active ? "1px solid rgba(200,164,90,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    transition: "all 0.2s",
                  }}>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
}
