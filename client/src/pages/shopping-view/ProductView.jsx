import { useEffect, useState } from "react";
import { ArrowLeft, Check, Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { addToCart, fetchCart } from "@/store/cart-slice";
import { fetchProductById } from "@/store/product-slice";

const money = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;

export default function ProductView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct: product, detailLoading, detailError } = useSelector((state) => state.product);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (detailLoading || !product) {
    return <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">{detailError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{detailError}</div> : <div className="grid animate-pulse gap-8 lg:grid-cols-2"><div className="aspect-square rounded-3xl bg-slate-200" /><div className="space-y-5"><div className="h-8 w-2/3 rounded bg-slate-200" /><div className="h-5 w-1/3 rounded bg-slate-200" /><div className="h-32 rounded bg-slate-200" /></div></div>}</main>;
  }

  const images = product.images?.length ? product.images : [{ url: "", altText: product.name }];
  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  async function handleAdd() {
    if (!isAuthenticated) {
      navigate("/auth/login", { state: { from: `/shopping/products/${id}`, cartProductId: id, cartQuantity: quantity } });
      return;
    }
    setAdding(true);
    try {
      await dispatch(addToCart({ productId: id, productQuantity: quantity })).unwrap();
      await dispatch(fetchCart()).unwrap();
      setAdded(true);
    } catch (error) {
      window.alert(typeof error === "string" ? error : "Unable to add this product");
    } finally {
      setAdding(false);
    }
  }

  return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><Link to="/shopping/listing" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-950"><ArrowLeft className="h-4 w-4" /> Back to shop</Link><div className="grid gap-10 lg:grid-cols-2 lg:gap-16"><section className="flex flex-col-reverse gap-4 sm:flex-row"><div className="flex gap-3 overflow-auto sm:w-20 sm:flex-col">{images.map((image, index) => <button type="button" key={`${image.url}-${index}`} onClick={() => setSelectedImage(index)} className={`h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-100 sm:h-20 sm:w-20 ${selectedImage === index ? "border-slate-950" : "border-transparent"}`}>{image.url && <img src={image.url} alt={image.altText || product.name} className="h-full w-full object-cover" />}</button>)}</div><div className="aspect-square min-w-0 flex-1 overflow-hidden rounded-3xl bg-slate-100">{images[selectedImage]?.url ? <img src={images[selectedImage].url} alt={images[selectedImage].altText || product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-7xl font-bold text-slate-300">{product.name?.[0]}</div>}</div></section><section className="py-1"><div className="flex items-center justify-between gap-4"><span className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{product.category}</span><button type="button" className="rounded-full border border-slate-200 p-2 text-slate-500 hover:text-rose-500" aria-label="Save product"><Heart className="h-5 w-5" /></button></div><h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">{product.name}</h1><div className="mt-4 flex items-center gap-3"><span className="flex items-center gap-1 text-sm text-amber-500"><Star className="h-4 w-4 fill-current" /> {Number(product.rating || 0).toFixed(1)}</span><span className="text-sm text-slate-400">{product.numReviews || 0} reviews</span></div><div className="mt-7 flex items-end gap-3"><span className="text-3xl font-bold text-slate-950">{money(price)}</span>{hasDiscount && <span className="pb-1 text-base text-slate-400 line-through">{money(product.price)}</span>}</div><p className="mt-7 max-w-xl leading-7 text-slate-600">{product.description}</p><div className="mt-7 grid gap-3 border-y border-slate-200 py-5 text-sm sm:grid-cols-2"><div><span className="text-slate-500">Brand</span><p className="mt-1 font-medium text-slate-900">{product.brand || "NOVA"}</p></div><div><span className="text-slate-500">Collection</span><p className="mt-1 font-medium text-slate-900">{product.collections || "Essentials"}</p></div>{product.material && <div><span className="text-slate-500">Material</span><p className="mt-1 font-medium text-slate-900">{product.material}</p></div>}<div><span className="text-slate-500">Availability</span><p className={`mt-1 font-medium ${product.countInStock > 0 ? "text-emerald-600" : "text-rose-600"}`}>{product.countInStock > 0 ? `${product.countInStock} in stock` : "Sold out"}</p></div></div>{product.sizes?.length > 0 && <div className="mt-6"><p className="text-sm font-semibold text-slate-900">Available sizes</p><div className="mt-3 flex flex-wrap gap-2">{product.sizes.map((size) => <span key={size} className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600">{size}</span>)}</div></div>}{product.colors?.length > 0 && <div className="mt-5"><p className="text-sm font-semibold text-slate-900">Available colors</p><div className="mt-3 flex flex-wrap gap-2">{product.colors.map((color) => <span key={color} className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600">{color}</span>)}</div></div>}<div className="mt-8 flex gap-3"><div className="inline-flex h-11 items-center rounded-full border border-slate-200"><button type="button" disabled={quantity <= 1} onClick={() => setQuantity((value) => value - 1)} className="p-3 text-slate-500 hover:text-slate-950 disabled:opacity-30" aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button><span className="min-w-8 text-center text-sm font-semibold">{quantity}</span><button type="button" disabled={quantity >= product.countInStock} onClick={() => setQuantity((value) => value + 1)} className="p-3 text-slate-500 hover:text-slate-950 disabled:opacity-30" aria-label="Increase quantity"><Plus className="h-4 w-4" /></button></div><Button type="button" onClick={handleAdd} disabled={adding || product.countInStock < 1} className="h-11 flex-1 rounded-full">{added ? <><Check className="mr-2 h-4 w-4" /> Added to bag</> : <><ShoppingCart className="mr-2 h-4 w-4" /> {isAuthenticated ? adding ? "Adding..." : "Add to bag" : "Sign in to add"}</>}</Button></div></section></div></main>;
}
