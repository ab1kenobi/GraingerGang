const fs = require("fs");
const path = require("path");

// ALWAYS resolve from project root
const filePath = path.join(process.cwd(), "products.json");

if (!fs.existsSync(filePath)) {
  console.error("❌ products.json NOT FOUND in project root.");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// unwrap
const cleaned = raw[0].products.map(p => ({
  id: p.id,
  label: p.label,
  price: Number(p.price),
  product: p.product,
  image_url: p.image_url,
  grainger_url: p.grainger_url
}));

fs.writeFileSync(
  path.join(process.cwd(), "products-clean.json"),
  JSON.stringify(cleaned, null, 2)
);

console.log("✅ Products cleaned.");
