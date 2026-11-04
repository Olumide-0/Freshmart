"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

function isRenderable(src) {
  if (src && typeof src === "object" && src.src) return true; // static import
  if (typeof src !== "string") return false;
  return src.startsWith("/") || /^https?:\/\/\S+$/i.test(src);
}

export default function ProductThumb({ src, alt, className = "h-[48px] w-[48px]" }) {
  // Remember which src failed, so a new src gets a fresh attempt without an effect.
  const [failedSrc, setFailedSrc] = useState(null);
  const showImage = isRenderable(src) && failedSrc !== src;

  return (
    <div className={`relative shrink-0 overflow-hidden rounded-[8px] border border-black/5 bg-gray-50 ${className}`}>
      {showImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="128px"
          // Typed paths/URLs skip the optimizer, so no remotePatterns config is needed.
          unoptimized={typeof src === "string"}
          onError={() => setFailedSrc(src)}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-gray-400">
          <ImageOff className="h-[40%] w-[40%]" strokeWidth={1.75} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
