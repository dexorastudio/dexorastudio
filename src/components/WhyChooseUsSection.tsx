import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WHY_CHOOSE_VALUES } from '../config/agency';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const WhyChooseUsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const mm = gsap.matchMedia();

    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        gsap.from('.why-header-item', {
          y: 20,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.why-header',
            start: 'top 90%',
            once: true,
          },
        });
      },
      sectionRef
    );

    mm.add(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      () => {
        gsap.from('.value-card-item', {
          y: 24,
          opacity: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.why-grid',
            start: 'top 86%',
            once: true,
          },
        });
        ScrollTrigger.refresh();
      },
      sectionRef
    );

    mm.add(
      '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      () => {
        const cards = gsap.utils.toArray<HTMLElement>('.value-card-item');
        cards.forEach((card) => {
          gsap.from(card, {
            y: 18,
            opacity: 0,
            duration: 0.56,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: card,
              start: 'top 91%',
              once: true,
            },
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
      id="why-dexora"
      ref={sectionRef}
      className="relative py-20 sm:py-28 lg:py-32 bg-[#050505]"
    >
      <div
        aria-hidden="true"
        className="platinum-divider absolute top-0 inset-x-0"
      />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="why-header max-w-3xl mb-14 sm:mb-16">
          <p className="why-header-item text-xs font-medium tracking-[0.22em] text-[#C9A96E] mb-4">
            WHY DEXORA STUDIO
          </p>
          <h2
            className="why-header-item font-display font-semibold tracking-[-0.02em] leading-[1.1] text-[#F5F1E8]"
            style={{ fontSize: 'clamp(1.85rem, 3.4vw, 3rem)' }}
          >
            DESIGNED WITH PURPOSE. BUILT WITH PRECISION.
          </h2>
        </div>

        <div className="why-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          {WHY_CHOOSE_VALUES.map((item) => (
            <article
              key={item.number}
              className="value-card-item group relative p-7 sm:p-9 rounded-sm bg-[#111111] border border-[#D4D4D8]/12 transition-all duration-200 hover:border-[#C9A96E]/45"
            >
              <div className="flex items-center justify-between gap-4 mb-5">
                <span className="font-mono text-xs tabular-nums tracking-[0.2em] text-[#C9A96E]">
                  {item.number}
                </span>
                <span
                  aria-hidden="true"
                  className="h-[1px] w-10 bg-[#D4D4D8]/20 transition-all duration-300 group-hover:w-16 group-hover:bg-[#C9A96E]/60"
                />
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#F5F1E8] mb-3">
                {item.title}
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#96969E]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
