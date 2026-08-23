// src/app/education/page.tsx
"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import DynamicCosmic from "@/app/components/DynamicCosmic";
import CenterBook from "./components/CenterBook";
import EducationBookModal from "./components/EducationBookModal";
import SolarPreview from "@/app/components/orbit/SolarPreview";

export default function EducationPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <DynamicCosmic />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-6xl">
          <header className="mb-10 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-300/50">
              Education
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl text-cyan-100 drop-shadow-lg">
              Shivraj&rsquo;s Education
            </h1>
            <p className="mt-3 text-sm text-cyan-200/55">
              A bound volume of chapters, marksheets and the degree. Open it to
              read.
            </p>
          </header>

          <div className="flex flex-col-reverse items-center justify-center gap-12 md:flex-row md:gap-16">
            <CenterBook onOpen={() => setOpen(true)} />
            <div style={{ width: 360 }} className="hidden md:block">
              <SolarPreview scale={0.88} height="320px" />
            </div>
          </div>
        </div>
      </main>

      {/*
        AnimatePresence has to live here, not inside the modal: the modal used
        to wrap itself, so unmounting it from this parent tore it out of the
        tree before any exit animation could run and closing was a hard cut.
      */}
      <AnimatePresence>
        {open && <EducationBookModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
