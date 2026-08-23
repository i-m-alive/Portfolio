/**
 * Canonical origin for the deployed site.
 *
 * Set NEXT_PUBLIC_SITE_URL in the host environment (Vercel project settings)
 * to the real domain. Everything that builds absolute URLs — metadataBase,
 * sitemap, robots, JSON-LD, Open Graph images — reads from here, so there is
 * exactly one place to change when the domain is decided.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://kumarshivrajbhakat.vercel.app"
).replace(/\/$/, "");

export const PERSON = {
  name: "Kumar Shivraj Bhakat",
  jobTitle: "AI/ML Engineer",
  email: "bhakatshivraj2@gmail.com",
  linkedin: "https://www.linkedin.com/in/kumar-shivraj-bhakat-6403b7236/",
  github: "https://github.com/i-m-alive",
} as const;
