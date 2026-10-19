import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import OrderCard from "@/components/admin-view/orders/OrderCard";
import OrderDetail from "@/components/admin-view/orders/OrderDetail";
import Pagination from "@/components/Pagination";
import { fetchAllOrders, updateDeliveryStatus } from "@/store/order-slice";

const LIMIT = 8;

export default function AdminOrders() {
  const dispatch = useDispatch();
  // "orders" must match the key you used in store.js
  const { adminOrders, totalPages, isLoading } = useSelector((state) => state.orders);

  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [draft, setDraft] = useState({}); // { orderId: newStatus } while saving

  useEffect(() => {
    dispatch(fetchAllOrders({ page, limit: LIMIT }));
  }, [dispatch, page]);

  function handleStatusChange(order, status) {
    const risky = ["shipped", "delivered"].includes(status);
    if (order.paymentStatus !== "paid" && risky) {
      if (!window.confirm("This order is not paid yet. Change the status anyway?")) return;
    }

    setDraft((d) => ({ ...d, [order._id]: status }));

    dispatch(updateDeliveryStatus({ id: order._id, data: { deliveryStatus: status } }))
      .unwrap()
      .catch((err) => alert(typeof err === "string" ? err : "Unable to update order status"))
      .finally(() =>
        setDraft((d) => {
          const { [order._id]: _done, ...rest } = d;
          return rest;
        })
      );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
        <p className="text-sm text-slate-500">Track orders and update their delivery status.</p>
      </div>

      {adminOrders.length === 0 ? (
        <p className="py-16 text-center text-slate-500">
          {isLoading ? "Loading orders..." : "No orders yet."}
        </p>
      ) : (
        <div className="space-y-4">
          {adminOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              status={draft[order._id] ?? order.deliveryStatus}
              updating={order._id in draft}
              onStatusChange={handleStatusChange}
              onDetail={setDetail}
            />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <Dialog open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order details</DialogTitle>
          </DialogHeader>
          {detail && <OrderDetail order={detail} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
