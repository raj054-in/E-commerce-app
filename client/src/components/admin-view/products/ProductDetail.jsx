import ImageGallery from "./ImageGallery";

const text = (v) => (Array.isArray(v) ? v.join(", ") : v);

export default function ProductDetail({ product }) {
  const d = product.dimensions;
  const rows = [
    ["Price", `Rs. ${product.price}`],
    ["Discount price", product.discountPrice && `Rs. ${product.discountPrice}`],
    ["In stock", product.countInStock],
    ["SKU", product.sku],
    ["Category", product.category],
    ["Brand", product.brand],
    ["Collection", product.collections],
    ["Gender", product.gender],
    ["Material", product.material],
    ["Sizes", text(product.sizes)],
    ["Colors", text(product.colors)],
    ["Tags", text(product.tags)],
    ["Weight", product.weight],
    ["Dimensions", d && `${d.length ?? "-"} × ${d.width ?? "-"} × ${d.height ?? "-"}`],
    ["Rating", product.rating],
    ["Status", `${product.isPublished ? "Published" : "Draft"}${product.isFeatured ? " · Featured" : ""}`],
  ].filter(([, v]) => v !== undefined && v !== null && v !== "");

  return (
    <div className="space-y-4">
      <ImageGallery images={product.images} name={product.name} />
      <p className="text-sm text-slate-600">{product.description}</p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-slate-500">{label}</dt>
            <dd className="text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
