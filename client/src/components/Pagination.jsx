import { ChevronLeft, ChevronRight } from "lucide-react";

const base =
  "inline-flex h-9 items-center justify-center rounded-md border text-sm font-medium transition-colors";
const idle = "border-slate-300 bg-white text-slate-700 hover:bg-slate-100";
const current = "border-slate-900 bg-slate-900 text-white shadow-sm";
const disabled = "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300";

// 1 ... 4 5 6 ... 20
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

export default function Pagination({ page, totalPages, onChange }) {
  const atStart = page <= 1;
  const atEnd = page >= totalPages;

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          disabled={atStart}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
          className={`${base} gap-1 px-3 ${atStart ? disabled : idle}`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {pageList(page, totalPages).map((n, i) =>
          n === "..." ? (
            <span key={`dots-${i}`} className="px-1 text-slate-400">
              ...
            </span>
          ) : (
            <button
              type="button"
              key={n}
              onClick={() => onChange(n)}
              aria-current={n === page ? "page" : undefined}
              className={`${base} min-w-9 px-3 ${n === page ? current : idle}`}
            >
              {n}
            </button>
          )
        )}

        <button
          type="button"
          disabled={atEnd}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
          className={`${base} gap-1 px-3 ${atEnd ? disabled : idle}`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Page {page} of {totalPages}
      </p>
    </nav>
  );
}
