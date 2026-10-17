import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductCard from "@/components/admin-view/products/ProductCard";
import ProductForm from "@/components/admin-view/products/ProductForm";
import ProductDetail from "@/components/admin-view/products/ProductDetail";
import { fetchProducts, deleteProduct } from "@/store/product-slice";

const LIMIT = 8;

// 1 ... 4 5 6 ... 20  (keeps the bar short on phones)
function pageList(page, total) {
  const nums = [...new Set([1, total, page - 1, page, page + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) out.push("...");
    out.push(n);
  });
  return out;
}

export default function AdminProducts() {
  const dispatch = useDispatch();
  const { products, totalPages, isLoading } = useSelector((state) => state.product);

  const [page, setPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = add mode
  const [detail, setDetail] = useState(null);

  const load = () => dispatch(fetchProducts({ page, limit: LIMIT }));

  useEffect(() => {
    load();
  }, [page]);

  function openAdd() {
    setEditing(null);
    setSheetOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    setSheetOpen(true);
  }

  function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return;

    dispatch(deleteProduct(id))
      .unwrap()
      .then(() => {
        if (products.length === 1 && page > 1) setPage(page - 1);
        else load();
      })
      .catch((err) => {
        const message =
          typeof err === "string"
            ? err
            : err?.message || err?.error || "Unable to delete product";

        alert(message);
      });
  }

  function handleSaved() {
    setSheetOpen(false);
    load();
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
        <Button onClick={openAdd} className="w-full sm:w-auto">
          Add product
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-slate-500">
          {isLoading ? "Loading products..." : "No products yet. Add your first one."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDetail={setDetail}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* pagination */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          aria-label="Previous page"
        >
          ‹
        </Button>

        {pageList(page, totalPages).map((n, i) =>
          n === "..." ? (
            <span key={`dots-${i}`} className="px-1 text-slate-400">
              ...
            </span>
          ) : (
            <Button
              key={n}
              size="sm"
              variant={n === page ? "default" : "outline"}
              onClick={() => setPage(n)}
            >
              {n}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          aria-label="Next page"
        >
          ›
        </Button>
      </div>

      {/* add / update form */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto bg-white sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{editing ? "Update product" : "Add product"}</SheetTitle>
            <SheetDescription>
              {editing
                ? "Change the fields you need and save."
                : "Fill in the details to add a product to your store."}
            </SheetDescription>
          </SheetHeader>

          <div className="px-4 pb-6">
            <ProductForm
              key={editing?._id || "new"}
              product={editing}
              onDone={handleSaved}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* product detail with all images */}
      <Dialog open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{detail?.name}</DialogTitle>
          </DialogHeader>
          {detail && <ProductDetail product={detail} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
