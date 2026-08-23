export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center min-h-screen bg-black"
    >
      <span className="sr-only">Loading</span>
      <span
        aria-hidden="true"
        className="w-10 h-10 border-2 rounded-full border-cyan-400 border-t-transparent animate-spin motion-reduce:animate-none"
      />
    </div>
  );
}
