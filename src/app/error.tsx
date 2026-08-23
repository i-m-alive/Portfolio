"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-5 px-6 text-center text-white bg-black">
      <h1 className="text-2xl font-bold md:text-3xl text-cyan-100">
        Something went wrong
      </h1>
      <p className="max-w-md text-white/60">
        An unexpected error occurred while rendering this page.
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-white/35">ref {error.digest}</p>
      )}
      <button
        type="button"
        onClick={reset}
        className="px-4 py-2 mt-2 text-sm font-semibold text-black transition-colors rounded bg-cyan-400 hover:bg-cyan-300"
      >
        Try again
      </button>
    </main>
  );
}
