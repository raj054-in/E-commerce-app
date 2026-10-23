import { useEffect } from "react";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "@/components/shopping-view/ProductCard";
import { fetchProducts } from "@/store/product-slice";

const benefits = [
  { icon: Truck, title: "Fast delivery", text: "Carefully packed and delivered to your door." },
  { icon: ShieldCheck, title: "Secure checkout", text: "Payments handled safely through eSewa." },
  { icon: Sparkles, title: "Curated quality", text: "Thoughtful essentials made for everyday life." },
];

export default function Home() {
  const dispatch = useDispatch();
  const { products, isLoading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 8 }));
  }, [dispatch]);

  return (
    <main>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -right-24 -top-40 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-48 left-1/3 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200"><Sparkles className="h-3.5 w-3.5 text-amber-300" /> New season, new essentials</span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">Good things, thoughtfully chosen.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">Discover a considered collection of everyday pieces that make your routine feel a little more like you.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/shopping/listing" className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-slate-950 hover:bg-slate-200">Shop the collection <ArrowRight className="ml-2 h-4 w-4" /></Link>
              <a href="#featured" className="inline-flex h-11 items-center justify-center rounded-full border border-white/30 bg-transparent px-6 text-sm font-medium text-white hover:bg-white/10">See featured pieces</a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-700 via-slate-800 to-indigo-950 p-8 shadow-2xl shadow-black/30">
              <div className="flex h-full flex-col justify-between rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-300"><span>NOVA</span><span>01 / 04</span></div>
                <div><p className="text-sm text-slate-300">The everyday edit</p><p className="mt-2 text-4xl font-bold leading-tight">Less noise.<br />More life.</p></div>
                <div className="flex items-end justify-between"><span className="text-xs text-slate-300">Designed for your now</span><span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-950"><ArrowRight className="h-5 w-5" /></span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          {benefits.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-3"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-950" /><div><h2 className="text-sm font-semibold text-slate-900">{title}</h2><p className="mt-1 text-sm text-slate-500">{text}</p></div></div>)}
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Shop the edit</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Featured for you</h2></div><Link to="/shopping/listing" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950">View all products <ArrowRight className="h-4 w-4" /></Link></div>
        {error && <p className="mt-10 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
        {products.length === 0 && isLoading ? <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-200" />)}</div> : <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.slice(0, 8).map((product) => <ProductCard key={product._id} product={product} />)}</div>}
      </section>
    </main>
  );
}
