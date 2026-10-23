import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, LockKeyhole, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchCart } from "@/store/cart-slice";
import { createOrder } from "@/store/order-slice";

const money = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;

function PaymentForm({ payment }) {
  const fields = payment?.fields || {};
  return <form action={payment.action} method="POST" className="mt-6 rounded-2xl bg-emerald-50 p-5"><div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white"><Check className="h-5 w-5" /></span><div><h2 className="font-semibold text-emerald-950">Your order is ready</h2><p className="mt-1 text-sm text-emerald-800">Continue to eSewa to sign in and complete your payment.</p></div></div>{Object.entries(fields).map(([name, value]) => <input key={name} type="hidden" name={name} value={value ?? ""} />)}<button type="submit" className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#56b84e] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#479c41]"><LockKeyhole className="h-4 w-4" /> Pay with eSewa <ArrowRight className="h-4 w-4" /></button><p className="mt-3 text-center text-xs text-emerald-700">You will be redirected to the secure eSewa login page.</p></form>;
}

export default function Checkout() {
  const dispatch = useDispatch();
  const { items, isLoading: cartLoading } = useSelector((state) => state.cart);
  const { isCheckoutLoading, checkoutError } = useSelector((state) => state.orders);
  const [payment, setPayment] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const subtotal = useMemo(() => items.reduce((sum, item) => {
    const product = typeof item.productId === "object" ? item.productId : null;
    return sum + Number(product?.discountPrice || product?.price || 0) * item.quantity;
  }, 0), [items]);

  async function submitAddress(data) {
    try {
      const result = await dispatch(createOrder(data)).unwrap();
      setPayment(result.esewa);
    } catch (error) {
      window.alert(typeof error === "string" ? error : error?.message || "Unable to prepare your payment");
    }
  }

  if (!cartLoading && items.length === 0 && !payment) {
    return <main className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6"><h1 className="text-2xl font-bold text-slate-950">Your bag is empty</h1><p className="mt-2 text-slate-500">Add a product before starting checkout.</p><Link to="/shopping/listing" className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-700">Browse products</Link></main>;
  }

  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"><Link to="/shopping/cart" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-950"><ArrowLeft className="h-4 w-4" /> Back to bag</Link><div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"><section><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Almost there</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Delivery details</h1><p className="mt-3 text-slate-500">Where should we send your order?</p></div><form onSubmit={handleSubmit(submitAddress)} className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white"><MapPin className="h-4 w-4" /></span><div><h2 className="font-semibold text-slate-900">Shipping address</h2><p className="text-sm text-slate-500">All fields are required for delivery.</p></div></div><div className="grid gap-5 sm:grid-cols-2"><Field name="province" label="Province" placeholder="Bagmati" register={register} error={errors.province} /><Field name="city" label="City" placeholder="Kathmandu" register={register} error={errors.city} /><Field name="area" label="Area / street" placeholder="Lalitpur, Jhamsikhel" register={register} error={errors.area} /><Field name="nearestLandmark" label="Nearest landmark" placeholder="Near the community school" register={register} error={errors.nearestLandmark} /></div>{checkoutError && <p className="mt-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{checkoutError}</p>}<Button type="submit" disabled={isCheckoutLoading || Boolean(payment)} className="mt-7 h-11 w-full rounded-full">{isCheckoutLoading ? "Preparing secure payment..." : payment ? "Payment form ready" : "Continue to payment"}<ArrowRight className="ml-2 h-4 w-4" /></Button></form>{payment && <PaymentForm payment={payment} />}</section><aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="text-lg font-semibold text-slate-900">Order summary</h2><div className="mt-5 space-y-4">{items.map((item) => { const product = typeof item.productId === "object" ? item.productId : null; return <div key={product?._id} className="flex gap-3"><div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">{product?.images?.[0]?.url && <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-900">{product?.name}</p><p className="text-xs text-slate-500">Qty {item.quantity}</p></div><span className="text-sm font-medium text-slate-900">{money(Number(product?.discountPrice || product?.price || 0) * item.quantity)}</span></div>; })}</div><div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm"><div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="flex justify-between text-slate-600"><span>Delivery</span><span>Included</span></div><div className="flex justify-between pt-2 text-base font-bold text-slate-950"><span>Total</span><span>{money(subtotal)}</span></div></div><p className="mt-5 flex items-center gap-2 text-xs text-slate-500"><LockKeyhole className="h-3.5 w-3.5" /> Secure payment powered by eSewa</p></aside></div></main>;
}

function Field({ name, label, placeholder, register, error }) {
  return <div className="space-y-2"><Label htmlFor={name} className="text-slate-700">{label}</Label><Input id={name} placeholder={placeholder} className="h-10 bg-white" {...register(name, { required: `${label} is required` })} />{error && <p className="text-xs text-rose-600">{error.message}</p>}</div>;
}
