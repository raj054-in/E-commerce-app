import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "@/components/shopping-view/ProductCard";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/store/product-slice";

const LIMIT = 12;

export default function Listing() {
  const dispatch = useDispatch();
  const { products, totalPages, currentPage, totalProducts, isLoading, error } = useSelector((state) => state.product);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: LIMIT, keywords: search, category }));
  }, [dispatch, page, search, category]);

  function submitSearch(event) {
    event.preventDefault();
    setPage(1);
    setSearch(keyword.trim());
  }

  function clearFilters() {
    setKeyword("");
    setSearch("");
    setCategory("");
    setPage(1);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">The collection</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Shop all products</h1><p className="mt-3 max-w-xl text-slate-500">Find your next everyday favorite from our curated collection.</p></div>
        <form onSubmit={submitSearch} className="flex w-full max-w-md gap-2"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Search products" className="h-10 rounded-full bg-white pl-9" /></div><Button type="submit" className="h-10 rounded-full px-5">Search</Button></form>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3"><p className="text-sm text-slate-500">{isLoading ? "Finding products..." : `${totalProducts || products.length} products`}</p><button type="button" onClick={() => setFiltersOpen((open) => !open)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"><SlidersHorizontal className="h-4 w-4" /> Filters</button></div>
      {filtersOpen && <div className="mt-4 flex flex-wrap items-end gap-4 rounded-2xl border border-slate-200 bg-white p-4"><label className="text-sm font-medium text-slate-700">Category<select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className="mt-2 block h-9 min-w-44 rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal"><option value="">All categories</option><option value="Clothing">Clothing</option><option value="Accessories">Accessories</option><option value="Shoes">Shoes</option><option value="Beauty">Beauty</option></select></label><button type="button" onClick={clearFilters} className="inline-flex h-9 items-center gap-1 text-sm text-slate-500 hover:text-slate-950"><X className="h-4 w-4" /> Clear filters</button></div>}

      {error && <p className="mt-8 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
      {!isLoading && products.length === 0 ? <div className="mt-16 rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center"><h2 className="text-lg font-semibold text-slate-900">No products found</h2><p className="mt-2 text-sm text-slate-500">Try another search or clear your filters.</p></div> : <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div>}
      <Pagination page={currentPage || page} totalPages={totalPages || 1} onChange={setPage} />
    </main>
  );
}
