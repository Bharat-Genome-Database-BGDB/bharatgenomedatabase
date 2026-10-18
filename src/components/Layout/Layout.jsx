'use client';

import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ title, description, children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const baseBranding = "Bharat Genome Database";

    if (!title || title.toLowerCase() === "home") {
      document.title = baseBranding;
    } else {
      document.title = `${title} | ${baseBranding}`;
    }

    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
  }, [title, description]);

  return (
    <>
      <Header />
      <main className="content-container">
        {mounted ? children : (
          <div className="container section-stack">
            <div className="catalog-loading-box text-center">Loading...</div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}