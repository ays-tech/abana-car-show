"use client";

import { motion, AnimatePresence } from "framer-motion";

import { useKiosk } from "@/lib/store";

import { useState, useEffect } from "react";

const HEADLINES = [

  { line1: "Find your next car", line2: "in seconds." },

  { line1: "Built for your",     line2: "lifestyle."  },

  { line1: "Explore. Compare.",  line2: "Decide."     },

  { line1: "Nigeria's finest",   line2: "automobiles."},

];

const BRAND_LOGOS: Record<string, string> = {
  toyota: "https://cdn.simpleicons.org/toyota/ffffff",
  tesla: "https://cdn.simpleicons.org/tesla/ffffff",
  honda: "https://cdn.simpleicons.org/ferrari/ffffff",
  mercedes: "https://cdn.simpleicons.org/bmw/ffffff",
};

const TILES = [
  {
    img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop&q=80",
    label: "Ride-Hailing",
    sub: "Reliable & efficient",
    brand: "toyota",
  },
  {
    img: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&auto=format&fit=crop&q=80",
    label: "Fuel Efficient",
    sub: "Lowest running cost",
    brand: "tesla",
  },
  {
    img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80",
    label: "Budget Picks",
    sub: "Under ₦30 million",
    brand: "honda",
  },
  {
    img: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&auto=format&fit=crop&q=80",
    label: "Top Luxury",
    sub: "Premium collection",
    brand: "mercedes",
  },
];


/* Two high-quality showroom/car backgrounds — regular <img> to avoid next/image fill issues */

const HERO_IMGS = [

  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&h=1080&fit=crop&auto=format&q=70",

  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&h=1080&fit=crop&auto=format&q=70",

  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&h=1080&fit=crop&auto=format&q=70",

];

const ease = [0.16, 1, 0.3, 1] as const;

export default function HomeScreen() {

  const { dispatch, state } = useKiosk();

  const [headIdx,  setHeadIdx]  = useState(0);

  const [bgIdx,    setBgIdx]    = useState(0);

  const [time,     setTime]     = useState("--:--");

  const [mounted,  setMounted]  = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {

    const tick = () => {

      const n = new Date();

      setTime(`${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`);

    };

    tick();

    const t = setInterval(tick, 10_000);

    return () => clearInterval(t);

  }, []);

  useEffect(() => {

    const t = setInterval(() => setHeadIdx(i => (i + 1) % HEADLINES.length), 4_000);

    return () => clearInterval(t);

  }, []);

  useEffect(() => {

    const t = setInterval(() => setBgIdx(i => (i + 1) % HERO_IMGS.length), 7_000);

    return () => clearInterval(t);

  }, []);

  const go = (screen: "browse" | "finder" | "compare") =>

    dispatch({ type: "GO", screen });

  const idlePct = Math.max(0, 100 - (state.idleSeconds / 60) * 100);

  if (!mounted) return null;

  return (

    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#060606]">

      {/* ══ BACKGROUND ══ */}

      {/* eslint-disable-next-line @next/next/no-img-element */}

      <AnimatePresence mode="wait">

        <motion.img

          key={bgIdx}

          src={HERO_IMGS[bgIdx]}

          alt=""

          aria-hidden="true"

          initial={{ opacity: 0, scale: 1.06 }}

          animate={{ opacity: 1, scale: 1.0 }}

          exit={{ opacity: 0 }}

          transition={{ duration: 1.4, ease: "easeInOut" }}

          style={{

            position: "absolute", inset: 0,

            width: "100%", height: "100%",

            objectFit: "cover",

            filter: "blur(18px) brightness(0.28) saturate(0.6)",

            transform: "scale(1.1)",

            zIndex: 0,

          }}

        />

      </AnimatePresence>

      {/* Vignette layers */}

      <div style={{ position:"absolute",inset:0,zIndex:1,pointerEvents:"none",

        background:"radial-gradient(ellipse 140% 110% at 50% 115%, rgba(6,6,6,0.97) 0%, rgba(6,6,6,0.55) 45%, transparent 72%)" }} />

      <div style={{ position:"absolute",inset:0,zIndex:1,pointerEvents:"none",

        background:"linear-gradient(to bottom, rgba(6,6,6,0.88) 0%, transparent 30%, transparent 70%, rgba(6,6,6,0.7) 100%)" }} />

      <div style={{ position:"absolute",inset:0,zIndex:1,pointerEvents:"none",

        background:"radial-gradient(ellipse 70% 55% at 50% 38%, rgba(200,164,90,0.05), transparent 65%)" }} />

      {/* ══ TOP BAR ══ */}

      <motion.div

        initial={{ opacity:0, y:-20 }}

        animate={{ opacity:1, y:0 }}

        transition={{ duration:0.8, delay:0.2, ease }}

        style={{ position:"absolute",top:0,left:0,right:0,zIndex:30,

          display:"flex",alignItems:"center",justifyContent:"space-between",

          padding:"36px 56px 0" }}

      >

        {/* Logo */}

        <div>

          <p style={{ fontSize:9,letterSpacing:6,textTransform:"uppercase",color:"rgba(200,164,90,0.55)",marginBottom:8 }}>

            Welcome to

          </p>

          <div style={{ fontFamily:"Georgia,serif",fontSize:22,letterSpacing:9,lineHeight:1,fontWeight:700 }}>

            <span style={{ color:"#C8A45A" }}>ABANA</span>

            <span style={{ color:"rgba(244,239,228,0.75)",fontWeight:300 }}>CARS</span>

          </div>

        </div>

        {/* Clock */}

        <div style={{ textAlign:"right" }}>

          <div style={{ fontFamily:"Georgia,serif",fontSize:48,fontWeight:300,color:"#C8A45A",

            lineHeight:1,letterSpacing:4,fontVariantNumeric:"tabular-nums" }}>

            {time}

          </div>

          <p style={{ fontSize:8,letterSpacing:5,textTransform:"uppercase",

            color:"rgba(244,239,228,0.2)",marginTop:8 }}>

            Lagos · Nigeria

          </p>

        </div>

      </motion.div>

      {/* ══ CENTRE CONTENT ══ */}

      <div style={{ position:"absolute",inset:0,zIndex:20,

        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>

        {/* Rotating headline — fixed 180px height prevents layout jump */}

        <div style={{ height:180,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16 }}>

          <AnimatePresence mode="wait">

            <motion.h1

              key={headIdx}

              initial={{ opacity:0, y:22, filter:"blur(10px)" }}

              animate={{ opacity:1, y:0,  filter:"blur(0px)" }}

              exit={{    opacity:0, y:-16, filter:"blur(6px)"  }}

              transition={{ duration:0.65, ease }}

              style={{ fontFamily:"Georgia,serif",fontWeight:300,lineHeight:1.05,

                color:"#fff",textAlign:"center",fontSize:"clamp(46px,5.2vw,74px)",

                margin:0 }}

            >

              {HEADLINES[headIdx].line1}

              <br />

              <em style={{ fontStyle:"italic",color:"#C8A45A",fontWeight:400 }}>

                {HEADLINES[headIdx].line2}

              </em>

            </motion.h1>

          </AnimatePresence>

        </div>

        {/* Sub-headline */}

        <motion.p

          initial={{ opacity:0 }}

          animate={{ opacity:1 }}

          transition={{ delay:0.9, duration:0.9 }}

          style={{ fontSize:11,letterSpacing:4,textTransform:"uppercase",

            color:"rgba(244,239,228,0.35)",fontWeight:300,marginBottom:52 }}

        >

          Browse real cars · No pressure · No waiting

        </motion.p>

        {/* ── CTA BUTTONS ── */}

        <motion.div

          initial={{ opacity:0, y:24 }}

          animate={{ opacity:1, y:0 }}

          transition={{ delay:0.55, duration:0.7, ease }}

          style={{ display:"flex",gap:16,marginBottom:48 }}

        >

          {/* PRIMARY */}

          <motion.button

            whileTap={{ scale:0.94 }}

            onClick={() => go("browse")}

            style={{

              position:"relative",overflow:"hidden",

              padding:"18px 48px",

              fontSize:11,letterSpacing:4,textTransform:"uppercase",

              fontWeight:700,color:"#060606",background:"#C8A45A",border:"none",

            }}

          >

            {/* Shimmer sweep */}

            <motion.span

              aria-hidden="true"

              style={{

                position:"absolute",inset:0,display:"block",

                background:"linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.26) 50%,transparent 70%)",

              }}

              animate={{ x:["-110%","210%"] }}

              transition={{ repeat:Infinity, duration:2.8, delay:2.5, ease:"linear" }}

            />

            <span style={{ position:"relative",zIndex:1 }}>Browse Cars</span>

          </motion.button>

          {/* SECONDARY */}

          <motion.button

            whileTap={{ scale:0.94 }}

            onClick={() => go("finder")}

            style={{

              padding:"18px 40px",

              fontSize:11,letterSpacing:4,textTransform:"uppercase",

              fontWeight:500,color:"rgba(244,239,228,0.78)",

              background:"rgba(18,18,20,0.72)",

              backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",

              border:"1px solid rgba(200,164,90,0.25)",

            }}

          >

            Find My Car

          </motion.button>

          {/* TERTIARY */}

          <motion.button

            whileTap={{ scale:0.94 }}

            onClick={() => go("compare")}

            style={{

              padding:"18px 40px",

              fontSize:11,letterSpacing:4,textTransform:"uppercase",

              fontWeight:500,color:"rgba(244,239,228,0.78)",

              background:"rgba(18,18,20,0.72)",

              backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",

              border:"1px solid rgba(200,164,90,0.25)",

            }}

          >

            Compare Models

          </motion.button>

        </motion.div>

        {/* ── DISCOVERY TILES ── */}

        <motion.div

          initial={{ opacity:0, y:18 }}

          animate={{ opacity:1, y:0 }}

          transition={{ delay:0.85, duration:0.7, ease }}

          style={{ display:"flex",gap:12 }}

        >

          {TILES.map((tile, i) => (

            <motion.button
            key={tile.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95 + i * 0.07, duration: 0.5 }}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.04 }}
            onClick={() => go("browse")}
            style={{
              position: "relative",
              width: 180,
              height: 160,
              overflow: "hidden",
              borderRadius: 10,
              border: "1px solid rgba(200,164,90,0.15)",
              background: "#0c0c0e",
            }}
          >
            {/* IMAGE */}
            <motion.img
              src={tile.img}
              alt={tile.label}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.6 }}
            />

            {/* DARK GRADIENT */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2))",
              }}
            />

            {/* GOLD TINT (very subtle) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 50% 100%, rgba(200,164,90,0.15), transparent 70%)",
                opacity: 0.6,
              }}
            />

            {/* CONTENT */}
            <div
              style={{
                position: "absolute",
                bottom: 14,
                left: 14,
                right: 14,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "rgba(244,239,228,0.85)",
                  fontWeight: 600,
                }}
              >
                {tile.label}
              </div>

              <div
                style={{
                  fontSize: 9,
                  color: "rgba(244,239,228,0.5)",
                  marginTop: 4,
                }}
              >
                {tile.sub}
              </div>
            </div>

            {/* HOVER BORDER GLOW */}
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                border: "1px solid rgba(200,164,90,0.0)",
                borderRadius: 10,
              }}
              whileHover={{
                borderColor: "rgba(200,164,90,0.45)",
              }}
              transition={{ duration: 0.25 }}
            />


            <div
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(200,164,90,0.25)",
              }}
            >
              <img
                src={BRAND_LOGOS[tile.brand]}
                alt={tile.brand}
                style={{
                  width: 16,
                  height: 16,
                  objectFit: "contain",
                  opacity: 0.9,
                }}
              />
            </div>
          </motion.button>

))}

        </motion.div>

      </div>

      {/* ══ COMPARE BADGE ══ */}

      <AnimatePresence>

        {state.compareList.length > 0 && (

          <motion.button

            initial={{ opacity:0, scale:0.85 }}

            animate={{ opacity:1, scale:1 }}

            exit={{ opacity:0, scale:0.85 }}

            whileTap={{ scale:0.93 }}

            onClick={() => go("compare")}

            style={{

              position:"absolute",top:32,left:"50%",transform:"translateX(-50%)",

              zIndex:40,display:"flex",alignItems:"center",gap:10,

              padding:"12px 24px",

              background:"rgba(200,164,90,0.1)",

              backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",

              border:"1px solid rgba(200,164,90,0.35)",

            }}

          >

            <span style={{ width:8,height:8,borderRadius:"50%",background:"#C8A45A",display:"block" }} />

            <span style={{ fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"#C8A45A" }}>

              {state.compareList.length} car{state.compareList.length > 1 ? "s" : ""} ready to compare →

            </span>

          </motion.button>

        )}

      </AnimatePresence>

      {/* ══ BOTTOM ROW ══ */}

      <motion.div

        initial={{ opacity:0 }}

        animate={{ opacity:1 }}

        transition={{ delay:1.3, duration:0.8 }}

        style={{

          position:"absolute",bottom:28,left:0,right:0,zIndex:30,

          display:"flex",alignItems:"center",justifyContent:"space-between",

          padding:"0 56px",

        }}

      >

        <div style={{ display:"flex",alignItems:"center",gap:12 }}>

          <span style={{ width:20,height:1,background:"rgba(200,164,90,0.35)",display:"block" }} />

          <span style={{ fontSize:9,letterSpacing:3,textTransform:"uppercase",color:"rgba(244,239,228,0.22)" }}>

            Victoria Island Showroom · Lagos

          </span>

        </div>

        {/* Pulsing touch hint */}

        <motion.div

          animate={{ opacity:[0.28, 0.62, 0.28] }}

          transition={{ repeat:Infinity, duration:3, ease:"easeInOut" }}

          style={{ display:"flex",alignItems:"center",gap:8 }}

        >

          <motion.span

            animate={{ scale:[1,1.35,1] }}

            transition={{ repeat:Infinity, duration:2.4, ease:"easeInOut" }}

            style={{ display:"block",width:6,height:6,borderRadius:"50%",background:"rgba(200,164,90,0.55)" }}

          />

          <span style={{ fontSize:9,letterSpacing:4,textTransform:"uppercase",color:"rgba(244,239,228,0.28)" }}>

            Touch anywhere to begin

          </span>

          <motion.span

            animate={{ scale:[1,1.35,1] }}

            transition={{ repeat:Infinity, duration:2.4, ease:"easeInOut", delay:0.5 }}

            style={{ display:"block",width:6,height:6,borderRadius:"50%",background:"rgba(200,164,90,0.55)" }}

          />

        </motion.div>

        <div style={{ display:"flex",alignItems:"center",gap:12 }}>

          <span style={{ fontSize:9,letterSpacing:3,textTransform:"uppercase",color:"rgba(244,239,228,0.22)" }}>

            400+ vehicles available

          </span>

          <span style={{ width:20,height:1,background:"rgba(200,164,90,0.35)",display:"block" }} />

        </div>

      </motion.div>

      {/* ══ IDLE BAR ══ */}

      <div style={{ position:"absolute",bottom:0,left:0,right:0,zIndex:50,

        height:2,background:"rgba(200,164,90,0.06)" }}>

        <div style={{ height:"100%",background:"#C8A45A",

          width:`${idlePct}%`,transition:"width 1s linear" }} />

      </div>

    </div>

  );

}



