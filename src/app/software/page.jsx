'use client';

import Link from 'next/link';
import Layout from '@layout/Layout';
import "@styles/main.css";

export default function SoftwarePage() {
  const platforms = [
    {
      name: "MAYA (Multistage Analysis prokarYotic Annotations)",
      badge: "Flagship AI Suite",
      desc: "An end-to-end, LLM-enhanced pipeline for automated bacterial, viral, and fungal genome annotation. MAYA integrates structural gene prediction, functional domain assignment, and novel biosynthetic gene cluster (BGC) identification into a single reproducible computational workflow.",
      features: [
        "Automated gene identification and functional domain mapping",
        "LLM-guided biosynthetic gene cluster (BGC) discovery",
        "Reproducible Docker & Nextflow container execution"
      ]
    },
    {
      name: "VEDA (Versatile Engine for Data Annotation)",
      badge: "Eukaryotic Deep Learning",
      desc: "A deep learning framework tailored for complex eukaryotic assemblies. VEDA leverages sequence transformer models to resolve splice-site junctions, non-coding RNA elements, and structural variants across large, repeat-heavy eukaryotic genomes.",
      features: [
        "Sequence transformer models for splice-site prediction",
        "Repeat-masking and structural variant resolution",
        "High-throughput multi-species comparative genomic indexing"
      ]
    }
  ];

  return (
    <Layout 
      title="Software Platforms & Pipelines | GenAI Research Labs" 
      description="Open-access computational platforms engineered for reproducible, high-throughput multi-omics interpretation."
    >
      <main className="container py-xl">
        {/* ─── HERO SECTION ─── */}
        <header className="hero mb-lg">
          <span className="badge mb-md">Open Source Bio-Pipelines</span>
          <h1 className="hero-title">Software Platforms & Pipelines</h1>
          <p className="hero-tagline">
            Open-access computational platforms engineered for reproducible, high-throughput multi-omics interpretation.
          </p>
        </header>

        {/* ─── PLATFORMS STACK ─── */}
        <section className="section-stack">
          <div className="grid-1 gap-lg">
            {platforms.map((item, idx) => (
              <div key={idx} className="card p-xl">
                <div className="flex flex-wrap justify-content-between align-items-center mb-md">
                  <h2 className="card-title" style={{ fontSize: '1.75rem', margin: 0 }}>{item.name}</h2>
                  <span className="badge">{item.badge}</span>
                </div>
                
                <p className="card-body mb-lg">{item.desc}</p>
                
                <div className="mb-lg">
                  <h4 style={{ color: 'var(--text-heading)', fontSize: '0.95rem', marginBottom: '12px', textTransform: 'uppercase' }}>
                    Key Capabilities:
                  </h4>
                  <ul className="card-list">
                    {item.features.map((feat, fIdx) => (
                      <li key={fIdx}>
                        <i className="fas fa-check-circle" style={{ color: 'var(--brand-accent)' }}></i> 
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Link href="/contact?intent=software_demo" className="btn-solid">
                    Request Pipeline Access <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}