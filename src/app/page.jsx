'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@db/supabaseClient';
import Layout from '@components/Layout/Layout';
import '@styles/main.css';
import '@styles/home.css';

export default function HomePage() {
  const [featuredSpecies, setFeaturedSpecies] = useState([]);
  const [totalSpeciesCount, setTotalSpeciesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Carousel auto-scroll index state
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchHomeData();
  }, []);

  // Automatic Carousel Rotator Effect (every 4 seconds)
  useEffect(() => {
    if (featuredSpecies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredSpecies.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredSpecies.length]);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      // Fetch featured species for the carousel
      const { data: featuredData, error: featuredError } = await supabase
        .from('species_catalog')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .limit(6);

      if (featuredError) throw featuredError;
      setFeaturedSpecies(featuredData || []);

      // Fetch total count for stats counter
      const { count, error: countError } = await supabase
        .from('species_catalog')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      if (!countError) {
        setTotalSpeciesCount(count || 0);
      }
    } catch (err) {
      console.error('Error loading homepage data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="content-wrapper home-wrapper">
        
        {/* Hero Section */}
        <div className="home-hero">
          <h1 className="home-hero-title">
            Bharat Genome Database (BGDB)
          </h1>
          <p className="home-hero-subtitle">
            Mapping India's rich biodiversity through high-throughput genomic sequencing, standardized taxonomy catalogs, and secure bioinformatics pipelines.
          </p>
          <div className="home-hero-actions">
            <Link href="/catalogs" className="btn-solid" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
              Explore Genome Catalogs →
            </Link>
            <Link href="/admin/add-species" className="btn-outline" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
              Curate Specimen (Admin)
            </Link>
          </div>
        </div>

        {/* Live Database Metrics Counter (The Proof) */}
        <div className="home-stats-row">
          <div className="home-stat-box">
            <div className="home-stat-number">{totalSpeciesCount > 0 ? totalSpeciesCount : '—'}</div>
            <div className="home-stat-label">Sequenced Genomes</div>
          </div>
          <div className="home-stat-box">
            <div className="home-stat-number">3</div>
            <div className="home-stat-label">Core Kingdoms Cataloged</div>
          </div>
          <div className="home-stat-box">
            <div className="home-stat-number">100%</div>
            <div className="home-stat-label">Secure Access Control</div>
          </div>
        </div>

        {/* Featured Species Auto-Scrolling Carousel with Hover Tooltips */}
        {!loading && featuredSpecies.length > 0 && (
          <div className="home-carousel-section">
            <div className="home-carousel-header">
              <div>
                <h3 className="home-carousel-title">
                  🧬 Featured Genomic Specimens
                </h3>
                <span className="home-carousel-subtitle">
                  Hover over any card to view assembly metrics & quick insights. Rotates automatically.
                </span>
              </div>
              <Link href="/catalogs" style={{ color: '#0284c7', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>
                View All Catalogs →
              </Link>
            </div>

            <div className="home-carousel-container">
              <div 
                className="home-carousel-track"
                style={{ transform: `translateX(-${currentIndex * 320}px)` }}
              >
                {featuredSpecies.map((species) => (
                  <div key={species.id} className="home-carousel-card">
                    
                    {/* Card Image */}
                    <div className="home-carousel-img-wrap">
                      {species.cover_image_url ? (
                        <img src={species.cover_image_url} alt={species.common_name} className="home-carousel-img" />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: '0.85rem' }}>
                          No Cover Image
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="home-carousel-body">
                      <h4 className="home-carousel-common">{species.common_name}</h4>
                      <p className="home-carousel-sci">{species.scientific_name}</p>
                      <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '600', textTransform: 'uppercase' }}>
                        {species.kingdom || 'Flora'}
                      </span>
                    </div>

                    {/* Hover Tooltip Overlay (Appears on Hover) */}
                    <div className="home-carousel-tooltip">
                      <div className="home-tooltip-title">{species.common_name}</div>
                      <div style={{ fontStyle: 'italic', fontSize: '0.85rem', marginBottom: '0.75rem', color: '#38bdf8' }}>
                        {species.scientific_name}
                      </div>
                      <div className="home-tooltip-stats"><strong>Family:</strong> {species.family || 'N/A'}</div>
                      <div className="home-tooltip-stats"><strong>Genome Size:</strong> {species.genome_size_mb ? `${species.genome_size_mb} Mb` : 'Pending'}</div>
                      <div className="home-tooltip-stats"><strong>Accession:</strong> {species.assembly_accession || 'N/A'}</div>
                      <div style={{ marginTop: '1rem' }}>
                        <Link 
                          href={`/catalogs/${species.slug}`}
                          className="btn-solid"
                          style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', display: 'inline-block', textDecoration: 'none' }}
                        >
                          View Full Record →
                        </Link>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* National Initiatives & Core Pillars (Bento Grid) */}
        <div className="home-bento-grid">
          
          <div className="home-bento-card">
            <div>
              <div className="home-bento-icon">🌳</div>
              <h3 className="home-bento-title">One Day One Genome (ODOG)</h3>
              <p className="home-bento-text">
                Committed to sequencing and annotating unique indigenous flora and microbial strains to safeguard genetic heritage and accelerate translational research.
              </p>
            </div>
            <Link href="/catalogs" style={{ color: '#0284c7', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>
              Browse Sequenced Species →
            </Link>
          </div>

          <div className="home-bento-card">
            <div>
              <div className="home-bento-icon">🔍</div>
              <h3 className="home-bento-title">High-Throughput JBrowse</h3>
              <p className="home-bento-text">
                Interactive chromosome assembly visualizers and annotation tracks engineered for deep genomic exploration.
              </p>
            </div>
            <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '500' }}>
              🔒 Gated Member Access
            </span>
          </div>

          <div className="home-bento-card">
            <div>
              <div className="home-bento-icon">⚡</div>
              <h3 className="home-bento-title">BLAST Sequence Pipelines</h3>
              <p className="home-bento-text">
                Run high-speed nucleotide and protein alignment queries directly against curated reference databases.
              </p>
            </div>
            <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '500' }}>
              🔒 Research Portal Active
            </span>
          </div>

        </div>

      </div>
    </Layout>
  );
}