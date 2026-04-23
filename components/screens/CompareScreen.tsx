"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useKiosk } from "@/lib/store";
import { cars } from "@/lib/data";
import ScreenLayout from "../kiosk/ScreenLayout";

const SPEC_ROWS = [
  { key: "price", label: "Price", getValue: (c: any) => c.priceLabel },
  { key: "engine", label: "Engine", getValue: (c: any) => c.engine },
  { key: "horsepower", label: "Horsepower", getValue: (c: any) => `${c.horsepower} hp`, compareNum: (c: any) => c.horsepower, higher: true },
  { key: "fuel", label: "Fuel Type", getValue: (c: any) => c.fuel },
  { key: "consumption", label: "Consumption", getValue: (c: any) => c.consumption, compareNum: (c: any) => parseFloat(c.consumption), higher: false },
  { key: "transmission", label: "Transmission", getValue: (c: any) => c.transmission },
  { key: "seats", label: "Seats", getValue: (c: any) => `${c.seats} seats` },
  { key: "acceleration", label: "0–100 km/h", getValue: (c: any) => c.specs.acceleration },
  { key: "topSpeed", label: "Top Speed", getValue: (c: any) => c.specs.topSpeed },
  { key: "bootSpace", label: "Boot Space", getValue: (c: any) => c.specs.bootSpace },
  { key: "warranty", label: "Warranty", getValue: (c: any) => c.specs.warranty },
];

export default function CompareScreen() {
  const { state, dispatch } = useKiosk();
  const list = state.compareList;

  const addMore = () => dispatch({ type: "GO", screen: "browse" });

  if (list.length === 0) {
    return (
      <ScreenLayout title="Compare Cars" showBack>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-10">
          <div className="text-6xl mb-6">⚖️</div>
          <div className="font-serif text-3xl text-[rgba(244,239,228,0.5)] mb-3">No cars selected</div>
          <div className="text-sm text-[rgba(244,239,228,0.3)] mb-8">
            Browse cars and tap the + button to add them for comparison
          </div>
          <button
            onClick={addMore}
            className="bg-[#C8A45A] text-[#060606] px-10 py-4 text-xs tracking-[3px] uppercase font-semibold"
          >
            Browse Cars
          </button>
        </div>
      </ScreenLayout>
    );
  }

  // Find best values for numeric specs
  const getBest = (row: typeof SPEC_ROWS[0]) => {
    if (!row.compareNum) return null;
    const vals = list.map((c) => row.compareNum!(c));
    return row.higher ? Math.max(...vals) : Math.min(...vals);
  };

  return (
    <ScreenLayout title="Compare Cars" showBack>
      <div className="flex-1 kiosk-scroll">
        {/* Header row */}
        <div
          className="grid sticky top-0 z-20 bg-[#0C0C0E] border-b border-[rgba(200,164,90,0.1)]"
          style={{ gridTemplateColumns: `180px repeat(${Math.max(list.length, 1)}, 1fr)` }}
        >
          {/* Empty label cell */}
          <div className="p-4 flex items-end">
            {list.length < 3 && (
              <button
                onClick={addMore}
                className="text-[10px] tracking-[2px] text-[#C8A45A] uppercase border border-[rgba(200,164,90,0.3)] px-3 py-2 w-full text-center"
              >
                + Add Car
              </button>
            )}
          </div>

          {list.map((car) => (
            <div key={car.id} className="p-4 border-l border-[rgba(200,164,90,0.08)]">
              <div className="relative w-full h-28 overflow-hidden mb-3">
                <Image src={car.images.hero} alt={car.model} fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] to-transparent" />
              </div>
              <div className="text-[9px] tracking-[3px] text-[#C8A45A] uppercase">{car.brand}</div>
              <div className="font-serif text-lg text-white leading-tight">{car.model}</div>
              <button
                onClick={() => dispatch({ type: "REMOVE_COMPARE", id: car.id })}
                className="mt-2 text-[9px] tracking-[2px] text-[rgba(244,239,228,0.3)] uppercase hover:text-red-400 transition-colors"
              >
                ✕ Remove
              </button>
            </div>
          ))}
        </div>

        {/* Spec rows */}
        {SPEC_ROWS.map((row, i) => {
          const best = getBest(row);
          return (
            <div
              key={row.key}
              className={`grid border-b border-[rgba(255,255,255,0.04)] ${i % 2 === 0 ? "" : "bg-[rgba(255,255,255,0.02)]"}`}
              style={{ gridTemplateColumns: `180px repeat(${Math.max(list.length, 1)}, 1fr)` }}
            >
              <div className="p-4 flex items-center">
                <span className="text-xs text-[rgba(244,239,228,0.35)] tracking-wide">{row.label}</span>
              </div>
              {list.map((car) => {
                const val = row.getValue(car);
                const numVal = row.compareNum ? row.compareNum(car) : null;
                const isBest = best !== null && numVal !== null && numVal === best;
                return (
                  <div
                    key={car.id}
                    className={`p-4 border-l border-[rgba(200,164,90,0.06)] flex items-center ${
                      isBest ? "bg-[rgba(200,164,90,0.06)]" : ""
                    }`}
                  >
                    <span className={`text-sm font-medium ${isBest ? "text-[#C8A45A]" : "text-[#F4EFE4]"}`}>
                      {val}
                      {isBest && (
                        <span className="ml-2 text-[9px] tracking-[2px] text-[#C8A45A] uppercase">
                          {row.higher ? "↑ Best" : "↓ Best"}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Price highlight row */}
        <div className="p-6 border-t border-[rgba(200,164,90,0.15)]">
          <div className="text-[10px] tracking-[4px] text-[rgba(244,239,228,0.3)] uppercase mb-4">
            Quick Actions
          </div>
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `180px repeat(${Math.max(list.length, 1)}, 1fr)` }}
          >
            <div />
            {list.map((car) => (
              <button
                key={car.id}
                onClick={() => dispatch({ type: "GO", screen: "detail", car })}
                className="bg-[#C8A45A] text-[#060606] py-3 text-xs tracking-[2px] uppercase font-semibold active:scale-95 transition-transform"
              >
                View Details
              </button>
            ))}
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
}
