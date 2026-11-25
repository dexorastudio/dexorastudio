import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, X } from 'lucide-react';
import { PORTFOLIO_PROJECTS, PortfolioProject } from '../config/agency';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { CustomButton } from './CustomButton';
import { ProjectCard } from './ProjectCard';

gsap.registerPlugin(ScrollTrigger);

interface PortfolioSectionProps {
  onDiscussProject: (projectName: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  onDiscussProject,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [selectedProject, setSelectedProject] =
    useState<PortfolioProject | null>(null);

  const handleImageLoaded = useCallback(() => {
    if (!reducedMotion) {
      ScrollTrigger.refresh();
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const mm = gsap.matchMedia();

    const setupPortfolioAnimations = (isMobile: boolean) => {
      gsap.from('.portfolio-header-item', {
        y: 22,
        opacity: 0,
        duration: 0.68,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.portfolio-header',
          start: 'top 90%',
          once: true,
        },
      });

      const cards = gsap.utils.toArray<HTMLElement>('.portfolio-card-wrapper');

      cards.forEach((card, index) => {
        const img = card.querySelector<HTMLElement>('.portfolio-parallax-img');
        const revealImg = card.querySelector<HTMLElement>('.portfolio-reveal-img');
        const curtain = card.querySelector<HTMLElement>('.portfolio-image-curtain');
        const caption = card.querySelector<HTMLElement>(
          '.portfolio-parallax-caption'
        );
        const captionItems = card.querySelectorAll<HTMLElement>(
          '.portfolio-caption-item'
        );
        const badge = card.querySelector<HTMLElement>('.portfolio-parallax-badge');

        // Cinematic viewport entrance timeline per card
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: isMobile ? 'top 90%' : 'top 86%',
            once: true,
          },
        });

        tl.from(card, {
          y: isMobile ? 22 : 34,
          opacity: 0,
          duration: 0.72,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });

        if (curtain) {
          tl.fromTo(
            curtain,
            { scaleY: 1, transformOrigin: 'top center' },
            {
              scaleY: 0,
              transformOrigin: 'top center',
              duration: 0.85,
              ease: 'power3.inOut',
              clearProps: 'transform',
            },
            0.06
          );
        }

        if (revealImg) {
          tl.from(
            revealImg,
            {
              scale: isMobile ? 1.07 : 1.12,
              duration: 0.95,
              ease: 'power3.out',
              clearProps: 'transform',
            },
            0.06
          );
        }

        if (captionItems.length > 0) {
          tl.from(
            captionItems,
            {
              y: 14,
              opacity: 0,
              duration: 0.55,
              stagger: 0.07,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            },
            0.22
          );
        }

        // GPU-composited image depth parallax (lighter on mobile)
        if (img) {
          const ySpan = isMobile ? 4 : 7.5;
          const baseScale = isMobile ? 1.1 : 1.16;
          gsap.fromTo(
            img,
            { yPercent: -ySpan, scale: baseScale },
            {
              yPercent: ySpan,
              scale: baseScale,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.55,
              },
            }
          );
        }

        // Foreground counter-parallax (desktop/tablet)
        if (!isMobile && caption) {
          const offset = index % 2 === 0 ? 10 : 16;
          gsap.fromTo(
            caption,
            { y: offset },
            {
              y: -offset * 0.55,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.55,
              },
            }
          );
        }

        if (!isMobile && badge) {
          gsap.fromTo(
            badge,
            { y: -4 },
            {
              y: 6,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.55,
              },
            }
          );
        }
      });

      ScrollTrigger.refresh();
    };

    mm.add(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      () => setupPortfolioAnimations(false),
      sectionRef
    );

    mm.add(
      '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      () => setupPortfolioAnimations(true),
      sectionRef
    );

    return () => mm.revert();
  }, [reducedMotion]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);

    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative py-20 sm:py-28 lg:py-32 bg-[#050505] overflow-x-clip"
    >
      <div
        aria-hidden="true"
        className="platinum-divider absolute top-0 inset-x-0"
      />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="portfolio-header flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14 sm:mb-20">
          <div className="max-w-2xl">
            <p className="portfolio-header-item text-xs font-medium tracking-[0.22em] text-[#C9A96E] mb-4">
              SELECTED WORK · CONCEPT PORTFOLIO
            </p>
            <h2
              className="portfolio-header-item font-display font-semibold tracking-[-0.02em] leading-[1.1] text-[#F5F1E8]"
              style={{ fontSize: 'clamp(1.85rem, 3.4vw, 3rem)' }}
            >
              SELECTED DIGITAL EXPERIENCES.
            </h2>
            <p className="portfolio-header-item mt-4 text-base sm:text-lg leading-relaxed text-[#D4D4D8]/80">
              A collection of creative concepts demonstrating our approach to
              modern digital design.
            </p>
          </div>

          <p className="portfolio-header-item text-xs sm:text-sm text-[#96969E] max-w-xs leading-relaxed">
            Every project presented here is original studio concept work created
            to showcase design direction and visual engineering.
          </p>
        </div>

        {/* Staggered Two-Column Editorial Parallax Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-14 gap-y-14 sm:gap-y-20">
          {PORTFOLIO_PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              isOffset={index % 2 === 1}
              onInspect={setSelectedProject}
              onImageLoaded={handleImageLoaded}
            />
          ))}
        </div>
      </div>

      {/* Concept Case Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="concept-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            className="absolute inset-0 bg-[#050505]/85 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm bg-[#111111] border border-[#D4D4D8]/20 shadow-[0_32px_90px_rgba(0,0,0,0.85)]">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#050505]">
              <img
                src={selectedProject.image}
                alt={selectedProject.alt}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close concept preview"
                className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-sm bg-[#050505]/85 border border-[#D4D4D8]/25 text-[#F5F1E8] hover:border-[#C9A96E] hover:text-[#E8D5AC] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#96969E]">
                <span className="font-mono tabular-nums text-[#C9A96E]">
                  {selectedProject.number}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-[#D4D4D8]">{selectedProject.industry}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedProject.projectType} (Fictional Concept)</span>
              </div>

              <h3
                id="concept-modal-title"
                className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-[#F5F1E8]"
              >
                {selectedProject.name}
              </h3>

              <p className="mt-3 text-base leading-relaxed text-[#D4D4D8]/85">
                {selectedProject.concept}
              </p>

              <div className="mt-6 pt-6 border-t border-[#D4D4D8]/10">
                <p className="text-xs font-medium tracking-[0.18em] text-[#C9A96E] mb-3">
                  DESIGN FOCUS
                </p>
                <ul className="space-y-2 text-sm text-[#D4D4D8]/80">
                  {selectedProject.focusPoints.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1 w-1 rounded-full bg-[#C9A96E] shrink-0"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <CustomButton
                  variant="primary"
                  size="md"
                  onClick={() => {
                    const name = selectedProject.name;
                    setSelectedProject(null);
                    onDiscussProject(name);
                  }}
                >
                  Discuss a Similar Project
                  <ArrowRight className="h-4 w-4" />
                </CustomButton>

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="text-sm text-[#96969E] hover:text-[#F5F1E8] transition-colors px-3 py-2 cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
