export type FuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric";
export type Purpose = "Luxury" | "Family" | "Uber" | "Sport";
export type Transmission = "Automatic" | "Manual";

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number; // in Naira millions
  priceLabel: string;
  fuel: FuelType;
  transmission: Transmission;
  engine: string;
  consumption: string; // L/100km
  horsepower: number;
  seats: number;
  purpose: Purpose[];
  popularity: number; // 1-100
  available: boolean;
  badge?: "New Arrival" | "Best Seller" | "Hot Deal" | "Rare Find";
  images: {
    hero: string;
    gallery: string[];
    rotate: string[]; // 8 angles for 360
  };
  specs: {
    acceleration: string;
    topSpeed: string;
    bootSpace: string;
    warranty: string;
  };
  description: string;
  color: string; // dominant color for UI accent
}

const UNSPLASH = (id: string, w = 800, h = 500) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

export const cars: Car[] = [
  {
    id: "merc-s-class",
    brand: "Mercedes-Benz",
    model: "S-Class AMG Line",
    year: 2024,
    price: 185,
    priceLabel: "₦185,000,000",
    fuel: "Petrol",
    transmission: "Automatic",
    engine: "3.0L Inline-6 Turbo",
    consumption: "9.8L/100km",
    horsepower: 503,
    seats: 5,
    purpose: ["Luxury"],
    popularity: 95,
    available: true,
    badge: "Best Seller",
    color: "#C8A45A",
    images: {
      hero: UNSPLASH("1618843479313-40f8afb4b4d8", 1200, 700),
      gallery: [
        UNSPLASH("1618843479313-40f8afb4b4d8", 800, 500),
        UNSPLASH("1503376780353-7e6692767b70", 800, 500),
        UNSPLASH("1555215695-3004980ad54e", 800, 500),
        UNSPLASH("1449965408869-eaa3f722e40d", 800, 500),
      ],
      rotate: Array.from({ length: 8 }, (_, i) =>
        UNSPLASH("1618843479313-40f8afb4b4d8", 800, 500)
      ),
    },
    specs: {
      acceleration: "4.4s 0-100",
      topSpeed: "250 km/h",
      bootSpace: "550L",
      warranty: "3 Years",
    },
    description:
      "The S-Class defines automotive luxury. With a commanding presence and cutting-edge technology, it is the benchmark for prestige motoring in Nigeria.",
  },
  {
    id: "rolls-ghost",
    brand: "Rolls-Royce",
    model: "Ghost Black Badge",
    year: 2024,
    price: 620,
    priceLabel: "₦620,000,000",
    fuel: "Petrol",
    transmission: "Automatic",
    engine: "6.75L V12 Twin-Turbo",
    consumption: "14.1L/100km",
    horsepower: 591,
    seats: 5,
    purpose: ["Luxury"],
    popularity: 82,
    available: true,
    badge: "Rare Find",
    color: "#8B7355",
    images: {
      hero: UNSPLASH("1563720223185-11003d516935", 1200, 700),
      gallery: [
        UNSPLASH("1563720223185-11003d516935", 800, 500),
        UNSPLASH("1542362567-b07e54358753", 800, 500),
        UNSPLASH("1606016159991-dfe4f2746ad5", 800, 500),
        UNSPLASH("1493238792000-8113da705763", 800, 500),
      ],
      rotate: Array.from({ length: 8 }, () =>
        UNSPLASH("1563720223185-11003d516935", 800, 500)
      ),
    },
    specs: {
      acceleration: "4.8s 0-100",
      topSpeed: "250 km/h",
      bootSpace: "490L",
      warranty: "4 Years",
    },
    description:
      "The Ghost Black Badge pushes the boundaries of what a Rolls-Royce can be. The darkest expression of the marque — designed for those who choose to stand apart.",
  },
  {
    id: "bmw-7",
    brand: "BMW",
    model: "740i M Sport",
    year: 2024,
    price: 95,
    priceLabel: "₦95,000,000",
    fuel: "Petrol",
    transmission: "Automatic",
    engine: "3.0L Inline-6",
    consumption: "8.5L/100km",
    horsepower: 375,
    seats: 5,
    purpose: ["Luxury", "Family"],
    popularity: 88,
    available: true,
    badge: "New Arrival",
    color: "#1A3A6B",
    images: {
      hero: UNSPLASH("1555215695-3004980ad54e", 1200, 700),
      gallery: [
        UNSPLASH("1555215695-3004980ad54e", 800, 500),
        UNSPLASH("1618843479313-40f8afb4b4d8", 800, 500),
        UNSPLASH("1503376780353-7e6692767b70", 800, 500),
        UNSPLASH("1544636331-e26879cd4d9b", 800, 500),
      ],
      rotate: Array.from({ length: 8 }, () =>
        UNSPLASH("1555215695-3004980ad54e", 800, 500)
      ),
    },
    specs: {
      acceleration: "5.2s 0-100",
      topSpeed: "250 km/h",
      bootSpace: "530L",
      warranty: "3 Years",
    },
    description:
      "The BMW 7 Series is the ultimate executive sedan. Combining striking design with an unparalleled suite of technology, comfort and performance.",
  },
  {
    id: "bentley-continental",
    brand: "Bentley",
    model: "Continental GT V8",
    year: 2023,
    price: 420,
    priceLabel: "₦420,000,000",
    fuel: "Petrol",
    transmission: "Automatic",
    engine: "4.0L V8 Twin-Turbo",
    consumption: "11.8L/100km",
    horsepower: 542,
    seats: 4,
    purpose: ["Luxury", "Sport"],
    popularity: 78,
    available: true,
    badge: "Rare Find",
    color: "#2A4A2A",
    images: {
      hero: UNSPLASH("1549317661-bd32c8ce0db2", 1200, 700),
      gallery: [
        UNSPLASH("1549317661-bd32c8ce0db2", 800, 500),
        UNSPLASH("1542362567-b07e54358753", 800, 500),
        UNSPLASH("1503376780353-7e6692767b70", 800, 500),
        UNSPLASH("1563720223185-11003d516935", 800, 500),
      ],
      rotate: Array.from({ length: 8 }, () =>
        UNSPLASH("1549317661-bd32c8ce0db2", 800, 500)
      ),
    },
    specs: {
      acceleration: "3.9s 0-100",
      topSpeed: "318 km/h",
      bootSpace: "358L",
      warranty: "3 Years",
    },
    description:
      "A grand tourer of exceptional presence and capability. The Continental GT V8 blends handcrafted luxury with sports car performance.",
  },
  {
    id: "porsche-panamera",
    brand: "Porsche",
    model: "Panamera 4S",
    year: 2024,
    price: 112,
    priceLabel: "₦112,000,000",
    fuel: "Petrol",
    transmission: "Automatic",
    engine: "2.9L V6 Biturbo",
    consumption: "9.4L/100km",
    horsepower: 440,
    seats: 5,
    purpose: ["Luxury", "Sport"],
    popularity: 84,
    available: true,
    color: "#8B2020",
    images: {
      hero: UNSPLASH("1503376780353-7e6692767b70", 1200, 700),
      gallery: [
        UNSPLASH("1503376780353-7e6692767b70", 800, 500),
        UNSPLASH("1618843479313-40f8afb4b4d8", 800, 500),
        UNSPLASH("1555215695-3004980ad54e", 800, 500),
        UNSPLASH("1544636331-e26879cd4d9b", 800, 500),
      ],
      rotate: Array.from({ length: 8 }, () =>
        UNSPLASH("1503376780353-7e6692767b70", 800, 500)
      ),
    },
    specs: {
      acceleration: "4.0s 0-100",
      topSpeed: "289 km/h",
      bootSpace: "495L",
      warranty: "3 Years",
    },
    description:
      "The Panamera 4S offers a unique combination of sports car dynamics and the comfort of a luxury saloon — a true four-door sports car.",
  },
  {
    id: "range-sport",
    brand: "Range Rover",
    model: "Sport SVR",
    year: 2023,
    price: 145,
    priceLabel: "₦145,000,000",
    fuel: "Petrol",
    transmission: "Automatic",
    engine: "5.0L V8 Supercharged",
    consumption: "13.6L/100km",
    horsepower: 575,
    seats: 7,
    purpose: ["Luxury", "Family"],
    popularity: 91,
    available: true,
    badge: "Hot Deal",
    color: "#1A3A1A",
    images: {
      hero: UNSPLASH("1606016159991-dfe4f2746ad5", 1200, 700),
      gallery: [
        UNSPLASH("1606016159991-dfe4f2746ad5", 800, 500),
        UNSPLASH("1544636331-e26879cd4d9b", 800, 500),
        UNSPLASH("1493238792000-8113da705763", 800, 500),
        UNSPLASH("1449965408869-eaa3f722e40d", 800, 500),
      ],
      rotate: Array.from({ length: 8 }, () =>
        UNSPLASH("1606016159991-dfe4f2746ad5", 800, 500)
      ),
    },
    specs: {
      acceleration: "4.5s 0-100",
      topSpeed: "283 km/h",
      bootSpace: "784L",
      warranty: "3 Years",
    },
    description:
      "The Range Rover Sport SVR is the pinnacle of performance SUVs. Commanding off-road and on it — with unmatched luxury for the whole family.",
  },
  {
    id: "lexus-lx",
    brand: "Lexus",
    model: "LX 600 F Sport",
    year: 2024,
    price: 72,
    priceLabel: "₦72,000,000",
    fuel: "Petrol",
    transmission: "Automatic",
    engine: "3.5L V6 Twin-Turbo",
    consumption: "12.0L/100km",
    horsepower: 409,
    seats: 7,
    purpose: ["Family", "Luxury"],
    popularity: 86,
    available: true,
    badge: "Hot Deal",
    color: "#2A2A5A",
    images: {
      hero: UNSPLASH("1544636331-e26879cd4d9b", 1200, 700),
      gallery: [
        UNSPLASH("1544636331-e26879cd4d9b", 800, 500),
        UNSPLASH("1606016159991-dfe4f2746ad5", 800, 500),
        UNSPLASH("1493238792000-8113da705763", 800, 500),
        UNSPLASH("1560958089-b8a1929cea89", 800, 500),
      ],
      rotate: Array.from({ length: 8 }, () =>
        UNSPLASH("1544636331-e26879cd4d9b", 800, 500)
      ),
    },
    specs: {
      acceleration: "6.7s 0-100",
      topSpeed: "210 km/h",
      bootSpace: "910L",
      warranty: "4 Years",
    },
    description:
      "The Lexus LX 600 delivers legendary Japanese reliability wrapped in premium luxury. An ideal choice for Nigerian roads and family journeys.",
  },
  {
    id: "toyota-camry",
    brand: "Toyota",
    model: "Camry XSE V6",
    year: 2024,
    price: 28,
    priceLabel: "₦28,000,000",
    fuel: "Petrol",
    transmission: "Automatic",
    engine: "3.5L V6",
    consumption: "9.0L/100km",
    horsepower: 301,
    seats: 5,
    purpose: ["Uber", "Family"],
    popularity: 97,
    available: true,
    badge: "Best Seller",
    color: "#3A2A1A",
    images: {
      hero: UNSPLASH("1492144534655-ae79c964c9d7", 1200, 700),
      gallery: [
        UNSPLASH("1492144534655-ae79c964c9d7", 800, 500),
        UNSPLASH("1449965408869-eaa3f722e40d", 800, 500),
        UNSPLASH("1560958089-b8a1929cea89", 800, 500),
        UNSPLASH("1493238792000-8113da705763", 800, 500),
      ],
      rotate: Array.from({ length: 8 }, () =>
        UNSPLASH("1492144534655-ae79c964c9d7", 800, 500)
      ),
    },
    specs: {
      acceleration: "6.1s 0-100",
      topSpeed: "220 km/h",
      bootSpace: "428L",
      warranty: "3 Years",
    },
    description:
      "Nigeria's most dependable ride. The Camry XSE V6 is the go-to for ride-hailing drivers and families who want reliability without compromise.",
  },
  {
    id: "honda-accord",
    brand: "Honda",
    model: "Accord Sport 2.0T",
    year: 2024,
    price: 22,
    priceLabel: "₦22,000,000",
    fuel: "Petrol",
    transmission: "Automatic",
    engine: "2.0L Turbo",
    consumption: "8.1L/100km",
    horsepower: 192,
    seats: 5,
    purpose: ["Uber", "Family"],
    popularity: 93,
    available: true,
    color: "#1A2A3A",
    images: {
      hero: UNSPLASH("1560958089-b8a1929cea89", 1200, 700),
      gallery: [
        UNSPLASH("1560958089-b8a1929cea89", 800, 500),
        UNSPLASH("1492144534655-ae79c964c9d7", 800, 500),
        UNSPLASH("1449965408869-eaa3f722e40d", 800, 500),
        UNSPLASH("1493238792000-8113da705763", 800, 500),
      ],
      rotate: Array.from({ length: 8 }, () =>
        UNSPLASH("1560958089-b8a1929cea89", 800, 500)
      ),
    },
    specs: {
      acceleration: "7.1s 0-100",
      topSpeed: "205 km/h",
      bootSpace: "473L",
      warranty: "3 Years",
    },
    description:
      "Refined, fuel-efficient and built to last. The Accord is a proven performer — perfect for drivers who need a professional, low-maintenance vehicle.",
  },
  {
    id: "toyota-corolla",
    brand: "Toyota",
    model: "Corolla Cross Hybrid",
    year: 2024,
    price: 18,
    priceLabel: "₦18,000,000",
    fuel: "Hybrid",
    transmission: "Automatic",
    engine: "1.8L Hybrid",
    consumption: "4.9L/100km",
    horsepower: 122,
    seats: 5,
    purpose: ["Uber", "Family"],
    popularity: 89,
    available: true,
    badge: "Hot Deal",
    color: "#2A3A1A",
    images: {
      hero: UNSPLASH("1493238792000-8113da705763", 1200, 700),
      gallery: [
        UNSPLASH("1493238792000-8113da705763", 800, 500),
        UNSPLASH("1492144534655-ae79c964c9d7", 800, 500),
        UNSPLASH("1560958089-b8a1929cea89", 800, 500),
        UNSPLASH("1449965408869-eaa3f722e40d", 800, 500),
      ],
      rotate: Array.from({ length: 8 }, () =>
        UNSPLASH("1493238792000-8113da705763", 800, 500)
      ),
    },
    specs: {
      acceleration: "11.0s 0-100",
      topSpeed: "170 km/h",
      bootSpace: "390L",
      warranty: "5 Years",
    },
    description:
      "The most fuel-efficient vehicle in our fleet. The Corolla Cross Hybrid is ideal for Uber drivers looking to dramatically cut fuel costs.",
  },
];

export const brands = [...new Set(cars.map((c) => c.brand))].sort();
export const fuelTypes: FuelType[] = ["Petrol", "Diesel", "Hybrid", "Electric"];
export const purposes: Purpose[] = ["Luxury", "Family", "Uber", "Sport"];
export const priceRange = { min: 0, max: 700 };
