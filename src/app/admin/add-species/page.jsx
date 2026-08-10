'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@db/supabaseClient';
import Layout from '@components/Layout/Layout';
import '@styles/main.css';
import '@styles/pages/admin.css';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to prevent Server-Side Rendering (SSR) window errors in Next.js
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const INITIAL_RESOURCE_ROW = { db_name: '', data_type: '', url: '' };
const INITIAL_JBROWSE_ROW = { track_name: '', jbrowse_url: '', description: '' };

const INITIAL_FORM_STATE = {
  id: null,
  common_name: '',
  scientific_name: '',
  slug: '',
  kingdom: 'Flora',
  phylum: '',
  class: '',
  order_rank: '',
  family: '',
  genus: '',
  species_name: '',
  description: '',
  assembly_accession: '',
  genome_size_mb: '',
  chromosome_count: '',
  annotation_status: 'Completed',
  access_tier: 'student',
  hero_image_url: '',
  cover_image_url: '',
  is_featured: false,
  is_published: true,
  external_resources: [{ ...INITIAL_RESOURCE_ROW }],
  jbrowse_links: [{ ...INITIAL_JBROWSE_ROW }],
};

export default function AdminAddSpeciesPage() {
  const [speciesList, setSpeciesList] = useState([]);
  const [comboboxSearchText, setComboboxSearchText] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const dropdownRef = useRef(null);

  // Workflow Guide Toggle State
  const [showGuide, setShowGuide] = useState(true);

  // Validation & Statuses
  const [slugStatus, setSlugStatus] = useState({ state: 'idle', message: '' });
  const [imageStatus, setImageStatus] = useState({ state: 'idle', message: '' });
  const [globalStatus, setGlobalStatus] = useState({ state: 'idle', message: '' });

  useEffect(() => {
    fetchSpeciesDropdown();
    const savedGuidePref = localStorage.getItem('bgdb_admin_species_guide');
    if (savedGuidePref !== null) {
      setShowGuide(savedGuidePref === 'true');
    }

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleGuide = () => {
    const nextState = !showGuide;
    setShowGuide(nextState);
    localStorage.setItem('bgdb_admin_species_guide', String(nextState));
  };

  const fetchSpeciesDropdown = async () => {
    try {
      const { data, error } = await supabase
        .from('species_catalog')
        .select('id, common_name, scientific_name')
        .order('common_name', { ascending: true });

      if (error) throw error;
      setSpeciesList(data || []);
    } catch (err) {
      console.error('Error fetching species list:', err.message);
    }
  };

  // Filter list dynamically as user types
  const filteredSpecies = speciesList.filter((item) => {
    const query = comboboxSearchText.toLowerCase();
    return (
      item.common_name.toLowerCase().includes(query) ||
      item.scientific_name.toLowerCase().includes(query)
    );
  });

  const checkSlugUniqueness = async (slugToCheck, currentId) => {
    if (!slugToCheck.trim()) {
      setSlugStatus({ state: 'idle', message: '' });
      return;
    }

    setSlugStatus({ state: 'checking', message: 'Checking availability...' });

    try {
      let query = supabase.from('species_catalog').select('id').eq('slug', slugToCheck);
      if (currentId) {
        query = query.neq('id', currentId);
      }

      const { data, error } = await query;
      if (error) throw error;

      if (data && data.length > 0) {
        setSlugStatus({ state: 'taken', message: '⚠️ Slug is already in use by another species!' });
      } else {
        setSlugStatus({ state: 'available', message: '✓ Slug is available' });
      }
    } catch (err) {
      console.error('Slug check failed:', err.message);
      setSlugStatus({ state: 'idle', message: '' });
    }
  };

  const handleSelectSpeciesFromMenu = (species) => {
    setComboboxSearchText(`${species.common_name} (${species.scientific_name})`);
    setIsDropdownOpen(false);
    loadSpeciesData(species.id);
  };

  const loadSpeciesData = async (id) => {
    setGlobalStatus({ state: 'idle', message: '' });
    setImageStatus({ state: 'idle', message: '' });

    try {
      const { data, error } = await supabase
        .from('species_catalog')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          ...INITIAL_FORM_STATE,
          ...data,
          phylum: data.phylum || '',
          class: data.class || '',
          order_rank: data.order_rank || '',
          family: data.family || '',
          genus: data.genus || '',
          species_name: data.species_name || '',
          genome_size_mb: data.genome_size_mb || '',
          chromosome_count: data.chromosome_count || '',
          external_resources:
            Array.isArray(data.external_resources) && data.external_resources.length > 0
              ? data.external_resources
              : [{ ...INITIAL_RESOURCE_ROW }],
          jbrowse_links:
            Array.isArray(data.jbrowse_links) && data.jbrowse_links.length > 0
              ? data.jbrowse_links
              : [{ ...INITIAL_JBROWSE_ROW }],
        });
        
        checkSlugUniqueness(data.slug, data.id);
      }
    } catch (err) {
      console.error('Error fetching record:', err.message);
      setGlobalStatus({ state: 'error', message: 'Failed to load species details.' });
    }
  };

  const handleCancel = () => {
    if (formData.id) {
      loadSpeciesData(formData.id);
      setGlobalStatus({ state: 'idle', message: 'Unsaved edits canceled.' });
    } else {
      setComboboxSearchText('');
      setFormData(INITIAL_FORM_STATE);
      setSlugStatus({ state: 'idle', message: '' });
      setImageStatus({ state: 'idle', message: '' });
      setGlobalStatus({ state: 'idle', message: 'Form cleared.' });
    }
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    
    setFormData((prev) => {
      const updated = { ...prev, [id]: type === 'checkbox' ? checked : value };

      if (id === 'common_name' && !prev.id) {
        const generatedSlug = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/[\s_]+/g, '-');
        updated.slug = generatedSlug;
        checkSlugUniqueness(generatedSlug, prev.id);
      }

      return updated;
    });

    if (id === 'slug') {
      checkSlugUniqueness(value, formData.id);
    }
  };

  // Dedicated handler for ReactQuill rich text changes
  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  // Handlers for External Databases & Links
  const handleResourceChange = (index, field, value) => {
    const updated = [...formData.external_resources];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, external_resources: updated }));
  };

  const handleAddResourceRow = () => {
    setFormData((prev) => ({
      ...prev,
      external_resources: [...prev.external_resources, { ...INITIAL_RESOURCE_ROW }],
    }));
  };

  const handleRemoveResourceRow = (index) => {
    const updated = formData.external_resources.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      external_resources: updated.length > 0 ? updated : [{ ...INITIAL_RESOURCE_ROW }],
    }));
  };

  // Handlers for JBrowse Genome Links
  const handleJBrowseChange = (index, field, value) => {
    const updated = [...formData.jbrowse_links];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, jbrowse_links: updated }));
  };

  const handleAddJBrowseRow = () => {
    setFormData((prev) => ({
      ...prev,
      jbrowse_links: [...prev.jbrowse_links, { ...INITIAL_JBROWSE_ROW }],
    }));
  };

  const handleRemoveJBrowseRow = (index) => {
    const updated = formData.jbrowse_links.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      jbrowse_links: updated.length > 0 ? updated : [{ ...INITIAL_JBROWSE_ROW }],
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageStatus({ state: 'uploading', message: 'Uploading image to species-media...' });

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `catalog-media/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('species-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('species-media')
        .getPublicUrl(filePath);

      setFormData((prev) => ({
        ...prev,
        cover_image_url: publicUrlData.publicUrl,
        hero_image_url: publicUrlData.publicUrl,
      }));

      setImageStatus({ state: 'success', message: '✓ Image uploaded successfully! URL attached.' });
    } catch (err) {
      console.error('Image upload failed:', err.message);
      setImageStatus({ state: 'error', message: `Upload failed: ${err.message}. Check storage policies.` });
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, cover_image_url: '', hero_image_url: '' }));
    setImageStatus({ state: 'idle', message: 'Image removed.' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (slugStatus.state === 'taken') {
      setGlobalStatus({ state: 'error', message: 'Cannot save: URL Slug is already taken by another entry.' });
      return;
    }

    setGlobalStatus({ state: 'saving', message: 'Saving species record to database...' });

    const cleanedResources = formData.external_resources.filter(
      (res) => res.db_name.trim() !== '' || res.url.trim() !== ''
    );

    const cleanedJBrowse = formData.jbrowse_links.filter(
      (jb) => jb.track_name.trim() !== '' || jb.jbrowse_url.trim() !== ''
    );

    const payload = {
      common_name: formData.common_name,
      scientific_name: formData.scientific_name,
      slug: formData.slug,
      kingdom: formData.kingdom,
      phylum: formData.phylum || null,
      class: formData.class || null,
      order_rank: formData.order_rank || null,
      family: formData.family || null,
      genus: formData.genus || null,
      species_name: formData.species_name || null,
      description: formData.description || null,
      assembly_accession: formData.assembly_accession || null,
      genome_size_mb: formData.genome_size_mb ? parseFloat(formData.genome_size_mb) : null,
      chromosome_count: formData.chromosome_count ? parseInt(formData.chromosome_count, 10) : null,
      annotation_status: formData.annotation_status,
      access_tier: formData.access_tier,
      hero_image_url: formData.hero_image_url || null,
      cover_image_url: formData.cover_image_url || null,
      is_featured: formData.is_featured,
      is_published: formData.is_published,
      external_resources: cleanedResources,
      jbrowse_links: cleanedJBrowse,
      updated_at: new Date().toISOString(),
    };

    try {
      if (formData.id) {
        const { error } = await supabase
          .from('species_catalog')
          .update(payload)
          .eq('id', formData.id);

        if (error) throw error;
        setGlobalStatus({ state: 'success', message: `Successfully updated "${formData.common_name}"!` });
      } else {
        const { data, error } = await supabase
          .from('species_catalog')
          .insert([payload])
          .select();

        if (error) throw error;
        setGlobalStatus({ state: 'success', message: `Successfully added "${formData.common_name}" to catalog!` });

        if (data && data[0]) {
          setComboboxSearchText(`${data[0].common_name} (${data[0].scientific_name})`);
          setFormData((prev) => ({ ...prev, id: data[0].id }));
        }
      }

      fetchSpeciesDropdown();
    } catch (err) {
      console.error('Database save error:', err.message);
      setGlobalStatus({ state: 'error', message: `Error: ${err.message}` });
    }
  };

  // Quill Toolbar Modules Configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'clean'],
    ],
  };

  return (
    <Layout>
      <div className="content-wrapper admin-wrapper">
        
        {/* Header Control Bar */}
        <div className="admin-header">
          <div>
            <h1 className="hero-title admin-header-title">
              {formData.id ? 'Edit Species Entry' : 'Add New Species'}
            </h1>
            <p className="admin-header-subtitle">
              Curate taxonomy, genome metrics, and public catalog visibility for BGDB.
            </p>
          </div>

          <div className="admin-header-actions">
            <button
              type="button"
              onClick={toggleGuide}
              className="btn-outline admin-btn-sm"
            >
              <span>{showGuide ? '▼ Hide Guide' : '▶ Workflow Guide'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setComboboxSearchText(''); setFormData(INITIAL_FORM_STATE); setGlobalStatus({ state: 'idle', message: '' }); }}
              className="btn-solid admin-btn-md"
            >
              + Create New Entry
            </button>
          </div>
        </div>

        {/* Workflow Guide Banner */}
        {showGuide && (
          <div className="card admin-guide-card">
            <div className="admin-guide-title">
              📋 Species Catalog Curation Lifecycle:
            </div>
            <div className="admin-guide-grid">
              <div><strong>1. Select / Search:</strong> Click arrow to view all species or type to filter live. Click any match to edit.</div>
              <div><strong>2. Basic Info & Images:</strong> Enter naming, slugs, and upload cover photos.</div>
              <div><strong>3. Description & Ranks:</strong> Format detailed summaries and fill biological classification ranks.</div>
              <div><strong>4. Tools & Metrics:</strong> Attach JBrowse genomic browsers, database links, and genome metrics before publishing.</div>
            </div>
          </div>
        )}

        {/* Searchable Custom Combobox Selector */}
        <div className="card admin-select-card">
          <label htmlFor="species_combobox_input" className="admin-select-label">
            Search or Select Existing Species to Edit:
          </label>
          
          <div className="admin-combobox-wrap" ref={dropdownRef}>
            <div className="admin-combobox-input-group" style={{ width: '100%' }}>
              <input
                id="species_combobox_input"
                type="text"
                className="admin-combobox-input"
                placeholder="🔍 Click arrow on right or type to search species..."
                value={comboboxSearchText}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setComboboxSearchText(e.target.value);
                  setIsDropdownOpen(true);
                }}
              />
              <span
                className="admin-combobox-arrow"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                style={{ cursor: 'pointer' }}
              >
                ▼
              </span>

              {comboboxSearchText && (
                <button
                  type="button"
                  onClick={() => { setComboboxSearchText(''); setFormData(INITIAL_FORM_STATE); setIsDropdownOpen(false); }}
                  className="admin-combobox-clear"
                  style={{ marginLeft: '0.5rem' }}
                  title="Clear selection to create a new entry"
                >
                  ✕ Clear
                </button>
              )}
            </div>

            {/* Floating Options Menu */}
            {isDropdownOpen && (
              <ul className="admin-combobox-dropdown">
                {filteredSpecies.length > 0 ? (
                  filteredSpecies.map((item) => (
                    <li
                      key={item.id}
                      className="admin-combobox-item"
                      onClick={() => handleSelectSpeciesFromMenu(item)}
                    >
                      <span className="admin-combobox-item-name">{item.common_name}</span>
                      <span className="admin-combobox-item-sci">{item.scientific_name}</span>
                    </li>
                  ))
                ) : (
                  <li className="admin-combobox-no-results">
                    No matching species found. (Click "+ Create New Entry" above to add new)
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Global Save Feedback Box */}
        {globalStatus.message && (
          <div className={`admin-status-box ${globalStatus.state}`}>
            {globalStatus.message}
          </div>
        )}

        {/* Main Curation Form (Reordered as requested) */}
        <form onSubmit={handleSubmit} className="card admin-form-card">
          
          {/* SECTION 1: BASIC IDENTIFICATION & SLUG CHECK */}
          <div>
            <h3 className="admin-section-title">
              1. Basic Identification & Slug Check
            </h3>
            <div className="admin-grid-3">
              <div>
                <label htmlFor="common_name" className="admin-form-label">
                  Common Name *
                </label>
                <input
                  id="common_name"
                  type="text"
                  required
                  placeholder="e.g. Mango"
                  value={formData.common_name}
                  onChange={handleChange}
                  className="admin-input-text"
                />
              </div>

              <div>
                <label htmlFor="scientific_name" className="admin-form-label">
                  Scientific Name *
                </label>
                <input
                  id="scientific_name"
                  type="text"
                  required
                  placeholder="e.g. Mangifera indica"
                  value={formData.scientific_name}
                  onChange={handleChange}
                  className="admin-input-text"
                />
              </div>

              <div>
                <label htmlFor="slug" className="admin-form-label">
                  URL Slug *
                </label>
                <input
                  id="slug"
                  type="text"
                  required
                  placeholder="e.g. mango"
                  value={formData.slug}
                  onChange={handleChange}
                  className={`admin-input-text ${slugStatus.state === 'taken' ? 'error' : ''}`}
                />
                {slugStatus.message && (
                  <span className={`admin-inline-validation ${slugStatus.state}`}>
                    {slugStatus.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: COVER IMAGE */}
          <div>
            <h3 className="admin-section-title">
              2. Cover Image
            </h3>
            <div className="admin-upload-box">
              <label className="admin-form-label">
                Upload Cover Photo (Max: 2MB | JPEG, PNG, WebP)
              </label>
              
              <input
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleImageUpload}
                disabled={imageStatus.state === 'uploading'}
              />

              {imageStatus.message && (
                <div className={`admin-upload-status ${imageStatus.state}`}>
                  {imageStatus.message}
                </div>
              )}

              {formData.cover_image_url && (
                <div className="admin-image-preview-card">
                  <img
                    src={formData.cover_image_url}
                    alt="Uploaded species cover"
                    className="admin-preview-thumbnail"
                  />
                  <div className="admin-preview-info">
                    <div className="admin-preview-info-title">Active Cover Image Attached</div>
                    <div className="admin-preview-info-url">{formData.cover_image_url}</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="btn-outline admin-btn-sm"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: DESCRIPTION */}
          <div>
            <h3 className="admin-section-title">
              3. Description & Overview
            </h3>
            <div>
              <label className="admin-form-label" style={{ marginBottom: '0.5rem' }}>
                Species Detailed Overview & Summary (Paste with formatting enabled)
              </label>
              
              <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  modules={quillModules}
                  placeholder="Type or paste formatted text, bullets, or links from external documents here..."
                  style={{ minHeight: '180px' }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: TAXONOMIC RANKS */}
          <div>
            <h3 className="admin-section-title">
              4. Taxonomic Ranks
            </h3>
            <div className="admin-grid-taxonomy">
              <div>
                <label htmlFor="kingdom" className="admin-form-label">
                  Kingdom *
                </label>
                <select
                  id="kingdom"
                  className="admin-input-text"
                  value={formData.kingdom}
                  onChange={handleChange}
                >
                  <option value="Flora">Flora (Plantae)</option>
                  <option value="Fauna">Fauna (Animalia)</option>
                  <option value="Microbes">Microbes</option>
                  <option value="Disease">Disease</option>
                </select>
              </div>

              <div>
                <label htmlFor="phylum" className="admin-form-label">Phylum</label>
                <input id="phylum" type="text" placeholder="e.g. Angiosperms" value={formData.phylum} onChange={handleChange} className="admin-input-text" />
              </div>

              <div>
                <label htmlFor="class" className="admin-form-label">Class</label>
                <input id="class" type="text" placeholder="e.g. Eudicots" value={formData.class} onChange={handleChange} className="admin-input-text" />
              </div>

              <div>
                <label htmlFor="order_rank" className="admin-form-label">Order</label>
                <input id="order_rank" type="text" placeholder="e.g. Sapindales" value={formData.order_rank} onChange={handleChange} className="admin-input-text" />
              </div>

              <div>
                <label htmlFor="family" className="admin-form-label">Family</label>
                <input id="family" type="text" placeholder="e.g. Anacardiaceae" value={formData.family} onChange={handleChange} className="admin-input-text" />
              </div>

              <div>
                <label htmlFor="genus" className="admin-form-label">Genus</label>
                <input id="genus" type="text" placeholder="e.g. Mangifera" value={formData.genus} onChange={handleChange} className="admin-input-text" />
              </div>

              <div>
                <label htmlFor="species_name" className="admin-form-label">Species</label>
                <input id="species_name" type="text" placeholder="e.g. indica" value={formData.species_name} onChange={handleChange} className="admin-input-text" />
              </div>
            </div>
          </div>

          {/* SECTION 5: EXTERNAL DATABASES & LINKS */}
          <div>
            <div className="admin-resource-header">
              <h3 className="admin-resource-title">5. External Databases & Links</h3>
              <button
                type="button"
                onClick={handleAddResourceRow}
                className="admin-btn-add-resource"
              >
                + Add Resource Link
              </button>
            </div>

            {formData.external_resources.map((res, idx) => (
              <div key={idx} className="admin-resource-row">
                <input type="text" placeholder="Database Name (e.g. NCBI)" value={res.db_name} onChange={(e) => handleResourceChange(idx, 'db_name', e.target.value)} className="admin-input-text" />
                <input type="url" placeholder="URL (e.g. https://...)" value={res.url} onChange={(e) => handleResourceChange(idx, 'url', e.target.value)} className="admin-input-text" />
                <button type="button" onClick={() => handleRemoveResourceRow(idx)} className="admin-btn-remove">✕</button>
              </div>
            ))}
          </div>

          {/* SECTION 6: JBROWSE, ETC. */}
          <div>
            <div className="admin-resource-header">
              <h3 className="admin-resource-title">6. JBrowse & Genome Browsers</h3>
              <button
                type="button"
                onClick={handleAddJBrowseRow}
                className="admin-btn-add-resource"
              >
                + Add JBrowse Link
              </button>
            </div>
            <p className="admin-header-subtitle" style={{ marginBottom: '1rem' }}>
              Attach interactive browser endpoints (e.g., JBrowse 2 chromosome assemblies or track views).
            </p>

            {formData.jbrowse_links.map((jb, idx) => (
              <div key={idx} className="admin-resource-row" style={{ gridTemplateColumns: '1fr 2fr 1fr auto' }}>
                <input 
                  type="text" 
                  placeholder="Track / Assembly Name (e.g. v2 Scaffold)" 
                  value={jb.track_name} 
                  onChange={(e) => handleJBrowseChange(idx, 'track_name', e.target.value)} 
                  className="admin-input-text" 
                />
                <input 
                  type="url" 
                  placeholder="JBrowse HTML URL (e.g. https://.../baniyan-tree.html)" 
                  value={jb.jbrowse_url} 
                  onChange={(e) => handleJBrowseChange(idx, 'jbrowse_url', e.target.value)} 
                  className="admin-input-text" 
                />
                <input 
                  type="text" 
                  placeholder="Short Description (Optional)" 
                  value={jb.description} 
                  onChange={(e) => handleJBrowseChange(idx, 'description', e.target.value)} 
                  className="admin-input-text" 
                />
                <button type="button" onClick={() => handleRemoveJBrowseRow(idx)} className="admin-btn-remove">✕</button>
              </div>
            ))}
          </div>

          {/* SECTION 7: GENOMIC METRICS */}
          <div>
            <h3 className="admin-section-title">
              7. Genomic Metrics
            </h3>
            <div className="admin-grid-taxonomy">
              <div>
                <label htmlFor="assembly_accession" className="admin-form-label">Assembly Accession</label>
                <input id="assembly_accession" type="text" placeholder="e.g. GCA_000000000.1" value={formData.assembly_accession} onChange={handleChange} className="admin-input-text" />
              </div>

              <div>
                <label htmlFor="genome_size_mb" className="admin-form-label">Genome Size (Mb)</label>
                <input id="genome_size_mb" type="number" step="0.01" placeholder="e.g. 392.5" value={formData.genome_size_mb} onChange={handleChange} className="admin-input-text" />
              </div>

              <div>
                <label htmlFor="chromosome_count" className="admin-form-label">Chromosomes</label>
                <input id="chromosome_count" type="number" placeholder="e.g. 20" value={formData.chromosome_count} onChange={handleChange} className="admin-input-text" />
              </div>
            </div>
          </div>

          {/* SECTION 8: VISIBILITY TOGGLES */}
          <div className="admin-checkbox-group">
            <label className="admin-checkbox-label">
              <input id="is_published" type="checkbox" checked={formData.is_published} onChange={handleChange} />
              <span>Publish to Public Catalog</span>
            </label>

            <label className="admin-checkbox-label">
              <input id="is_featured" type="checkbox" checked={formData.is_featured} onChange={handleChange} />
              <span>Feature on Homepage</span>
            </label>
          </div>

          {/* ACTION BUTTONS */}
          <div className="admin-action-bar">
            <button
              type="submit"
              disabled={globalStatus.state === 'saving' || slugStatus.state === 'taken'}
              className="btn-solid admin-btn-lg"
            >
              {globalStatus.state === 'saving' ? 'Saving...' : formData.id ? 'Update Species' : 'Save New Species'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="btn-outline admin-btn-cancel"
            >
              Cancel / Reset
            </button>
          </div>

        </form>
      </div>
    </Layout>
  );
}