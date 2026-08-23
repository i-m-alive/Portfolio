import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-5 px-6 text-center text-white bg-black">
      <p className="font-mono text-sm tracking-[0.2em] text-cyan-300/70">404</p>
      <h1 className="text-3xl font-extrabold md:text-4xl text-cyan-100">
        This planet is not on the map
      </h1>
      <p className="max-w-md text-white/60">
        The page you were looking for does not exist, or has drifted out of
        orbit.
      </p>
      <Link
        href="/"
        className="px-4 py-2 mt-2 text-sm font-semibold text-black transition-colors rounded bg-cyan-400 hover:bg-cyan-300"
      >
        Return to orbit
      </Link>
    </main>
  );
}
