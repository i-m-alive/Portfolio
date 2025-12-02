"use client";

import React from "react";
import SkillTag from "@/app/components/SkillTag";
import CloudBadge from "@/app/components/CloudBadge";
import TechIcon from "@/app/components/TechIcon";
import AccessibilityToggle from "@/app/components/AccessibilityToggle";
import { motion } from "framer-motion";

// Example mapping of skill -> project anchor / page
const skillLinks: Record<string, string> = {
  "Transformers (BERT / LLaMA)": "/projects/transformers",
  "LangChain & RAG": "/projects/langchain-rag",
  "PyTorch / Hugging Face": "/projects/hf-pytorch",
  "MLOps (Docker, CI/CD)": "/projects/mlops",
};

export default function ProfessionalSummary() {
  // you can compute deployed services dynamically if you have real endpoints
  const deployedAWS = 1;
  const deployedAzure = 2;
  const deployedgcp =1;

  return (
    <section id="professional" className="w-full py-20 px-6 md:px-16 lg:px-32 bg-gradient-to-b from-black/80 to-black/90 relative">
      <AccessibilityToggle />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left: summary card */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white/3 p-6 rounded-2xl border border-white/6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold">Who I am</h3>
              <p className="mt-3 text-sm text-white/80">
                I&apos;m <strong>Kumar Shivraj Bhakat</strong>, an AI/ML Engineer specialized in Transformer architectures,
                production ML pipelines, and NLP systems. I design end-to-end MLOps solutions and build scalable
                models for real-world applications.
              </p>
            </div>

            {/* micro-info / badge */}
            <div className="text-right">
              <div className="text-xs text-white/50">Location</div>
              <div className="font-semibold">Nagpur, India</div>
            </div>
          </div>

          <h4 className="mt-5 text-lg font-semibold">What I do</h4>
          <ul className="mt-2 list-disc pl-5 text-sm text-white/80 space-y-1">
            <li>Design & deploy Transformer-based NLP models (BERT, LLaMA)</li>
            <li>Build RAG pipelines with LangChain + FAISS</li>
            <li>MLOps with Docker, CI/CD, Azure & AWS deployments</li>
          </ul>

          <h4 className="mt-5 text-lg font-semibold">Mission</h4>
          <p className="mt-2 text-sm text-white/80">Create production-grade, responsible AI systems that solve domain problems and are maintainable at scale.</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="/Kumar_Shivraj_Bhakat_Resume.docx"
              download
              className="px-4 py-2 rounded-lg border border-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 transition"
            >
              Download Resume
            </a>

            <a
              href="#projects"
              className="px-4 py-2 rounded-lg border border-white/12 bg-white/6 hover:bg-white/10 transition"
            >
              See Projects
            </a>
          </div>
        </motion.div>

        {/* Middle: Skill tags (clickable) */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <motion.h4
            initial={{ y: 8, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg font-semibold"
          >
            Key Skills
          </motion.h4>

          <div className="grid grid-cols-1 gap-3">
            <SkillTag name="Transformers (BERT / LLaMA)" level={88} href={skillLinks["Transformers (BERT / LLaMA)"]} />
            <SkillTag name="LangChain & RAG" level={84} href={skillLinks["LangChain & RAG"]} />
            <SkillTag name="PyTorch / Hugging Face" level={82} href={skillLinks["PyTorch / Hugging Face"]} />
            <SkillTag name="MLOps (Docker, CI/CD)" level={76} href={skillLinks["MLOps (Docker, CI/CD)"]} />
          </div>
        </div>

        {/* Right: Cloud & Tech */}
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex gap-4 items-center"
          >
            <CloudBadge provider="aws" deployed={deployedAWS} />
            <CloudBadge provider="azure" deployed={deployedAzure} />
            <CloudBadge provider="gcp" deployed={deployedgcp} />
          </motion.div>

          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4">AI/ML Stack</h4>
            <div className="flex flex-wrap gap-4">
              <TechIcon name="Python" />
              <TechIcon name="PyTorch" />
              <TechIcon name="TensorFlow" />
              <TechIcon name="HuggingFace" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
