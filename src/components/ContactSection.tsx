import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Instagram,
  Mail,
  MessageCircle,
  Send,
} from 'lucide-react';
import {
  AGENCY_CONFIG,
  BUDGET_RANGES,
  PROJECT_TYPES,
  buildWhatsAppUrl,
} from '../config/agency';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { CustomButton } from './CustomButton';

gsap.registerPlugin(ScrollTrigger);

interface ContactSectionProps {
  preselectedProjectType?: string;
  preselectedReferenceNote?: string;
}

interface FormState {
  fullName: string;
  email: string;
  brandName: string;
  projectType: string;
  budgetRange: string;
  description: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  brandName?: string;
  projectType?: string;
  budgetRange?: string;
  description?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  preselectedProjectType,
  preselectedReferenceNote,
}) => {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    brandName: '',
    projectType: preselectedProjectType || PROJECT_TYPES[0],
    budgetRange: '',
    description: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'submitted' | 'error'
  >('idle');
  const [submitErrorMsg, setSubmitErrorMsg] = useState<string>('');
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [focusedBudgetIndex, setFocusedBudgetIndex] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const budgetContainerRef = useRef<HTMLDivElement>(null);
  const budgetButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const mm = gsap.matchMedia();

    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        gsap.from('.contact-header-item', {
          y: 18,
          opacity: 0,
          duration: 0.62,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.contact-header',
            start: 'top 90%',
            once: true,
          },
        });

        gsap.from('.contact-channel-card', {
          y: 18,
          opacity: 0,
          duration: 0.6,
          stagger: 0.09,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.contact-channels',
            start: 'top 90%',
            once: true,
          },
        });

        gsap.from('.contact-form-shell', {
          y: 20,
          opacity: 0,
          duration: 0.65,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.contact-form-shell',
            start: 'top 90%',
            once: true,
          },
        });

        gsap.from('.contact-field-item', {
          y: 12,
          opacity: 0,
          duration: 0.5,
          stagger: 0.055,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.contact-form-shell',
            start: 'top 88%',
            once: true,
          },
        });

        ScrollTrigger.refresh();
      },
      sectionRef
    );

    return () => mm.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (!budgetOpen) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        budgetContainerRef.current &&
        !budgetContainerRef.current.contains(e.target as Node)
      ) {
        setBudgetOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setBudgetOpen(false);
        budgetButtonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [budgetOpen]);

  useEffect(() => {
    if (preselectedProjectType) {
      setForm((prev) => ({ ...prev, projectType: preselectedProjectType }));
    }
  }, [preselectedProjectType]);

  useEffect(() => {
    if (preselectedReferenceNote) {
      setForm((prev) => ({
        ...prev,
        description: prev.description
          ? prev.description
          : `Interested in a digital experience inspired by the ${preselectedReferenceNote} concept.`,
      }));
      setErrors((prev) => ({ ...prev, description: undefined }));
    }
  }, [preselectedReferenceNote]);

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!form.brandName.trim()) {
      nextErrors.brandName = 'Please enter your business or brand name.';
    }
    if (!form.projectType) {
      nextErrors.projectType = 'Please select a project type.';
    }
    if (!form.budgetRange) {
      nextErrors.budgetRange = 'Please select a budget range.';
    }
    if (!form.description.trim() || form.description.trim().length < 15) {
      nextErrors.description =
        'Please share a brief description of your project (at least 15 characters).';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const formattedInquiryText = `Project Inquiry — DEXORA STUDIO
Name: ${form.fullName.trim()}
Email: ${form.email.trim()}
Brand / Business: ${form.brandName.trim()}
Project Type: ${form.projectType}
Budget Range: ${form.budgetRange}

Project Overview:
${form.description.trim()}`;

  const mailtoInquiryHref = `${AGENCY_CONFIG.mailtoUrl}?subject=${encodeURIComponent(
    `Project Inquiry: ${form.brandName.trim()} (${form.projectType})`
  )}&body=${encodeURIComponent(formattedInquiryText)}`;

  const whatsappInquiryHref = buildWhatsAppUrl(formattedInquiryText);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitErrorMsg('');
    if (!validate()) return;

    setStatus('submitting');

    if (AGENCY_CONFIG.inquiryEndpoint) {
      try {
        const res = await fetch(AGENCY_CONFIG.inquiryEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          throw new Error('Submission could not be completed.');
        }
        setStatus('submitted');
        return;
      } catch {
        setStatus('error');
        setSubmitErrorMsg(
          'Unable to reach the inquiry server. Please send your brief directly via Email or WhatsApp below.'
        );
        return;
      }
    }

    await new Promise((resolve) => window.setTimeout(resolve, 300));
    setStatus('submitted');
  };

  const handleCopyBrief = async () => {
    try {
      await navigator.clipboard.writeText(formattedInquiryText);
      setCopiedBrief(true);
      window.setTimeout(() => setCopiedBrief(false), 2500);
    } catch {
      setCopiedBrief(false);
    }
  };

  const inputBaseClass =
    'w-full rounded-sm bg-[#050505] border border-[#D4D4D8]/18 px-4 py-3 text-sm sm:text-base text-[#F5F1E8] placeholder:text-[#96969E]/65 transition-colors duration-200 focus:border-[#C9A96E] focus:outline-none min-h-[46px]';

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-20 sm:py-28 lg:py-32 bg-[#050505] overflow-x-clip"
    >
      <div
        aria-hidden="true"
        className="platinum-divider absolute top-0 inset-x-0"
      />

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
          {/* Left Column: Direct Channels */}
          <div className="lg:col-span-5 flex flex-col justify-between min-w-0">
            <div className="contact-header">
              <p className="contact-header-item text-xs font-medium tracking-[0.22em] text-[#C9A96E] mb-4">
                CONTACT
              </p>
              <h2
                className="contact-header-item font-display font-semibold tracking-[-0.02em] leading-[1.1] text-[#F5F1E8]"
                style={{ fontSize: 'clamp(1.85rem, 3.4vw, 3rem)' }}
              >
                LET&apos;S CREATE SOMETHING EXCEPTIONAL.
              </h2>
              <p className="contact-header-item mt-4 text-base sm:text-lg leading-relaxed text-[#D4D4D8]/80 max-w-md">
                Have an idea for your next digital project? Let&apos;s discuss
                how we can bring it to life.
              </p>
              <p className="contact-header-item mt-3 text-sm text-[#96969E]">
                {AGENCY_CONFIG.pricingModel}
              </p>
            </div>

            <div className="contact-channels mt-10 space-y-4">
              {/* Email */}
              <a
                href={AGENCY_CONFIG.mailtoUrl}
                className="contact-channel-card group flex items-center justify-between gap-4 p-5 rounded-sm bg-[#111111] border border-[#D4D4D8]/12 hover:border-[#C9A96E]/55 md:hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[#202020] border border-[#D4D4D8]/12 text-[#C9A96E] transition-colors duration-200 group-hover:border-[#C9A96E]/45 group-hover:bg-[#C9A96E]/10">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs tracking-[0.16em] text-[#96969E]">
                      EMAIL
                    </p>
                    <p className="text-sm sm:text-base font-medium text-[#F5F1E8] truncate">
                      {AGENCY_CONFIG.email}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[#96969E] group-hover:text-[#C9A96E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </a>

              {/* WhatsApp */}
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-channel-card group flex items-center justify-between gap-4 p-5 rounded-sm bg-[#111111] border border-[#D4D4D8]/12 hover:border-[#C9A96E]/55 md:hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[#202020] border border-[#D4D4D8]/12 text-[#C9A96E] transition-colors duration-200 group-hover:border-[#C9A96E]/45 group-hover:bg-[#C9A96E]/10">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs tracking-[0.16em] text-[#96969E]">
                      WHATSAPP
                    </p>
                    <p className="text-sm sm:text-base font-medium text-[#F5F1E8] font-mono tabular-nums truncate">
                      {AGENCY_CONFIG.whatsappNumber}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[#96969E] group-hover:text-[#C9A96E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </a>

              {/* Official Instagram Profile */}
              <a
                href={AGENCY_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit @studiodexora Official Instagram Profile"
                className="contact-channel-card group flex items-center justify-between gap-4 p-5 rounded-sm bg-[#111111] border border-[#D4D4D8]/12 hover:border-[#C9A96E]/55 md:hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[#202020] border border-[#D4D4D8]/12 text-[#C9A96E] transition-colors duration-200 group-hover:border-[#C9A96E]/45 group-hover:bg-[#C9A96E]/10">
                    <Instagram className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs tracking-[0.16em] text-[#96969E]">
                      INSTAGRAM
                    </p>
                    <p className="text-sm sm:text-base font-medium text-[#F5F1E8] truncate">
                      {AGENCY_CONFIG.instagramHandle}
                    </p>
                    <p className="text-xs text-[#96969E] truncate">
                      Official Instagram Profile
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[#96969E] group-hover:text-[#C9A96E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </a>
            </div>
          </div>

          {/* Right Column: Project Inquiry Form */}
          <div className="lg:col-span-7 min-w-0">
            <div className="contact-form-shell p-6 sm:p-9 rounded-sm bg-[#111111] border border-[#D4D4D8]/14">
              {status === 'submitted' ? (
                <div className="py-4">
                  <div className="flex items-center gap-3 text-[#E8D5AC] mb-4">
                    <CheckCircle2
                      className="h-6 w-6 shrink-0"
                      aria-hidden="true"
                    />
                    <h3 className="font-display text-2xl font-semibold text-[#F5F1E8]">
                      Your Project Brief Is Ready
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base leading-relaxed text-[#D4D4D8]/85 mb-6">
                    {AGENCY_CONFIG.inquiryEndpoint
                      ? 'Thank you for reaching out. Your project inquiry has been delivered to DEXORA STUDIO.'
                      : 'Your structured inquiry brief is prepared below. Choose your preferred channel to send it directly to DEXORA STUDIO.'}
                  </p>

                  <pre className="p-4 rounded-sm bg-[#050505] border border-[#D4D4D8]/12 text-xs sm:text-sm text-[#D4D4D8]/85 whitespace-pre-wrap break-words font-sans leading-relaxed mb-6">
                    {formattedInquiryText}
                  </pre>

                  <div className="flex flex-wrap items-center gap-3">
                    <CustomButton
                      variant="primary"
                      size="md"
                      href={whatsappInquiryHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Send via WhatsApp
                    </CustomButton>

                    <CustomButton
                      variant="secondary"
                      size="md"
                      href={mailtoInquiryHref}
                    >
                      <Mail className="h-4 w-4" />
                      Send via Email
                    </CustomButton>

                    <CustomButton
                      variant="ghost"
                      size="md"
                      onClick={handleCopyBrief}
                    >
                      <Copy className="h-4 w-4" />
                      {copiedBrief ? 'Brief Copied' : 'Copy Brief'}
                    </CustomButton>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-xs text-[#96969E] hover:text-[#E8D5AC] transition-colors underline underline-offset-4 cursor-pointer"
                  >
                    Edit inquiry details
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="contact-field-item grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="inquiry-fullname"
                        className="block text-xs font-medium tracking-[0.12em] text-[#D4D4D8] mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        id="inquiry-fullname"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        value={form.fullName}
                        onChange={(e) =>
                          updateField('fullName', e.target.value)
                        }
                        placeholder="Your full name"
                        aria-invalid={Boolean(errors.fullName)}
                        aria-describedby={
                          errors.fullName ? 'error-fullname' : undefined
                        }
                        className={inputBaseClass}
                      />
                      {errors.fullName && (
                        <p
                          id="error-fullname"
                          role="alert"
                          className="mt-1.5 text-xs text-[#E8D5AC]"
                        >
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-email"
                        className="block text-xs font-medium tracking-[0.12em] text-[#D4D4D8] mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        id="inquiry-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="you@company.com"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                          errors.email ? 'error-email' : undefined
                        }
                        className={inputBaseClass}
                      />
                      {errors.email && (
                        <p
                          id="error-email"
                          role="alert"
                          className="mt-1.5 text-xs text-[#E8D5AC]"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="contact-field-item">
                    <label
                      htmlFor="inquiry-brand"
                      className="block text-xs font-medium tracking-[0.12em] text-[#D4D4D8] mb-2"
                    >
                      Business or Brand Name *
                    </label>
                    <input
                      id="inquiry-brand"
                      name="brandName"
                      type="text"
                      autoComplete="organization"
                      value={form.brandName}
                      onChange={(e) => updateField('brandName', e.target.value)}
                      placeholder="Your company or brand"
                      aria-invalid={Boolean(errors.brandName)}
                      aria-describedby={
                        errors.brandName ? 'error-brand' : undefined
                      }
                      className={inputBaseClass}
                    />
                    {errors.brandName && (
                      <p
                        id="error-brand"
                        role="alert"
                        className="mt-1.5 text-xs text-[#E8D5AC]"
                      >
                        {errors.brandName}
                      </p>
                    )}
                  </div>

                  <div className="contact-field-item grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="inquiry-type"
                        className="block text-xs font-medium tracking-[0.12em] text-[#D4D4D8] mb-2"
                      >
                        Project Type *
                      </label>
                      <div className="relative">
                        <select
                          id="inquiry-type"
                          name="projectType"
                          value={form.projectType}
                          onChange={(e) =>
                            updateField('projectType', e.target.value)
                          }
                          className={`${inputBaseClass} appearance-none pr-10 cursor-pointer`}
                        >
                          {PROJECT_TYPES.map((type) => (
                            <option
                              key={type}
                              value={type}
                              className="bg-[#111111]"
                            >
                              {type}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          aria-hidden="true"
                          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C9A96E]"
                        />
                      </div>
                    </div>

                    <div ref={budgetContainerRef} className="relative">
                      <label
                        id="budget-range-label"
                        htmlFor="inquiry-budget"
                        className="block text-xs font-medium tracking-[0.12em] text-[#D4D4D8] mb-2"
                      >
                        Budget Range *
                      </label>
                      <button
                        ref={budgetButtonRef}
                        id="inquiry-budget"
                        type="button"
                        aria-haspopup="listbox"
                        aria-expanded={budgetOpen}
                        aria-labelledby="budget-range-label inquiry-budget"
                        aria-invalid={Boolean(errors.budgetRange)}
                        aria-describedby={
                          errors.budgetRange ? 'error-budget' : undefined
                        }
                        onClick={() => {
                          const currentIdx = BUDGET_RANGES.indexOf(
                            form.budgetRange as (typeof BUDGET_RANGES)[number]
                          );
                          setFocusedBudgetIndex(currentIdx >= 0 ? currentIdx : 0);
                          setBudgetOpen((prev) => !prev);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Tab' && budgetOpen) {
                            setBudgetOpen(false);
                            return;
                          }
                          if (
                            e.key === 'ArrowDown' ||
                            e.key === 'ArrowUp' ||
                            e.key === 'Home' ||
                            e.key === 'End' ||
                            e.key === 'Enter' ||
                            e.key === ' '
                          ) {
                            e.preventDefault();
                            if (!budgetOpen) {
                              const currentIdx = BUDGET_RANGES.indexOf(
                                form.budgetRange as (typeof BUDGET_RANGES)[number]
                              );
                              setFocusedBudgetIndex(currentIdx >= 0 ? currentIdx : 0);
                              setBudgetOpen(true);
                            } else if (e.key === 'ArrowDown') {
                              setFocusedBudgetIndex((i) =>
                                Math.min(i + 1, BUDGET_RANGES.length - 1)
                              );
                            } else if (e.key === 'ArrowUp') {
                              setFocusedBudgetIndex((i) => Math.max(i - 1, 0));
                            } else if (e.key === 'Home') {
                              setFocusedBudgetIndex(0);
                            } else if (e.key === 'End') {
                              setFocusedBudgetIndex(BUDGET_RANGES.length - 1);
                            } else if (e.key === 'Enter' || e.key === ' ') {
                              updateField(
                                'budgetRange',
                                BUDGET_RANGES[focusedBudgetIndex]
                              );
                              setBudgetOpen(false);
                            }
                          }
                        }}
                        className={`${inputBaseClass} flex items-center justify-between gap-3 text-left cursor-pointer ${
                          budgetOpen
                            ? 'border-[#C9A96E] ring-1 ring-[#C9A96E]/35'
                            : 'hover:border-[#C9A96E]/55'
                        }`}
                      >
                        <span
                          className={`truncate ${
                            form.budgetRange ? 'text-[#D4D4D8]' : 'text-[#96969E]/75'
                          }`}
                        >
                          {form.budgetRange || 'Select a budget range'}
                        </span>
                        <ChevronDown
                          aria-hidden="true"
                          className={`h-4 w-4 shrink-0 text-[#C9A96E] transition-transform duration-200 ${
                            budgetOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {budgetOpen && (
                        <ul
                          role="listbox"
                          aria-labelledby="budget-range-label"
                          className="animate-dropdown-in absolute left-0 right-0 z-30 mt-1.5 max-h-[264px] w-full overflow-y-auto rounded-sm bg-[#0B0B0C] border border-[#C9A96E]/45 py-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.92)]"
                        >
                          {BUDGET_RANGES.map((range, index) => {
                            const isSelected = form.budgetRange === range;
                            const isFocused = focusedBudgetIndex === index;
                            return (
                              <li
                                key={range}
                                role="option"
                                aria-selected={isSelected}
                                onMouseEnter={() => setFocusedBudgetIndex(index)}
                                onClick={() => {
                                  updateField('budgetRange', range);
                                  setBudgetOpen(false);
                                  budgetButtonRef.current?.focus();
                                }}
                                className={`flex items-center justify-between gap-3 px-4 py-2.5 min-h-[44px] text-sm sm:text-base cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'bg-[#C9A96E]/16 text-[#E8D5AC] font-medium'
                                    : isFocused
                                      ? 'bg-[#202020] text-[#F5F1E8]'
                                      : 'text-[#D4D4D8] hover:bg-[#202020] hover:text-[#F5F1E8]'
                                }`}
                              >
                                <span className="leading-snug">{range}</span>
                                {isSelected && (
                                  <Check
                                    aria-hidden="true"
                                    className="h-4 w-4 shrink-0 text-[#C9A96E]"
                                  />
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}

                      {errors.budgetRange && (
                        <p
                          id="error-budget"
                          role="alert"
                          className="mt-1.5 text-xs text-[#E8D5AC]"
                        >
                          {errors.budgetRange}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="contact-field-item">
                    <label
                      htmlFor="inquiry-description"
                      className="block text-xs font-medium tracking-[0.12em] text-[#D4D4D8] mb-2"
                    >
                      Project Description *
                    </label>
                    <textarea
                      id="inquiry-description"
                      name="description"
                      rows={4}
                      value={form.description}
                      onChange={(e) =>
                        updateField('description', e.target.value)
                      }
                      placeholder="Tell us about your goals, timeline, and the digital experience you want to build..."
                      aria-invalid={Boolean(errors.description)}
                      aria-describedby={
                        errors.description ? 'error-description' : undefined
                      }
                      className={`${inputBaseClass} resize-y min-h-[120px]`}
                    />
                    {errors.description && (
                      <p
                        id="error-description"
                        role="alert"
                        className="mt-1.5 text-xs text-[#E8D5AC]"
                      >
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {status === 'error' && submitErrorMsg && (
                    <div
                      role="alert"
                      className="p-4 rounded-sm bg-[#202020] border border-[#C9A96E]/45 text-sm text-[#E8D5AC]"
                    >
                      {submitErrorMsg}
                    </div>
                  )}

                  <div className="contact-field-item pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CustomButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={status === 'submitting'}
                      className="w-full sm:w-auto"
                    >
                      <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      {status === 'submitting'
                        ? 'Preparing Inquiry...'
                        : 'Prepare Project Inquiry'}
                    </CustomButton>

                    <span className="text-xs text-[#96969E]">
                      Direct response via Email or WhatsApp
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
