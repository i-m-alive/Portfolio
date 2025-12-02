"use client";

import React from "react";

export default function ArchitectureBlock({ imageSrc, alt = "Architecture diagram", explanation }: { imageSrc?: string; alt?: string; explanation?: string }) {
  return (
    <div className="bg-white/3 p-4 rounded-xl border border-white/6">
      {imageSrc ? (
        <img src={imageSrc} alt={alt} className="w-full h-auto rounded-md object-contain" />
      ) : (
        <div className="w-full h-44 flex items-center justify-center bg-black/40 rounded-md text-white/60">No diagram provided</div>
      )}

      <div className="mt-3 text-sm text-white/80">
        {explanation ?? "Add a step-by-step explanation of the architecture here."}
      </div>
    </div>
  );
}
