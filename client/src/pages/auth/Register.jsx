import { useEffect, useState } from "react";
import { ImagePlus, UserRound } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { signUpUser } from "@/store/auth-slice";
import { addToCart, fetchCart } from "@/store/cart-slice";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import signUpPageHero from "../../assets/signup/signupHero2.jpg";

const schema = z.object({
  name: z.string().min(2, "Name must be longer than 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  avatar: z.any().optional(),
});

export default function Register() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const [avatarPreview, setAvatarPreview] = useState("");
  const { register, handleSubmit, setError, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  async function onSubmit(data) {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (data.avatar?.[0]) formData.append("avatar", data.avatar[0]);

      await dispatch(signUpUser(formData)).unwrap();
      const pendingProduct = location.state?.cartProductId;
      if (pendingProduct) {
        await dispatch(addToCart({ productId: pendingProduct, productQuantity: location.state?.cartQuantity || 1 })).unwrap();
        await dispatch(fetchCart()).unwrap();
      }
      navigate(location.state?.from || "/shopping/home", { replace: true });
    } catch (error) {
      setError("root", { type: "server", message: typeof error === "string" ? error : "Signup failed" });
    }
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(file ? URL.createObjectURL(file) : "");
  }

  return (
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div className="relative hidden min-h-72 overflow-hidden lg:block">
        <img className="absolute inset-0 h-full w-full object-cover" src={signUpPageHero} alt="" />
        <div className="absolute inset-0 bg-slate-950/35" />
        <div className="absolute bottom-10 left-10 max-w-sm text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">NOVA membership</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">Make your everyday feel more like you.</h2>
          <p className="mt-4 text-sm leading-6 text-white/80">Create an account to save your bag, track orders, and keep your profile close.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Welcome to NOVA</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Create your account</h1>
            <p className="mt-2 text-sm text-slate-500">A few details and you are ready to shop.</p>
          </div>
          <form className="flex w-full flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="form-name">Name</FieldLabel>
                <Input id="form-name" type="text" placeholder="Full name" {...register("name")} />
                {errors.name && <p className="text-sm text-rose-600">{errors.name.message}</p>}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                {errors.email && <p className="text-sm text-rose-600">{errors.email.message}</p>}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" placeholder="At least 8 characters" {...register("password")} />
                {errors.password && <p className="text-sm text-rose-600">{errors.password.message}</p>}
              </Field>
              <Field>
                <FieldLabel htmlFor="avatar">Profile photo <span className="font-normal text-slate-400">(optional)</span></FieldLabel>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-slate-400">
                    {avatarPreview ? <img src={avatarPreview} alt="Profile preview" className="h-full w-full object-cover" /> : <UserRound className="h-7 w-7" />}
                  </div>
                  <label htmlFor="avatar" className="flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 text-sm font-medium text-slate-600 transition hover:border-slate-500 hover:text-slate-950">
                    <ImagePlus className="h-4 w-4" /> Choose an image
                  </label>
                </div>
                <Input id="avatar" type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" {...register("avatar", { onChange: handleAvatarChange })} />
                <p className="text-xs text-slate-400">JPG, PNG, or WEBP up to 2 MB.</p>
              </Field>
            </FieldGroup>
            <Button type="submit" disabled={isLoading} className="h-11 w-full rounded-full">{isLoading ? "Creating account..." : "Create account"}</Button>
            {errors.root && <div className="text-sm text-rose-600">{errors.root.message}</div>}
            <p className="flex flex-wrap justify-center gap-2 text-sm text-slate-500"><span>Already have an account?</span><Link className="font-semibold text-slate-950 hover:underline" to="/auth/login">Log in</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}
