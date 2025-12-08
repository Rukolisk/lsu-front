import { Request, Response } from "express";
import axios from "axios";

/** Essaie d'extraire une portion/quantité (ex: "250 ml", "33 cl", "1 L", "200 g") et normalise. */
function parseServing(p: any) {
  const pieces: string[] = [];

  if (p?.serving_size) pieces.push(String(p.serving_size));
  if (p?.quantity) pieces.push(String(p.quantity));
  if (p?.product_quantity && p?.product_quantity_unit) {
    pieces.push(`${p.product_quantity} ${p.product_quantity_unit}`);
  }

  const candidate = pieces.join(" ");
  const m = String(candidate || "").match(/(\d+(?:[.,]\d+)?)\s*(ml|cl|l|g)\b/i);
  if (!m) return null;

  let v = parseFloat(m[1].replace(",", "."));
  let unit = m[2].toLowerCase();

  // normalisation des liquides en ml
  if (unit === "cl") { v *= 10; unit = "ml"; }
  if (unit === "l")  { v *= 1000; unit = "ml"; }

  return { value: Math.round(v), unit: unit as "ml" | "g" };
}

/** Normalise un produit OpenFoodFacts vers le format frontend */
function mapOFF(p: any) {
  const nutr = p?.nutriments || {};
  return {
    id: p?._id || p?.id || p?.code || "",
    name: p?.product_name || p?.generic_name || "Produit inconnu",
    brand: (p?.brands || "").split(",")[0] || "",
    imageUrl: p?.image_url || p?.image_front_url || "",
    barcode: p?.code || "",
    nutrientsPer100g: {
      sugars: Number(nutr.sugars_100g ?? nutr["sugars_100g"] ?? 0) || 0,
      caffeine: Number(nutr.caffeine_100g ?? nutr["caffeine_100g"] ?? 0) || 0,
      energy_kcal: Number(
        nutr["energy-kcal_100g"] ?? nutr.energy_kcal_100g ?? nutr.energy_100g ?? 0
      ) || 0,
    },
    // 👇 pour auto-remplir quantité/unité côté front
    suggestedServing: parseServing(p),
  };
}

/**
 * GET /api/product/search?q=red%20bull&barcode=5449...
 * - Si "barcode" est fourni, on priorise la recherche par code-barres.
 * - Sinon on cherche par nom (q) via OFF.
 */
export async function searchProducts(req: Request, res: Response) {
  try {
    const { q = "", barcode = "" } = req.query as { q?: string; barcode?: string };

    // recherche par code-barres prioritaire
    if (barcode && String(barcode).trim().length > 0) {
      const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
      const r = await axios.get(url, { timeout: 12000 });
      if (r.data?.status !== 1 || !r.data?.product) return res.json([]);
      return res.json([mapOFF(r.data.product)]);
    }

    // recherche par nom
    const term = String(q || "").trim();
    if (!term || term.length < 2) return res.json([]);

    const url =
      "https://world.openfoodfacts.org/cgi/search.pl?search_simple=1&json=1&page_size=10&search_terms=" +
      encodeURIComponent(term);

    const r = await axios.get(url, { timeout: 12000 });
    const products: any[] = r.data?.products || [];
    return res.json(products.map(mapOFF));
  } catch (e) {
    console.error("products.search error:", (e as any).message);
    return res.status(500).json({ message: "OpenFoodFacts indisponible" });
  }
}
