import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AGENCY_CONFIG } from '../config/agency';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { About3DScene } from './About3DScene';

gsap.registerPlugin(ScrollTrigger);

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const mm = gsap.matchMedia();

    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        gsap.from('.about-reveal', {
          y: 22,
          opacity: 0,
          duration: 0.7,
          stagger: 0.09,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.about-copy-col',
            start: 'top 88%',
            once: true,
          },
        });

        gsap.from('.about-visual-frame', {
          y: 26,
          scale: 0.97,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.about-visual-frame',
            start: 'top 90%',
            once: true,
          },
        });

        ScrollTrigger.refresh();
      },
      sectionRef
    );

    mm.add(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      () => {
        gsap.fromTo(
          '.about-visual-parallax',
          { y: -14 },
          {
            y: 14,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.65,
            },
          }
        );
      },
      sectionRef
    );

    return () => mm.revert();
  }, [reducedMotion]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-20 sm:py-28 lg:py-32 bg-[#050505] overflow-x-clip"
    >
      <div
        aria-hidden="true"
        className="platinum-divider absolute top-0 inset-x-0"
      />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-10">
          {/* Left 3D Geometric Composition */}
          <div className="about-visual-parallax lg:col-span-5 order-2 lg:order-1 will-change-transform">
            <div className="about-visual-frame relative rounded-sm bg-[#111111]/60 border border-[#D4D4D8]/12 p-4 sm:p-6">
              <About3DScene />
              <div className="mt-4 pt-4 border-t border-[#D4D4D8]/10 flex items-center justify-between gap-4 text-xs text-[#96969E]">
                <span>{AGENCY_CONFIG.name}</span>
                <span className="text-[#C9A96E]">Digital Agency</span>
              </div>
            </div>
          </div>

          {/* Right Editorial Copy */}
          <div className="about-copy-col lg:col-span-7 order-1 lg:order-2 lg:pl-6">
            <p className="about-reveal text-xs font-medium tracking-[0.22em] text-[#C9A96E] mb-4">
              ABOUT DEXORA STUDIO
            </p>

            <h2
              className="about-reveal font-display font-semibold tracking-[-0.02em] leading-[1.1] text-[#F5F1E8] max-w-xl"
              style={{ fontSize: 'clamp(1.85rem, 3.4vw, 3rem)' }}
            >
              WE TURN IDEAS INTO DIGITAL REALITY.
            </h2>

            <p className="about-reveal mt-6 text-base sm:text-lg leading-relaxed text-[#D4D4D8]/90 max-w-2xl">
              {AGENCY_CONFIG.description}
            </p>

            <p className="about-reveal mt-5 text-base leading-relaxed text-[#96969E] max-w-2xl">
              Our approach combines creativity, precision, and modern technology
              to create digital experiences that feel meaningful, memorable, and
              effortless to use.
            </p>

            <div className="about-reveal mt-8 pt-6 border-t border-[#D4D4D8]/12 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs tracking-[0.16em] text-[#C9A96E] mb-1.5">
                  ENGAGEMENT
                </p>
                <p className="text-sm text-[#F5F1E8]/90 leading-relaxed">
                  {AGENCY_CONFIG.pricingModel}
                </p>
              </div>
              <div>
                <p className="text-xs tracking-[0.16em] text-[#C9A96E] mb-1.5">
                  COMMUNICATION
                </p>
                <p className="text-sm text-[#F5F1E8]/90 leading-relaxed">
                  Direct collaboration via Email, WhatsApp, and Instagram.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
