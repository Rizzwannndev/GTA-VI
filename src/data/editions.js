// Editions as reported when pre-orders opened in June 2026 (Game Informer,
// Neowin and others, citing Rockstar). Prices are US list prices; regional
// prices differ. Contents beyond what was reported are deliberately left
// out: the official store page is the source of truth.
export const PRICES_NOTE =
  "US prices as reported when pre-orders opened in June 2026. Regional prices and contents vary; check Rockstar's store before buying.";

export const editions = [
  {
    id: "standard",
    name: "Standard Edition",
    price: "$79.99",
    tone: "var(--color-teal)",
    includes: ["Grand Theft Auto VI", "Pre-order bonus for orders placed before November 20, 2026"],
    bestFor: "Everyone who just wants to play on day one.",
  },
  {
    id: "ultimate",
    name: "Ultimate Edition",
    price: "$99.99",
    tone: "var(--color-pink)",
    featured: true,
    includes: ["Grand Theft Auto VI", "Extra in-game content listed on Rockstar's store page", "Pre-order bonus for orders placed before November 20, 2026"],
    bestFor: "Players who want the extras from the start.",
  },
  {
    id: "collection",
    name: "The Goodtime State Vice City Collection",
    price: "Collector's set",
    tone: "var(--color-gold)",
    includes: ["Physical collectibles", "The game itself is not included"],
    bestFor: "Collectors who already have a copy on order.",
  },
];
