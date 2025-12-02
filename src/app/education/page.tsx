// src/app/education/page.tsx
"use client";

import React, { useState } from "react";
import DynamicCosmic from "@/app/components/DynamicCosmic";
import CenterBook from "./components/CenterBook";
import EducationBookModal from "./components/EducationBookModal";
import SolarPreview from "@/app/components/orbit/SolarPreview";

export default function EducationPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0 z-0 pointer-events-none"><DynamicCosmic /></div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-6xl">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold md:text-4xl text-cyan-200 drop-shadow-lg">Shivraj's Education — Visual Book</h1>
            <p className="mt-2 text-cyan-200/60">Click the big floating book to open.</p>
          </header>

          <div className="flex flex-col-reverse items-center justify-center gap-8 md:flex-row">
            <div><CenterBook onOpen={() => setOpen(true)} /></div>
            <div style={{ width: 360 }} className="hidden md:block">
              <SolarPreview scale={0.88} height="320px" />
            </div>
          </div>
        </div>
      </main>

      {open && <EducationBookModal onClose={() => setOpen(false)} />}
    </div>
  );
}
