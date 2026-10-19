// match these to the deliveryStatus values in your order schema
export const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
export const FLOW = ["pending", "processing", "shipped", "delivered"];

const base = "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ";
const colors = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export const badge = (s) => base + (colors[s] || "bg-slate-50 text-slate-700 border-slate-200");
export const payBadge = (s) => base + (s === "paid" ? colors.delivered : colors.pending);

export const label = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
export const money = (n) => `Rs. ${Number(n || 0).toLocaleString("en-IN")}`;
export const shortId = (id) => String(id).slice(-6).toUpperCase();
export const itemCount = (o) => o.items.reduce((sum, i) => sum + i.quantity, 0);
export const dateText = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

// works when the backend populates items.productId, falls back to a letter tile when it doesn't
export const itemImage = (item) =>
  typeof item.productId === "object" ? item.productId?.images?.[0]?.url : undefined;

export function ItemThumb({ item, className = "h-14 w-14", showQty }) {
  const src = itemImage(item);
  return (
    <div className={`relative shrink-0 ${className}`}>
      <div className="h-full w-full overflow-hidden rounded-md border border-slate-200 bg-slate-100">
        {src ? (
          <img src={src} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-slate-400">
            {item.name?.[0]?.toUpperCase()}
          </div>
        )}
      </div>
      {showQty && (
        <span className="absolute -right-1.5 -top-1.5 rounded-full bg-slate-900 px-1.5 text-[10px] font-medium text-white">
          ×{item.quantity}
        </span>
      )}
    </div>
  );
}
