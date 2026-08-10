'use client';

import Layout from '@layout/Layout';
import "@styles/main.css";

export default function PrivacyPage() {
  return (
    <Layout 
      title="Data Privacy & Computational Terms | GenAI Research Labs" 
      description="Review our model governance standards and institutional multi-omics data protocols before interfacing with our research engines."
    >
      <main className="container py-xl">
        {/* ─── HERO SECTION ─── */}
        <header className="hero mb-lg">
          <span className="badge mb-md">Governance & Compliance</span>
          <h1 className="hero-title">Data Privacy & Computational Terms</h1>
          <p className="hero-tagline">
            Please read our model governance standards and institutional multi-omics data protocols before interfacing with our research engines.
          </p>
        </header>

        <article className="section-stack">
          {/* Metadata Date */}
          <div className="text-muted text-small mb-md" style={{ fontWeight: 500 }}>
            Last Updated: May 2026
          </div>

          {/* Section 1 */}
          <section className="card p-xl">
            <h2 className="card-title">1. Terms of Computational Usage</h2>
            <p className="card-body">
              By accessing our web endpoints, model documentation, and API prototypes, you agree to comply with and be bound by the following research parameters. The content provided on this platform spans deep learning architectures, computational multi-omics benchmarks, and algorithmic research outputs for peer validation and collaborative exploration.
            </p>
            <p className="card-body" style={{ marginTop: '16px' }}>
              Unauthorized exploitation of our infrastructure, including automated scraping of active server endpoints, launching model denial-of-service (DoS) payloads, or modifying our core Next.js/Python frameworks outside of their designated license wrappers, is strictly prohibited.
            </p>
          </section>

          {/* Section 2 */}
          <section className="card p-xl">
            <h2 className="card-title">2. Multi-Omics Data Protection & Model Safety</h2>
            <p className="card-body mb-md">
              GenAI Research Labs prioritizes stringency when processing raw or intermediate biological data:
            </p>
            <ul className="card-list mb-md">
              <li><strong>Non-Retention of Query Inputs:</strong> We do not log or persistently store unencrypted FASTA, FASTQ, structural PDB files, or user sequence queries submitted to public demonstration endpoints.</li>
              <li><strong>Isolated Ephemeral Memory:</strong> Sequences parsed through model demos run inside isolated, volatile memory buffers and are cleared immediately post-inference.</li>
              <li><strong>Zero Third-Party Training:</strong> Submitted research payloads are never harvested to fine-tune third-party commercial LLMs or external AI foundation models.</li>
            </ul>
            <p className="card-body">
              We maintain absolute isolation boundaries between separate research groups. We do not rent, trade, or distribute pipeline metadata, intellectual summaries, or contact databases to outside corporate entities.
            </p>
          </section>

          {/* Section 3 */}
          <section className="card p-xl">
            <h2 className="card-title">3. Intellectual Property, Model Weights & Open Science</h2>
            <p className="card-body">
              Our production platforms, custom sequence visualization engines, and underlying pipeline orchestration systems are protected properties of GenAI Research Labs.
            </p>
            <p className="card-body" style={{ marginTop: '16px' }}>
              However, in adherence to our open-science ethos, public research weights, pre-trained transformer checkpoints, and benchmarking utilities are actively open-sourced under permissive academic frameworks (e.g., Apache 2.0 or MIT licenses) hosted on our official version-controlled repositories. Users reproducing or fine-tuning our open-access architectures must credit GenAI Research Labs and append the required documentation headers in compliance with those respective terms.
            </p>
          </section>
        </article>
      </main>
    </Layout>
  );
}