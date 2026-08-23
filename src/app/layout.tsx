import "./globals.css";
import type { Metadata, Viewport } from "next";
import PageReadySignal from "@/app/components/PageReadySignal";
import ClientOverlays from "./components/ClientOverlays";
import SiteNav from "./components/SiteNav";
import JsonLd from "./components/JsonLd";
import { SITE_URL, PERSON } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${PERSON.name} — ${PERSON.jobTitle}`,
    template: `%s | ${PERSON.name}`,
  },
  description:
    "Portfolio of Kumar Shivraj Bhakat — AI/ML Engineer specialising in LLMs, RAG systems, deep learning and MLOps on AWS and Azure.",
  keywords: [
    "Kumar Shivraj Bhakat",
    "AI Engineer",
    "ML Engineer",
    "Machine Learning",
    "Deep Learning",
    "LLM",
    "RAG",
    "MLOps",
    "PyTorch",
    "TensorFlow",
    "Python",
    "Azure",
    "Portfolio",
  ],
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: PERSON.name,
    title: `${PERSON.name} — ${PERSON.jobTitle}`,
    description:
      "AI/ML Engineer building LLM, RAG and computer-vision systems. Explore projects, skills and experience.",
    images: [
      {
        url: "/social.png",
        width: 512,
        height: 512,
        alt: `${PERSON.name} — ${PERSON.jobTitle}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PERSON.name} — ${PERSON.jobTitle}`,
    description:
      "AI/ML Engineer building LLM, RAG and computer-vision systems.",
    images: ["/social.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/profile.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased text-white bg-black">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <JsonLd />
        <SiteNav />
        <PageReadySignal />
        <ClientOverlays />
        <div id="main-content" tabIndex={-1} className="site-content">
          {children}
        </div>
      </body>
    </html>
  );
}
