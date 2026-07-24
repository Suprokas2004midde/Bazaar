import React from 'react';
import logo from "../assets/logo.png";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-[var(--border-color)]/40 pt-12 pb-8 text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-10 pb-12">
        <div className="space-y-4">
          <img src={logo} alt="Bazaar Logo" className="w-36 brightness-105" />
          <p className="max-w-md text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal">
            Bazaar is your premier destination for modern lifestyle essentials, fashion, electronics, and daily updates. Crafted with care for extraordinary everyday experiences.
          </p>
        </div>

        <div>
          <p className="text-base font-bold text-[var(--text-main)] mb-4 uppercase tracking-wider">Company</p>
          <ul className="flex flex-col space-y-2 text-xs sm:text-sm text-[var(--text-muted)] font-medium">
            <li><Link to="/" className="hover:text-[var(--primary-accent)] transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-[var(--primary-accent)] transition-colors">About Us</Link></li>
            <li><Link to="/collection" className="hover:text-[var(--primary-accent)] transition-colors">Collection</Link></li>
            <li><span className="hover:text-[var(--primary-accent)] transition-colors cursor-pointer">Privacy Policy</span></li>
          </ul>
        </div>

        <div>
          <p className="text-base font-bold text-[var(--text-main)] mb-4 uppercase tracking-wider">Get in Touch</p>
          <ul className="flex flex-col space-y-2 text-xs sm:text-sm text-[var(--text-muted)] font-medium">
            <li>+91-121-4567-201</li>
            <li>contact@bazaar.com</li>
            <li>Mon - Sat: 9:00 AM - 8:00 PM</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--border-color)]/30 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-[var(--text-muted)] gap-2">
        <p>© 2026 Bazaar.com — All Rights Reserved.</p>
        <p className="font-medium text-[var(--primary-accent)]">Designed with Shadcn UI & Deep Sea Palette</p>
      </div>
    </footer>
  );
};

export default Footer;
