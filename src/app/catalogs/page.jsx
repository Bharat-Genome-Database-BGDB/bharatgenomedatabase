'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@db/supabaseClient';
import Layout from '@components/Layout/Layout';
import '@styles/main.css';
import '@styles/catalog.css';

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
      <div className="content-wrapper catalog-wrapper">
        
        {/* Page Header Section */}
        <div className="catalog-hero-section">
          <h1 className="hero-title catalog-hero-title">
            Species Genome Catalog
          </h1>
          <p className="catalog-hero-subtitle">
            Explore sequenced flora, fauna, and microbial genomes cataloged across the Bharat Genome Database. Browse alphabetically or search live records.
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="card catalog-search-card">
          <div className="catalog-search-group">
            <label htmlFor="catalog_search" className="catalog-search-label">
              Filter Catalog Contents:
            </label>
            <input
              id="catalog_search"
              type="text"
              className="catalog-search-input"
              placeholder="🔍 Search by common name (e.g., Mango), scientific name (e.g., Mangifera), or family..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Quick-Jump Alphabet Anchor Bar */}
        {!loading && activeAlphabetKeys.length > 0 && (
          <div className="catalog-jump-bar">
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
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b', fontSize: '1.1rem' }}>
            ⏳ Loading species catalog from database...
          </div>
        )}

        {errorMessage && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#dc2626', background: '#ffeeec', borderRadius: '8px' }}>
            {errorMessage}
          </div>
        )}

        {!loading && activeAlphabetKeys.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
            <h3>No species found matching your search criteria.</h3>
            <p>Try clearing your search filter to view all available entries.</p>
          </div>
        )}

        {/* Alphabet Sections List */}
        {!loading && activeAlphabetKeys.map((letter) => (
          <div key={letter} id={`letter-${letter}`} className="catalog-letter-section">
            
            {/* Alphabet Section Heading */}
            <div className="catalog-letter-header">
              <h2 className="catalog-letter-title">
                {letter}
              </h2>
              <span className="catalog-letter-count">
                ({groupedByAlphabet[letter].length} {groupedByAlphabet[letter].length === 1 ? 'species' : 'species'})
              </span>
            </div>

            {/* Species Grid for this Letter */}
            <div className="catalog-species-grid">
              {groupedByAlphabet[letter].map((species) => (
                <div key={species.id} className="card catalog-species-card">
                  
                  {species.cover_image_url ? (
                    <div className="catalog-species-img-wrap">
                      <img 
                        src={species.cover_image_url} 
                        alt={species.common_name} 
                        className="catalog-species-img"
                      />
                    </div>
                  ) : (
                    <div className="catalog-species-placeholder">
                      🧬 {species.kingdom || 'Genomic Specimen'}
                    </div>
                  )}

                  <div className="catalog-species-body">
                    <div>
                      <div className="catalog-badge-row">
                        <span className="catalog-kingdom-badge">
                          {species.kingdom || 'Flora'}
                        </span>
                        {species.access_tier && (
                          <span className="catalog-tier-label">
                            Tier: {species.access_tier}
                          </span>
                        )}
                      </div>

                      <h3 className="catalog-common-name">
                        {species.common_name}
                      </h3>

                      <p className="catalog-sci-name">
                        {species.scientific_name}
                      </p>

                      {species.family && (
                        <p className="catalog-family-text">
                          <strong>Family:</strong> {species.family}
                        </p>
                      )}
                    </div>

                    <div className="catalog-card-footer">
                      <Link
                        href={`/catalogs/${species.slug}`}
                        className="btn-solid"
                        style={{ display: 'block', textAlign: 'center', padding: '0.6rem 1rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}
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