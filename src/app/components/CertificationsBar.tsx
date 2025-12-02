"use client";

import React from "react";
import Image from "next/image";

type Cert = {
  title: string;
  url?: string;
  image?: string; // local path like /education/ai-900.png
};

export default function CertificationsBar({ certs }: { certs: Cert[] }) {
  if (!certs || certs.length === 0) return null;

  return (
    <div>
      <h4 className="mb-3 text-lg font-semibold text-cyan-100">Certifications</h4>

      <div className="space-y-3">
        {certs.map((c, i) => (
          <a
            key={`${c.title}-${i}`}
            href={c.url ?? "#"}
            target={c.url ? "_blank" : undefined}
            rel={c.url ? "noreferrer" : undefined}
            className="flex items-center gap-4 p-3 transition border rounded-md border-cyan-400/6 bg-black/15 hover:bg-black/20"
          >
            <div className="flex items-center justify-center h-12 overflow-hidden border rounded-md w-14 bg-black/10 border-cyan-400/6">
              {c.image ? (
                <Image src={c.image} alt={c.title} width={84} height={48} style={{ objectFit: "contain" }} />
              ) : (
                <div className="text-xs text-cyan-200/70">Badge</div>
              )}
            </div>

            <div className="flex-1">
              <div className="text-sm font-semibold leading-tight text-cyan-100">{c.title}</div>
              {c.url && <div className="mt-1 text-xs text-cyan-200/70">View certificate</div>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
