import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowRight,
  CircleAlert,
  ClipboardList,
  DollarSign,
  Package,
  RefreshCw,
  ShoppingBag,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchDashboardSummary } from "@/store/dashboard-slice";
import {
  badge,
  dateText,
  label,
  money,
  shortId,
} from "@/components/admin-view/orders/orderUtils";

const metricCards = [
  { key: "revenue", label: "Paid revenue", icon: DollarSign, format: money, iconClass: "bg-emerald-50 text-emerald-600" },
  { key: "orderCount", label: "Total orders", icon: ClipboardList, iconClass: "bg-blue-50 text-blue-600" },
  { key: "productCount", label: "Products", icon: Package, iconClass: "bg-violet-50 text-violet-600" },
  { key: "customerCount", label: "Customers", icon: Users, iconClass: "bg-amber-50 text-amber-600" },
];

function MetricCard({ card, value }) {
  const Icon = card.icon;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {card.format ? card.format(value) : Number(value || 0).toLocaleString("en-IN")}
          </p>
        </div>
        <div className={`rounded-lg p-2.5 ${card.iconClass}`}><Icon className="h-5 w-5" /></div>
      </div>
    </div>
  );
}

function LoadingCard() {
  return <div className="h-28 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />;
}

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { summary, isLoading, error } = useSelector((state) => state.dashboard);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => { dispatch(fetchDashboardSummary()); }, [dispatch]);

  const metrics = summary?.metrics || {};
  const recentOrders = summary?.recentOrders || [];
  const lowStockProducts = summary?.lowStockProducts || [];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Welcome back{user?.name ? `, ${user.name}` : ""}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Here is what is happening with your store today.</p>
          </div>
          <Button variant="outline" onClick={() => dispatch(fetchDashboardSummary())} disabled={isLoading}>
            <RefreshCw className={isLoading ? "animate-spin" : ""} /> Refresh
          </Button>
        </div>

        {error && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => dispatch(fetchDashboardSummary())}>Try again</Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {isLoading && !summary ? metricCards.map((card) => <LoadingCard key={card.key} />) : metricCards.map((card) => (
            <MetricCard key={card.key} card={card} value={metrics[card.key]} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5">
              <div>
                <h2 className="font-semibold text-slate-900">Recent orders</h2>
                <p className="mt-1 text-sm text-slate-500">The latest activity from your customers.</p>
              </div>
              <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-950">View all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="flex min-h-48 items-center justify-center px-4 text-sm text-slate-500">{isLoading ? "Loading orders..." : "No orders yet."}</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900">#{shortId(order._id)}</span>
                        <span className={badge(order.deliveryStatus)}>{label(order.deliveryStatus)}</span>
                      </div>
                      <p className="mt-1 truncate text-sm text-slate-600">{order.userId?.name || "Customer"}</p>
                      <p className="text-xs text-slate-500">{dateText(order.createdAt)} · {order.items?.length || 0} product type{order.items?.length === 1 ? "" : "s"}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold text-slate-900">{money(order.totalAmount)}</p>
                      <p className={`text-xs ${order.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"}`}>{order.paymentStatus === "paid" ? "Paid" : "Payment pending"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5">
                <div>
                  <h2 className="font-semibold text-slate-900">Inventory alerts</h2>
                  <p className="mt-1 text-sm text-slate-500">Products with 10 or fewer units.</p>
                </div>
                <CircleAlert className="h-5 w-5 text-amber-500" />
              </div>
              {lowStockProducts.length === 0 ? <p className="p-5 text-sm text-slate-500">All products have healthy stock.</p> : (
                <div className="divide-y divide-slate-100">
                  {lowStockProducts.map((product) => (
                    <div key={product._id} className="flex items-center gap-3 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-sm font-semibold text-slate-400">
                        {product.images?.[0]?.url ? <img src={product.images[0].url} alt="" className="h-full w-full object-cover" /> : product.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">{product.name}</p>
                        <p className="truncate text-xs text-slate-500">SKU {product.sku}</p>
                      </div>
                      <span className={`text-sm font-semibold ${product.countInStock === 0 ? "text-red-600" : "text-amber-600"}`}>{product.countInStock} left</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-300">Orders needing attention</p>
                  <p className="mt-2 text-3xl font-bold">{metrics.pendingOrders || 0}</p>
                  <p className="mt-1 text-sm text-slate-300">Pending orders waiting to be processed.</p>
                </div>
                <ShoppingBag className="h-6 w-6 text-slate-300" />
              </div>
              <Link to="/admin/orders" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-slate-200">Manage orders <ArrowRight className="h-4 w-4" /></Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
