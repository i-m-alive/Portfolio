// src/app/projects/page.tsx
"use client";

import React from "react";
import ProjectsSection from "./components/Projects"; // your ProjectsSection component

export default function ProjectsPage() {
  return (
    <main className="w-full min-h-screen">
      <ProjectsSection />
    </main>
  );
}
