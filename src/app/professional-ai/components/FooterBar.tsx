"use client";
import React from "react";

export default function FooterBar() {
  return (
    <footer className="p-4 mt-8 border rounded-lg border-cyan-400/6 bg-black/10">
      <div className="flex items-center justify-between">
        <div className="text-sm text-cyan-200/60">© {new Date().getFullYear()} Kumar Shivraj Bhakat</div>
        <div className="flex gap-3">
          <a href="mailto:bhakatshivraj2@gmail.com" className="text-sm text-cyan-200/75">Email</a>
          <a href="https://github.com/i-m-alive" target="_blank" rel="noreferrer" className="text-sm text-cyan-200/75">GitHub</a>
          <a href="https://www.linkedin.com/in/kumar-shivraj-bhakat-6403b7236" target="_blank" rel="noreferrer" className="text-sm text-cyan-200/75">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
