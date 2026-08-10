// src/components/Layout/Footer.jsx
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@db/supabaseClient";
import "@styles/footer.css";

/**
 * @component Footer
 * @description Master multi-column template footer styling utilizing deep plum layouts matching original FAQ specifications.
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

  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* Column 1: Core Branding Block */}
        <div className="footer-brand">
          <div>
            <strong className="footer-brand-title">GenAI Research Labs</strong>
            <br />
            <span className="footer-subtitle">Advancing the frontier of biology through artificial intelligence, transparency, and collaboration.</span>
          </div>
          <address className="footer-address">
            Kowdiar, Thiruvananthapuram, 
            Kerala, India
          </address>
          <p className="footer-copyright">
            © 2026 GenAI Research Labs • Sivasakthi Science Foundation
          </p>
        </div>

        {/* Column 2: Engagement & Utilities */}
        <div className="footer-links">
          <h4>Engage</h4>
          <Link href="/faq">Frequently Asked Questions</Link>
          <Link href="/privacy">Privacy & Terms</Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;