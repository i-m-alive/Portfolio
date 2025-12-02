"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ProjectModalLauncher({
  title,
  children,
  trigger,
}: {
  title: string;
  children: React.ReactNode;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      {open && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.18 }} className="bg-black/90 p-6 rounded-xl max-w-2xl w-full">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold">{title}</h3>
              <button onClick={() => setOpen(false)} className="text-sm text-white/60">Close</button>
            </div>

            <div className="mt-4 text-sm text-white/80">{children}</div>
          </motion.div>
        </div>
      )}
    </>
  );
}
