"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type PrefetchDetail = {
  href: string;
};

export default function RoutePrefetchListener() {
  const router = useRouter();

  useEffect(() => {
    const onPrefetch = (e: Event) => {
      const ev = e as CustomEvent<PrefetchDetail>;
      const href = ev.detail?.href;

      if (!href) return;

      // Next's router type doesn't expose `prefetch`, so we guard + cast
      const r = router as any;
      if (typeof r?.prefetch === "function") {
        (r.prefetch as (href: string) => Promise<void>)(href).catch(() => {});
      }
    };

    window.addEventListener("prefetch-route", onPrefetch);

    return () => {
      window.removeEventListener("prefetch-route", onPrefetch);
    };
  }, [router]);

  return null;
}
