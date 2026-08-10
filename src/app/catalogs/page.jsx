'use client';

import Link from 'next/link';
import Layout from '@layout/Layout';
import "@styles/main.css";

export default function AcademicsPage() {
  const courses = [
    {
      title: "Hands-on Generative AI & Deep Learning Workshops",
      target: "Ph.D. Scholars & Early-Career Researchers",
      desc: "Intensive, project-based bootcamps covering large language models (LLMs) in biology, sequence transformers, and neural network architectures for biological sequence design."
    },
    {
      title: "Dissertation & Thesis Mentorship",
      target: "Postgraduate & Ph.D. Candidates",
      desc: "Direct research guidance, computational infrastructure access, and co-advisorship for university students executing master's theses or doctoral dissertations in bioinformatics and computational genomics."
    },
    {
      title: "Scientific Communication & Open Science",
      target: "Doctoral Scholars & University Faculty",
      desc: "A foundational course focusing on grant drafting, high-impact manuscript preparation, open science practices, and transparent research reporting."
    }
  ];

  return (
    <Layout 
      title="Academic Programs & Research Mentorship | GenAI Research Labs" 
      description="Bridging the gap between computational innovation and academic curriculum through workshops, research guidance, and degree development."
    >
      <main className="container py-xl">
        {/* ─── HERO SECTION ─── */}
        <header className="hero mb-lg">
          <span className="badge mb-md">Academic Excellence</span>
          <h1 className="hero-title">Academic Programs & Research Mentorship</h1>
          <p className="hero-tagline">
            Bridging the gap between computational innovation and academic curriculum through workshops, research guidance, and degree development.
          </p>
        </header>

        {/* ─── COURSES LIST ─── */}
        <section className="section-stack mb-xl">
          <div className="text-center mb-lg">
            <h2>Academic Workshops & Mentorship Tracks</h2>
          </div>
          <div className="grid-3">
            {courses.map((course, idx) => (
              <div key={idx} className="card p-xl flex flex-column justify-content-between">
                <div>
                  <span className="badge mb-md">{course.target}</span>
                  <h3 className="card-title">{course.title}</h3>
                  <p className="card-body">{course.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── UNIVERSITY PARTNERSHIP FEATURE ─── */}
        <section className="section-stack">
          <div className="card p-xl">
            <div className="flex align-items-center gap-md mb-md">
              <div className="icon-box">
                <i className="fas fa-university"></i>
              </div>
              <span className="badge">Curriculum Development for NICHE</span>
            </div>
            <h2 className="card-title" style={{ fontSize: '2rem' }}>Master's Program in Microbiome Studies</h2>
            <p className="card-body mb-lg" style={{ marginTop: '12px' }}>
              Developed in partnership with the <strong>Noorul Islam Centre for Higher Education (NICHE)</strong>, 
              this pioneer curriculum offers a multidisciplinary postgraduate degree bridging metagenomics, computational biology, 
              clinical microbiome applications, and biostatistics. It prepares students for research leadership in precision medicine, 
              agriculture, and environmental biotechnology.
            </p>
            <div>
              <Link href="/contact?intent=academic_intake" className="btn-solid">
                Inquire About Academic Collaboration <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}