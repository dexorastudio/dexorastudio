import React from 'react';
import { ArrowRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';
import { AGENCY_CONFIG } from '../config/agency';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { CustomButton } from './CustomButton';
import { Hero3DScene } from './Hero3DScene';

export const HeroSection: React.FC = () => {
  const reducedMotion = useReducedMotion();

  const scrollTo = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const easeOut = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex flex-col pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-20 lg:pb-24 overflow-x-clip bg-[#050505]"
    >
      {/* Cinematic architectural lighting backdrop */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_74%_44%,rgba(201,169,110,0.11),transparent_70%),radial-gradient(ellipse_60%_50%_at_18%_82%,rgba(212,212,216,0.045),transparent_70%)] ${
          reducedMotion ? '' : 'animate-hero-glow'
        }`}
      />

      <div className="relative z-10 my-auto mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 sm:gap-10 lg:gap-8">
          {/* Left Typography & CTA Column */}
          <div className="lg:col-span-6 flex flex-col items-start">
            {/* Step 1: Cutout Monogram Emblem + Architectural Rule */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.06, ease: easeOut }}
              className="mb-6 sm:mb-7 flex items-center gap-3.5"
            >
              <img
                src={AGENCY_CONFIG.logoCutoutPath}
                alt="DEXORA STUDIO Emblem"
                className="h-7 sm:h-8 w-auto object-contain select-none logo-cutout-glow shrink-0"
                referrerPolicy="no-referrer"
              />
              <motion.span
                aria-hidden="true"
                initial={reducedMotion ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.55, delay: 0.14, ease: easeOut }}
                style={{ originX: 0 }}
                className="h-[1px] w-7 bg-[#C9A96E]/55"
              />
              <span className="text-xs sm:text-sm tracking-[0.22em] text-[#D4D4D8]/90 font-medium">
                {AGENCY_CONFIG.name}
              </span>
            </motion.div>

            {/* Step 2: Line-by-Line Masked Hero Headline */}
            <h1
              className="font-display font-semibold tracking-[-0.025em] leading-[1.06] text-[#F5F1E8] max-w-2xl"
              style={{ fontSize: 'clamp(2.05rem, 4.3vw, 4.1rem)' }}
            >
              <span className="block overflow-hidden pb-0.5">
                <motion.span
                  initial={reducedMotion ? false : { y: '105%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 0.68, delay: 0.12, ease: easeOut }}
                  className="block will-change-transform"
                >
                  WE CREATE
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-0.5">
                <motion.span
                  initial={reducedMotion ? false : { y: '105%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 0.72, delay: 0.2, ease: easeOut }}
                  className="block champagne-gradient-text will-change-transform"
                >
                  DIGITAL EXPERIENCES
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-0.5">
                <motion.span
                  initial={reducedMotion ? false : { y: '105%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 0.72, delay: 0.28, ease: easeOut }}
                  className="block will-change-transform"
                >
                  BEYOND EXPECTATION.
                </motion.span>
              </span>
            </h1>

            {/* Step 3: Supporting Copy Fade-In */}
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.34, ease: easeOut }}
              className="mt-5 sm:mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#D4D4D8]/85"
            >
              Premium websites, thoughtful design, and immersive digital
              experiences for ambitious brands.
            </motion.p>

            {/* Step 4: Staggered CTA Actions */}
            <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: easeOut }}
                className="w-full sm:w-auto"
              >
                <CustomButton
                  variant="primary"
                  size="lg"
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('#contact');
                  }}
                  className="w-full sm:w-auto"
                >
                  Start Your Project
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </CustomButton>
              </motion.div>

              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.48, ease: easeOut }}
                className="w-full sm:w-auto"
              >
                <CustomButton
                  variant="secondary"
                  size="lg"
                  href="#work"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('#work');
                  }}
                  className="w-full sm:w-auto"
                >
                  Explore Our Work
                  <ArrowDownRight className="h-4 w-4 text-[#C9A96E] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </CustomButton>
              </motion.div>
            </div>

            {/* Quiet unboxed discipline summary */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.54, ease: easeOut }}
              className="mt-9 sm:mt-10 pt-5 sm:pt-6 border-t border-[#D4D4D8]/10 w-full max-w-lg flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-[#96969E]"
            >
              <span>Website Design</span>
              <span aria-hidden="true" className="text-[#C9A96E]/60">
                ·
              </span>
              <span>Web Development</span>
              <span aria-hidden="true" className="text-[#C9A96E]/60">
                ·
              </span>
              <span>UI/UX Craft</span>
              <span aria-hidden="true" className="text-[#C9A96E]/60">
                ·
              </span>
              <span>Custom Quotes</span>
            </motion.div>
          </div>

          {/* Step 5: Right Real-Time 3D Monogram Sculpture Stage */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.72, delay: 0.18, ease: easeOut }}
            className="lg:col-span-6 relative h-[300px] sm:h-[390px] md:h-[440px] lg:h-[540px] xl:h-[580px] w-full"
          >
            {/* Subtle architectural studio corner ticks */}
            <span
              aria-hidden="true"
              className="pointer-events-none hidden sm:block absolute top-3 left-3 h-4 w-4 border-t border-l border-[#C9A96E]/30"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none hidden sm:block absolute bottom-3 right-3 h-4 w-4 border-b border-r border-[#C9A96E]/30"
            />
            <Hero3DScene />
          </motion.div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="platinum-divider absolute bottom-0 inset-x-0"
      />
    </section>
  );
};
