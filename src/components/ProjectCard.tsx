import React, { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PortfolioProject } from '../config/agency';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ProjectCardProps {
  project: PortfolioProject;
  isOffset?: boolean;
  onInspect: (project: PortfolioProject) => void;
  onImageLoaded?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isOffset = false,
  onInspect,
  onImageLoaded,
}) => {
  const [imgError, setImgError] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (
      reducedMotion ||
      e.pointerType !== 'mouse' ||
      !frameRef.current ||
      (typeof window !== 'undefined' && window.innerWidth < 1024)
    ) {
      return;
    }
    const rect = frameRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 6;
    const rx = (0.5 - py) * 5;
    setTilt({
      rx,
      ry,
      gx: px * 100,
      gy: py * 100,
      active: true,
    });
  };

  const handlePointerLeave = () => {
    setTilt((prev) => ({ ...prev, rx: 0, ry: 0, active: false }));
  };

  return (
    <article
      className={`portfolio-card-wrapper group relative flex flex-col ${
        isOffset ? 'md:mt-16 lg:mt-20' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => onInspect(project)}
        className="w-full text-left focus-visible:outline-2 focus-visible:outline-[#C9A96E] rounded-sm cursor-pointer md:transition-transform md:duration-500 md:ease-[cubic-bezier(0.16,1,0.3,1)] md:hover:-translate-y-1.5"
        aria-label={`View ${project.name} concept project details`}
      >
        {/* Parallax + Subtle Desktop 3D Tilt Viewport */}
        <div
          ref={frameRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{
            transform: tilt.active
              ? `perspective(1000px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg)`
              : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
            transition: tilt.active
              ? 'transform 140ms ease-out, border-color 300ms ease'
              : 'transform 520ms cubic-bezier(0.16, 1, 0.3, 1), border-color 300ms ease',
          }}
          className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-[#111111] border border-[#D4D4D8]/12 group-hover:border-[#C9A96E]/50 will-change-transform"
        >
          {!imgError ? (
            <div className="portfolio-reveal-img h-full w-full will-change-transform">
              <div className="portfolio-parallax-img h-full w-full will-change-transform scale-[1.16]">
                <img
                  src={project.image}
                  alt={project.alt}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onLoad={onImageLoaded}
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(201,169,110,0.16),#111111_75%)] p-6">
              <span className="font-display text-2xl tracking-[0.2em] text-[#E8D5AC]">
                {project.name}
              </span>
            </div>
          )}

          {/* Editorial GPU Mask Curtain Reveal (defaults open via scale-y-0 for fail-safe visibility) */}
          {!reducedMotion && (
            <div
              aria-hidden="true"
              className="portfolio-image-curtain pointer-events-none absolute inset-0 z-20 bg-[#0B0B0D] border-b border-[#C9A96E]/40 scale-y-0 origin-top will-change-transform"
            />
          )}

          {/* Subtle desktop cursor metallic sheen */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
            style={{
              opacity: tilt.active ? 1 : 0,
              background: `radial-gradient(420px circle at ${tilt.gx}% ${tilt.gy}%, rgba(232, 213, 172, 0.14), transparent 60%)`,
            }}
          />

          {/* Measured contrast scrim */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/85 via-[#050505]/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-65"
          />

          {/* Subtle corner index and action arrow */}
          <div className="portfolio-parallax-badge absolute top-4 left-4 right-4 z-10 flex items-center justify-between will-change-transform">
            <span className="font-mono text-xs tabular-nums tracking-[0.2em] text-[#E8D5AC] bg-[#050505]/80 px-2.5 py-1 border border-[#D4D4D8]/15 rounded-sm">
              {project.number}
            </span>

            <span className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-[#050505]/80 border border-[#D4D4D8]/20 text-[#F5F1E8] transition-all duration-300 group-hover:border-[#C9A96E] group-hover:bg-[#C9A96E] group-hover:text-[#050505]">
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>

        {/* Counter-parallax editorial caption */}
        <div className="portfolio-parallax-caption mt-5 will-change-transform">
          <div className="portfolio-caption-item flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#96969E]">
            <span className="text-[#C9A96E] font-medium">{project.industry}</span>
            <span aria-hidden="true">·</span>
            <span>{project.projectType}</span>
          </div>

          <div className="portfolio-caption-item mt-2 flex items-baseline justify-between gap-4">
            <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F1E8] transition-colors duration-200 group-hover:text-[#E8D5AC]">
              {project.name}
            </h3>
            <span className="text-xs font-medium text-[#D4D4D8]/70 group-hover:text-[#C9A96E] transition-colors whitespace-nowrap shrink-0">
              Inspect Concept
            </span>
          </div>

          <p className="portfolio-caption-item mt-2 text-sm sm:text-base leading-relaxed text-[#D4D4D8]/75 max-w-lg">
            {project.concept}
          </p>
        </div>
      </button>
    </article>
  );
};
