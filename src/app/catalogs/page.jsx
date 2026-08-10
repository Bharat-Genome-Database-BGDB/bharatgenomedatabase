'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@db/supabaseClient';
import Layout from '@components/Layout/Layout';
import '@styles/main.css';

export default function CatalogsPage() {
  const [speciesList, setSpeciesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const fetchCatalogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('species_catalog')
        .select('*')
        .eq('is_published', true)
        .order('common_name', { ascending: true });

      if (error) throw error;
      setSpeciesList(data || []);
    } catch (err) {
      console.error('Error loading species catalogs:', err.message);
      setErrorMessage('Failed to load species catalog from database.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSpecies = speciesList.filter((item) => {
    const query = searchTerm.toLowerCase();
    const common = item.common_name?.toLowerCase() || '';
    const scientific = item.scientific_name?.toLowerCase() || '';
    const family = item.family?.toLowerCase() || '';
    return common.includes(query) || scientific.includes(query) || family.includes(query);
  });

  const groupedByAlphabet = filteredSpecies.reduce((acc, item) => {
    const firstLetter = item.common_name ? item.common_name.charAt(0).toUpperCase() : '#';
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(item);
    return acc;
  }, {});

  const activeAlphabetKeys = Object.keys(groupedByAlphabet).sort();

  return (
    <Layout>
      <div className="container section-stack">

        {/* Page Header Section */}
        <div className="hero-section text-center">
          <h1 className="hero-title">
            Species Genome Catalog
          </h1>
          <p className="card-body margin-auto max-w-700">
            Explore sequenced flora, fauna, and microbial genomes cataloged across the Bharat Genome Database. Browse alphabetically or search live records.
          </p>
        </div>

        {/* Search & Filter Card */}
        <div className="card catalog-search-wrap">
          <div className="form-group">
            <label htmlFor="catalog_search">
              Filter Catalog Contents:
            </label>
            <input
              id="catalog_search"
              type="text"
              className="form-group input"
              placeholder="🔍 Search by common name (e.g., Mango), scientific name (e.g., Mangifera), or family..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Quick-Jump Alphabet Anchor Bar */}
        {!loading && activeAlphabetKeys.length > 0 && (
          <div className="catalog-jump-bar-card">
            <span className="catalog-jump-label">
              Jump to:
            </span>
            {activeAlphabetKeys.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="catalog-jump-pill"
              >
                {letter}
              </a>
            ))}
          </div>
        )}

        {/* Loading & Error States */}
        {loading && (
          <div className="text-center" style={{ padding: '4rem 0', color: 'var(--ink-muted)', fontSize: '1.1rem' }}>
            ⏳ Loading species catalog from database...
          </div>
        )}

        {errorMessage && (
          <div className="text-center" style={{ padding: '2rem', color: '#dc2626', background: '#ffeeec', borderRadius: '8px' }}>
            {errorMessage}
          </div>
        )}

        {!loading && activeAlphabetKeys.length === 0 && (
          <div className="card text-center" style={{ padding: '4rem 2rem' }}>
            <h3 className="card-title">No species found matching your search criteria.</h3>
            <p style={{ color: 'var(--ink-muted)' }}>Try clearing your search filter to view all available entries.</p>
          </div>
        )}

        {/* Alphabet Sections List */}
        {!loading && activeAlphabetKeys.map((letter) => (
          <div key={letter} id={`letter-${letter}`} className="section-stack">

            {/* Alphabet Section Heading */}
            <div className="catalog-section-heading">
              <h2 className="card-title" style={{ fontSize: '2rem', margin: 0, color: 'var(--brand-primary)' }}>
                {letter}
              </h2>
              <span style={{ fontSize: '0.9rem', color: 'var(--ink-muted)', fontWeight: 600 }}>
                ({groupedByAlphabet[letter].length} {groupedByAlphabet[letter].length === 1 ? 'species' : 'species'})
              </span>
            </div>

            {/* Species Grid for this Letter */}
            <div className="grid grid-3">
              {groupedByAlphabet[letter].map((species) => (
                <div key={species.id} className="card catalog-card-shell">

                  {species.cover_image_url ? (
                    <div className="catalog-thumb-box">
                      <img
                        src={species.cover_image_url}
                        alt={species.common_name}
                        className="catalog-thumb-img"
                      />
                    </div>
                  ) : (
                    <div className="catalog-placeholder-box">
                      🧬 {species.kingdom || 'Genomic Specimen'}
                    </div>
                  )}

                  <div className="catalog-card-content">
                    <div>
                      <div className="catalog-card-header">
                        <span className="badge">
                          {species.kingdom || 'Flora'}
                        </span>
                        {species.access_tier && (
                          <span className="catalog-tier-text">
                            Tier: {species.access_tier}
                          </span>
                        )}
                      </div>

                      <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                        {species.common_name}
                      </h3>

                      <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--brand-primary)', fontSize: '1rem', marginBottom: '0.75rem' }}>
                        {species.scientific_name}
                      </p>

                      {species.family && (
                        <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)', marginBottom: '1.5rem' }}>
                          <strong>Family:</strong> {species.family}
                        </p>
                      )}
                    </div>

                    <div>
                      <Link
                        href={`/catalogs/${species.slug}`}
                        className="btn-solid btn-full"
                      >
                        View Genome Record →
                      </Link>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        ))}

      </div>
    </Layout>
  );
}