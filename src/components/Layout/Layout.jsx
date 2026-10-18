'use client';

import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

/**
 * @component Layout
 * @description Master framework template wrapper.
 */
export default function Layout({ title, description, children }) {
  useEffect(() => {
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
      {/* Changed <main> to <div className="layout-content-wrapper"> to prevent illegal nested <main> tags */}
      <div className="layout-content-wrapper">
        {children}
      </div>
      <Footer />
    </>
  );
}