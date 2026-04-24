"use client";
import React, { createContext, useContext, useReducer, useEffect, useRef } from "react";
import { Car } from "./data";

export type Screen = "home" | "browse" | "detail" | "finder" | "compare" | "share";

interface KioskState {
  screen: Screen;
  selectedCar: Car | null;
  compareList: Car[];
  savedCars: Car[];
  history: Screen[];
  idleSeconds: number;
}

type Action =
  | { type: "GO"; screen: Screen; car?: Car }
  | { type: "BACK" }
  | { type: "RESET" }
  | { type: "RESET_IDLE" }
  | { type: "ADD_COMPARE"; car: Car }
  | { type: "REMOVE_COMPARE"; id: string }
  | { type: "SAVE_CAR"; car: Car }
  | { type: "UNSAVE_CAR"; id: string }
  | { type: "TICK" };

const initial: KioskState = {
  screen: "home",
  selectedCar: null,
  compareList: [],
  savedCars: [],
  history: [],
  idleSeconds: 0,
};

function reducer(state: KioskState, action: Action): KioskState {
  switch (action.type) {
    case "GO":
      return { ...state, screen: action.screen, selectedCar: action.car ?? state.selectedCar, history: [...state.history, state.screen], idleSeconds: 0 };
    case "BACK": {
      const prev = state.history[state.history.length - 1] ?? "home";
      return { ...state, screen: prev, history: state.history.slice(0, -1), idleSeconds: 0 };
    }
    case "RESET":
      return { ...initial };
    case "RESET_IDLE":
      return { ...state, idleSeconds: 0 };
    case "ADD_COMPARE":
      if (state.compareList.find((c) => c.id === action.car.id)) return state;
      if (state.compareList.length >= 3) return state;
      return { ...state, compareList: [...state.compareList, action.car], idleSeconds: 0 };
    case "REMOVE_COMPARE":
      return { ...state, compareList: state.compareList.filter((c) => c.id !== action.id) };
    case "SAVE_CAR":
      if (state.savedCars.find((c) => c.id === action.car.id)) return state;
      return { ...state, savedCars: [...state.savedCars, action.car], idleSeconds: 0 };
    case "UNSAVE_CAR":
      return { ...state, savedCars: state.savedCars.filter((c) => c.id !== action.id) };
    case "TICK":
      return { ...state, idleSeconds: state.idleSeconds + 1 };
    default:
      return state;
  }
}

const KioskCtx = createContext<{ state: KioskState; dispatch: React.Dispatch<Action> } | null>(null);

export function KioskProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Tick every second
  useEffect(() => {
    timerRef.current = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Auto-reset after 60s idle (not on home)
  useEffect(() => {
    if (state.idleSeconds >= 60 && state.screen !== "home") dispatch({ type: "RESET" });
  }, [state.idleSeconds, state.screen]);

  // Any interaction resets idle
  useEffect(() => {
    const handler = () => dispatch({ type: "RESET_IDLE" });
    const events = ["touchstart", "mousedown", "keydown", "pointermove"];
    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, handler));
  }, []);

  return <KioskCtx.Provider value={{ state, dispatch }}>{children}</KioskCtx.Provider>;
}

export function useKiosk() {
  const ctx = useContext(KioskCtx);
  if (!ctx) throw new Error("useKiosk must be inside KioskProvider");
  return ctx;
}
