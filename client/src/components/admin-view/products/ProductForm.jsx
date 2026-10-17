import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { addNewProduct, updateProduct } from "@/store/product-slice";

// [field name, label, input type]
const fields = [
  ["name", "Name *"],
  ["sku", "SKU *"],
  ["price", "Price *", "number"],
  ["discountPrice", "Discount Price", "number"],
  ["countInStock", "Count In Stock *", "number"],
  ["rating", "Rating", "number"],
  ["category", "Category *"],
  ["brand", "Brand"],
  ["collections", "Collections *"],
  ["material", "Material"],
  ["sizes", "Sizes * (comma separated)"],
  ["colors", "Colors * (comma separated)"],
  ["tags", "Tags (comma separated)"],
  ["weight", "Weight", "number"],
];

const toText = (v) => (Array.isArray(v) ? v.join(", ") : v ?? "");

export default function ProductForm({ product, onDone }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.product);
  const isEdit = Boolean(product);
  const [previews, setPreviews] = useState([]); // newly picked files

  // free the temporary preview URLs when they change or the form closes
  useEffect(
    () => () => previews.forEach((p) => URL.revokeObjectURL(p.url)),
    [previews]
  );

  // images must NOT go into defaultValues: a file input can't be given a value
  const { images: _existing, ...rest } = product || {};

  const { register, handleSubmit } = useForm({
    defaultValues: product
      ? {
          ...rest,
          discountPrice: product.discountPrice ?? "",
          rating: product.rating ?? "",
          weight: product.weight ?? "",
          brand: product.brand ?? "",
          material: product.material ?? "",
          gender: product.gender ?? "",
          sizes: toText(product.sizes),
          colors: toText(product.colors),
          tags: toText(product.tags),
          length: product.dimensions?.length ?? "",
          width: product.dimensions?.width ?? "",
          height: product.dimensions?.height ?? "",
        }
      : { isPublished: true },
  });

  function onSubmit(data) {
    const { images, length, width, height, ...values } = data;
    const formData = new FormData();

    [...fields.map(([key]) => key), "description", "gender", "isFeatured", "isPublished"].forEach(
      (key) => {
        if (values[key] !== "" && values[key] != null) formData.append(key, values[key]);
      }
    );

    if (length || width || height) {
      formData.append("dimensions", JSON.stringify({ length, width, height }));
    }

    // The server route expects every selected file under "productImage".
    // (empty on update = backend keeps the current images)
    Array.from(images || []).forEach((file) => formData.append("productImage", file));

    const action = isEdit
      ? updateProduct({ id: product._id, formData })
      : addNewProduct(formData);

    dispatch(action)
      .unwrap()
      .then(() => onDone())
      .catch((err) => {
        const message =
          typeof err === "string"
            ? err
            : err?.message || err?.error || "Unable to save product";

        alert(message);
      });
  }

  const shownImages = previews.length
    ? previews
    : isEdit
    ? (product.images || []).map((img) => ({ url: img.url, name: img.altText }))
    : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map(([name, label, type = "text"]) => (
          <div key={name} className="space-y-1">
            <Label className="text-slate-700">{label}</Label>
            <Input type={type} step="any" className="bg-white" {...register(name)} />
          </div>
        ))}

        <div className="space-y-1">
          <Label className="text-slate-700">Gender</Label>
          <select
            className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
            {...register("gender")}
          >
            <option value="">Select</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {["length", "width", "height"].map((d) => (
          <div key={d} className="space-y-1">
            <Label className="capitalize text-slate-700">{d}</Label>
            <Input type="number" step="any" className="bg-white" {...register(d)} />
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <Label className="text-slate-700">Description *</Label>
        <textarea
          rows={4}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          {...register("description")}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-slate-700">{isEdit ? "Replace images (optional)" : "Images *"}</Label>
        <Input
          type="file"
          multiple
          accept="image/*"
          className="bg-white"
          {...register("images", {
            onChange: (e) =>
              setPreviews(
                Array.from(e.target.files).map((f) => ({
                  url: URL.createObjectURL(f),
                  name: f.name,
                }))
              ),
          })}
        />
        <p className="text-xs text-slate-500">
          Select several files at once (hold Ctrl or Shift).
          {isEdit && " Picking new images replaces all current ones."}
        </p>

        {shownImages.length > 0 && (
          <div>
            <p className="mb-1 text-xs font-medium text-slate-600">
              {previews.length ? "New images" : "Current images"} ({shownImages.length})
            </p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {shownImages.map((img, i) => (
                <img
                  key={img.url + i}
                  src={img.url}
                  alt={img.name || `Image ${i + 1}`}
                  className="aspect-square w-full rounded-md border border-slate-200 object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" {...register("isFeatured")} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" {...register("isPublished")} /> Published
        </label>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : isEdit ? "Save changes" : "Add product"}
      </Button>
    </form>
  );
}
