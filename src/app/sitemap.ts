import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1.0 },
  { path: "/professional-ai", priority: 0.9 },
  { path: "/work-experience", priority: 0.9 },
  { path: "/projects", priority: 0.9 },
  { path: "/skills", priority: 0.8 },
  { path: "/professional", priority: 0.8 },
  { path: "/certificates", priority: 0.7 },
  { path: "/education", priority: 0.7 },
  { path: "/contact", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority,
  }));
}
