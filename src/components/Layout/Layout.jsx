'use client';

import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

/**
 * @component Layout
 * @description Master template wrapper handling document titles, 
 * page meta descriptions, and rendering the global Header and Footer shell for BGDB.
 */
export default function Layout({ title, description, children }) {

  useEffect(() => {
    const baseBranding = "Bharat Genome Database";

    // 1. Safe Title Update
    if (!title || title.toLowerCase() === "home") {
      document.title = baseBranding;
    } else {
      document.title = `${title} | ${baseBranding}`;
    }

    // 2. Safe Meta Description Update
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
  }, [title, description]);

  return (
    <>
      <Header />
      <main className="content-container">{children}</main>
      <Footer />
    </>
  );
}