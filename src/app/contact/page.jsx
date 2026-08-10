'use client';

import { useState } from "react";
import Layout from "@components/Layout/Layout";
import { supabase } from "@db/supabaseClient";
import "@styles/main.css";

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const company = formData.get("company");
    const formIntent = formData.get("form_intent");
    const subject = formData.get("subject");
    const message = formData.get("message");

    try {
      const { error: supabaseError } = await supabase
        .from("contact_submissions")
        .insert([{
          org_slug: "bharatgenomedatabase",
          name,
          email,
          company,
          form_intent: formIntent || "contact_page",
          subject,
          message,
          status: "pending"
        }]);

      if (supabaseError) throw new Error(supabaseError.message);

      setFormStatus("success");
      e.target.reset();
    } catch (error) {
      setFormStatus("error");
      setErrorMessage(error.message || "Failed to submit inquiry. Please try again.");
    }
  };

  return (
    <Layout 
      title="Contact & Support" 
      description="Get in touch with Bharat Genome Database for data access, internship applications, and research collaborations."
    >
      <main className="container" style={{ paddingTop: '40px' }}>
        <header className="hero hero-tinted mb-lg" style={{ borderRadius: 'var(--border-radius-bento, 12px)' }}>
          <div className="hero-content">
            <span className="hero-badge">Get In Touch</span>
            <h1 className="hero-title">Contact & Collaborations</h1>
            <p className="hero-tagline">
              Connect with our team for genomic dataset requests, internship intake, ODOG project proposals, or bio-computational pipeline access.
            </p>
          </div>
        </header>

        <section className="contact-grid-layout" style={{ marginTop: '40px' }}>
          {/* Left Column: Context Channels */}
          <div className="section-stack">
            <div className="card contact-sidebar">
              <div className="icon-box"><i className="fas fa-database"></i></div>
              <h3 className="card-title">Database Headquarters</h3>
              <p className="card-body">
                Bharat Genome Database Core<br />
                Sivasakthi Science Foundation<br />
                Kawdiar, Thiruvananthapuram, Kerala, India
              </p>
            </div>

            <div className="card contact-sidebar">
              <div className="icon-box"><i className="fas fa-dna"></i></div>
              <h3 className="card-title">Data Access & Submissions</h3>
              <p className="card-body">
                We support open-access requests for FASTA/FASTQ sequence assemblies, JBrowse map embeds, and custom annotation pipeline runs.
              </p>
            </div>

            <div className="card contact-sidebar">
              <div className="icon-box"><i className="fas fa-graduation-cap"></i></div>
              <h3 className="card-title">Internships & Academic Intake</h3>
              <p className="card-body">
                Students, bioinformatics researchers, and computational biologists can apply for:
              </p>
              <ul className="card-list" style={{ gridTemplateColumns: '1fr', marginTop: '12px' }}>
                <li><i className="fas fa-check" style={{ color: 'var(--brand-primary)', marginRight: '8px' }}></i> Genomic Data Curation Fellowships</li>
                <li><i className="fas fa-check" style={{ color: 'var(--brand-primary)', marginRight: '8px' }}></i> One Species One Genome (ODOG) Field Intake</li>
                <li><i className="fas fa-check" style={{ color: 'var(--brand-primary)', marginRight: '8px' }}></i> Computational Pipeline Engineering</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Interaction Form Block */}
          <section className="card">
            <h3 className="card-title">Submit Inquiry or Application</h3>
            <form onSubmit={handleSubmit} className="contact-form" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label htmlFor="name">Full Name / Lead Applicant</label>
                <input type="text" id="name" name="name" placeholder="Dr. / Prof. / Full Name" required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="name@institution.edu" required />
              </div>

              <div className="form-group">
                <label htmlFor="company">Institution / University / Organization</label>
                <input type="text" id="company" name="company" placeholder="e.g. University of Kerala / Independent Research" />
              </div>

              <div className="form-group">
                <label htmlFor="form_intent">Inquiry Classification</label>
                <select id="form_intent" name="form_intent" required defaultValue="general_inquiry">
                  <option value="general_inquiry">General Inquiry</option>
                  <option value="internship_application">Internship / Fellowship Application</option>
                  <option value="data_access">Genomic Data / FASTA Request</option>
                  <option value="odog_proposal">ODOG Species Proposal</option>
                  <option value="pipeline_collaboration">Pipeline & Tool Integration</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" placeholder="Brief summary of your inquiry..." required />
              </div>

              <div className="form-group">
                <label htmlFor="message">Details / Proposal Summary</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5" 
                  placeholder="Describe your research goals, background, or data requirements..." 
                  required
                ></textarea>
              </div>

              {formStatus === "success" && (
                <p className="form-feedback success">✓ Thank you! Your submission has been received and routed to the BGDB team.</p>
              )}
              {formStatus === "error" && (
                <p className="form-feedback error">⚠ Error: {errorMessage}</p>
              )}

              <button type="submit" className="submit-btn" disabled={formStatus === "submitting"}>
                {formStatus === "submitting" ? "Submitting..." : "Submit Submission"}
              </button>
            </form>
          </section>
        </section>
      </main>
    </Layout>
  );
}