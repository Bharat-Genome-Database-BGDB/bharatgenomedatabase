'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@db/supabaseClient';
import Layout from '@components/Layout/Layout';
import '@styles/main.css';

export default function CatalogsPage() {
  const [mounted, setMounted] = useState(false);
  const [speciesList, setSpeciesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setMounted(true);
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

  // Guard against server/client hydration mismatch
  if (!mounted) {
    return (
      <Layout>
        <div className="container section-stack">
          <div className="catalog-loading-box text-center">
            Loading species catalog...
          </div>
        </div>
      </Layout>
    );
  }

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
          <div className="catalog-loading-box text-center">
            ⏳ Loading species catalog from database...
          </div>
        )}

        {errorMessage && (
          <div className="catalog-error-box text-center">
            {errorMessage}
          </div>
        )}

        {!loading && activeAlphabetKeys.length === 0 && (
          <div className="card catalog-empty-card text-center">
            <h3 className="card-title">No species found matching your search criteria.</h3>
            <p className="card-body">Try clearing your search filter to view all available entries.</p>
          </div>
        )}

        {/* Alphabet Sections List */}
        {!loading && activeAlphabetKeys.map((letter) => (
          <div key={letter} id={`letter-${letter}`} className="section-stack">

            {/* Alphabet Section Heading */}
            <div className="catalog-section-heading">
              <h2 className="card-title catalog-letter-heading">
                {letter}
              </h2>
              <span className="catalog-count-pill">
                ({groupedByAlphabet[letter].length} species)
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

                      <h3 className="card-title catalog-item-title">
                        {species.common_name}
                      </h3>

                      <p className="catalog-sci-name">
                        {species.scientific_name}
                      </p>

                      {species.family && (
                        <p className="catalog-family-meta">
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