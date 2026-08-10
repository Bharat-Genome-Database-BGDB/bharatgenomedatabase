'use client';

import Layout from '@components/Layout/Layout';
import "@styles/main.css";

/**
 * @component PrivacyPage
 * @description Privacy & Terms of Usage page for Bharat Genome Database (BGDB).
 */
export default function PrivacyPage() {
  return (
    <Layout 
      title="Data Privacy & Terms of Usage" 
      description="Review our data governance standards, open-access genomic parameters, and repository security protocols for the Bharat Genome Database."
    >
      <main className="container" style={{ paddingTop: '40px' }}>
        {/* ─── HERO SECTION ─── */}
        <header className="hero hero-tinted mb-lg" style={{ borderRadius: 'var(--border-radius-bento, 12px)' }}>
          <div className="hero-content">
            <span className="hero-badge">Governance & Policy</span>
            <h1 className="hero-title">Data Privacy & Terms of Usage</h1>
            <p className="hero-tagline">
              Please review our national genomic data standards, repository access parameters, and open-science attribution guidelines.
            </p>
          </div>
        </header>

        <article className="section-stack" style={{ marginTop: '40px' }}>
          {/* Metadata Date */}
          <div className="text-small" style={{ color: 'var(--text-muted)', fontWeight: 500, marginBottom: '16px' }}>
            Last Updated: August 2026
          </div>

          {/* Section 1 */}
          <section className="card">
            <h2 className="card-title">1. Terms of Database Usage</h2>
            <p className="card-body">
              By accessing the <strong>Bharat Genome Database (BGDB)</strong>, querying species catalogs, downloading FASTA/GFF3 sequence files, or embedding interactive JBrowse map tracks, you agree to comply with our research and data usage protocols. BGDB serves as an open-access national repository designed to advance comparative genomics and preserve regional biodiversity records.
            </p>
            <p className="card-body" style={{ marginTop: '16px' }}>
              Unauthorized exploitation of database infrastructure—including aggressive server scraping, automated denial-of-service (DoS) query flooding, or attempting to bypass role-gated API endpoints—is strictly prohibited.
            </p>
          </section>

          {/* Section 2 */}
          <section className="card">
            <h2 className="card-title">2. Sequence Data Protection & Query Security</h2>
            <p className="card-body" style={{ marginBottom: '16px' }}>
              BGDB prioritizes strict integrity and security when handling sequence submissions and computational queries:
            </p>
            <ul className="card-list" style={{ gridTemplateColumns: '1fr', marginBottom: '16px' }}>
              <li>
                <i className="fas fa-shield-alt" style={{ color: 'var(--brand-primary)', marginRight: '8px' }}></i>
                <strong>Non-Retention of Search Queries:</strong> Unencrypted sequence queries processed through web BLAST tools or search forms are cleared from volatile server memory immediately post-alignment.
              </li>
              <li>
                <i className="fas fa-lock" style={{ color: 'var(--brand-primary)', marginRight: '8px' }}></i>
                <strong>Gated Research Submissions:</strong> Pre-publication genomic assemblies submitted by partner institutions are protected with strict Row-Level Security (RLS) until authorized for public indexing.
              </li>
              <li>
                <i className="fas fa-user-shield" style={{ color: 'var(--brand-primary)', marginRight: '8px' }}></i>
                <strong>Zero Commercial Harvesting:</strong> User contact records, institutional affiliations, and research inquiry details are never sold, rented, or distributed to third-party commercial entities.
              </li>
            </ul>
            <p className="card-body">
              We maintain clear data isolation standards to safeguard institutional research projects and proprietary species annotations prior to formal open-access release.
            </p>
          </section>

          {/* Section 3 */}
          <section className="card">
            <h2 className="card-title">3. Intellectual Property, Open Science & Citations</h2>
            <p className="card-body">
              The underlying web architecture, custom visualization components, and database infrastructure are maintained under the Sivasakthi Science Foundation ecosystem.
            </p>
            <p className="card-body" style={{ marginTop: '16px' }}>
              In accordance with our open-science mission, public genome assemblies, species taxonomy profiles, and computational annotation outputs (including the <em>One Species, One Genome - ODOG</em> initiative) are made available under permissive academic licenses. Researchers utilizing BGDB datasets in peer-reviewed publications, academic presentations, or commercial applications are requested to formally cite the Bharat Genome Database and maintain standard attribution headers.
            </p>
          </section>
        </article>
      </main>
    </Layout>
  );
}