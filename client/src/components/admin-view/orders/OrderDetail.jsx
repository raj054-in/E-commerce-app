import { ItemThumb, badge, payBadge, label, money, dateText, shortId } from "./orderUtils";

function Block({ title, children }) {
  return (
    <section className="rounded-lg border border-slate-200 p-3">
      <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">{title}</h4>
      {children}
    </section>
  );
}

export default function OrderDetail({ order }) {
  const a = order.shippingAddress || {};

  return (
    <div className="space-y-3 text-sm text-slate-700">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-slate-900">#{shortId(order._id)}</span>
        <span className={badge(order.deliveryStatus)}>{label(order.deliveryStatus)}</span>
        <span className={payBadge(order.paymentStatus)}>{order.paymentStatus === "paid" ? "Paid" : "Unpaid"}</span>
        <span className="text-xs text-slate-500">{dateText(order.createdAt)}</span>
      </div>

      <Block title="Customer and delivery address">
        <p className="font-medium text-slate-900">{order.userId?.name || "Customer"}</p>
        <p>{[a.area, a.city, a.province].filter(Boolean).join(", ")}</p>
        {a.nearestLandmark && <p className="text-slate-500">Near {a.nearestLandmark}</p>}
      </Block>

      <Block title={`Items (${order.items.length})`}>
        <ul className="divide-y divide-slate-100">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
              <ItemThumb item={item} className="h-12 w-12" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">Quantity {item.quantity}</p>
              </div>
              <span className="font-medium text-slate-900">{money(item.total)}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Payment">
        <div className="flex justify-between"><span>Method</span><span>eSewa</span></div>
        {order.paidAt && <div className="flex justify-between"><span>Paid on</span><span>{dateText(order.paidAt)}</span></div>}
        {order.esewaRefId && <div className="flex justify-between"><span>Reference</span><span>{order.esewaRefId}</span></div>}
        <div className="mt-2 flex justify-between border-t border-slate-100 pt-2 font-semibold text-slate-900">
          <span>Total</span><span>{money(order.totalAmount)}</span>
        </div>
      </Block>
    </div>
  );
}
