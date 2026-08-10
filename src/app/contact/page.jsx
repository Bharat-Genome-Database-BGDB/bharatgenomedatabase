'use client';

import { useState } from "react";
import Layout from "@layout/Layout";
import { supabase } from "@db/supabaseClient";
import "@styles/main.css";
import "@styles/components/forms.css";

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
    const subject = formData.get("subject");
    const message = formData.get("message");

    try {
      const { error: supabaseError } = await supabase
        .from("contact_submissions")
        .insert([{
          org_slug: "genairesearch",
          name,
          email,
          subject,
          message,
          form_intent: "contact_page",
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
    <Layout title="Contact & Connect" description="Get in touch with GenAI Research Labs.">
      <main className="container py-xl">
        <header className="hero mb-lg">
          <h1 className="hero-title">Contact & Collaborations</h1>
          <p className="hero-tagline">
            Connect with our team for research joint-ventures, academic fellowships, or data pipeline inquiries.
          </p>
        </header>

        <section className="contact-grid-layout">
          {/* Left Column: Context Channels */}
          <div className="section-stack">
            <div className="card p-xl contact-sidebar">
              <div className="icon-box"><i className="fas fa-atom"></i></div>
              <h3 className="card-title">Research Lab Headquarters</h3>
              <p className="card-body">
                GenAI Research Labs<br />
                7, Belhaven Gardens, Kawdiar,<br />
                Thiruvananthapuram, Kerala, India
              </p>
            </div>

            <div className="card p-xl contact-sidebar">
              <div className="icon-box"><i className="fas fa-dna"></i></div>
              <h3 className="card-title">Multi-Omics & Joint Processing</h3>
              <p className="card-body">
                We welcome joint biological processing requests, open-source model configuration evaluations, and deep learning computational project proposals.
              </p>
            </div>

            <div className="card p-xl contact-sidebar">
              <div className="icon-box"><i className="fas fa-graduation-cap"></i></div>
              <h3 className="card-title">Internships & Fellowships</h3>
              <p className="card-body">Academic researchers, bioinformatics graduates, and AI engineers can interface with our pipelines via:</p>
              <ul className="card-list">
                <li>Computational genomics bootcamps</li>
                <li>Postdoctoral research positions</li>
                <li>Open-source dataset contributions</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Interaction Form Block */}
          <section className="card p-xl">
            <h3 className="card-title">Submit Pipeline Inquiry</h3>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name / Lead Investigator</label>
                <input type="text" id="name" name="name" placeholder="Dr. / Prof. / Your name" required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Institutional Email Address</label>
                <input type="email" id="email" name="email" placeholder="name@university.edu" required />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Inquiry Classification</label>
                <input type="text" id="subject" name="subject" placeholder="Research Proposal, Dataset Access, or Fellowship" required />
              </div>

              <div className="form-group">
                <label htmlFor="message">Collaboration or Technical Details</label>
                <textarea id="message" name="message" rows="5" placeholder="Describe your computational needs, model requirements, or research parameters..." required></textarea>
              </div>

              {formStatus === "success" && (
                <p className="form-feedback success">✓ Thank you! Your pipeline inquiry has been submitted.</p>
              )}
              {formStatus === "error" && (
                <p className="form-feedback error">⚠ Error: {errorMessage}</p>
              )}

              <button type="submit" className="submit-btn" disabled={formStatus === "submitting"}>
                {formStatus === "submitting" ? "Submitting Inquiry..." : "Submit Inquiry"}
              </button>
            </form>
          </section>
        </section>
      </main>
    </Layout>
  );
}