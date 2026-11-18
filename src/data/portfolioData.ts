/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  PORTFOLIO DATA - SUDARSON BALAKRISHNAN                      ║
 * ║  Strictly aligned with official Resume details              ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

/* ───────────── 1. BASIC INFO ───────────── */
export const SITE = {
  name: 'Sudarson B',
  logo: '/assets/sb-crown-logo.png',
  pageTitle: 'Sudarson B – Aspiring AI & Data Science Engineer',
  role: 'AI & Data Science Engineer | Python Developer',
  email: 'sudarsonbalu@gmail.com',
  // digits only, with country code, no + or spaces
  phone: '919361138890',
  whatsappMessage: 'Hi Sudarson, I visited your portfolio and would like to get in touch.',
  available: true,
  location: 'Tiruchirappalli - 620101',
  portfolioUrl: 'https://sudarsonbalakrishnan-portfolio.vercel.app/',
};

/* ───────────── 2. HERO (top of page) ───────────── */
export const HERO = {
  eyebrow: 'ASPIRING AI & DATA SCIENCE ENGINEER • PYTHON DEVELOPER',
  headline: 'SUDARSON B', // big text, use CAPS
  roles: ['AI & DATA SCIENCE ENGINEER', 'PYTHON DEVELOPER'] as [string, string],
  tagline: 'Patent holder skilled in Python, Machine Learning, Computer Vision, and Data Analytics.',
  primaryButton: 'EXPLORE MY WORK',
  secondaryButton: 'GET IN TOUCH',
  image: '/assets/hero-red-bg.jpg', // 1920x1080, subject on the RIGHT side
  imageAlt: 'Portrait of Sudarson B',
  imagePosition: '85% 38%', // CSS object-position fallback (right corner + hair headroom)
};

/* ───────────── 3. LOADING SCREEN ───────────── */
export const LOADER = {
  statement: 'DEVELOPING INNOVATIVE AI DRIVEN SOLUTIONS AND SOLVING REAL WORLD PROBLEMS',
  redWords: ['AI', 'SOLUTIONS', 'PROBLEMS'], // words highlighted in red
};

/* ───────────── 4. ABOUT ───────────── */
export interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  date: string;
  featured?: boolean;
  certId?: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  credentialId?: string;
  category: string;
  image: string;
  pdfUrl?: string;
  featured?: boolean;
}

export const ABOUT = {
  eyebrow: 'B.Tech AI & Data Science · Patent Holder · Python Developer',
  portrait: '/media/profile.webp', // 4:5 portrait photo
  portraitAlt: 'Portrait of Sudarson Balakrishnan',
  portraitCaption: 'AI & Data Science Engineer',
  paragraphs: [
    'Aspiring AI & Data Science Engineer skilled in Python, Machine Learning, Computer Vision, and Data Analytics. Pursuing B.Tech in Artificial Intelligence and Data Science at VSB College of Engineering Technical Campus, Coimbatore (2023 – 2027, GPA: 8.45).',
    'Experienced in developing projects such as MediNexus, IBPFM, and Turbofan RUL Prediction. Patent holder with a published research journal, passionate about developing innovative AI-driven solutions and solving real-world problems.',
  ],
  education: [
    {
      institution: 'VSB College of Engineering Technical Campus, Coimbatore',
      degree: 'B.Tech in Artificial Intelligence and Data Science',
      duration: '2023 – 2027',
      score: 'GPA: 8.45',
    },
    {
      institution: 'Akkv Aarnadu Matric Higher Secondary School, Trichy',
      degree: 'Class XII (Higher Secondary)',
      duration: '2022 – 2023',
      score: '66.6%',
    },
  ],
  technologies: [
    'Python',
    'Java',
    'SQL',
    'MySQL',
    'HTML5',
    'CSS3',
    'JavaScript',
    'AWS',
    'Git',
    'VS Code',
    'Jupyter Notebook',
    'Power BI',
  ],
  focus: [
    'Machine Learning & Deep Learning',
    'Computer Vision & Data Analytics',
    'Python & REST API Engineering',
  ],
  experience: [
    {
      company: 'ServiceNow Virtual Internship (AICTE / EduSkills / ServiceNow)',
      role: 'ServiceNow Administration Intern',
      duration: 'MAR 2026',
      description: 'Learned ServiceNow platform fundamentals, workflow automation, and IT service management concepts. Gained hands-on exposure to cloud-based enterprise solutions and application development.',
    },
    {
      company: 'Techvolt Software Pvt. Ltd.',
      role: 'Front-End Development Intern',
      duration: 'FEB 2024',
      description: 'Gained hands-on training in HTML, CSS, and JavaScript basics. Built and styled interactive front-end web pages during training.',
    },
  ] as ExperienceItem[],
  certificates: [
    { name: 'Python', provider: 'HackerRank & Guvi' },
    { name: 'Virtual Internship', provider: 'ServiceNow' },
    { name: 'HTML & CSS', provider: 'Udemy' },
    { name: 'Python for Data Science', provider: 'Infosys Springboard' },
  ],
};

/* ───────────── 5. SOCIAL LINKS (footer) ───────────── */
export const SOCIALS = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/Sudarsonbalu' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/sudarson-balu-8110a1308' },
  { id: 'portfolio', label: 'Portfolio Live', href: 'https://sudarsonbalakrishnan-portfolio.vercel.app/' },
] as const;

/* ───────────── 6. TECHNICAL SKILLS (from Resume) ───────────── */
export const SKILL_CARDS: { name: string; category: string; level: string }[] = [
  { name: 'Programming Languages', category: 'Python · Java', level: 'Advanced' },
  { name: 'Database Systems', category: 'SQL · MySQL', level: 'Advanced' },
  { name: 'Web Technologies', category: 'HTML5 · CSS3 · JavaScript', level: 'Proficient' },
  { name: 'AI & Data Science', category: 'Machine Learning · Computer Vision · Analytics', level: 'Advanced' },
  { name: 'Cloud Infrastructure', category: 'AWS Cloud Services', level: 'Proficient' },
  { name: 'Tools & Version Control', category: 'Git · VS Code · Jupyter · Power BI', level: 'Advanced' },
];

/* ───────────── 6b. TECH STACK STRIP (logos under the skills) ───────────── */
export const TECH_STACK: string[] = ['Python', 'AWS', 'React', 'JavaScript', 'PostgreSQL', 'SQLite', 'Git'];

/* ───────────── 7. PROJECTS (Strictly from Resume) ───────────── */
export interface Project {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  videoUrl?: string;
  embedUrl?: string;
  driveUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  kind?: 'video' | 'software';
  poster?: string;
  description?: string;
  features?: string[];
  tags?: string[];
}

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: 'thekkamalai-transports',
    kind: 'software',
    title: 'Thekkamalai Transports',
    subtitle: 'Transportation & Logistics Platform',
    category: 'Logistics & Web Platform',
    poster: '/assets/thumbnails/thekkamalai-1.jpg',
    description: 'A professional transportation and logistics platform designed to showcase transport services, cargo handling, fleet information, and customer enquiries.',
    features: ['General Cargo Transport', 'Full Truck Load (FTL)', 'Part Load (PTL)', 'Pan India Network', 'Contact & Quote Enquiry'],
    tags: ['React', 'TypeScript', 'Vite'],
    repoUrl: 'https://github.com/Sudarsonbalu/-Thekkamalai-transports',
    liveUrl: 'https://thekkamalai-transports.vercel.app/',
  },
  {
    id: 'ibpfm',
    kind: 'software',
    title: 'IBPFM',
    subtitle: 'Intelligence Based Pollution Free Mission',
    category: 'AI & Environmental Tech',
    poster: '/assets/thumbnails/ibpfm-1.jpg',
    description: 'An AI-powered environmental awareness and pollution assistance platform designed to promote environmental protection and sustainable development.',
    features: ['AI Chatbot', 'Pollution Awareness', 'Environmental Information', 'Pollution Analysis'],
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    repoUrl: 'https://github.com/Sudarsonbalu/ibpfm',
    liveUrl: 'https://ibpfm.netlify.app/ai',
  },
  {
    id: 'turbofan-rul',
    kind: 'software',
    title: 'Turbofan RUL Prediction',
    subtitle: 'Remaining Useful Life (RUL) Estimation',
    category: 'Machine Learning & Predictive Maintenance',
    poster: '/assets/thumbnails/turbofan-1.jpg',
    description: 'A machine learning-based predictive maintenance application that estimates the Remaining Useful Life of aircraft turbofan engines using sensor data.',
    features: ['NASA C-MAPSS Dataset', 'Sensor Data Analysis', 'Machine Learning Prediction', 'Remaining Useful Life Estimation', 'Predictive Maintenance'],
    tags: ['Python', 'Machine Learning', 'Scikit-learn', 'Jupyter Notebook'],
    repoUrl: 'https://github.com/Sudarsonbalu/turbofanrulprediction',
    liveUrl: 'https://turbofanrulprediction.vercel.app/',
  },
  {
    id: 'codeguardian',
    kind: 'software',
    title: 'CodeGuardian',
    subtitle: 'AI-Powered Code Security & Vulnerability Analysis',
    category: 'Cybersecurity & AI',
    poster: '/assets/thumbnails/codeguardian-1.jpg',
    description: 'An AI-powered code security project designed to help developers identify potential vulnerabilities, analyze code risks, and explore secure coding improvements.',
    features: ['Vulnerability Detection', 'Code Analysis', 'Risk Identification', 'Security Recommendations', 'Secure Coding Assistance'],
    tags: ['Python', 'Machine Learning', 'AST Analysis', 'Security Audit'],
    repoUrl: 'https://github.com/Sudarsonbalu/codeguardian',
    // Live demo hidden until deployment URL is available
  },
  {
    id: 'mediai',
    kind: 'software',
    title: 'MediAI',
    subtitle: 'Hospital Management System',
    category: 'Healthcare & Full-Stack AI',
    poster: '/assets/thumbnails/mediai-1.jpg',
    description: 'An AI-powered hospital management application designed to simplify healthcare administration and improve hospital workflows.',
    features: ['Patient Management', 'Doctor Management', 'Appointment Booking', 'Health Records Management', 'Hospital Administration'],
    tags: ['Python', 'FastAPI', 'MySQL', 'React'],
    repoUrl: 'https://github.com/Sudarsonbalu/medi_ai_hospital_management',
    liveUrl: 'https://medi-ai-hospital-management-8wi1w22uj-sudarsonbalus-projects.vercel.app/index.html',
  },
  {
    id: 'asphalt-opencv',
    kind: 'software',
    title: 'Asphalt 8 OpenCV Controller',
    subtitle: 'Webcam-Based Hand Gesture Game Control',
    category: 'Computer Vision & Gaming AI',
    poster: '/assets/thumbnails/asphalt-1.jpg',
    description: 'Control Asphalt 8 gameplay using real-time webcam-based hand gesture recognition and computer vision. Maps finger poses and hand landmarks directly into driving controls.',
    features: [
      'Real-Time Hand Landmark Tracking',
      'Dynamic Steering (Left/Right) via Hand Pose',
      'Smooth Acceleration & Braking Control',
      'Nitro Boost Trigger via Thumb-Up Gesture',
      'Auto Pause/Resume on Open Hands Gesture',
    ],
    tags: ['Python', 'OpenCV', 'MediaPipe', 'CVZone', 'Pynput'],
    repoUrl: 'https://github.com/Sudarsonbalu/Asphalt_openCV',
  },
  {
    id: 'dragonball-opencv',
    kind: 'software',
    title: 'Dragon Ball Z OpenCV Controller',
    subtitle: 'Gesture-to-Keyboard Translation System',
    category: 'Computer Vision & Human-Computer Interaction',
    poster: '/assets/thumbnails/dragonball-1.jpg',
    description: 'A hand gesture-based gaming control project that uses computer vision to translate hand movements into game controls for Dragon Ball gameplay.',
    features: [
      'Webcam Hand Movement Capture',
      'Gesture-to-Key Mapping (A, D, W, S)',
      'Custom Finger Pose Classification',
      'Real-Time Video Processing Feed',
      'Interactive Combat & Directional Control',
    ],
    tags: ['Python', 'OpenCV', 'CVZone', 'Computer Vision', 'Keyboard'],
    repoUrl: 'https://github.com/Sudarsonbalu/DRAGONBALL-OPENCV',
  },
];

/* ───────────── 8. CERTIFICATES & ACHIEVEMENTS ───────────── */
export const CERTIFICATES_LIST: CertificateItem[] = [
  {
    id: 'cert-hackerrank-python',
    title: 'Python (Basic) Skill Certification',
    issuer: 'HackerRank',
    date: '27 Jan, 2026',
    credentialId: 'DB28D301B895',
    category: 'Skill Certification',
    image: '/assets/certificates/cert-hackerrank-python.jpg',
    featured: true,
  },
  {
    id: 'cert-servicenow-internship',
    title: 'ServiceNow Virtual Internship Program',
    issuer: 'ServiceNow & SmartBridge (AICTE)',
    date: 'April 14, 2026',
    credentialId: 'SNU2015707',
    category: 'Virtual Internship',
    image: '/assets/certificates/cert-servicenow.jpg',
    featured: true,
  },
  {
    id: 'cert-infosys-datascience',
    title: 'Data Science Course Completion',
    issuer: 'Infosys Springboard',
    date: 'August 17, 2026',
    category: 'Course Completion',
    image: '/assets/certificates/cert-infosys.jpg',
    featured: true,
  },
  {
    id: 'cert-techvolt-internship',
    title: 'Full Stack Development - Frontend Internship',
    issuer: 'Techvolt Software Pvt. Ltd.',
    date: '15/02/2024 – 22/02/2024',
    credentialId: 'Reg: 723723243114',
    category: 'Industry Internship',
    image: '/assets/certificates/cert-techvolt.jpg',
    featured: false,
  },
  {
    id: 'cert-ijcrt-publication',
    title: 'A Comprehensive Analysis of Cyber Crimes and Cyber Security Tools',
    issuer: 'International Journal of Creative Research Thoughts (IJCRT)',
    date: '17 November, 2024',
    credentialId: 'Paper ID: IJCRT2411408 | ISSN: 2320-2882',
    category: 'Research Paper Publication',
    image: '/assets/certificates/cert-ijcrt.jpg',
    featured: true,
  },
  {
    id: 'cert-ncrpaidst-secondprize',
    title: 'AI in Cybersecurity – Second Prize Conference Paper',
    issuer: 'Er. Perumal Manimekalai College of Engineering (PMC TECH)',
    date: '25 March, 2025',
    credentialId: 'ISBN: 978-81-972697-4-5',
    category: 'National Conference Paper',
    image: '/assets/certificates/cert-ncrpaidst.jpg',
    featured: true,
  },
  {
    id: 'cert-patent-publication',
    title: 'Smart Dustbin System with Automated Dust Collection, Waste Management and IoT Integration',
    issuer: 'The Patent Office Journal, Government of India',
    date: '21 February, 2025',
    credentialId: 'Application No: 202541009764 A',
    category: 'Published Patent',
    image: '/assets/certificates/cert-patent.jpg',
    featured: true,
  },
  {
    id: 'cert-astranova-cit',
    title: 'ASTRANOVA 2K25 – National Technical Symposium',
    issuer: 'Coimbatore Institute of Technology (CIT)',
    date: '28 Feb – 01 Mar, 2025',
    category: 'National Symposium',
    image: '/assets/certificates/cert-astranova.jpg',
    featured: false,
  },
];

export const MAJOR_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach-sparkathon',
    title: 'Sparkathon 2024',
    subtitle: 'Secured Second Place in Sparkathon 2024, a technical innovation hackathon organized by the Department of Artificial Intelligence and Data Science at V.S.B. College of Engineering Technical Campus.',
    category: 'Technical Innovation Hackathon',
    badge: 'Second Place',
    date: 'Hackathon 2024',
    featured: true,
  },
  {
    id: 'ach-ncrpaidst',
    title: 'NCRPAIDST-2K25 – Research Paper on Cybersecurity',
    subtitle: 'Awarded Second Prize for presenting the research paper titled "AI in Cybersecurity" at the National Conference on Rising Phenomenon of Artificial Intelligence and Data Science Technologies (PMC TECH, ISBN: 978-81-972697-4-5).',
    category: 'National Conference Award',
    badge: 'Second Prize',
    date: '25 March 2025',
    featured: true,
    certId: 'cert-ncrpaidst-secondprize',
  },
  {
    id: 'ach-patent',
    title: 'Patent Holder – Smart Dustbin System with Automated Dust Collection, Waste Management and IoT Integration',
    subtitle: 'Official Patent Holder (The Patent Office Journal, Application No: 202541009764 A, Published 21/02/2025). Designed and published an intelligent automated dust collection system with IoT and sensor integration.',
    category: 'Government of India Patent',
    badge: 'Patent Holder',
    date: 'Published Feb 2025',
    featured: true,
    certId: 'cert-patent-publication',
  },
];

export const ACHIEVEMENTS_LIST = MAJOR_ACHIEVEMENTS;

/* Kept for backward compatibility if referenced */
export const SERVICES_PRICING = ACHIEVEMENTS_LIST;

/* ───────────── 9. HEADLINE NUMBERS (under hero) ───────────── */
export const CLIENT_STATS = [
  { id: 'stat-1', value: 7, suffix: '', label: 'Featured Projects' },
  { id: 'stat-2', value: 1, suffix: '', label: 'Published Patent' },
  { id: 'stat-3', value: 8, suffix: '+', label: 'Verified Certificates' },
] as const;

/* Derived – do not edit */
export const WHATSAPP_URL = `https://wa.me/${SITE.phone}?text=${encodeURIComponent(SITE.whatsappMessage)}`;
