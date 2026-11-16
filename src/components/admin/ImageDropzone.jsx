"use client";

import { useRef, useState } from "react";
import { ImageUp, Loader2 } from "lucide-react";
import ProductThumb from "@/components/admin/ProductThumb";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/admin/uploadImage";

// The product form's image box: preview, "Choose image" and drag and drop.
// The upload itself happens in the form (onFile), which also handles Ctrl+V.
export default function ImageDropzone({ src, alt, uploading, error, onFile }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const hasFiles = (e) => Array.from(e.dataTransfer?.types ?? []).includes("Files");

  return (
    <div className="flex flex-col gap-[8px]">
      <div
        onDragEnter={(e) => {
          if (!hasFiles(e)) return;
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          if (!hasFiles(e)) return;
          e.preventDefault(); // allow the drop
          e.dataTransfer.dropEffect = "copy";
        }}
        onDragLeave={(e) => {
          // Ignore leaving into a child element.
          if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
        }}
        onDrop={(e) => {
          if (!hasFiles(e)) return;
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) onFile(file);
        }}
        className={`relative rounded-[8px] ${dragging ? "ring-2 ring-[#2F5D3A] ring-offset-2" : ""}`}
      >
        <ProductThumb src={src} alt={alt} className="h-[180px] w-full" />

        {(dragging || uploading) && (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-[6px] rounded-[8px] text-[13px] font-semibold ${
              uploading ? "bg-white/70 text-[#1F2937]" : "border-2 border-dashed border-[#2F5D3A] bg-[#E6F0E1]/90 text-[#2F5D3A]"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="h-[22px] w-[22px] animate-spin" strokeWidth={2} />
                Uploading…
              </>
            ) : (
              <>
                <ImageUp className="h-[22px] w-[22px]" strokeWidth={2} />
                Drop to upload
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[4px]">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-[6px] rounded-[8px] border border-[#D8DADD] bg-white px-[12px] py-[8px] text-[14px] font-semibold text-[#1F2937] hover:bg-black/5 disabled:opacity-60"
        >
          <ImageUp className="h-[16px] w-[16px]" strokeWidth={2} />
          Choose image
        </button>
        <span className="text-[12px] text-gray-500">or drop / paste one. JPG, PNG or WebP, max 2 MB.</span>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = ""; // choosing the same file again still fires
            if (file) onFile(file);
          }}
        />
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {uploading ? "Uploading image…" : ""}
      </p>
      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
