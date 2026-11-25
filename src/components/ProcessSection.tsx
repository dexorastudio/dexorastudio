import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROCESS_STEPS } from '../config/agency';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const ProcessSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState<number | null>(null);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) {
      setActiveStep(null);
      return;
    }

    const mm = gsap.matchMedia();

    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        gsap.from('.process-header-item', {
          y: 20,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.process-header',
            start: 'top 90%',
            once: true,
          },
        });
      },
      sectionRef
    );

    // Desktop horizontal sequential timeline + scrubbed active-step highlight
    mm.add(
      '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      () => {
        gsap.from('.process-line-fill', {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.0,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: '.process-grid',
            start: 'top 86%',
            once: true,
          },
        });

        gsap.from('.process-step-card', {
          x: -26,
          opacity: 0,
          duration: 0.7,
          stagger: 0.13,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.process-grid',
            start: 'top 86%',
            once: true,
          },
        });

        ScrollTrigger.create({
          trigger: '.process-grid',
          start: 'top 72%',
          end: 'bottom 35%',
          onUpdate: (self) => {
            const idx = Math.min(
              PROCESS_STEPS.length - 1,
              Math.floor(self.progress * PROCESS_STEPS.length)
            );
            setActiveStep(idx);
          },
          onLeaveBack: () => setActiveStep(null),
        });

        ScrollTrigger.refresh();
      },
      sectionRef
    );

    // Mobile & tablet vertical/2-col sequential step reveal + connector line draw
    mm.add(
      '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
      () => {
        const cards = gsap.utils.toArray<HTMLElement>('.process-step-card');
        cards.forEach((card, index) => {
          const line = card.querySelector<HTMLElement>('.process-mobile-line');

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              once: true,
            },
          });

          tl.from(card, {
            x: -18,
            opacity: 0,
            duration: 0.62,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          });

          if (line) {
            tl.from(
              line,
              {
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 0.65,
                ease: 'power3.out',
                clearProps: 'transform',
              },
              0.12
            );
          }

          ScrollTrigger.create({
            trigger: card,
            start: 'top 66%',
            end: 'bottom 34%',
            onEnter: () => setActiveStep(index),
            onEnterBack: () => setActiveStep(index),
          });
        });

        ScrollTrigger.refresh();
      },
      sectionRef
    );

    return () => mm.revert();
  }, [reducedMotion]);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative py-20 sm:py-28 lg:py-32 bg-[#050505] overflow-x-clip"
    >
      <div
        aria-hidden="true"
        className="platinum-divider absolute top-0 inset-x-0"
      />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="process-header max-w-2xl mb-14 sm:mb-20">
          <p className="process-header-item text-xs font-medium tracking-[0.22em] text-[#C9A96E] mb-4">
            OUR PROCESS
          </p>
          <h2
            className="process-header-item font-display font-semibold tracking-[-0.02em] leading-[1.1] text-[#F5F1E8]"
            style={{ fontSize: 'clamp(1.85rem, 3.4vw, 3rem)' }}
          >
            FROM IDEA TO EXPERIENCE.
          </h2>
        </div>

        <div className="process-grid relative">
          {/* Desktop horizontal connector track */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-6 left-0 right-0 h-[1px] bg-[#D4D4D8]/12"
          >
            <div className="process-line-fill h-full w-full bg-gradient-to-r from-[#C9A96E] via-[#E8D5AC]/65 to-[#C9A96E]/25" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {PROCESS_STEPS.map((step, index) => {
              const isActive = activeStep === index;

              return (
                <div
                  key={step.number}
                  className="process-step-card relative flex flex-col"
                >
                  {/* Step node */}
                  <div className="mb-6 flex items-center gap-4">
                    <span
                      className={`relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-sm border font-mono text-sm tabular-nums transition-all duration-500 ${
                        isActive
                          ? 'bg-[#C9A96E]/15 border-[#C9A96E] text-[#F5F1E8] shadow-[0_0_24px_rgba(201,169,110,0.22)]'
                          : 'bg-[#111111] border-[#C9A96E]/45 text-[#E8D5AC]'
                      }`}
                    >
                      {step.number}
                    </span>
                    <span
                      aria-hidden="true"
                      className="lg:hidden relative h-[1px] flex-1 bg-[#D4D4D8]/12 overflow-hidden"
                    >
                      <span
                        className={`process-mobile-line block h-full w-full transition-opacity duration-500 ${
                          isActive
                            ? 'bg-gradient-to-r from-[#C9A96E] to-[#E8D5AC]/40 opacity-100'
                            : 'bg-gradient-to-r from-[#C9A96E]/65 to-transparent opacity-70'
                        }`}
                      />
                    </span>
                  </div>

                  <div
                    className={`flex-1 p-6 rounded-sm border transition-all duration-500 ${
                      isActive
                        ? 'bg-[#151411] border-[#C9A96E]/50 shadow-[0_14px_40px_rgba(201,169,110,0.06)]'
                        : 'bg-[#111111] border-[#D4D4D8]/12 hover:border-[#C9A96E]/35'
                    }`}
                  >
                    <h3
                      className={`font-display text-xl sm:text-2xl font-semibold transition-colors duration-300 mb-3 ${
                        isActive ? 'text-[#E8D5AC]' : 'text-[#F5F1E8]'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-[#96969E]">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
