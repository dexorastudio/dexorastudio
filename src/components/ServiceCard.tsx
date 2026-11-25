import React, { useRef, useState } from 'react';
import {
  ArrowUpRight,
  Code2,
  Compass,
  Layers,
  Layout,
  Sparkles,
} from 'lucide-react';
import { ServiceItem } from '../config/agency';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ServiceCardProps {
  service: ServiceItem;
  className?: string;
  onSelectService: (serviceTitle: string) => void;
}

const ICONS = {
  layout: Layout,
  code: Code2,
  compass: Compass,
  layers: Layers,
  sparkles: Sparkles,
} as const;

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  className = '',
  onSelectService,
}) => {
  const cardRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });

  const IconComponent = ICONS[service.iconName];

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reducedMotion || e.pointerType !== 'mouse' || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y, active: true });
  };

  const handlePointerLeave = () => {
    setSpotlight((prev) => ({ ...prev, active: false }));
  };

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`group relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 rounded-sm bg-[#111111] border border-[#D4D4D8]/12 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#C9A96E]/45 md:hover:-translate-y-1 ${className}`}
    >
      {/* Top champagne-gold hairline accent sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#C9A96E] via-[#E8D5AC] to-transparent scale-x-0 origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />

      {/* Subtle desktop cursor glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-sm transition-opacity duration-300"
        style={{
          opacity: spotlight.active ? 1 : 0,
          background: `radial-gradient(380px circle at ${spotlight.x}% ${spotlight.y}%, rgba(201, 169, 110, 0.085), transparent 65%)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <span className="font-mono text-xs tabular-nums tracking-[0.18em] text-[#C9A96E]">
            {service.number}
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#202020] border border-[#D4D4D8]/12 text-[#E8D5AC] transition-all duration-300 group-hover:border-[#C9A96E]/50 group-hover:bg-[#C9A96E]/10 group-hover:scale-105">
            <IconComponent className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>

        <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#F5F1E8] transition-colors duration-200 group-hover:text-[#E8D5AC] mb-3">
          {service.title}
        </h3>

        <p className="text-sm sm:text-base leading-relaxed text-[#96969E]">
          {service.description}
        </p>
      </div>

      <div className="relative z-10 mt-8 pt-5 border-t border-[#D4D4D8]/10 flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#D4D4D8]/75">
          {service.deliverables.map((item, idx) => (
            <React.Fragment key={item}>
              {idx > 0 && (
                <span aria-hidden="true" className="text-[#C9A96E]/60">
                  ·
                </span>
              )}
              <span>{item}</span>
            </React.Fragment>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onSelectService(service.title)}
          aria-label={`Inquire about ${service.title}`}
          className="inline-flex items-center justify-center h-9 w-9 shrink-0 rounded-sm border border-[#D4D4D8]/15 text-[#D4D4D8] group-hover:border-[#C9A96E]/60 hover:border-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#050505] transition-all duration-200 cursor-pointer"
        >
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </article>
  );
};
