import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { loginUser } from "@/store/auth-slice";
import { addToCart, fetchCart } from "@/store/cart-slice";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import loginPageHero from "../../assets/signup/loginHero.jpg";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const { register, handleSubmit, setError, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(data) {
    try {
      const user = await dispatch(loginUser(data)).unwrap();
      const pendingProduct = location.state?.cartProductId;
      if (pendingProduct) {
        await dispatch(addToCart({ productId: pendingProduct, productQuantity: location.state?.cartQuantity || 1 })).unwrap();
        await dispatch(fetchCart()).unwrap();
      }
      navigate(location.state?.from || (user?.role === "admin" ? "/admin/dashboard" : "/shopping/home"), { replace: true });
    } catch (error) {
      setError("root", { type: "server", message: typeof error === "string" ? error : "Login failed" });
    }
  }

  return (
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div className="relative hidden min-h-72 overflow-hidden lg:block">
        <img className="absolute inset-0 h-full w-full object-cover" src={loginPageHero} alt="" />
        <div className="absolute inset-0 bg-slate-950/35" />
        <div className="absolute bottom-10 left-10 max-w-sm text-white"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">Welcome back</p><h2 className="mt-3 text-4xl font-bold tracking-tight">Your next favorite is waiting.</h2><p className="mt-4 text-sm leading-6 text-white/80">Sign in to access your account, saved bag, and order history.</p></div>
      </div>
      <div className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">NOVA account</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Welcome back</h1><p className="mt-2 text-sm text-slate-500">Sign in to continue shopping.</p></div>
          <form className="flex w-full flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field><FieldLabel htmlFor="email">Email</FieldLabel><Input id="email" type="email" placeholder="you@example.com" {...register("email")} />{errors.email && <p className="text-sm text-rose-600">{errors.email.message}</p>}</Field>
              <Field><FieldLabel htmlFor="password">Password</FieldLabel><Input id="password" type="password" placeholder="Your password" {...register("password")} />{errors.password && <p className="text-sm text-rose-600">{errors.password.message}</p>}</Field>
            </FieldGroup>
            <Button type="submit" disabled={isLoading} className="h-11 w-full rounded-full">{isLoading ? "Signing in..." : "Sign in"}</Button>
            {errors.root && <div className="text-sm text-rose-600">{errors.root.message}</div>}
            <p className="flex flex-wrap justify-center gap-2 text-sm text-slate-500"><span>Don't have an account?</span><Link className="font-semibold text-slate-950 hover:underline" to="/auth/signup">Create one</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}
