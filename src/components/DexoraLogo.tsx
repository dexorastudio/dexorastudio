import React from 'react';
import { AGENCY_CONFIG } from '../config/agency';

interface DexoraLogoProps {
  size?: 'nav' | 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
}

const IMAGE_HEIGHT_MAP = {
  nav: 'h-[18px] min-[390px]:h-5 sm:h-6 lg:h-7',
  sm: 'h-6 sm:h-7',
  md: 'h-7 sm:h-8',
  lg: 'h-9 sm:h-10',
  xl: 'h-12 sm:h-14',
} as const;

const WORDMARK_CLASS_MAP = {
  nav: 'text-[10.5px] min-[360px]:text-[11px] min-[390px]:text-[10.5px] min-[420px]:text-[11.5px] sm:text-sm lg:text-[15px] tracking-[0.08em] min-[420px]:tracking-[0.12em] sm:tracking-[0.18em] lg:tracking-[0.22em]',
  sm: 'text-xs sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.22em]',
  md: 'text-xs sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.22em]',
  lg: 'text-sm sm:text-base tracking-[0.22em]',
  xl: 'text-base sm:text-lg tracking-[0.24em]',
} as const;

export const DexoraLogo: React.FC<DexoraLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 min-[420px]:gap-2 sm:gap-3 min-w-0 max-w-full ${className}`}
    >
      <img
        src={AGENCY_CONFIG.logoCutoutPath}
        alt="DEXORA STUDIO D/S Monogram"
        className={`${IMAGE_HEIGHT_MAP[size]} w-auto object-contain select-none logo-cutout-glow shrink-0`}
        referrerPolicy="no-referrer"
      />
      {showWordmark && (
        <span
          className={`font-display font-semibold text-[#F5F1E8] whitespace-nowrap truncate min-w-0 ${WORDMARK_CLASS_MAP[size]}`}
        >
          {AGENCY_CONFIG.name}
        </span>
      )}
    </span>
  );
};
