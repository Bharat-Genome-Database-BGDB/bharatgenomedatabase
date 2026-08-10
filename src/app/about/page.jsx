'use client';

import Layout from "@components/Layout/Layout";
import Link from "next/link";
import "@styles/main.css";

/**
 * @component AboutPage
 * @description About Us page for Bharat Genome Database (BGDB) with Data Metrics grid,
 * structured in the exact two-column layout as the Contact Us page without inline styling.
 */
export default function AboutPage() {
  return (
    <Layout
      title="About Us"
      description="Learn about the Bharat Genome Database (BGDB), India's premier open genomic data repository and bio-computational research hub."
    >
      <main className="container" style={{ paddingTop: '40px' }}>
        {/* 1. Hero Identity Banner */}
        <header className="hero hero-tinted">
          <div className="hero-content">
            <span className="hero-badge">National Repository</span>
            <h1 className="hero-title">About Bharat Genome Database</h1>
            <p className="hero-tagline">
              Empowering biological research, genomic discovery, and computational innovation across India and the global scientific community.
            </p>
          </div>
        </header>

        {/* 2. Main Two-Column Grid Layout matching Contact Page */}
        <section className="grid-layout" style={{ marginTop: '40px' }}>

          {/* <div className="grid grid-2 gap-lg" style={{ alignItems: 'stretch' }}> */}
          <div className="card card-sidebar">
            <h2 className="card-title">Our Core Purpose</h2>
            <p className="card-body">
              The <strong>Bharat Genome Database (BGDB)</strong> is an open-access, comprehensive repository dedicated to aggregating, curating, and standardizing multi-species genomic data across the Indian subcontinent and beyond.
            </p>
            <p className="card-body" style={{ marginTop: '16px' }}>
              Established under the broader umbrella of the Sivasakthi Science Foundation, BGDB serves as a critical bridge between raw sequencing data, bio-computational annotation pipelines, and translational health insights.
            </p>
          </div>

          <div className="card" style={{ justifyContent: 'center' }}>
            <span className="card-subtitle">Repository Scale</span>
            <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '16px' }}>
              Data Infrastructure At A Glance
            </h3>
            <div className="info-grid" style={{ marginTop: '0' }}>
              <div className="info-item">
                <strong>Multi-Omics</strong>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--brand-primary)' }}>10,000+</span>
                <span className="text-small">Curated Assemblies</span>
              </div>
              <div className="info-item">
                <strong>ODOG Project</strong>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--brand-primary)' }}>500+</span>
                <span className="text-small">Native Species</span>
              </div>
              <div className="info-item">
                <strong>Pipelines</strong>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--brand-primary)' }}>100%</span>
                <span className="text-small">Automated Workflows</span>
              </div>
              <div className="info-item">
                <strong>Access</strong>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--brand-primary)' }}>Open</span>
                <span className="text-small">FASTA & Variant Files</span>
              </div>
            </div>

          </div>
        </section>
        <div className="card card-sidebar" style={{ marginTop: '24px' }}>
          <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '16px' }}>
            Mission & Strategic Directives
          </h3>
          <ul className="card-list" style={{ gridTemplateColumns: '1fr' }}>
            <li>
              <i className="fas fa-database" style={{ color: 'var(--brand-primary)', marginRight: '8px' }}></i>
              <strong>Genomic Data Archiving:</strong> Providing high-integrity storage for FASTA, FASTQ, GFF3, and annotated variant files.
            </li>
            <li>
              <i className="fas fa-dna" style={{ color: 'var(--brand-primary)', marginRight: '8px' }}></i>
              <strong>One Species, One Genome (ODOG):</strong> Cataloging native Indian flora, fauna, and microbial species to safeguard regional biodiversity.
            </li>
            <li>
              <i className="fas fa-microscope" style={{ color: 'var(--brand-primary)', marginRight: '8px' }}></i>
              <strong>Automated Annotation Pipelines:</strong> Giving researchers access to automated tools for gene prediction, functional mapping, and structural analysis.
            </li>
            <li>
              <i className="fas fa-graduation-cap" style={{ color: 'var(--brand-primary)', marginRight: '8px' }}></i>
              <strong>Capacity Building:</strong> Hosting workshops, academic training fellowships, and open computational datasets for young bioinformaticians.
            </li>
          </ul>
        </div>


      </main>
    </Layout>
  );
}