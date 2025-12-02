"use client";

import { motion } from "framer-motion";
import ParticleBackground from "@/app/components/Particles";
import { useEffect, useState } from "react";
import Image from "next/image";

const roles = [
  "AI/ML Engineer",
  "Deep Learning & NLP Specialist",
  "Graphite & Charcoal Artist",
  "Rapper & Lyricist",
  "Sports Enthusiast",
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Particles */}
      <ParticleBackground />

      {/* Main Container */}
      <div className="relative z-10 text-center flex flex-col items-center">
        {/* Glass Image Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="w-56 h-56 rounded-full overflow-hidden border border-cyan-400 shadow-[0_0_40px_rgba(0,255,255,0.4)] backdrop-blur-xl"
        >
            <Image
            src="/assets/profile.png"
            alt="Shivraj Profile"
            width={500}
            height={500}
            className="w-full h-full object-cover"
            />

        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-5xl font-bold mt-8"
        >
          Kumar Shivraj Bhakat
        </motion.h1>

        {/* Dynamic role animation */}
        <motion.h2
          key={roleIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl mt-4 text-cyan-300"
        >
          {roles[roleIndex]}
        </motion.h2>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex gap-6 mt-8"
        >
          <a
            href="Kumar_Shivraj_Bhakat_Resume.pdf"
            className="px-6 py-3 rounded-lg bg-cyan-500/20 border border-cyan-400 hover:bg-cyan-500/40 transition"
          >
            View Resume
          </a>

          <a
            href="#projects"
            className="px-6 py-3 rounded-lg bg-white/10 border border-white/30 hover:bg-white/20 transition"
          >
            View Projects
          </a>
        </motion.div>
      </div>
    </section>
  );
}
