import { useEffect, useState } from "react";
import { CheckCircle2, CircleAlert, LoaderCircle, ShoppingBag } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCartState } from "@/store/cart-slice";
import { verifyEsewaPayment } from "@/store/order-slice";

export default function PaymentResult({ failed = false }) {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const data = searchParams.get("data");
  const [status, setStatus] = useState(() => failed || !data ? "failed" : "verifying");
  const [message, setMessage] = useState(() => failed ? "The payment was not completed." : data ? "Verifying your payment with the server..." : "eSewa did not return a payment confirmation.");

  useEffect(() => {
    if (failed) return;
    if (!data) return;

    dispatch(verifyEsewaPayment(data))
      .unwrap()
      .then(() => {
        dispatch(clearCartState());
        setStatus("success");
        setMessage("Your payment was verified and your order is confirmed.");
      })
      .catch((error) => {
        setStatus("failed");
        setMessage(typeof error === "string" ? error : "We could not verify this payment. Please contact support if money was deducted.");
      });
  }, [dispatch, failed, data]);

  const success = status === "success";
  const verifying = status === "verifying";

  return <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16"><section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-xl shadow-slate-200/60 sm:p-10">{verifying ? <LoaderCircle className="mx-auto h-14 w-14 animate-spin text-slate-900" /> : success ? <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" /> : <CircleAlert className="mx-auto h-14 w-14 text-rose-500" />}<p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{verifying ? "Payment status" : success ? "Payment complete" : "Payment incomplete"}</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{verifying ? "Confirming your order" : success ? "Thank you for your order" : "We could not complete payment"}</h1><p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500">{message}</p>{!verifying && <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to={success ? "/shopping/account" : "/shopping/checkout"} className="inline-flex h-9 items-center justify-center rounded-full bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-700">{success ? "View my orders" : "Try payment again"}</Link><Link to="/shopping/listing" className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"><ShoppingBag className="mr-2 h-4 w-4" /> Continue shopping</Link></div>}</section></main>;
}
