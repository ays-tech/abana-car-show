"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { useKiosk } from "@/lib/store";
import { cars, Car } from "@/lib/data";
import ScreenLayout from "../kiosk/ScreenLayout";

type Step = "budget" | "purpose" | "fuel" | "results";

const BUDGET_OPTIONS = [
  { label: "Under ₦30M", max: 30, icon: "💰" },
  { label: "₦30M – ₦100M", max: 100, icon: "💎" },
  { label: "₦100M – ₦300M", max: 300, icon: "✨" },
  { label: "₦300M+", max: 9999, icon: "👑" },
];

const PURPOSE_OPTIONS = [
  { value: "Uber", label: "Ride-Hailing", icon: "🚖", desc: "Reliable, fuel-efficient, passenger-friendly" },
  { value: "Family", label: "Family Car", icon: "👨‍👩‍👧", desc: "Spacious, safe, and comfortable" },
  { value: "Luxury", label: "Luxury", icon: "🌟", desc: "Prestige, performance, exclusivity" },
  { value: "Sport", label: "Sport", icon: "🏁", desc: "Performance, speed, handling" },
];

const FUEL_OPTIONS = [
  { value: "Petrol", label: "Petrol", icon: "⛽", desc: "Widely available across Nigeria" },
  { value: "Diesel", label: "Diesel", icon: "🛢️", desc: "More torque, fuel efficient for long drives" },
  { value: "Hybrid", label: "Hybrid", icon: "⚡", desc: "Best of both — low running costs" },
  { value: "Any", label: "No Preference", icon: "🔄", desc: "Show me everything" },
];

export default function FinderScreen() {
  const { dispatch } = useKiosk();
  const [step, setStep] = useState<Step>("budget");
  const [budget, setBudget] = useState<{ max: number } | null>(null);
  const [purpose, setPurpose] = useState<string | null>(null);
  const [fuel, setFuel] = useState<string | null>(null);
  const [results, setResults] = useState<Car[]>([]);

  const stepNum = { budget: 1, purpose: 2, fuel: 3, results: 4 };
  const totalSteps = 3;

  function runFinder() {
    let found = [...cars];
    if (budget) found = found.filter((c) => c.price <= budget.max);
    if (purpose && purpose !== "Any")
      found = found.filter((c) => c.purpose.includes(purpose as any));
    if (fuel && fuel !== "Any")
      found = found.filter((c) => c.fuel === fuel);
    found.sort((a, b) => b.popularity - a.popularity);
    setResults(found.slice(0, 5));
    setStep("results");
  }

  const slideVariants = {
    enter: { x: 60, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -60, opacity: 0 },
  };

  return (
    <ScreenLayout title="Find My Car" showBack>
      {/* Progress */}
      {step !== "results" && (
        <div className="flex-shrink-0 px-10 pt-4 pb-2">
          <div className="flex gap-2 mb-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                  n <= stepNum[step] ? "bg-[#C8A45A]" : "bg-[rgba(200,164,90,0.15)]"
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-[rgba(244,239,228,0.35)] tracking-[3px] uppercase">
            Step {stepNum[step]} of {totalSteps}
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === "budget" && (
            <motion.div
              key="budget"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col px-10 pt-6"
            >
              <div className="font-serif text-4xl text-white mb-2">What's your budget?</div>
              <div className="text-sm text-[rgba(244,239,228,0.4)] mb-8 tracking-wide">
                Select the price range that works for you
              </div>
              <div className="grid grid-cols-2 gap-4 flex-1">
                {BUDGET_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setBudget({ max: opt.max });
                      setStep("purpose");
                    }}
                    className="glass p-8 flex flex-col items-start text-left hover:border-[#C8A45A]/50 active:scale-[0.97] transition-all group"
                  >
                    <div className="text-4xl mb-4">{opt.icon}</div>
                    <div className="font-serif text-2xl text-white group-hover:text-[#C8A45A] transition-colors">
                      {opt.label}
                    </div>
                    <div className="mt-auto pt-4 text-[#C8A45A] opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                      Select →
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "purpose" && (
            <motion.div
              key="purpose"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col px-10 pt-6"
            >
              <div className="font-serif text-4xl text-white mb-2">What's it for?</div>
              <div className="text-sm text-[rgba(244,239,228,0.4)] mb-8 tracking-wide">
                Help us narrow down the perfect match
              </div>
              <div className="grid grid-cols-2 gap-4 flex-1">
                {PURPOSE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setPurpose(opt.value);
                      setStep("fuel");
                    }}
                    className="glass p-8 flex flex-col items-start text-left hover:border-[#C8A45A]/50 active:scale-[0.97] transition-all group"
                  >
                    <div className="text-4xl mb-4">{opt.icon}</div>
                    <div className="font-serif text-2xl text-white group-hover:text-[#C8A45A] transition-colors">
                      {opt.label}
                    </div>
                    <div className="text-xs text-[rgba(244,239,228,0.4)] mt-2 leading-relaxed">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "fuel" && (
            <motion.div
              key="fuel"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col px-10 pt-6"
            >
              <div className="font-serif text-4xl text-white mb-2">Fuel preference?</div>
              <div className="text-sm text-[rgba(244,239,228,0.4)] mb-8 tracking-wide">
                Choose what works best for your driving style
              </div>
              <div className="grid grid-cols-2 gap-4 flex-1">
                {FUEL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFuel(opt.value);
                      runFinder();
                    }}
                    className="glass p-8 flex flex-col items-start text-left hover:border-[#C8A45A]/50 active:scale-[0.97] transition-all group"
                  >
                    <div className="text-4xl mb-4">{opt.icon}</div>
                    <div className="font-serif text-2xl text-white group-hover:text-[#C8A45A] transition-colors">
                      {opt.label}
                    </div>
                    <div className="text-xs text-[rgba(244,239,228,0.4)] mt-2 leading-relaxed">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "results" && (
            <motion.div
              key="results"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              <div className="px-10 pt-6 pb-4 flex-shrink-0 flex items-center justify-between">
                <div>
                  <div className="font-serif text-3xl text-white">Your Matches</div>
                  <div className="text-sm text-[rgba(244,239,228,0.4)] mt-1">
                    {results.length} cars found for you
                  </div>
                </div>
                <button
                  onClick={() => {
                    setBudget(null); setPurpose(null); setFuel(null);
                    setStep("budget");
                  }}
                  className="border border-[rgba(200,164,90,0.3)] text-[rgba(244,239,228,0.5)] px-6 py-2.5 text-xs tracking-[2px] uppercase"
                >
                  Start Over
                </button>
              </div>

              {results.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-10">
                  <div className="text-5xl mb-4">😔</div>
                  <div className="font-serif text-2xl text-[rgba(244,239,228,0.5)]">No matches found</div>
                  <div className="text-sm text-[rgba(244,239,228,0.3)] mt-2">Try adjusting your criteria</div>
                  <button
                    onClick={() => { setBudget(null); setPurpose(null); setFuel(null); setStep("budget"); }}
                    className="mt-6 bg-[#C8A45A] text-[#060606] px-8 py-3 text-xs tracking-[2px] uppercase font-semibold"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="flex-1 kiosk-scroll px-10 pb-10">
                  <div className="space-y-3">
                    {results.map((car, i) => (
                      <motion.div
                        key={car.id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => dispatch({ type: "GO", screen: "detail", car })}
                        className="glass flex items-center gap-5 p-4 active:scale-[0.98] transition-transform group"
                      >
                        {i === 0 && (
                          <div className="absolute -top-px left-0 right-0 h-0.5 bg-[#C8A45A]" />
                        )}
                        <div className="relative w-32 h-20 flex-shrink-0 overflow-hidden">
                          <Image src={car.images.hero} alt={car.model} fill className="object-cover" unoptimized />
                        </div>
                        <div className="flex-1">
                          <div className="text-[9px] tracking-[3px] text-[#C8A45A] uppercase">{car.brand}</div>
                          <div className="font-serif text-xl text-white">{car.model}</div>
                          <div className="text-xs text-[rgba(244,239,228,0.4)] mt-0.5">
                            {car.fuel} · {car.transmission} · {car.horsepower}hp
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {i === 0 && <div className="text-[9px] tracking-[2px] text-[#C8A45A] uppercase mb-1">Best Match</div>}
                          <div className="font-serif text-xl text-[#C8A45A]">{car.priceLabel}</div>
                          <div className="text-[rgba(244,239,228,0.3)] text-xs mt-0.5 group-hover:text-[#C8A45A] transition-colors">
                            View Details →
                          </div>
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
