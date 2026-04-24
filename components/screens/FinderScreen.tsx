"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useKiosk } from "@/lib/store";
import { cars, Car } from "@/lib/data";
import ScreenLayout from "../kiosk/ScreenLayout";

type Step = "budget" | "purpose" | "fuel" | "results";

const BUDGET = [
  { label: "Under ₦30M",    max: 30,   icon: "💰", sub: "Entry & Mid-range" },
  { label: "₦30M – ₦100M", max: 100,  icon: "💎", sub: "Premium segment"   },
  { label: "₦100M – ₦300M",max: 300,  icon: "✨", sub: "Super premium"     },
  { label: "₦300M+",        max: 9999, icon: "👑", sub: "Ultra luxury"      },
];
const PURPOSE = [
  { value: "Uber",   label: "Ride-Hailing", icon: "🚖", desc: "Reliable, efficient, passenger-friendly" },
  { value: "Family", label: "Family Car",   icon: "👨‍👩‍👧", desc: "Spacious, safe, comfortable"           },
  { value: "Luxury", label: "Luxury",       icon: "🌟", desc: "Prestige, performance, exclusivity"     },
  { value: "Sport",  label: "Sport",        icon: "🏁", desc: "Performance, speed, handling"          },
];
const FUEL = [
  { value: "Petrol", label: "Petrol",         icon: "⛽", desc: "Widely available across Nigeria"     },
  { value: "Diesel", label: "Diesel",         icon: "🛢️", desc: "More torque, efficient long drives"  },
  { value: "Hybrid", label: "Hybrid",         icon: "⚡", desc: "Best of both — low running costs"   },
  { value: "Any",    label: "No Preference",  icon: "🔄", desc: "Show me all options"                },
];

const STEP_NUM: Record<Step, number> = { budget: 1, purpose: 2, fuel: 3, results: 4 };

const cardStyle = (hovered: boolean) => ({
  padding: "28px 24px",
  background: hovered ? "rgba(200,164,90,0.07)" : "rgba(20,20,22,0.85)",
  border: hovered ? "1px solid rgba(200,164,90,0.45)" : "1px solid rgba(200,164,90,0.14)",
  display: "flex", flexDirection: "column" as const, alignItems: "flex-start",
  textAlign: "left" as const, transition: "all 0.25s", cursor: "none",
});

function OptionCard({ icon, title, desc, onClick }: { icon: string; title: string; desc?: string; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={cardStyle(hov)}>
      <span style={{ fontSize: 36, marginBottom: 16 }}>{icon}</span>
      <div style={{ fontFamily: "Georgia,serif", fontSize: 22, color: hov ? "#C8A45A" : "#F4EFE4", transition: "color 0.2s", marginBottom: 6 }}>{title}</div>
      {desc && <div style={{ fontSize: 11, color: "rgba(244,239,228,0.38)", lineHeight: 1.55 }}>{desc}</div>}
    </button>
  );
}

export default function FinderScreen() {
  const { dispatch } = useKiosk();
  const [step,    setStep]    = useState<Step>("budget");
  const [budget,  setBudget]  = useState<number | null>(null);
  const [purpose, setPurpose] = useState<string | null>(null);
  const [results, setResults] = useState<Car[]>([]);

  function run(fuelVal: string) {
    let list = [...cars];
    if (budget !== null)            list = list.filter(c => c.price <= budget);
    if (purpose && purpose !== "Any") list = list.filter(c => c.purpose.includes(purpose as any));
    if (fuelVal && fuelVal !== "Any") list = list.filter(c => c.fuel === fuelVal);
    list.sort((a, b) => b.popularity - a.popularity);
    setResults(list.slice(0, 5));
    setStep("results");
  }

  function reset() { setBudget(null); setPurpose(null); setResults([]); setStep("budget"); }

  const slide = { enter: { x: 50, opacity: 0 }, center: { x: 0, opacity: 1 }, exit: { x: -40, opacity: 0 } };

  return (
    <ScreenLayout title="Find My Car" showBack>

      {/* Progress bar */}
      {step !== "results" && (
        <div style={{ flexShrink: 0, padding: "14px 40px 10px" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            {[1,2,3].map(n => (
              <div key={n} style={{ flex: 1, height: 3, borderRadius: 2, transition: "background 0.4s",
                background: n <= STEP_NUM[step] ? "#C8A45A" : "rgba(200,164,90,0.14)" }} />
            ))}
          </div>
          <span style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "rgba(244,239,228,0.3)" }}>
            Step {STEP_NUM[step]} of 3
          </span>
        </div>
      )}

      {/* Step panels */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <AnimatePresence mode="wait">

          {step === "budget" && (
            <motion.div key="budget" variants={slide} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.28 }}
              style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 40px" }}>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 34, color: "#fff", marginBottom: 6 }}>What's your budget?</div>
              <div style={{ fontSize: 12, color: "rgba(244,239,228,0.38)", marginBottom: 24 }}>Select the price range that works for you</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, flex: 1 }}>
                {BUDGET.map(opt => (
                  <OptionCard key={opt.label} icon={opt.icon} title={opt.label} desc={opt.sub}
                    onClick={() => { setBudget(opt.max); setStep("purpose"); }} />
                ))}
              </div>
            </motion.div>
          )}

          {step === "purpose" && (
            <motion.div key="purpose" variants={slide} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.28 }}
              style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 40px" }}>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 34, color: "#fff", marginBottom: 6 }}>What's it for?</div>
              <div style={{ fontSize: 12, color: "rgba(244,239,228,0.38)", marginBottom: 24 }}>Help us narrow down the perfect match</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, flex: 1 }}>
                {PURPOSE.map(opt => (
                  <OptionCard key={opt.value} icon={opt.icon} title={opt.label} desc={opt.desc}
                    onClick={() => { setPurpose(opt.value); setStep("fuel"); }} />
                ))}
              </div>
            </motion.div>
          )}

          {step === "fuel" && (
            <motion.div key="fuel" variants={slide} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.28 }}
              style={{ height: "100%", display: "flex", flexDirection: "column", padding: "20px 40px" }}>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 34, color: "#fff", marginBottom: 6 }}>Fuel preference?</div>
              <div style={{ fontSize: 12, color: "rgba(244,239,228,0.38)", marginBottom: 24 }}>Choose what works best for your lifestyle</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, flex: 1 }}>
                {FUEL.map(opt => (
                  <OptionCard key={opt.value} icon={opt.icon} title={opt.label} desc={opt.desc}
                    onClick={() => run(opt.value)} />
                ))}
              </div>
            </motion.div>
          )}

          {step === "results" && (
            <motion.div key="results" variants={slide} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.28 }}
              style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              {/* Results header */}
              <div style={{ flexShrink: 0, padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(200,164,90,0.08)" }}>
                <div>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 28, color: "#fff" }}>Your Matches</div>
                  <div style={{ fontSize: 12, color: "rgba(244,239,228,0.38)", marginTop: 2 }}>
                    {results.length} car{results.length !== 1 ? "s" : ""} found for you
                  </div>
                </div>
                <button onClick={reset}
                  style={{ border: "1px solid rgba(200,164,90,0.28)", color: "rgba(244,239,228,0.45)",
                    background: "none", padding: "10px 24px", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>
                  Start Over
                </button>
              </div>

              {results.length === 0 ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>😔</div>
                  <div style={{ fontFamily: "Georgia,serif", fontSize: 24, color: "rgba(244,239,228,0.4)" }}>No matches found</div>
                  <button onClick={reset}
                    style={{ marginTop: 24, background: "#C8A45A", color: "#060606", border: "none",
                      padding: "12px 32px", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="ks" style={{ flex: 1, padding: "16px 40px 60px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {results.map((car, i) => (
                      <motion.div key={car.id}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        onClick={() => dispatch({ type: "GO", screen: "detail", car })}
                        style={{
                          display: "flex", alignItems: "center", gap: 16,
                          padding: "14px 16px",
                          background: i === 0 ? "rgba(200,164,90,0.07)" : "rgba(20,20,22,0.85)",
                          border: i === 0 ? "1px solid rgba(200,164,90,0.35)" : "1px solid rgba(200,164,90,0.1)",
                          borderLeft: i === 0 ? "3px solid #C8A45A" : "1px solid rgba(200,164,90,0.1)",
                          transition: "all 0.2s",
                        }}>
                        {/* Thumbnail */}
                        <div style={{ width: 120, height: 72, flexShrink: 0, overflow: "hidden" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={car.images.hero} alt={car.model}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: "#C8A45A" }}>{car.brand}</div>
                          <div style={{ fontFamily: "Georgia,serif", fontSize: 20, color: "#fff" }}>{car.model}</div>
                          <div style={{ fontSize: 10, color: "rgba(244,239,228,0.38)", marginTop: 2 }}>
                            {car.fuel} · {car.transmission} · {car.horsepower} hp
                          </div>
                        </div>
                        {/* Price + action */}
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          {i === 0 && <div style={{ fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: "#C8A45A", marginBottom: 2 }}>Best Match</div>}
                          <div style={{ fontFamily: "Georgia,serif", fontSize: 20, color: "#C8A45A" }}>{car.priceLabel}</div>
                          <div style={{ fontSize: 10, color: "rgba(244,239,228,0.28)", marginTop: 3 }}>View Details →</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScreenLayout>
  );
}
