'use client';

import { useState } from "react";
import "@styles/main.css";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "What is GenAI Research Labs?",
      a: "GenAI Research Labs is an interdisciplinary computational research arm operating under the Sivasakthi Science Foundation umbrella. We focus explicitly on the intersection of deep learning and multi-omics, developing state-of-the-art machine learning models to decode complex biological sequences, accelerate structural biology pipelines, and optimize drug discovery."
    },
    {
      q: "How does GenAI Research Labs utilize machine learning in genomics?",
      a: "We train and fine-tune specialized transformer architectures and deep convolutional networks on massive, curated multi-omics datasets. These neural networks are designed to capture complex spatial and evolutionary relationships within biological data, enabling tasks like variant pathogenicity prediction, structural protein modeling, and structural variations classification."
    },
    {
      q: "What is the relationship between GenAI Research Labs and the Bharat Genome Database (BGDB)?",
      a: "GenAI Research Labs serves as the core engineering and analytical backbone for the Bharat Genome Database. While BGDB functions as a highly secure, role-based genomic storage network and sequence visualization browser, our lab builds the deep learning pipelines that ingest, clean, and run downstream predictive modeling over those population-scale variant sets."
    },
    {
      q: "Are the models and datasets developed here open-source?",
      a: "We are committed to open-source reproducibility. Our model weights, structural pipeline configurations, and utility training benchmarks are routinely deployed to GitHub for academic verification. However, institutional clinical trial pipelines and raw patient genomic data remains strictly protected using multi-tenant security layers."
    },
    {
      q: "How can academic institutes or clinical groups collaborate with the lab?",
      a: "Research institutions can submit joint biological processing requests or deep learning project proposals through our computational intake channels. Collaborators often leverage our high-performance infrastructure to run specialized model evaluations, scale mutation processing pipelines, or collaborate on structural biology papers."
    },
    {
      q: "What training pathways are available for researchers and interns?",
      a: "We host intensive computational genomics bootcamps, master's thesis mentorship programs, and postdoctoral fellowships. Selected participants interface directly with our model pipelines, learning to manage high-throughput deep learning training loops, handle massive sequence alignment indices, and engineer performant bioinformatics data loaders."
    }
  ];

  return (
    <Layout title="FAQ" description="Frequently Asked Questions">
      
      <header className="hero-identity-group">
        <h1 className="hero-main-title">Frequently Asked Questions</h1>
        <p className="hero-sub-tagline">
          Common inquiries regarding computational access, research partnerships, open-access databases, and academic fellowships.
        </p>
      </header>

      <div className="faq-list">
        {faqs.map((faq, idx) => (
          <article key={idx} className="card">
            <h3 className="faq-question">
              <i className="fas fa-question-circle"></i>
              {faq.q}
            </h3>
            <div className="faq-answer">
              <p className="body-text">{faq.a}</p>
            </div>
          </article>
        ))}
      </div>

    </Layout>
  );

}