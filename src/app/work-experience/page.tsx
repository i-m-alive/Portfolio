// src/app/education/page.tsx
"use client";

import React, { useState } from "react";
import DynamicCosmic from "@/app/components/DynamicCosmic";
import TimelineZigzag from "./components/TimelineZigzag";
import ExperienceModalParallax from "./components/ExperienceModalParallax";
import SolarPreview from "@/app/components/orbit/SolarPreview";
import type { Exp } from "./components/ExperienceModalParallax"; 

const EXPERIENCES: Exp[] = [
  {
    id: "e1",
    company: "Navikenz",
    title: "Software Engineer (Full-time)",
    type: "Full-time",
    period: "Oct 2025 - Present",
    location: "Bengaluru, India",
    summary: "Promoted to full-time after a 7-month internship; building AI-driven solutions and agentic projects.",
    skills: ["Langgraph", "Agentic", "Python", "LLMs"],
    avatar: "/work/avatar2.png",
    companyLogo: "/education/navikenz-intern.png",
  },
  {
    id: "e2",
    company: "Navikenz",
    title: "Software Engineer (Internship)",
    period: "Mar 2025 - Sep 2025",
    type: "Internship",
    location: "Bengaluru, India (Hybrid)",
    summary: "7-month internship as a Software Engineer: worked on backend services, model integration and data pipelines.",
    skills: ["APIs","Docker","ML Ops"],
    avatar: "/work/avatar1.png",
    companyLogo: "/education/navikenz-intern.png",
  },
  {
    id: "e3",
    company: "Futurense Technologies",
    title: "Intern",
    period: "Jun 2024 - Aug 2024",
    type: "Internship",
    location: "On-site",
    summary: "Worked on LLM prototypes and data visualizations.",
    skills: ["LLMs","DataViz","Python"],
    avatar: "/work/avatar3.png",
    companyLogo: "/education/futurense.png",
  },
  {
    id: "e4",
    company: "Capabl India",
    title: "Full-stack Developer (Intern)",
    period: "Jul 2023 - Aug 2023",
    type: "Internship",
    location: "Remote",
    summary: "Hands-on experience in Python & Java.",
    skills: ["Java","React","APIs"],
    avatar: "/work/avatar4.png",
    companyLogo: "/education/capabl.png",
  },
];

export default function WorkExperiencePage() {
  const [selected, setSelected] = useState<Exp | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0 z-0 pointer-events-none"><DynamicCosmic /></div>

      <main className="relative z-10 p-8">
        {/* Title + SolarPreview grouped so preview stays with the section */}
        <div className="flex flex-col w-full gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-extrabold md:text-4xl text-cyan-200">Work Experience</h1>

          {/* SolarPreview sits with the section, responsive sizing and placement */}
          <div className="order-1 w-full md:order-2 md:w-auto md:ml-6">
            <div className="flex items-center justify-end">
              {/* Desktop/tablet: show larger preview. On small screens, it becomes smaller and stacks under the title */}
              <div className="pointer-events-auto">
                <SolarPreview
                  // larger on desktop; SolarPreview implements interactive children
                  scale={0.6}
                  height="220px"
                
                  
                />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline (no SolarPreview inside it now) */}
        <TimelineZigzag experiences={EXPERIENCES} onOpen={(exp) => setSelected(exp)} />
      </main>

      <ExperienceModalParallax exp={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
