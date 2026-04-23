"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useKiosk } from "@/lib/store";
import ScreenLayout from "../kiosk/ScreenLayout";

export default function DetailScreen() {
  const { state, dispatch } = useKiosk();
  const car = state.selectedCar!;
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [rotateIdx, setRotateIdx] = useState(0);
  const [mode, setMode] = useState<"gallery" | "rotate">("gallery");
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(0);
  const saved = state.savedCars.some((c) => c.id === car.id);
  const inCompare = state.compareList.some((c) => c.id === car.id);

  const handleDragStart = useCallback((clientX: number) => {
    dragStart.current = clientX;
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback((clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - dragStart.current;
    if (Math.abs(diff) > 30) {
      const dir = diff > 0 ? -1 : 1;
      setRotateIdx((prev) => (prev + dir + car.images.rotate.length) % car.images.rotate.length);
    }
    setIsDragging(false);
  }, [isDragging, car.images.rotate.length]);

  if (!car) return null;

  const specs = [
    { label: "Price", value: car.priceLabel, highlight: true },
    { label: "Engine", value: car.engine },
    { label: "Power", value: `${car.horsepower} hp` },
    { label: "Fuel", value: car.fuel },
    { label: "Consumption", value: car.consumption },
    { label: "Transmission", value: car.transmission },
    { label: "Seats", value: `${car.seats} seats` },
    { label: "0–100 km/h", value: car.specs.acceleration },
    { label: "Top Speed", value: car.specs.topSpeed },
    { label: "Boot Space", value: car.specs.bootSpace },
    { label: "Warranty", value: car.specs.warranty },
  ];

  return (
    <ScreenLayout title={`${car.brand} ${car.model}`} showBack>
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT — Image viewer */}
        <div className="w-[55%] flex flex-col border-r border-[rgba(200,164,90,0.1)]">
          {/* Mode toggle */}
          <div className="flex border-b border-[rgba(200,164,90,0.1)]">
            {(["gallery", "rotate"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-3 text-xs tracking-[3px] uppercase transition-all ${
                  mode === m
                    ? "bg-[rgba(200,164,90,0.1)] text-[#C8A45A] border-b-2 border-[#C8A45A]"
                    : "text-[rgba(244,239,228,0.35)]"
                }`}
              >
                {m === "gallery" ? "📷 Gallery" : "🔄 360° View"}
              </button>
            ))}
          </div>

          {/* Main image */}
          <div
            className="relative flex-1 overflow-hidden"
            onMouseDown={(e) => { if (mode === "rotate") handleDragStart(e.clientX); }}
            onMouseUp={(e) => { if (mode === "rotate") handleDragEnd(e.clientX); }}
            onTouchStart={(e) => { if (mode === "rotate") handleDragStart(e.touches[0].clientX); }}
            onTouchEnd={(e) => { if (mode === "rotate") handleDragEnd(e.changedTouches[0].clientX); }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mode === "gallery" ? galleryIdx : rotateIdx}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Image
                  src={mode === "gallery" ? car.images.gallery[galleryIdx] : car.images.rotate[rotateIdx]}
                  alt={car.model}
                  fill
                  className="object-cover"
                  unoptimized
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* 360 drag hint */}
            {mode === "rotate" && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="glass px-4 py-2 text-[10px] tracking-[3px] text-[rgba(244,239,228,0.5)] uppercase">
                  ← Drag to rotate →
                </div>
              </div>
            )}

            {/* Gallery nav arrows */}
            {mode === "gallery" && (
              <>
                <button
                  onClick={() => setGalleryIdx((i) => (i - 1 + car.images.gallery.length) % car.images.gallery.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 glass w-12 h-12 flex items-center justify-center text-xl active:scale-90 transition-transform"
                >
                  ←
                </button>
                <button
                  onClick={() => setGalleryIdx((i) => (i + 1) % car.images.gallery.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 glass w-12 h-12 flex items-center justify-center text-xl active:scale-90 transition-transform"
                >
                  →
                </button>
              </>
            )}
          </div>

          {/* Thumbnails (gallery mode) */}
          {mode === "gallery" && (
            <div className="flex gap-2 p-3 border-t border-[rgba(200,164,90,0.08)]">
              {car.images.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIdx(i)}
                  className={`relative flex-1 h-16 overflow-hidden transition-all ${
                    i === galleryIdx ? "ring-2 ring-[#C8A45A]" : "opacity-50"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}

          {/* 360 rotation dots */}
          {mode === "rotate" && (
            <div className="flex gap-1 p-3 border-t border-[rgba(200,164,90,0.08)] justify-center">
              {car.images.rotate.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setRotateIdx(i)}
                  className={`h-1 transition-all rounded-full ${
                    i === rotateIdx ? "w-6 bg-[#C8A45A]" : "w-2 bg-white/20"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Info */}
        <div className="w-[45%] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[rgba(200,164,90,0.1)]">
            <div className="text-[10px] tracking-[4px] text-[#C8A45A] uppercase mb-1">{car.brand}</div>
            <div className="font-serif text-3xl font-light text-white">{car.model}</div>
            <div className="font-serif text-2xl text-[#C8A45A] mt-1">{car.priceLabel}</div>
            <p className="text-xs text-[rgba(244,239,228,0.45)] mt-3 leading-relaxed">{car.description}</p>
          </div>

          {/* Specs */}
          <div className="flex-1 kiosk-scroll p-4">
            <div className="text-[9px] tracking-[4px] text-[rgba(244,239,228,0.3)] uppercase mb-3">
              Specifications
            </div>
            <div className="space-y-0">
              {specs.map((spec, i) => (
                <div
                  key={spec.label}
                  className={`flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.05)] ${
                    i % 2 === 0 ? "bg-transparent" : "bg-[rgba(255,255,255,0.02)]"
                  }`}
                >
                  <span className="text-xs text-[rgba(244,239,228,0.4)] tracking-wide">{spec.label}</span>
                  <span className={`text-sm font-medium ${spec.highlight ? "text-[#C8A45A] font-serif text-base" : "text-[#F4EFE4]"}`}>
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-[rgba(200,164,90,0.1)] space-y-2">
            <button
              onClick={() => dispatch({ type: "GO", screen: "share" })}
              className="w-full bg-[#C8A45A] text-[#060606] py-4 text-xs tracking-[3px] uppercase font-semibold active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              📱 Save & Send to Phone
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  inCompare
                    ? dispatch({ type: "REMOVE_COMPARE", id: car.id })
                    : dispatch({ type: "ADD_COMPARE", car });
                }}
                className={`flex-1 py-3 text-xs tracking-[2px] uppercase border transition-all active:scale-95 ${
                  inCompare
                    ? "border-[#C8A45A] text-[#C8A45A] bg-[rgba(200,164,90,0.1)]"
                    : "border-[rgba(200,164,90,0.3)] text-[rgba(244,239,228,0.5)]"
                }`}
              >
                {inCompare ? "✓ In Compare" : "+ Compare"}
              </button>
              <button
                onClick={() => {
                  saved
                    ? dispatch({ type: "UNSAVE_CAR", id: car.id })
                    : dispatch({ type: "SAVE_CAR", car });
                }}
                className={`flex-1 py-3 text-xs tracking-[2px] uppercase border transition-all active:scale-95 ${
                  saved
                    ? "border-[#C8A45A] text-[#C8A45A] bg-[rgba(200,164,90,0.1)]"
                    : "border-[rgba(200,164,90,0.3)] text-[rgba(244,239,228,0.5)]"
                }`}
              >
                {saved ? "♥ Saved" : "♡ Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
}
