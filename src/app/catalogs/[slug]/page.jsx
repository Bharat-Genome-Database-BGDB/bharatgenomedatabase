'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@db/supabaseClient';
import Layout from '@components/Layout/Layout';
import '@styles/main.css';

export default function SpeciesDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const [species, setSpecies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (slug) {
      fetchSpeciesDetail(slug);
    }
  }, [slug]);

  const fetchSpeciesDetail = async (targetSlug) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('species_catalog')
        .select('*')
        .eq('slug', targetSlug)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      if (!data) {
        setErrorMessage('Species record not found or not published.');
      } else {
        setSpecies(data);
      }
    } catch (err) {
      console.error('Error fetching species profile:', err.message);
      setErrorMessage('Failed to load genome record from database.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
          <div style={{ color: 'var(--ink-muted)', fontSize: '1.1rem' }}>⏳ Loading specimen genome profile...</div>
        </div>
      </Layout>
    );
  }

  if (errorMessage || !species) {
    return (
      <Layout>
        <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
          <h2 className="card-title" style={{ marginBottom: '1rem' }}>Specimen Not Found</h2>
          <p style={{ color: 'var(--ink-muted)', marginBottom: '2rem' }}>{errorMessage || 'The requested genome record does not exist.'}</p>
          <Link href="/catalogs" className="btn-solid">
            ← Back to Species Catalog
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container section-stack" style={{ paddingTop: '2.5rem' }}>
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link href="/catalogs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--ink-muted)', fontWeight: 600, fontSize: '0.95rem' }}>
            ← Back to Species Catalog
          </Link>
        </div>

        {/* Hero Header Profile Banner using card-horizontal */}
        <div className="card card-horizontal" style={{ padding: '32px' }}>
          <div style={{ width: '100%', maxWidth: '380px', height: '220px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-section)' }}>
            {species.cover_image_url ? (
              <img src={species.cover_image_url} alt={species.common_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
                🧬 {species.kingdom || 'Genomic Specimen'}
              </div>
            )}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span className="badge">{species.kingdom || 'Flora'}</span>
              <span className="badge">Access: {species.access_tier || 'Public'}</span>
              {species.assembly_accession && (
                <span className="badge" style={{ backgroundColor: 'var(--brand-surface-subtle)', color: 'var(--brand-primary)' }}>
                  {species.assembly_accession}
                </span>
              )}
            </div>

            <h1 className="card-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{species.common_name}</h1>
            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.25rem', color: 'var(--brand-primary)', marginBottom: '0.75rem' }}>
              {species.scientific_name}
            </p>

            {species.family && (
              <p style={{ color: 'var(--ink-muted)', fontSize: '0.95rem' }}>
                <strong>Family:</strong> {species.family} {species.genus ? `| Genus: ${species.genus}` : ''}
              </p>
            )}
          </div>
        </div>

        {/* Two-Column Detailed Body Grid */}
        <div className="grid grid-2" style={{ alignItems: 'start' }}>
          
          {/* MAIN COLUMN (Description & JBrowse Links) */}
          <div className="section-stack">
            
            {/* Overview / Description */}
            <div className="card">
              <h3 className="card-title">📖 Genomic Overview & Summary</h3>
              {species.description ? (
                <div className="card-body" style={{ marginTop: '1rem' }}>
                  <div dangerouslySetInnerHTML={{ __html: species.description }} />
                </div>
              ) : (
                <p style={{ color: 'var(--ink-muted)', fontStyle: 'italic' }}>No detailed description provided for this specimen yet.</p>
              )}
            </div>

            {/* JBrowse & Genome Browsers Section */}
            {Array.isArray(species.jbrowse_links) && species.jbrowse_links.length > 0 && species.jbrowse_links[0].jbrowse_url && (
              <div className="card">
                <h3 className="card-title">🧬 Interactive Genome Browsers (JBrowse)</h3>
                <p className="card-body" style={{ marginBottom: '1.25rem' }}>
                  Launch authenticated chromosome assemblies or custom tracks for deep structural inspection.
                </p>
                <div className="section-stack" style={{ gap: '12px' }}>
                  {species.jbrowse_links.map((jb, idx) => (
                    jb.jbrowse_url ? (
                      <a 
                        key={idx} 
                        href={jb.jbrowse_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="card"
                        style={{ padding: '16px 20px', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}
                      >
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--ink-primary)' }}>{jb.track_name || 'JBrowse 2 Assembly View'}</div>
                          {jb.description && <div style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>{jb.description}</div>}
                        </div>
                        <span style={{ color: 'var(--brand-primary)', fontWeight: '600', fontSize: '0.9rem' }}>Launch Browser ↗</span>
                      </a>
                    ) : null
                  ))}
                </div>
              </div>
            )}

            {/* External Databases Section */}
            {Array.isArray(species.external_resources) && species.external_resources.length > 0 && species.external_resources[0].url && (
              <div className="card">
                <h3 className="card-title">🔗 External Repositories & References</h3>
                <div className="section-stack" style={{ gap: '12px', marginTop: '1rem' }}>
                  {species.external_resources.map((res, idx) => (
                    res.url ? (
                      <a 
                        key={idx} 
                        href={res.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="card"
                        style={{ padding: '16px 20px', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}
                      >
                        <span style={{ fontWeight: '600', color: 'var(--ink-primary)' }}>{res.db_name || 'External Database Link'}</span>
                        <span style={{ color: 'var(--brand-primary)', fontSize: '0.85rem', fontWeight: '600' }}>Access Record ↗</span>
                      </a>
                    ) : null
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* SIDEBAR COLUMN (Taxonomic Ranks & Genomic Metrics) */}
          <div className="section-stack">
            
            {/* Taxonomic Hierarchy Card */}
            <div className="card">
              <h3 className="card-title">🌿 Taxonomic Hierarchy</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '0.75rem 0', fontWeight: 600, color: 'var(--ink-muted)', fontSize: '0.9rem', width: '35%' }}>Kingdom</td>
                    <td style={{ padding: '0.75rem 0', color: 'var(--ink-primary)', fontWeight: 500, fontSize: '0.95net' }}>{species.kingdom || '—'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '0.75rem 0', fontWeight: 600, color: 'var(--ink-muted)', fontSize: '0.9rem' }}>Phylum</td>
                    <td style={{ padding: '0.75rem 0', color: 'var(--ink-primary)', fontWeight: 500, fontSize: '0.95rem' }}>{species.phylum || '—'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '0.75rem 0', fontWeight: 600, color: 'var(--ink-muted)', fontSize: '0.9rem' }}>Class</td>
                    <td style={{ padding: '0.75rem 0', color: 'var(--ink-primary)', fontWeight: 500, fontSize: '0.95rem' }}>{species.class || '—'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '0.75rem 0', fontWeight: 600, color: 'var(--ink-muted)', fontSize: '0.9rem' }}>Order</td>
                    <td style={{ padding: '0.75rem 0', color: 'var(--ink-primary)', fontWeight: 500, fontSize: '0.95rem' }}>{species.order_rank || '—'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '0.75rem 0', fontWeight: 600, color: 'var(--ink-muted)', fontSize: '0.9rem' }}>Family</td>
                    <td style={{ padding: '0.75rem 0', color: 'var(--ink-primary)', fontWeight: 500, fontSize: '0.95rem' }}>{species.family || '—'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '0.75rem 0', fontWeight: 600, color: 'var(--ink-muted)', fontSize: '0.9rem' }}>Genus</td>
                    <td style={{ padding: '0.75rem 0', color: 'var(--ink-primary)', fontWeight: 500, fontSize: '0.95rem' }}>{species.genus || '—'}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.75rem 0', fontWeight: 600, color: 'var(--ink-muted)', fontSize: '0.9rem' }}>Species</td>
                    <td style={{ padding: '0.75rem 0', color: 'var(--ink-primary)', fontWeight: 500, fontSize: '0.95rem', fontStyle: 'italic' }}>{species.species_name || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Genomic Metrics Card */}
            <div className="card">
              <h3 className="card-title">📊 Genome Metrics</h3>
              <div className="section-stack" style={{ gap: '0px', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--card-border)' }}>
                  <span style={{ color: 'var(--ink-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Assembly Size</span>
                  <span style={{ color: 'var(--ink-primary)', fontWeight: 700, fontSize: '0.95rem' }}>{species.genome_size_mb ? `${species.genome_size_mb} Mb` : 'Not Listed'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--card-border)' }}>
                  <span style={{ color: 'var(--ink-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Chromosome Count</span>
                  <span style={{ color: 'var(--ink-primary)', fontWeight: 700, fontSize: '0.95rem' }}>{species.chromosome_count || 'Not Listed'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0' }}>
                  <span style={{ color: 'var(--ink-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Annotation Status</span>
                  <span style={{ color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.95rem' }}>{species.annotation_status || 'Completed'}</span>
                </div>
              </div>

              {/* Strict Copy / Download Restriction Notice */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: '1.5rem', padding: '16px', backgroundColor: 'var(--brand-surface-subtle)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
                <span>🔒</span>
                <span>Raw assembly files and annotations are strictly restricted under BGDB secure data governance policies.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}