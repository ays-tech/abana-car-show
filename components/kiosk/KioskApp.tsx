"use client";
import { AnimatePresence } from "framer-motion";
import { useKiosk } from "@/lib/store";
import HomeScreen from "@/components/screens/HomeScreen";
import BrowseScreen from "@/components/screens/BrowseScreen";
import DetailScreen from "@/components/screens/DetailScreen";
import FinderScreen from "@/components/screens/FinderScreen";
import CompareScreen from "@/components/screens/CompareScreen";
import ShareScreen from "@/components/screens/ShareScreen";

export default function KioskApp() {
  const { state } = useKiosk();

  return (
    <AnimatePresence mode="wait">
      {state.screen === "home" && <HomeScreen key="home" />}
      {state.screen === "browse" && <BrowseScreen key="browse" />}
      {state.screen === "detail" && state.selectedCar && <DetailScreen key="detail" />}
      {state.screen === "finder" && <FinderScreen key="finder" />}
      {state.screen === "compare" && <CompareScreen key="compare" />}
      {state.screen === "share" && <ShareScreen key="share" />}
    </AnimatePresence>
  );
}
