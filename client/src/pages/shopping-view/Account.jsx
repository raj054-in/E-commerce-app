import { useEffect, useRef, useState } from "react";
import { CreditCard, Mail, Package, Trash2, UserRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deletePendingOrder, fetchMyOrders, resumePendingPayment } from "@/store/order-slice";

const money = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;
const label = (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

export default function Account() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { userOrders, isLoading, error, isPaymentLoading, paymentError } = useSelector((state) => state.orders);
  const [pendingPayment, setPendingPayment] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const paymentFormRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  useEffect(() => {
    if (pendingPayment?.fields && paymentFormRef.current) {
      paymentFormRef.current.submit();
    }
  }, [pendingPayment]);

  async function handleResumePayment(orderId) {
    try {
      const result = await dispatch(resumePendingPayment(orderId)).unwrap();
      setPendingPayment(result.esewa);
    } catch (resumeError) {
      window.alert(typeof resumeError === "string" ? resumeError : "Unable to resume payment");
    }
  }

  async function handleDeleteOrder(orderId) {
    if (!window.confirm("Delete this pending order? This cannot be undone.")) return;

    setDeletingOrderId(orderId);
    try {
      await dispatch(deletePendingOrder(orderId)).unwrap();
    } catch (deleteError) {
      window.alert(typeof deleteError === "string" ? deleteError : "Unable to delete order");
    } finally {
      setDeletingOrderId(null);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="rounded-3xl bg-slate-950 p-6 text-white sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-white/10 text-slate-300">
            {user?.image ? <img src={user.image} alt={user.name || "Profile"} className="h-full w-full object-cover" /> : <UserRound className="h-9 w-9" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-slate-300">Welcome back</p>
            <h1 className="mt-1 truncate text-2xl font-bold sm:text-3xl">{user?.name || "Customer"}</h1>
            <p className="mt-1 flex items-center gap-2 truncate text-sm text-slate-400"><Mail className="h-3.5 w-3.5 shrink-0" />{user?.email}</p>
          </div>
        </div>
      </div>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Your activity</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Order history</h2>
          </div>
          <Package className="h-7 w-7 shrink-0 text-slate-400" />
        </div>
        {error && <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
        {paymentError && <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{paymentError}</p>}
        {isLoading && userOrders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Loading your orders...</div>
        ) : userOrders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"><p className="font-medium text-slate-900">No orders yet</p><p className="mt-2 text-sm text-slate-500">Your completed purchases will appear here.</p></div>
        ) : (
          <div className="mt-6 space-y-3">
            {userOrders.map((order) => (
              <article key={order._id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">Order #{String(order._id).slice(-6).toUpperCase()}</p>
                  <p className="mt-1 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {order.items?.length || 0} product type{order.items?.length === 1 ? "" : "s"}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end sm:text-right">
                  <div><p className="font-semibold text-slate-900">{money(order.totalAmount)}</p><p className="text-xs text-slate-500">{order.paymentStatus === "paid" ? "Paid" : "Payment pending"}</p></div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">{label(order.deliveryStatus)}</span>
                  {order.paymentStatus === "pending" && <div className="flex items-center gap-2"><button type="button" onClick={() => handleResumePayment(order._id)} disabled={isPaymentLoading || deletingOrderId === order._id} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-slate-950 px-3.5 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"><CreditCard className="h-3.5 w-3.5" />{isPaymentLoading ? "Preparing..." : "Pay now"}</button><button type="button" onClick={() => handleDeleteOrder(order._id)} disabled={deletingOrderId === order._id || isPaymentLoading} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-rose-200 px-3 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60" aria-label={`Delete order ${order._id}`}><Trash2 className="h-3.5 w-3.5" />{deletingOrderId === order._id ? "Deleting..." : "Delete"}</button></div>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {pendingPayment?.fields && <form ref={paymentFormRef} action={pendingPayment.action} method="POST" className="hidden">{Object.entries(pendingPayment.fields).map(([name, value]) => <input key={name} type="hidden" name={name} value={value ?? ""} />)}</form>}
    </main>
  );
}
