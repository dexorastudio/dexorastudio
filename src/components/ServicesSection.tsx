import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES } from '../config/agency';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ServiceCard } from './ServiceCard';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const mm = gsap.matchMedia();

    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        gsap.from('.services-header-item', {
          y: 22,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.services-header',
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
        gsap.from('.service-card-item', {
          y: 28,
          opacity: 0,
          duration: 0.7,
          stagger: 0.09,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.services-grid',
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
        const cards = gsap.utils.toArray<HTMLElement>('.service-card-item');
        cards.forEach((card) => {
          gsap.from(card, {
            y: 20,
            opacity: 0,
            duration: 0.58,
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
      id="services"
      ref={sectionRef}
      className="relative py-20 sm:py-28 lg:py-32 bg-[#050505]"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="services-header max-w-3xl mb-12 sm:mb-16">
          <p className="services-header-item text-xs font-medium tracking-[0.22em] text-[#C9A96E] mb-4">
            SERVICES
          </p>
          <h2
            className="services-header-item font-display font-semibold tracking-[-0.02em] leading-[1.1] text-[#F5F1E8]"
            style={{ fontSize: 'clamp(1.85rem, 3.4vw, 3rem)' }}
          >
            CRAFTED FOR THE DIGITAL FUTURE.
          </h2>
          <p className="services-header-item mt-4 text-base sm:text-lg leading-relaxed text-[#D4D4D8]/80 max-w-2xl">
            From powerful websites to immersive digital experiences, we help
            brands transform ideas into reality.
          </p>
        </div>

        {/* Asymmetric 5-Card Bento Grid */}
        <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5 sm:gap-6">
          {SERVICES.map((service, index) => {
            const spanClass =
              index < 2 ? 'lg:col-span-3' : 'lg:col-span-2';
            const mdSpanClass =
              index === 4 ? 'md:col-span-2 lg:col-span-2' : '';

            return (
              <div
                key={service.id}
                className={`service-card-item ${spanClass} ${mdSpanClass}`}
              >
                <ServiceCard
                  service={service}
                  className="h-full"
                  onSelectService={onSelectService}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
