import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

const navClass = ({ isActive }) =>
  `text-sm font-medium transition ${isActive ? "text-slate-950" : "text-slate-500 hover:text-slate-950"}`;

export default function ShoppingHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0);

  async function handleLogout() {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/shopping/home", { replace: true });
    } catch {
      navigate("/shopping/home", { replace: true });
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <Link to="/shopping/home" className="flex shrink-0 items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">N</span>
          <span className="text-lg font-bold tracking-tight text-slate-950">NOVA</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/shopping/home" className={navClass}>Home</NavLink>
          <NavLink to="/shopping/listing" className={navClass}>Shop</NavLink>
          <a href="/shopping/home#featured" className="text-sm font-medium text-slate-500 transition hover:text-slate-950">Featured</a>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link to="/shopping/listing" className="hidden rounded-full p-2 text-slate-600 transition hover:bg-slate-100 sm:block" aria-label="Search products"><Search className="h-5 w-5" /></Link>
          <Link to={isAuthenticated ? "/shopping/account" : "/auth/login"} className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-slate-600 transition hover:bg-slate-100" aria-label={isAuthenticated ? "Account" : "Sign in"}>{user?.image ? <img src={user.image} alt={user.name || "Profile"} className="h-full w-full object-cover" /> : <UserRound className="h-5 w-5" />}</Link>
          <Link to={isAuthenticated ? "/shopping/cart" : "/auth/login"} className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100" aria-label="Shopping cart">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-950 px-1 text-[10px] font-bold text-white">{cartCount > 99 ? "99+" : cartCount}</span>}
          </Link>
          {isAuthenticated ? (
            <button type="button" onClick={handleLogout} disabled={isLoading} className="ml-1 hidden items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950 lg:flex"><span className="max-w-24 truncate">{user?.name?.split(" ")[0] || "Account"}</span><LogOut className="h-3.5 w-3.5 shrink-0" /></button>
          ) : (
            <Link to="/auth/login" className="ml-1 hidden rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 lg:block">Sign in</Link>
          )}
          <button type="button" onClick={() => setMobileOpen((open) => !open)} className="rounded-full p-2 text-slate-600 hover:bg-slate-100 md:hidden" aria-label="Toggle menu">{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-4">
            <NavLink to="/shopping/home" className={navClass} onClick={() => setMobileOpen(false)}>Home</NavLink>
            <NavLink to="/shopping/listing" className={navClass} onClick={() => setMobileOpen(false)}>Shop</NavLink>
            <Link to={isAuthenticated ? "/shopping/account" : "/auth/login"} className="text-sm font-medium text-slate-500" onClick={() => setMobileOpen(false)}>{isAuthenticated ? "My account" : "Sign in"}</Link>
            {isAuthenticated && <button type="button" onClick={handleLogout} className="flex items-center gap-2 text-left text-sm font-medium text-rose-600"><LogOut className="h-4 w-4" /> Log out</button>}
          </nav>
        </div>
      )}
    </header>
  );
}
