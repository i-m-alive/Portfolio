// src/app/components/JsonLd.tsx
// Server Component — emits Person + WebSite structured data so search engines
// can associate this site with a named individual.
import { SITE_URL, PERSON } from "@/lib/site";

export default function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: PERSON.name,
        url: SITE_URL,
        image: `${SITE_URL}/profile.png`,
        jobTitle: PERSON.jobTitle,
        email: `mailto:${PERSON.email}`,
        sameAs: [PERSON.linkedin, PERSON.github],
        knowsAbout: [
          "Machine Learning",
          "Deep Learning",
          "Large Language Models",
          "Retrieval Augmented Generation",
          "Computer Vision",
          "MLOps",
          "Python",
          "PyTorch",
          "TensorFlow",
          "Azure",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${PERSON.name} — Portfolio`,
        description: `Portfolio of ${PERSON.name}, ${PERSON.jobTitle}.`,
        publisher: { "@id": `${SITE_URL}/#person` },
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
