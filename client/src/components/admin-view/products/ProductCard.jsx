import { Button } from "@/components/ui/button";
import ImageGallery from "./ImageGallery";

export default function ProductCard({ product, onDetail, onEdit, onDelete }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="p-3 pb-0">
        <ImageGallery images={product.images} name={product.name} />
      </div>

      <div className="flex-1 space-y-1 p-4">
        <h3 className="truncate font-medium text-slate-900">{product.name}</h3>
        <p className="truncate text-xs text-slate-500">
          {product.category} · SKU {product.sku}
        </p>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900">
            Rs. {product.discountPrice || product.price}
          </span>
          {product.discountPrice ? (
            <span className="text-sm text-slate-400 line-through">
              Rs. {product.price}
            </span>
          ) : null}
        </div>

        <p className="text-xs text-slate-600">
          Stock: {product.countInStock}
          {product.isPublished ? "" : " · Draft"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 p-4 pt-0">
        <Button size="sm" variant="outline" onClick={() => onDetail(product)}>
          Detail
        </Button>
        <Button size="sm" onClick={() => onEdit(product)}>
          Update
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => onDelete(product._id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
