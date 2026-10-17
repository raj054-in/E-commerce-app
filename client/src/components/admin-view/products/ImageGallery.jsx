import { useState } from "react";

// main image + clickable thumbnails (thumbnails only show when there are 2+ images)
export default function ImageGallery({ images = [], name }) {
  const [active, setActive] = useState(0);
  const main = images[active] || images[0];

  return (
    <div className="space-y-2">
      <div className="aspect-[4/3] overflow-hidden rounded-md bg-slate-100">
        {main ? (
          <img
            src={main.url}
            alt={main.altText || name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No image
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              type="button"
              key={img.url + i}
              onClick={() => setActive(i)}
              className={`h-12 w-12 shrink-0 overflow-hidden rounded border-2 transition ${
                i === active
                  ? "border-slate-900"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img.url}
                alt={img.altText || `${name} ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
