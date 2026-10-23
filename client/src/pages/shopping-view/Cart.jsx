import { useEffect } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { fetchCart, removeFromCart, updateCart } from "@/store/cart-slice";

const money = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;

function itemProduct(item) {
  return typeof item.productId === "object" ? item.productId : null;
}

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, isLoading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const subtotal = items.reduce((sum, item) => {
    const product = itemProduct(item);
    return sum + Number(product?.discountPrice || product?.price || 0) * item.quantity;
  }, 0);

  async function changeQuantity(item, nextQuantity) {
    const product = itemProduct(item);
    if (!product || nextQuantity < 1 || nextQuantity > product.countInStock) return;
    try {
      await dispatch(updateCart({ productId: product._id, productQuantity: nextQuantity })).unwrap();
      await dispatch(fetchCart()).unwrap();
    } catch (actionError) {
      window.alert(typeof actionError === "string" ? actionError : "Unable to update your cart");
    }
  }

  async function removeItem(productId) {
    try {
      await dispatch(removeFromCart(productId)).unwrap();
      await dispatch(fetchCart()).unwrap();
    } catch (actionError) {
      window.alert(typeof actionError === "string" ? actionError : "Unable to remove this item");
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Your selection</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Shopping bag</h1><p className="mt-3 text-slate-500">Review your pieces before you check out.</p></div>
      {error && <p className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
      {isLoading && items.length === 0 ? <div className="flex min-h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm text-slate-500">Loading your bag...</div> : items.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><ShoppingBag className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-4 text-xl font-semibold text-slate-900">Your bag is waiting</h2><p className="mt-2 text-sm text-slate-500">Add something you love and it will appear here.</p><Link to="/shopping/listing" className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-700">Continue shopping <ArrowRight className="ml-2 h-4 w-4" /></Link></div> : <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4"><h2 className="font-semibold text-slate-900">{items.length} item{items.length === 1 ? "" : "s"}</h2><Link to="/shopping/listing" className="text-sm font-medium text-slate-600 hover:text-slate-950">Keep shopping</Link></div>
          <div className="divide-y divide-slate-100">
            {items.map((item) => {
              const product = itemProduct(item);
              if (!product) return null;
              const price = product.discountPrice || product.price;
              return <div key={product._id} className="flex gap-4 py-5 first:pt-2"><div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-36 sm:w-28">{product.images?.[0]?.url ? <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-2xl font-bold text-slate-300">{product.name?.[0]}</div>}</div><div className="flex min-w-0 flex-1 flex-col"><div className="flex items-start justify-between gap-3"><div><p className="truncate font-semibold text-slate-900">{product.name}</p><p className="mt-1 text-sm text-slate-500">{product.category}</p></div><button type="button" onClick={() => removeItem(product._id)} className="rounded-full p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Remove ${product.name}`}><Trash2 className="h-4 w-4" /></button></div><div className="mt-auto flex items-end justify-between gap-3"><div className="inline-flex items-center rounded-full border border-slate-200"><button type="button" disabled={item.quantity <= 1 || isLoading} onClick={() => changeQuantity(item, item.quantity - 1)} className="p-2 text-slate-500 hover:text-slate-950 disabled:opacity-40" aria-label="Decrease quantity"><Minus className="h-3.5 w-3.5" /></button><span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span><button type="button" disabled={item.quantity >= product.countInStock || isLoading} onClick={() => changeQuantity(item, item.quantity + 1)} className="p-2 text-slate-500 hover:text-slate-950 disabled:opacity-40" aria-label="Increase quantity"><Plus className="h-3.5 w-3.5" /></button></div><p className="font-semibold text-slate-900">{money(price * item.quantity)}</p></div></div></div>;
            })}
          </div>
        </section>
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="text-lg font-semibold text-slate-900">Order summary</h2><div className="mt-6 space-y-3 text-sm"><div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="flex justify-between text-slate-600"><span>Delivery</span><span className="text-emerald-600">Calculated next</span></div><div className="flex justify-between border-t border-slate-100 pt-4 text-base font-bold text-slate-950"><span>Total</span><span>{money(subtotal)}</span></div></div><Button type="button" onClick={() => navigate("/shopping/checkout")} className="mt-6 h-11 w-full rounded-full">Continue to checkout <ArrowRight className="ml-2 h-4 w-4" /></Button><p className="mt-3 text-center text-xs text-slate-400">You will enter delivery details next.</p></aside>
      </div>}
    </main>
  );
}
