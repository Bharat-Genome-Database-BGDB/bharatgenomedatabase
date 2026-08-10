'use client';

import Link from 'next/link';
import Layout from '@layout/Layout';
import "@styles/main.css";

export default function DatabasesPage() {
  const databases = [
    {
      name: "BMGA (Bharat Microbial Genome Atlas)",
      tag: "Continental Metagenomics",
      desc: "A comprehensive, curated microbial genome database mapping the taxonomic and functional diversity of microbial organism. BMGA catalogues novel microbial genomes, antimicrobial resistance (AMR) profiles, and metabolic pathway variations across diverse demographics.",
      link: "https://bmga.aarogyasakthi.com",
      external: true
    },
    {
      name: "BGDB (Bharat Genome DataBase)",
      tag: "Eukaryotic & Biodiversity",
      desc: "A public genomic database dedicated to cataloguing native plant, animal, and endemic eukaryotic species genomes. BGDB serves as a central hub for biodiversity conservation, evolutionary tracking, and comparative pangenomics across South Asia.",
      link: "https://bgdb.org",
      external: true
    }
  ];

  return (
    <Layout 
      title="Genomic Databases & Repositories | GenAI Research Labs" 
      description="Open-access genomic repositories mapping population metagenomics, gut microbiome dynamics, and regional biological diversity."
    >
      <main className="container py-xl">
        {/* ─── HERO SECTION ─── */}
        <header className="hero mb-lg">
          <span className="badge mb-md">FAIR Data Repositories</span>
          <h1 className="hero-title">Genomic Databases & Repositories</h1>
          <p className="hero-tagline">
            Open-access genomic repositories mapping population metagenomics, gut microbiome dynamics, and regional biological diversity.
          </p>
        </header>

        {/* ─── DATABASES GRID ─── */}
        <section className="section-stack">
          <div className="grid-2">
            {databases.map((db, idx) => (
              <div key={idx} className="card p-xl flex flex-column justify-content-between">
                <div>
                  <span className="badge mb-md">{db.tag}</span>
                  <h2 className="card-title" style={{ fontSize: '1.75rem' }}>{db.name}</h2>
                  <p className="card-body mb-lg" style={{ marginTop: '12px' }}>{db.desc}</p>
                </div>

                <div style={{ marginTop: '24px' }}>
                  {db.external ? (
                    <a 
                      href={db.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-outline" 
                      style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
                    >
                      Explore Repository <i className="fas fa-external-link-alt"></i>
                    </a>
                  ) : (
                    <Link href={db.link} className="btn-outline" style={{ width: '100%' }}>
                      Explore Repository <i className="fas fa-external-link-alt"></i>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}