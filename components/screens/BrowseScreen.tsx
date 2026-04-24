"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useKiosk } from "@/lib/store";
import { cars, Car, brands as ALL_BRANDS } from "@/lib/data";
import ScreenLayout from "../kiosk/ScreenLayout";

const BADGE: Record<string, { bg: string; color: string }> = {
  "New Arrival": { bg: "rgba(59,130,246,0.18)", color: "#60a5fa" },
  "Best Seller": { bg: "rgba(200,164,90,0.2)",  color: "#C8A45A" },
  "Hot Deal":    { bg: "rgba(239,68,68,0.18)",  color: "#f87171" },
  "Rare Find":   { bg: "rgba(168,85,247,0.18)", color: "#c084fc" },
};

type Pill = { label: string; value: string };

function Pills({ options, value, onChange }: { options: Pill[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          style={{
            padding: "7px 16px", fontSize: 9, letterSpacing: 2,
            textTransform: "uppercase" as const,
            background: value === o.value ? "#C8A45A" : "transparent",
            color: value === o.value ? "#060606" : "rgba(244,239,228,0.42)",
            fontWeight: value === o.value ? 700 : 400,
            border: value === o.value ? "1px solid #C8A45A" : "1px solid rgba(200,164,90,0.2)",
            transition: "all 0.2s",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function BrowseScreen() {
  const { dispatch, state } = useKiosk();
  const [maxPrice, setMaxPrice] = useState(700);
  const [brand,    setBrand]    = useState("All");
  const [fuel,     setFuel]     = useState("All");
  const [sort,     setSort]     = useState<"popularity" | "price">("popularity");

  const filtered = useMemo(() => {
    let list = [...cars];
    if (brand !== "All") list = list.filter(c => c.brand === brand);
    if (fuel  !== "All") list = list.filter(c => c.fuel  === fuel);
    list = list.filter(c => c.price <= maxPrice);
    list.sort((a, b) => sort === "price" ? a.price - b.price : b.popularity - a.popularity);
    return list;
  }, [brand, fuel, maxPrice, sort]);

  const inCompare = (car: Car) => state.compareList.some(c => c.id === car.id);

  const brandPills: Pill[] = [{ label: "All", value: "All" }, ...ALL_BRANDS.map(b => ({ label: b, value: b }))];
  const fuelPills:  Pill[] = ["All","Petrol","Diesel","Hybrid","Electric"].map(f => ({ label: f, value: f }));
  const sortPills:  Pill[] = [{ label: "Popularity", value: "popularity" }, { label: "Price ↑", value: "price" }];

  return (
    <ScreenLayout title="Browse Cars" showBack>

      {/* ── FILTERS ── */}
      <div style={{ flexShrink: 0, background: "#0C0C0E", borderBottom: "1px solid rgba(200,164,90,0.08)", padding: "14px 40px 10px" }}>
        {/* Row 1: brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <span style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "rgba(244,239,228,0.28)", width: 36, flexShrink: 0 }}>Brand</span>
          <div className="ks-x" style={{ display: "flex", gap: 6 }}>
            <Pills options={brandPills} value={brand} onChange={setBrand} />
          </div>
        </div>
        {/* Row 2: fuel + sort */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <span style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "rgba(244,239,228,0.28)", width: 36, flexShrink: 0 }}>Fuel</span>
          <Pills options={fuelPills} value={fuel} onChange={setFuel} />
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "rgba(244,239,228,0.28)" }}>Sort</span>
            <Pills options={sortPills} value={sort} onChange={v => setSort(v as any)} />
          </div>
        </div>
        {/* Row 3: price slider */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "rgba(244,239,228,0.28)", width: 36, flexShrink: 0 }}>Max</span>
          <input type="range" min={18} max={700} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} style={{ flex: 1 }} />
          <span style={{ fontSize: 13, color: "#C8A45A", fontWeight: 500, width: 80, textAlign: "right", flexShrink: 0 }}>
            ₦{maxPrice}M
          </span>
        </div>
      </div>

      {/* Count */}
      <div style={{ flexShrink: 0, padding: "8px 40px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "rgba(244,239,228,0.24)" }}>
          {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* ── GRID ── */}
      <div className="ks" style={{ flex: 1, padding: "16px 40px 80px" }}>
        {filtered.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 240, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <p style={{ fontFamily: "Georgia,serif", fontSize: 22, color: "rgba(244,239,228,0.35)" }}>No cars match your filters</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {filtered.map((car, i) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.38 }}
                onClick={() => dispatch({ type: "GO", screen: "detail", car })}
                style={{
                  position: "relative", overflow: "hidden",
                  background: "rgba(20,20,22,0.9)",
                  border: "1px solid rgba(200,164,90,0.11)",
                  transition: "transform 0.2s, border-color 0.2s",
                }}
                whileTap={{ scale: 0.97 }}
                whileHover={{ borderColor: "rgba(200,164,90,0.32)" }}
              >
                {/* Image */}
                <div style={{ position: "relative", height: 176, overflow: "hidden", background: "#141416" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={car.images.hero} alt={car.model}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.7s" }} />
                  <div style={{ position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(20,20,22,0.85) 0%, transparent 55%)" }} />
                  {/* Badge */}
                  {car.badge && (
                    <div style={{
                      position: "absolute", top: 10, left: 10,
                      fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase",
                      padding: "4px 10px", fontWeight: 600,
                      background: BADGE[car.badge]?.bg ?? "transparent",
                      color: BADGE[car.badge]?.color ?? "#fff",
                      border: `1px solid ${BADGE[car.badge]?.color ?? "#fff"}33`,
                    }}>
                      {car.badge}
                    </div>
                  )}
                  {/* Compare toggle */}
                  <button
                    onClick={e => { e.stopPropagation(); inCompare(car) ? dispatch({ type: "REMOVE_COMPARE", id: car.id }) : dispatch({ type: "ADD_COMPARE", car }); }}
                    style={{
                      position: "absolute", top: 10, right: 10,
                      width: 32, height: 32, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 700, border: "none",
                      background: inCompare(car) ? "#C8A45A" : "rgba(0,0,0,0.65)",
                      color: inCompare(car) ? "#060606" : "rgba(255,255,255,0.5)",
                      transition: "all 0.2s",
                    }}
                  >
                    {inCompare(car) ? "✓" : "+"}
                  </button>
                </div>

                {/* Info */}
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "#C8A45A", marginBottom: 4 }}>{car.brand}</div>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 18, fontWeight: 500, color: "#F4EFE4", lineHeight: 1.2 }}>{car.model}</div>
                  <div style={{ fontSize: 10, color: "rgba(244,239,228,0.35)", marginTop: 4, letterSpacing: 0.5 }}>
                    {car.year} · {car.fuel} · {car.transmission}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                    <div style={{ fontFamily: "Georgia,serif", fontSize: 20, color: "#C8A45A", fontWeight: 300 }}>₦{car.price}M</div>
                    <div style={{ fontSize: 9, color: "rgba(244,239,228,0.3)", letterSpacing: 1 }}>{car.horsepower} hp</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Compare CTA */}
      <AnimatePresence>
        {state.compareList.length >= 2 && (
          <motion.div
            initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
            style={{
              flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 40px", background: "#0C0C0E",
              borderTop: "1px solid rgba(200,164,90,0.14)",
            }}
          >
            <span style={{ fontSize: 13, color: "rgba(244,239,228,0.45)" }}>
              {state.compareList.length} cars selected for comparison
            </span>
            <button
              onClick={() => dispatch({ type: "GO", screen: "compare" })}
              style={{ background: "#C8A45A", color: "#060606", border: "none",
                padding: "12px 36px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 700 }}
            >
              Compare Now →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenLayout>
  );
}
