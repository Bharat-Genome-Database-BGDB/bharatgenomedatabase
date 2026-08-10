'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@db/supabaseClient";
import "@styles/footer.css";

/**
 * @component Footer
 * @description Master multi-column footer component for Bharat Genome Database (BGDB).
 */
const Footer = () => {
  const [userRole, setUserRole] = useState("public");
  const [loading, setLoading] = useState(true);

  // --- Auth Role-Based Access Control (RBAC) Listener ---
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setUserRole("public");
          return;
        }

        const { data: roleData, error } = await supabase
          .from("user_role_assignments")
          .select("role")
          .eq("user_id", session.user.id)
          .single();

        if (!error && roleData?.role) {
          setUserRole(roleData.role.toLowerCase());
        }
      } catch (err) {
        // Silently capture for standard public navigation views
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  const currentYear = new Date().getFullYear();
  const isAdminUser = ["admin", "superadmin", "curator"].includes(userRole);

  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* Column 1: Core Branding Block */}
        <div className="footer-brand">
          <div>
            <strong className="footer-brand-title">Bharat Genome Database</strong>
            <br />
            <span className="footer-subtitle">
              India's open genomic knowledge repository and bio-computational research engine.
            </span>
          </div>
          <address className="footer-address">
            Kowdiar, Thiruvananthapuram, Kerala, India
          </address>
          <p className="footer-copyright">
            © {currentYear} Bharat Genome Database • Sivasakthi Science Foundation
          </p>
        </div>

        {/* Column 2: Catalogs & Research */}
        <div className="footer-links">
          <h4>Resources</h4>
          <Link href="/faq">Frequently Asked Questions</Link>
          <Link href="/privacy">Privacy & Terms</Link>
          {isAdminUser && (
            <a 
              href="https://sivasakthifoundation.org/admin/dashboard" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-admin-link"
            >
              Admin Portal <i className="fas fa-external-link-alt"></i>
            </a>
          )}
        </div>

      </div>
    </footer>
  );
};

export default Footer;