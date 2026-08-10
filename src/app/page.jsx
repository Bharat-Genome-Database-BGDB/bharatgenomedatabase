'use client';

import Link from 'next/link';
import Layout from '@layout/Layout';
import "@styles/main.css";

export default function HomePage() {
  const pillars = [
    {
      title: "Generative AI & Annotation Pipelines",
      desc: "Engineering next-generation computational frameworks (MAYA & VEDA) for automated microbial and eukaryotic genome annotation.",
      icon: "fas fa-brain",
      link: "/software"
    },
    {
      title: "Open Access Databases & Pangenomics",
      desc: "Architecting public-facing genomic repositories (BMGA & BGDB) to map biological diversity and host-microbiome interactions.",
      icon: "fas fa-database",
      link: "/databases"
    },
    {
      title: "Advanced Academic Training & Workshops",
      desc: "Empowering Ph.D. scholars, postdocs, and university faculties through intensive workshops in generative AI, computational genomics, and scientific communication.",
      icon: "fas fa-graduation-cap",
      link: "/academics"
    },
    {
      title: "Translational Research & Publications",
      desc: "Translating multi-omics findings into peer-reviewed journals, open-source software packages, and reproducible bio-pipelines.",
      icon: "fas fa-microscope",
      link: "/about"
    }
  ];

  return (
    <Layout 
      title="GenAI Research Labs | Democratizing Genomics Through AI" 
      description="GenAI Research Labs bridges multi-omics, evolutionary biology, and artificial intelligence with open-access computational engines."
    >
      <main className="container py-xl">
        {/* ─── HERO SECTION ─── */}
        <header className="hero mb-lg">
          <span className="badge mb-md">GenAI Research Labs • Computational Core</span>
          <h1 className="hero-title">
            Democratizing Eukaryotic & Microbiome Genomics Through Generative Intelligence
          </h1>
          <p className="hero-tagline">
            GenAI Research Labs bridges multi-omics, evolutionary biology, and artificial intelligence. 
            From automated genome annotation pipelines to continental-scale microbiome atlases, we build 
            open-access computational engines to decode life across all domains.
          </p>
          <div className="hero-actions">
            <Link href="/software" className="btn-solid">
              Explore Software & Pipelines <i className="fas fa-arrow-right"></i>
            </Link>
            <Link href="/databases" className="btn-outline">
              Access Genomic Databases
            </Link>
          </div>
        </header>

        {/* ─── CORE MISSION NARRATIVE ─── */}
        <section className="section-stack mb-xl">
          <div className="card p-xl">
            <h2 className="card-title text-center mb-md">Core Mission</h2>
            <p className="card-body">
              At GenAI Research Labs, we believe the bottleneck in modern genomics is no longer data generation—it is interpretation. 
              We engineer specialized, generative AI frameworks and scalable computational pipelines to solve fundamental challenges 
              in genome assembly, functional annotation, and comparative genomics.
            </p>
            <p className="card-body" style={{ marginTop: '16px' }}>
              Operating at the intersection of non-profit research governance (via the <strong>Sivasakthi Science Foundation</strong>) 
              and academic excellence, our labs pioneer end-to-end multi-omics architectures. Whether resolving hypervariable 
              eukaryotic loci or constructing native biodiversity databases, our goal remains singular: turning high-dimensional sequence data 
              into actionable biological intelligence.
            </p>
          </div>
        </section>

        {/* ─── 4-CARD PILLARS GRID ─── */}
        <section className="section-stack">
          <div className="text-center mb-lg">
            <h2>Key Pillars at a Glance</h2>
            <p className="text-muted">Our core operational and scientific research verticals</p>
          </div>
          
          <div className="grid-2">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="card p-xl flex flex-column justify-content-between">
                <div>
                  <div className="icon-box mb-md">
                    <i className={pillar.icon}></i>
                  </div>
                  <h3 className="card-title">{pillar.title}</h3>
                  <p className="card-body mb-lg">{pillar.desc}</p>
                </div>
                <Link href={pillar.link} className="text-bold" style={{ color: 'var(--brand-primary)', textDecoration: 'none' }}>
                  Learn More <i className="fas fa-chevron-right" style={{ fontSize: '12px' }}></i>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}