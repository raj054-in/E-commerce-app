import { Button } from "@/components/ui/button";
import {
  ItemThumb, STATUSES, FLOW, badge, payBadge, label, money, dateText, shortId, itemCount,
} from "./orderUtils";

function Progress({ status }) {
  if (status === "cancelled") return <p className="text-xs font-medium text-red-600">Order cancelled</p>;
  const current = FLOW.indexOf(status);

  return (
    <div>
      <div className="flex items-center">
        {FLOW.map((s, i) => (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className={`h-2.5 w-2.5 rounded-full ${i <= current ? "bg-slate-900" : "bg-slate-200"}`} />
            {i < FLOW.length - 1 && (
              <div className={`h-0.5 flex-1 ${i < current ? "bg-slate-900" : "bg-slate-200"}`} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-slate-500">
        {FLOW.map((s) => <span key={s}>{label(s)}</span>)}
      </div>
    </div>
  );
}

// status = the value shown right now (can be ahead of order.deliveryStatus while saving)
export default function OrderCard({ order, status, updating, onStatusChange, onDetail }) {
  const shown = order.items.slice(0, 3);
  const extra = order.items.length - shown.length;
  const a = order.shippingAddress || {};
  const count = itemCount(order);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
      <div className="flex items-center gap-2 lg:w-52 lg:shrink-0">
        {shown.map((item, i) => <ItemThumb key={i} item={item} showQty />)}
        {extra > 0 && (
          <div className="flex h-14 w-14 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-sm font-medium text-slate-500">
            +{extra}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-900">#{shortId(order._id)}</span>
          <span className={badge(status)}>{label(status)}</span>
          <span className={payBadge(order.paymentStatus)}>
            {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
          </span>
        </div>
        <p className="truncate text-sm text-slate-700">
          {order.userId?.name || "Customer"} · {a.area}, {a.city}
        </p>
        <p className="text-xs text-slate-500">
          {dateText(order.createdAt)} · {count} item{count > 1 ? "s" : ""} ·{" "}
          <span className="font-medium text-slate-900">{money(order.totalAmount)}</span>
        </p>
      </div>

      <div className="space-y-3 lg:w-64 lg:shrink-0">
        <Progress status={status} />
        <div className="flex gap-2">
          <select
            value={status}
            disabled={updating}
            onChange={(e) => onStatusChange(order, e.target.value)}
            className="h-9 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 disabled:opacity-60"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
          </select>
          <Button size="sm" variant="outline" className="h-9" onClick={() => onDetail(order)}>
            Detail
          </Button>
        </div>
      </div>
    </div>
  );
}
