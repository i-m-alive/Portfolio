"use client";

import React from "react";
import Image from "next/image";
import SolarPreview from "@/app/components/orbit/SolarPreview"; // adjust path if needed

export default function TopRightPanel() {
  return (
    <div className="space-y-6">
      {/* Hobbies box */}
      <div className="p-3 border rounded-xl bg-gradient-to-r from-sky-900/30 to-black/30 border-cyan-400/8">
        <div className="text-xs text-cyan-200/60">Hobbies</div>
        <div className="font-semibold text-cyan-100">Sketch · Rap · Sports</div>
      </div>

      {/* badges */}
      <div className="flex items-center gap-4">
        {/* Badge 1 */}
        <div
          className="flex flex-col items-center justify-center overflow-hidden border rounded-full w-28 h-28 bg-black/40 border-cyan-400/8"
          role="img"
          aria-label="AI-102 badge"
        >
          <div className="relative w-20 h-20">
            <Image
              src="/badges/ai-102-card.png"
              alt="AI-102 Badge"
              fill
              style={{ objectFit: "contain" }}
              sizes="80px"
            />
          </div>

        </div>

        {/* Badge 2 */}
        <div
          className="flex flex-col items-center justify-center overflow-hidden border rounded-full w-28 h-28 bg-black/40 border-cyan-400/8"
          role="img"
          aria-label="AI-900 badge"
        >
          <div className="relative w-20 h-20">
            <Image
              src="/badges/ai-900-card.png"
              alt="AI-900 Badge"
              fill
              style={{ objectFit: "contain" }}
              sizes="80px"
            />
          </div>
        </div>
      </div>

      {/* solar preview circle */}
      <div className="relative w-[400px] h-[400px] rounded-full bg-black/20 border border-cyan-400/6 flex items-center justify-center overflow-hidden">
        <div className="absolute w-[260px] h-[260px] rounded-full border border-cyan-400/8 opacity-10" />
        <div className="absolute w-[200px] h-[200px] rounded-full border border-cyan-400/6 opacity-60" />

        <div className="z-10 w-[350px] h-[350px] rounded-full overflow-hidden border border-cyan-400/8">
          <SolarPreview scale={0.9} height="350px" />
        </div>
      </div>
    </div>
  );
}
