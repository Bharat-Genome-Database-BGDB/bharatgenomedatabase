'use client';

import Layout from "@components/Layout/Layout";
import "@styles/main.css";

/**
 * @component FAQPage
 * @description Frequently Asked Questions page for Bharat Genome Database (BGDB).
 */
export default function FAQPage() {
  const faqs = [
    {
      q: "What is the Bharat Genome Database (BGDB)?",
      a: "The Bharat Genome Database (BGDB) is an open-access national repository dedicated to centralizing, standardizing, and hosting comparative genomics, multi-species assemblies, and functional annotation datasets for species across the Indian subcontinent."
    },
    {
      q: "What sequence file formats does BGDB support for download and analysis?",
      a: "BGDB hosts and provides downloads for raw sequencing reads in FASTQ format, assembled nucleotide and amino acid sequences in FASTA format, gene structural annotations in GFF3/GTF formats, and variant call records in VCF format."
    },
    {
      q: "What is the One Species, One Genome (ODOG) Initiative?",
      a: "The ODOG Initiative is a flagship project aimed at sequencing, assembling, and annotating at least one high-quality reference genome for native Indian plant, animal, and microbial species to preserve regional biodiversity records and support bio-computational research."
    },
    {
      q: "How can I inspect genome tracks interactively?",
      a: "Researchers can utilize our integrated JBrowse 2 genome browser embedded directly within the database pages to interactively explore chromosome maps, gene predictions, variant density, and RNA-seq alignment tracks."
    },
    {
      q: "Does BGDB provide sequence similarity search tools like BLAST?",
      a: "Yes. BGDB offers a web-based BLAST alignment server allowing users to query custom nucleotide or protein sequences against our curated database of native Indian species and reference assemblies."
    },
    {
      q: "How does role-based access control (RBAC) work on BGDB?",
      a: "High-level taxonomy catalogs and reference assemblies are publicly accessible. However, raw sequence downloads, high-throughput pipeline execution endpoints, and pre-publication research datasets require an authenticated user role (Student, Researcher, or Admin)."
    },
    {
      q: "How can independent researchers or labs submit sequence data to BGDB?",
      a: "Labs can submit raw FASTQ reads or curated FASTA/GFF3 assemblies through our researcher portal or contact our curation team. Submitted data undergoes automated quality control checks before being indexed."
    },
    {
      q: "Are datasets on BGDB open for commercial research and development?",
      a: "Publicly released reference genomes and species annotations are made available under permissive open-science licenses. Commercial entities using BGDB records are required to adhere to our attribution and usage guidelines."
    },
    {
      q: "Does BGDB provide automated genome annotation tools?",
      a: "Yes. BGDB operates computational annotation pipelines that automatically predict gene boundaries, identify functional domains, and map orthologous gene clusters across multi-species datasets."
    },
    {
      q: "How can students apply for bioinformatics fellowships or internships?",
      a: "Students and graduates in computational biology, bioinformatics, and software engineering can apply for hands-on data curation and pipeline development fellowships through our Contact & Support page."
    }
  ];

  return (
    <Layout 
      title="Frequently Asked Questions" 
      description="Find answers to common questions about sequence downloads, file formats, JBrowse 2 viewer, BLAST tools, and the ODOG initiative on Bharat Genome Database."
    >
      <main className="container" style={{ paddingTop: '40px' }}>
        
        {/* ─── HERO BANNER ─── */}
        <header className="hero hero-tinted mb-lg" style={{ borderRadius: 'var(--border-radius-bento, 12px)' }}>
          <div className="hero-content">
            <span className="hero-badge">Knowledge Hub</span>
            <h1 className="hero-title">Frequently Asked Questions</h1>
            <p className="hero-tagline">
              Common inquiries regarding genomic sequence downloads, file formats, JBrowse 2 viewer tracks, BLAST queries, and the ODOG initiative.
            </p>
          </div>
        </header>

        {/* ─── FAQ LIST (Hover-Only Cards) ─── */}
        <section className="section-stack" style={{ marginTop: '40px', maxWidth: '850px', marginInline: 'auto' }}>
          {faqs.map((faq, idx) => (
            <article 
              key={idx} 
              className="card faq-card"
              style={{ padding: '28px 32px' }}
            >
              <h3 
                className="card-title" 
                style={{ 
                  fontSize: '1.25rem', 
                  marginBottom: '12px', 
                  color: 'var(--text-heading)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <i className="fas fa-question-circle" style={{ color: 'var(--brand-primary)' }}></i>
                {faq.q}
              </h3>
              <p className="card-body" style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.7' }}>
                {faq.a}
              </p>
            </article>
          ))}
        </section>

      </main>
    </Layout>
  );
}