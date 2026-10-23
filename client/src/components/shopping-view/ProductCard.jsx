import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Check, ShoppingCart, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { addToCart, fetchCart } from "@/store/cart-slice";

const money = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const image = product.images?.[0]?.url;

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate("/auth/login", {
        state: {
          from: `${location.pathname}${location.search}`,
          cartProductId: product._id,
          cartQuantity: 1,
        },
      });
      return;
    }

    setIsAdding(true);
    try {
      await dispatch(addToCart({ productId: product._id, productQuantity: 1 })).unwrap();
      await dispatch(fetchCart()).unwrap();
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1800);
    } catch (error) {
      window.alert(typeof error === "string" ? error : "Unable to add this product");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/shopping/products/${product._id}`} className="relative block aspect-[4/5] overflow-hidden bg-slate-100">
        {image ? (
          <img src={image} alt={product.images?.[0]?.altText || product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl font-bold text-slate-300">{product.name?.[0]}</div>
        )}
        {product.isFeatured && <span className="absolute left-3 top-3 rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">Featured</span>}
        {hasDiscount && <span className="absolute right-3 top-3 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white">Sale</span>}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-1 text-xs text-amber-500">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span>{Number(product.rating || 0).toFixed(1)}</span>
        </div>
        <Link to={`/shopping/products/${product._id}`} className="line-clamp-1 text-base font-semibold text-slate-900 hover:text-slate-600">{product.name}</Link>
        <p className="mt-1 line-clamp-1 text-sm text-slate-500">{product.category} · {product.brand || "Everyday essential"}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="font-bold text-slate-950">{money(price)}</p>
            {hasDiscount && <p className="text-xs text-slate-400 line-through">{money(product.price)}</p>}
          </div>
          <Button type="button" size="sm" onClick={handleAddToCart} disabled={isAdding || product.countInStock < 1} className="gap-1.5">
            {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
            {product.countInStock < 1 ? "Sold out" : added ? "Added" : isAdding ? "Adding" : isAuthenticated ? "Add" : "Sign in"}
          </Button>
        </div>
      </div>
    </article>
  );
}
