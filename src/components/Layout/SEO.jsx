'use client';
import React from 'react';
import Head from 'next/head';

/**
 * @component SEO
 * @description Standardized SEO component for Bharat Genome Database (BGDB).
 * Locks in brand metadata and social preview cards across all routes.
 * @param {string} title - Page-specific title
 * @param {string} description - Meta description
 * @param {string} keywords - Array of keyword strings
 * @param {string} image - Path to the social sharing image
 */
const SEO = ({ title, description, keywords, image }) => {
  // --- PROJECT-SPECIFIC BRANDING (BGDB Configuration) ---
  const brandName = 'Bharat Genome Database™';
  const titleSuffix = ' | Bharat Genome Database™';
  const siteUrl = 'https://bharatgenomedatabase.org';
  const defaultImage = '/images/global/Seo_bgdb.png';
  
  // --- LOGIC ---
  const pageTitle = title 
    ? `${title}${titleSuffix}` 
    : brandName;

  const pageDescription = description || 'India\'s National Genomic Data Repository and Bio-computational Research Platform.';
  const pageKeywords = keywords?.join(', ') || 'Bharat Genome Database, BGDB, Genomics, FASTA, Bio-computational Pipelines, JBrowse, India';
  const pageImage = image || `${siteUrl}${defaultImage}`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />

      {/* Twitter */}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default SEO;