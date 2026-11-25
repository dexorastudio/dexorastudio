import React from 'react';
import { Instagram, Mail, MessageCircle } from 'lucide-react';
import {
  AGENCY_CONFIG,
  NAV_LINKS,
  buildWhatsAppUrl,
} from '../config/agency';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollTo = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#050505] pt-16 pb-10 border-t border-[#D4D4D8]/12">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#D4D4D8]/10">
          {/* Brand Monogram & Statement */}
          <div className="md:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-3.5 mb-5">
              <img
                src={AGENCY_CONFIG.logoCutoutPath}
                alt="DEXORA STUDIO Cutout Monogram"
                className="h-9 sm:h-10 w-auto object-contain select-none animate-subtle-float logo-cutout-glow shrink-0"
                referrerPolicy="no-referrer"
              />
              <span className="font-display text-base font-semibold tracking-[0.22em] text-[#F5F1E8]">
                {AGENCY_CONFIG.name}
              </span>
            </div>
            <p className="text-sm sm:text-base text-[#96969E] max-w-sm leading-relaxed">
              {AGENCY_CONFIG.footerStatement}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <p className="text-xs font-medium tracking-[0.18em] text-[#C9A96E] mb-4">
              NAVIGATION
            </p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(link.href);
                    }}
                    className="text-sm text-[#D4D4D8]/80 hover:text-[#E8D5AC] transition-colors py-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Channels */}
          <div className="md:col-span-4">
            <p className="text-xs font-medium tracking-[0.18em] text-[#C9A96E] mb-4">
              CONNECT
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={AGENCY_CONFIG.mailtoUrl}
                  className="inline-flex items-center gap-2.5 text-[#D4D4D8]/85 hover:text-[#E8D5AC] transition-colors"
                >
                  <Mail className="h-4 w-4 text-[#C9A96E]" aria-hidden="true" />
                  <span>{AGENCY_CONFIG.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[#D4D4D8]/85 hover:text-[#E8D5AC] transition-colors font-mono tabular-nums"
                >
                  <MessageCircle
                    className="h-4 w-4 text-[#C9A96E]"
                    aria-hidden="true"
                  />
                  <span>{AGENCY_CONFIG.whatsappNumber}</span>
                </a>
              </li>
              <li>
                <a
                  href={AGENCY_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[#D4D4D8]/85 hover:text-[#E8D5AC] transition-colors"
                >
                  <Instagram
                    className="h-4 w-4 text-[#C9A96E]"
                    aria-hidden="true"
                  />
                  <span>{AGENCY_CONFIG.instagramHandle}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#96969E]">
          <p>
            &copy; {currentYear} {AGENCY_CONFIG.name}. All rights reserved.
          </p>
          <p>Custom quotes after discussing project requirements.</p>
        </div>
      </div>
    </footer>
  );
};
