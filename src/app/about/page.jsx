'use client';

import Link from 'next/link';
import Layout from '@layout/Layout';
import "@styles/main.css";

export default function AboutPage() {
  const focusAreas = [
    {
      title: "Reproducible AI Systems",
      desc: "Building transparent, benchmarked deep learning tools for multi-omics integration.",
      icon: "fas fa-code-branch"
    },
    {
      title: "Open Science Governance",
      desc: "Ensuring all tools, pipelines, and databases conform to FAIR (Findable, Accessible, Interoperable, Reusable) data principles.",
      icon: "fas fa-balance-scale"
    },
    {
      title: "Cross-Institutional Collaboration",
      desc: "Partnering with academic centers, non-profit institutions, and research hospitals to deploy genomics at scale.",
      icon: "fas fa-handshake"
    }
  ];

  return (
    <Layout title="About GenAI Research Labs" description="An interdisciplinary research entity driving computational innovation and open-access genomics.">
      <main className="container py-xl">
        {/* ─── Hero Section ─── */}
        <header className="hero mb-lg">
          <span className="badge mb-md">Non-Profit Research Core</span>
          <h1 className="hero-title">About GenAI Research Labs</h1>
          <p className="hero-tagline">
            An interdisciplinary research entity driving computational innovation and open-access genomics.
          </p>
        </header>

        {/* ─── Narrative Section ─── */}
        <section className="section-stack mb-xl">
          <div className="card p-xl">
            <h2 className="card-title">Governance & Foundation Context</h2>
            <p className="card-body">
              GenAI Research Labs operates as a specialized research entity supported by the&nbsp;
              <strong>Sivasakthi Science Foundation (SSF)</strong>.
            </p>
            <p className="card-body" style={{ marginTop: '16px' }}>
              By unifying open-source software engineering, public database hosting, and university-level research mentorship, 
              we foster an ecosystem where computational innovations translate directly into educational and scientific outcomes.
            </p>
          </div>
        </section>

        {/* ─── Core Focus Areas ─── */}
        <section className="section-stack">
          <div className="text-center mb-lg">
            <h2>Core Operational Focus Areas</h2>
            <p className="text-muted">Our commitments to scientific rigor and open access</p>
          </div>
          <div className="grid-3">
            {focusAreas.map((item, idx) => (
              <div key={idx} className="card p-xl text-center">
                <div className="icon-box mx-auto">
                  <i className={item.icon}></i>
                </div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-body">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}