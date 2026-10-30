export type SizeSystem = "UK" | "EU" | "US";

export type Product = {
  id: string;
  name: string;
  colour: string;
  price: number;
  image: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "midnight",
    name: "Midnight",
    colour: "Black",
    price: 9500,
    image: "/images/black-heated-slippers-v2.png",
  },
  {
    id: "ocean",
    name: "Ocean",
    colour: "Blue",
    price: 9500,
    image: "/images/blue-heated-slippers-v2.png",
  },
  {
    id: "blush",
    name: "Blush",
    colour: "Pink",
    price: 9500,
    image: "/images/pink-heated-slippers-v2.png",
  },
];

export const SIZE_OPTIONS = [
  {
    eu: "37–38",
    uk: "4–5",
    us: "5–6",
    weightGrams: 1000,
  },
  {
    eu: "39–40",
    uk: "6–7",
    us: "7–8",
    weightGrams: 1050,
  },
  {
    eu: "41–42",
    uk: "7–8",
    us: "8–9",
    weightGrams: 1100,
  },
  {
    eu: "43–44",
    uk: "9–10",
    us: "10–11",
    weightGrams: 1150,
  },
  {
    eu: "45–46",
    uk: "11–12",
    us: "12–13",
    weightGrams: 1200,
  },
] as const;