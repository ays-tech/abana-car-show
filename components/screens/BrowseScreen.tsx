"use client";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import Image from "next/image";
import { useKiosk } from "@/lib/store";
import { cars, Car, FuelType, brands as BRANDS } from "@/lib/data";
import ScreenLayout from "../kiosk/ScreenLayout";

const BADGE_CLASS: Record<string, string> = {
  "New Arrival": "badge-new",
  "Best Seller": "badge-seller",
  "Hot Deal": "badge-hot",
  "Rare Find": "badge-rare",
};

export default function BrowseScreen() {
  const { dispatch, state } = useKiosk();
  const [maxPrice, setMaxPrice] = useState(700);
  const [brand, setBrand] = useState<string>("All");
  const [fuel, setFuel] = useState<string>("All");
  const [sort, setSort] = useState<"price" | "popularity">("popularity");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...cars];
    if (brand !== "All") list = list.filter((c) => c.brand === brand);
    if (fuel !== "All") list = list.filter((c) => c.fuel === fuel);
    list = list.filter((c) => c.price <= maxPrice);
    list.sort((a, b) =>
      sort === "price" ? a.price - b.price : b.popularity - a.popularity
    );
    return list;
  }, [maxPrice, brand, fuel, sort]);

  const inCompare = (car: Car) => state.compareList.some((c) => c.id === car.id);

  return (
    <ScreenLayout title="Browse Cars" showBack>
      {/* Filter bar */}
      <div className="flex-shrink-0 border-b border-[rgba(200,164,90,0.1)]">
        <div className="flex items-center gap-3 px-8 py-4 overflow-x-auto kiosk-scroll">
          {/* Brand pills */}
          {["All", ...BRANDS].map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`flex-shrink-0 px-5 py-2.5 text-xs tracking-widest uppercase transition-all rounded-none ${
                brand === b
                  ? "bg-[#C8A45A] text-[#060606] font-semibold"
                  : "border border-[rgba(200,164,90,0.2)] text-[rgba(244,239,228,0.5)] hover:border-[#C8A45A]/50"
              }`}
            >
              {b}
            </button>
          ))}

          <div className="w-px h-8 bg-[rgba(200,164,90,0.15)] flex-shrink-0 mx-2" />

          {/* Fuel */}
          {["All", "Petrol", "Diesel", "Hybrid", "Electric"].map((f) => (
            <button
              key={f}
              onClick={() => setFuel(f)}
              className={`flex-shrink-0 px-5 py-2.5 text-xs tracking-widest uppercase transition-all rounded-none ${
                fuel === f
                  ? "bg-[#C8A45A] text-[#060606] font-semibold"
                  : "border border-[rgba(200,164,90,0.2)] text-[rgba(244,239,228,0.5)] hover:border-[#C8A45A]/50"
              }`}
            >
              {f}
            </button>
          ))}

          <div className="w-px h-8 bg-[rgba(200,164,90,0.15)] flex-shrink-0 mx-2" />

          {/* Sort */}
          <button
            onClick={() => setSort("popularity")}
            className={`flex-shrink-0 px-5 py-2.5 text-xs tracking-widest uppercase transition-all rounded-none ${
              sort === "popularity"
                ? "bg-[#C8A45A] text-[#060606] font-semibold"
                : "border border-[rgba(200,164,90,0.2)] text-[rgba(244,239,228,0.5)]"
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => setSort("price")}
            className={`flex-shrink-0 px-5 py-2.5 text-xs tracking-widest uppercase transition-all rounded-none ${
              sort === "price"
                ? "bg-[#C8A45A] text-[#060606] font-semibold"
                : "border border-[rgba(200,164,90,0.2)] text-[rgba(244,239,228,0.5)]"
            }`}
          >
            Price ↑
          </button>
        </div>

        {/* Price slider */}
        <div className="px-8 pb-4 flex items-center gap-6">
          <span className="text-[10px] tracking-[3px] text-[rgba(244,239,228,0.4)] uppercase flex-shrink-0">
            Max Price
          </span>
          <input
            type="range"
            min={18}
            max={700}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-[#C8A45A] text-sm font-medium flex-shrink-0 w-24 text-right">
            ₦{maxPrice}M
          </span>
        </div>
      </div>

      {/* Results count */}
      <div className="flex-shrink-0 px-8 py-3 text-xs text-[rgba(244,239,228,0.3)] tracking-wider">
        {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} found
      </div>

      {/* Grid */}
      <div className="flex-1 kiosk-scroll px-8 pb-10">
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((car, i) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              onClick={() => dispatch({ type: "GO", screen: "detail", car })}
              className="glass group relative overflow-hidden active:scale-[0.98] transition-transform"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={car.images.hero}
                  alt={car.model}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-transparent" />
                {car.badge && (
                  <div className={`absolute top-3 left-3 text-[9px] tracking-[2px] uppercase px-2.5 py-1 font-semibold ${BADGE_CLASS[car.badge] ?? ""}`}>
                    {car.badge}
                  </div>
                )}
                {/* Compare toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    inCompare(car)
                      ? dispatch({ type: "REMOVE_COMPARE", id: car.id })
                      : dispatch({ type: "ADD_COMPARE", car });
                  }}
                  className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-sm transition-all ${
                    inCompare(car)
                      ? "bg-[#C8A45A] text-[#060606]"
                      : "bg-black/60 text-white/50 hover:text-white"
                  }`}
                >
                  {inCompare(car) ? "✓" : "+"}
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="text-[9px] tracking-[3px] text-[#C8A45A] uppercase mb-1">{car.brand}</div>
                <div className="font-serif text-lg font-medium text-[#F4EFE4] leading-tight">{car.model}</div>
                <div className="text-[10px] text-[rgba(244,239,228,0.4)] mt-1 tracking-wide">
                  {car.year} · {car.fuel} · {car.transmission}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="font-serif text-xl text-[#C8A45A] font-light">
                    ₦{car.price}M
                  </div>
                  <div className="text-[10px] text-[rgba(244,239,228,0.35)] tracking-wider">
                    {car.horsepower} hp
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <div className="font-serif text-2xl text-[rgba(244,239,228,0.4)]">No cars match</div>
            <div className="text-sm text-[rgba(244,239,228,0.25)] mt-2">Adjust your filters</div>
          </div>
        )}
      </div>

      {/* Compare CTA */}
      {state.compareList.length >= 2 && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          className="flex-shrink-0 p-4 border-t border-[rgba(200,164,90,0.15)] flex items-center justify-between bg-[#141416]"
        >
          <div className="text-sm text-[rgba(244,239,228,0.6)]">
            {state.compareList.length} cars selected for comparison
          </div>
          <button
            onClick={() => dispatch({ type: "GO", screen: "compare" })}
            className="bg-[#C8A45A] text-[#060606] px-8 py-3 text-xs tracking-widest uppercase font-semibold active:scale-95 transition-transform"
          >
            Compare Now →
          </button>
        </motion.div>
      )}
    </ScreenLayout>
  );
}
