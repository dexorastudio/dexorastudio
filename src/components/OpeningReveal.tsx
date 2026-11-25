import React, { useEffect, useState } from 'react';
import { AGENCY_CONFIG } from '../config/agency';
import { useReducedMotion } from '../hooks/useReducedMotion';

export const OpeningReveal: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<'active' | 'fading' | 'done'>(
    reducedMotion ? 'done' : 'active'
  );

  useEffect(() => {
    if (reducedMotion) {
      setPhase('done');
      return;
    }

    const fadeTimer = window.setTimeout(() => setPhase('fading'), 320);
    const doneTimer = window.setTimeout(() => setPhase('done'), 760);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [reducedMotion]);

  if (phase === 'done') return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[#050505] transition-opacity duration-450 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center gap-3">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.24)_0%,transparent_70%)]" />
          <img
            src={AGENCY_CONFIG.logoCutoutPath}
            alt=""
            className="relative h-12 sm:h-14 w-auto object-contain logo-cutout-glow transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="font-display text-xs tracking-[0.34em] text-[#E8D5AC]/90">
          {AGENCY_CONFIG.name}
        </span>
      </div>
    </div>
  );
};
