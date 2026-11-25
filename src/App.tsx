import React, { Suspense, lazy, useState } from 'react';
import { OpeningReveal } from './components/OpeningReveal';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LuxuryCursor } from './components/LuxuryCursor';

const ServicesSection = lazy(() =>
  import('./components/ServicesSection').then((m) => ({
    default: m.ServicesSection,
  }))
);
const PortfolioSection = lazy(() =>
  import('./components/PortfolioSection').then((m) => ({
    default: m.PortfolioSection,
  }))
);
const AboutSection = lazy(() =>
  import('./components/AboutSection').then((m) => ({
    default: m.AboutSection,
  }))
);
const ProcessSection = lazy(() =>
  import('./components/ProcessSection').then((m) => ({
    default: m.ProcessSection,
  }))
);
const WhyChooseUsSection = lazy(() =>
  import('./components/WhyChooseUsSection').then((m) => ({
    default: m.WhyChooseUsSection,
  }))
);
const ContactSection = lazy(() =>
  import('./components/ContactSection').then((m) => ({
    default: m.ContactSection,
  }))
);
const Footer = lazy(() =>
  import('./components/Footer').then((m) => ({ default: m.Footer }))
);

function SectionFallback() {
  return (
    <div
      aria-hidden="true"
      className="py-24 bg-[#050505] flex items-center justify-center"
    >
      <div className="h-[1px] w-24 bg-[#C9A96E]/30" />
    </div>
  );
}

export default function App() {
  const [selectedServiceType, setSelectedServiceType] = useState<
    string | undefined
  >(undefined);
  const [referenceProjectName, setReferenceProjectName] = useState<
    string | undefined
  >(undefined);

  const scrollToContact = () => {
    const contactEl = document.querySelector('#contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (serviceTitle: string) => {
    const normalized =
      serviceTitle === 'Landing Pages'
        ? 'Landing Page Design'
        : serviceTitle === 'Creative Digital Experiences'
          ? 'Creative Digital Experience'
          : serviceTitle;
    setSelectedServiceType(normalized);
    scrollToContact();
  };

  const handleDiscussProject = (projectName: string) => {
    setReferenceProjectName(projectName);
    scrollToContact();
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#050505] text-[#F5F1E8] selection:bg-[#C9A96E]/30 selection:text-[#F5F1E8]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#C9A96E] focus:text-[#050505] focus:rounded-sm focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      <LuxuryCursor />
      <OpeningReveal />
      <Navbar />

      <main id="main-content">
        <HeroSection />

        <Suspense fallback={<SectionFallback />}>
          <ServicesSection onSelectService={handleSelectService} />
          <PortfolioSection onDiscussProject={handleDiscussProject} />
          <AboutSection />
          <ProcessSection />
          <WhyChooseUsSection />
          <ContactSection
            preselectedProjectType={selectedServiceType}
            preselectedReferenceNote={referenceProjectName}
          />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
