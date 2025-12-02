"use client";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#00080b] text-slate-100 antialiased">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
