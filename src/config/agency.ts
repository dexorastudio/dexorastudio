export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  iconName: 'layout' | 'code' | 'compass' | 'layers' | 'sparkles';
}

export interface PortfolioProject {
  id: string;
  number: string;
  name: string;
  industry: string;
  concept: string;
  projectType: string;
  image: string;
  alt: string;
  focusPoints: string[];
  aspectClass?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface ValueCard {
  number: string;
  title: string;
  description: string;
}

export const AGENCY_CONFIG = {
  name: 'DEXORA STUDIO',
  logoCutoutPath: '/assets/dexora-logo-transparent.png',
  email: 'studiodexora@gmail.com',
  mailtoUrl: 'mailto:studiodexora@gmail.com',
  whatsappNumber: '+923111076063',
  whatsappUrl: 'https://wa.me/923111076063',
  whatsappPrefill:
    'Hello DEXORA STUDIO, I would like to discuss a website project.',
  instagramHandle: '@studiodexora',
  instagramUrl: 'https://www.instagram.com/studiodexora/',
  description:
    'DEXORA STUDIO is a digital agency focused on creating modern, professional, and user-friendly websites. We specialize in website design, web development, and UI/UX design, helping businesses build a strong digital presence.',
  mission:
    'Our mission is to turn ideas into powerful digital experiences through creative design and functional solutions.',
  pricingModel: 'Custom quotes after discussing project requirements.',
  footerStatement:
    'Digital experiences crafted with creativity and precision.',
  inquiryEndpoint:
    (import.meta.env.VITE_INQUIRY_ENDPOINT as string | undefined) || '',
} as const;

export function buildWhatsAppUrl(customMessage?: string): string {
  const message = customMessage ?? AGENCY_CONFIG.whatsappPrefill;
  return `${AGENCY_CONFIG.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;

export const SERVICES: ServiceItem[] = [
  {
    id: 'website-design',
    number: '01',
    title: 'Website Design',
    description:
      'Modern, sophisticated websites designed to communicate brand identity and create a strong first impression.',
    deliverables: ['Visual Direction', 'Design Systems', 'Brand Storytelling'],
    iconName: 'layout',
  },
  {
    id: 'website-development',
    number: '02',
    title: 'Website Development',
    description:
      'Responsive, functional, and performance-focused websites built with modern technologies.',
    deliverables: ['Responsive Architecture', 'Clean Codebase', 'Speed Optimization'],
    iconName: 'code',
  },
  {
    id: 'ui-ux-design',
    number: '03',
    title: 'UI/UX Design',
    description:
      'Thoughtful user interfaces and intuitive digital experiences designed around users.',
    deliverables: ['User Flows', 'Interface Craft', 'Interactive Prototyping'],
    iconName: 'compass',
  },
  {
    id: 'landing-pages',
    number: '04',
    title: 'Landing Pages',
    description:
      'High-quality landing pages designed to communicate value and encourage meaningful action.',
    deliverables: ['Clear Hierarchy', 'Focused Messaging', 'Conversion Flow'],
    iconName: 'layers',
  },
  {
    id: 'creative-digital-experiences',
    number: '05',
    title: 'Creative Digital Experiences',
    description:
      'Immersive digital experiences combining design, motion, and technology.',
    deliverables: ['Real-Time 3D', 'Choreographed Motion', 'Editorial Craft'],
    iconName: 'sparkles',
  },
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'nova',
    number: '01',
    name: 'NOVA',
    industry: 'Technology',
    concept:
      'A futuristic technology brand website with immersive visuals.',
    projectType: 'Concept Showcase',
    image: '/src/assets/images/project_nova_tech_1795635064182.jpg',
    alt: 'NOVA futuristic spatial computing technology concept render in brushed titanium and smoked glass',
    focusPoints: [
      'Hardware-inspired dark material palette',
      'Scroll-driven product depth and perspective',
      'Minimalist technical specification architecture',
    ],
  },
  {
    id: 'aurel',
    number: '02',
    name: 'AUREL',
    industry: 'Luxury Fashion',
    concept:
      'An elegant fashion website with sophisticated typography and premium product presentation.',
    projectType: 'Concept Showcase',
    image: '/src/assets/images/project_aurel_fashion_1795635065356.jpg',
    alt: 'AUREL luxury fashion concept editorial showcasing tailored black wool coat and brass accessories',
    focusPoints: [
      'Editorial lookbook pacing and whitespace',
      'Refined serif and geometric display pairing',
      'Restrained champagne and obsidian contrast',
    ],
  },
  {
    id: 'vanta',
    number: '03',
    name: 'VANTA',
    industry: 'Architecture',
    concept:
      'A modern architecture portfolio with minimalist layouts and cinematic imagery.',
    projectType: 'Concept Showcase',
    image: '/src/assets/images/project_vanta_architecture_1795635065813.jpg',
    alt: 'VANTA minimalist dark concrete architectural pavilion cantilevered over still water at dusk',
    focusPoints: [
      'Asymmetric spatial grid echoing architectural proportions',
      'Full-bleed photographic framing with subtle parallax',
      'Quiet typographic project index',
    ],
  },
  {
    id: 'orbit',
    number: '04',
    name: 'ORBIT',
    industry: 'Software / SaaS',
    concept:
      'A premium software landing page with clean UI and modern visual storytelling.',
    projectType: 'Concept Showcase',
    image: '/src/assets/images/project_orbit_saas_1795635065914.jpg',
    alt: 'ORBIT precision software workstation display suspended in a minimalist dark studio',
    focusPoints: [
      'Structured product storytelling and clear hierarchy',
      'Interactive feature walkthrough architecture',
      'High-contrast dark interface clarity',
    ],
  },
  {
    id: 'lumen',
    number: '05',
    name: 'LUMEN',
    industry: 'Photography',
    concept:
      'A luxury photography portfolio with immersive image transitions.',
    projectType: 'Concept Showcase',
    image: '/src/assets/images/project_lumen_photography_1795635067402.jpg',
    alt: 'LUMEN luxury fine-art photography gallery interior with framed portrait under museum spotlight',
    focusPoints: [
      'Gallery-first viewing canvas without visual clutter',
      'Fluid image transitions and parallax depth',
      'Balanced curatorial captions and spacing',
    ],
  },
  {
    id: 'velocity',
    number: '06',
    name: 'VELOCITY',
    industry: 'Automotive',
    concept:
      'A futuristic automotive website with dramatic lighting and cinematic visuals.',
    projectType: 'Concept Showcase',
    image: '/src/assets/images/project_velocity_automotive_1795635067262.jpg',
    alt: 'VELOCITY futuristic satin charcoal electric grand tourer parked inside a concrete pavilion',
    focusPoints: [
      'Dramatic studio lighting and surface reflections',
      'Precision specification storytelling',
      'Smooth responsive vehicle showcase layout',
    ],
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    description:
      "Understand the client's goals, audience, brand, and project requirements.",
  },
  {
    number: '02',
    title: 'Design',
    description:
      'Create the visual direction, layout, and user experience.',
  },
  {
    number: '03',
    title: 'Develop',
    description:
      'Build a responsive, functional, and polished website.',
  },
  {
    number: '04',
    title: 'Launch',
    description:
      'Test, optimize, and prepare the website for launch.',
  },
];

export const WHY_CHOOSE_VALUES: ValueCard[] = [
  {
    number: '01',
    title: 'Creative Direction',
    description:
      "Thoughtful visual design that communicates a brand's identity.",
  },
  {
    number: '02',
    title: 'User-Focused Experience',
    description:
      'Interfaces designed to feel intuitive and easy to use.',
  },
  {
    number: '03',
    title: 'Modern Development',
    description:
      'Responsive websites built with modern web technologies.',
  },
  {
    number: '04',
    title: 'Attention to Detail',
    description:
      'Careful consideration of typography, motion, spacing, and functionality.',
  },
];

export const PROJECT_TYPES = [
  'Website Design',
  'Website Development',
  'UI/UX Design',
  'Landing Page Design',
  'Responsive Business Website',
  'Creative Digital Experience',
] as const;

export const BUDGET_RANGES = [
  'Under $250',
  '$250 – $500',
  '$500 – $750',
  '$750 – $1,000',
  '$1,000 – $1,500',
  '$1,500 – $3,000',
  '$3,000+',
  "Let's discuss after scope review",
] as const;
