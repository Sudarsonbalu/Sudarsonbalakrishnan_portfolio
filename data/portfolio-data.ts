export interface Project {
  n: string
  slug: string
  title: string
  subtitle: string
  client: string
  year: string
  category: string
  tags: string[]
  tone: 'crimson' | 'ruby' | 'obsidian' | 'scarlet'
  summary: string
  metric: string
  deliverables: string
  features: string[]
  challenge: string
  solution: string
  architectureList: string[]
  metricsList: { label: string; value: string }[]
  image?: string
  link?: string
  github?: string
  demo?: string
}

export interface Experience {
  company: string
  role: string
  period: string
  type: string
  highlights: string[]
}

export interface Education {
  institution: string
  degree: string
  period: string
  score: string
  location: string
}

export interface Publication {
  type: 'Patent' | 'Journal'
  title: string
  venue: string
}

export interface Achievement {
  title: string
  event: string
  organizer: string
  date: string
  badge: string
}

export interface Certification {
  name: string
  issuer: string
}

export interface PortfolioData {
  profile: {
    name: string
    formalName: string
    title: string
    displayRole: string
    headline: string
    statement: string
    bio: string
    location: string
    coordinates: string
    email: string
    phone: string
    availability: string
    gpa: string
    degree: string
    college: string
  }
  links: {
    github: string
    linkedin: string
    portfolio: string
    email: string
    phone: string
    resume: string
  }
  skills: {
    languages: string[]
    frameworks: string[]
    libraries: string[]
    databases: string[]
    tools: string[]
    aiMl: string[]
    webTech: string[]
    softSkills: string[]
  }
  projects: Project[]
  experience: Experience[]
  education: Education[]
  publications: Publication[]
  achievements: Achievement[]
  certifications: Certification[]
}

export const portfolioData: PortfolioData = {
  profile: {
    name: 'SUDARSON',
    formalName: 'Sudarson Balakrishnan',
    title: 'Artificial Intelligence & Data Science Engineer',
    displayRole: 'AI & Data Science Engineer · Full-Stack Developer',
    headline: 'INTELLIGENT SYSTEMS & DATA ENGINEERING',
    statement:
      'Engineering intelligent applications, machine learning architectures, and full-stack systems with rigorous analytical foundations and human-centric design.',
    bio: 'Aspiring Artificial Intelligence and Data Science engineer with a strong foundation in machine learning, computer vision, web development, and data analytics. Passionate about developing intelligent applications and solving real-world problems through AI-driven and data-oriented solutions.',
    location: 'Tiruchirappalli / Coimbatore, India',
    coordinates: "10°51'N · 78°41'E",
    email: 'sudarsonbalu@gmail.com',
    phone: '+91 9361138890',
    availability: 'OPEN FOR FULL-TIME ROLES & COMMISSIONS',
    gpa: '8.45 / 10',
    degree: 'B.Tech in Artificial Intelligence & Data Science',
    college: 'VSB College of Engineering Technical Campus',
  },
  links: {
    github: 'https://github.com/Sudarsonbalu',
    linkedin: 'https://linkedin.com/in/sudarson-balu-8110a1308',
    portfolio: 'https://sudarson-balakrishnan-portfolio.vercel.app/',
    email: 'mailto:sudarsonbalu@gmail.com',
    phone: 'tel:+919361138890',
    resume: 'https://drive.google.com/drive/folders/12fZAOVld3XP_NQ9zyB6BiZnqmjE_6f0z?usp=drive_link',
  },
  skills: {
    languages: ['Python', 'Java', 'JavaScript', 'TypeScript', 'PHP', 'SQL'],
    frameworks: ['FastAPI', 'Next.js', 'React'],
    libraries: ['Pandas', 'NumPy', 'Scikit-learn', 'OpenCV', 'Matplotlib'],
    databases: ['PostgreSQL', 'MySQL', 'SQL'],
    tools: [
      'Git',
      'VS Code',
      'Jupyter Notebook',
      'Power BI',
      'Cursor AI',
      'Antigravity',
      'ServiceNow',
    ],
    aiMl: [
      'Machine Learning',
      'Computer Vision',
      'Gemini API',
      'OpenAI API',
      'OpenRouter API',
      'Data Analytics',
      'Predictive Modeling',
    ],
    webTech: ['HTML5', 'CSS3', 'REST APIs', 'JWT Authentication', 'Responsive UI'],
    softSkills: ['Teamwork', 'Communication', 'Quick Learner'],
  },
  projects: [
    {
      n: '01',
      slug: 'medi-nexus',
      title: 'MEDI NEXUS',
      subtitle: 'AI-Driven Healthcare Ecosystem',
      client: 'Healthcare Innovation',
      year: '2025',
      category: 'Full-Stack Healthcare AI',
      tags: ['FastAPI', 'MySQL', 'Gemini API', 'OpenRouter', 'JWT', 'REST API'],
      tone: 'crimson',
      summary:
        'A full-stack healthcare ecosystem streamlining patient registration, doctor appointment scheduling, and electronic medical record management with intelligent AI clinical assistance.',
      metric: 'FastAPI + MySQL · Gemini & OpenRouter AI · JWT Auth',
      deliverables:
        'Full-Stack Web Interface · RESTful Services · AI Symptom Analysis Pipeline',
      challenge:
        'Healthcare facilities frequently struggle with fragmented patient scheduling, disconnected record keeping, and lack of immediate pre-consultation clinical guidance for patients.',
      solution:
        'Built a consolidated healthcare platform coupling high-throughput asynchronous backend APIs (FastAPI) with structured relational storage (MySQL) and dual LLM inference (Gemini API + OpenRouter) for clinical symptom triaging.',
      architectureList: [
        'FastAPI asynchronous REST service layer with sub-millisecond route dispatching',
        'Relational MySQL schema with foreign keys for patients, physicians, and appointments',
        'JWT token authentication with role-based access control (Patient / Doctor / Admin)',
        'Prompt-engineered Gemini API integration for real-time symptom analysis and guidance',
      ],
      metricsList: [
        { label: 'Backend Architecture', value: 'FastAPI Async' },
        { label: 'Database Storage', value: 'Relational MySQL' },
        { label: 'Intelligence Pipeline', value: 'Gemini + OpenRouter' },
        { label: 'Security Model', value: 'Stateless JWT Auth' },
      ],
      features: [
        'Streamlines patient registration, appointment scheduling, and electronic medical record management.',
        'Engineered secure backend services using FastAPI and MySQL with JWT-based authentication and role-based access control.',
        'Integrated OpenRouter & Gemini API for AI-powered symptom analysis, clinical guidance, and intelligent patient support.',
      ],
      link: 'https://github.com/Sudarsonbalu/medi_ai_hospital_management',
      image: '/images/projects/medi-nexus.jpg',
      demo: 'https://github.com/Sudarsonbalu/medi_ai_hospital_management',
      github: 'https://github.com/Sudarsonbalu/medi_ai_hospital_management',
    },
    {
      n: '02',
      slug: 'codeguardian',
      title: 'CODEGUARDIAN',
      subtitle: 'AI-Powered Data Engineering & Cybersecurity Platform',
      client: 'Cybersecurity & Code Quality',
      year: '2025',
      category: 'AI Code Intelligence & Security',
      tags: ['FastAPI', 'Next.js', 'TypeScript', 'PostgreSQL', 'OpenAI API', 'GitHub API'],
      tone: 'ruby',
      summary:
        'A full-stack platform collecting, processing, and analyzing GitHub repository data for automated code quality assessment, vulnerability detection, and engineering insights.',
      metric: 'OpenAI Source-Code Analysis · GitHub API · PostgreSQL',
      deliverables:
        'Data Engineering Pipelines · Automated Vulnerability Detection · Actionable Remediation',
      challenge:
        'Software repositories often harbor hidden vulnerabilities, technical debt, and misconfigurations that manual code reviews miss before deployment.',
      solution:
        'Constructed an end-to-end data ingestion and security analytics engine that pulls raw repository telemetry via GitHub REST APIs, indexes codebases in PostgreSQL, and orchestrates OpenAI API models to detect flaws and formulate fixes.',
      architectureList: [
        'GitHub API telemetry ingestion engine parsing repository file trees and commit diffs',
        'PostgreSQL structured repository catalog with indexed vulnerability registries',
        'OpenAI API automated AST and code vulnerability analysis engine',
        'Next.js & TypeScript reactive dashboard displaying security scorecards',
      ],
      metricsList: [
        { label: 'Data Ingestion', value: 'GitHub API Pipeline' },
        { label: 'Analysis Engine', value: 'OpenAI LLM Engine' },
        { label: 'Storage Engine', value: 'PostgreSQL Relational' },
        { label: 'Frontend Interface', value: 'Next.js + TypeScript' },
      ],
      features: [
        'Collects, processes, and evaluates GitHub repository telemetry for automated code quality benchmarks.',
        'Constructed data processing services using FastAPI and PostgreSQL with structured analysis storage.',
        'Integrated GitHub API and OpenAI API to detect potential security vulnerabilities and generate actionable remediation.',
      ],
      link: 'https://github.com/Sudarsonbalu',
      image: '/images/projects/codeguardian.jpg',
      github: 'https://github.com/Sudarsonbalu',
    },
    {
      n: '03',
      slug: 'turbofan-rul',
      title: 'TURBOFAN RUL PREDICTION',
      subtitle: 'Remaining Useful Life (RUL) Prediction System',
      client: 'Predictive Maintenance / NASA C-MAPSS',
      year: '2024',
      category: 'Machine Learning & Sensor Analytics',
      tags: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Jupyter'],
      tone: 'scarlet',
      summary:
        'Predictive maintenance machine learning model predicting the Remaining Useful Life (RUL) of turbofan engines using NASA C-MAPSS sensor data to avert unexpected failures.',
      metric: 'NASA C-MAPSS Telemetry · Regression ML · Degradation Modeling',
      deliverables:
        'Feature Engineering · Health Indicator Identification · Trend Visualization',
      challenge:
        'Unscheduled aerospace turbine downtime causes massive logistical disruptions and severe financial losses when mechanical degradation occurs undetected.',
      solution:
        'Leveraged the benchmark NASA C-MAPSS dataset containing multi-sensor engine degradation cycles. Applied statistical rolling features, sensor correlation filtering, and regression algorithms to forecast time-to-failure.',
      architectureList: [
        'Multi-channel sensor telemetry preprocessing across 21 continuous sensor streams',
        'Rolling window statistical aggregations (mean, std dev, min/max) for trend extraction',
        'Health indicator modeling comparing healthy baseline states against terminal cycles',
        'Regression algorithms (Random Forest, Gradient Boosting, Linear Regression) with evaluation metrics',
      ],
      metricsList: [
        { label: 'Dataset', value: 'NASA C-MAPSS' },
        { label: 'Sensor Channels', value: '21 Parameters' },
        { label: 'Core Algorithms', value: 'Regression / Ensemble' },
        { label: 'Toolchain', value: 'Scikit-Learn + Pandas' },
      ],
      features: [
        'Predicts Remaining Useful Life of turbofan engines to enable condition-based proactive maintenance.',
        'Extensive sensor preprocessing, exploratory data analysis, and domain-specific feature engineering.',
        'Trained and evaluated regression algorithms to visualize engine degradation trends with high reliability.',
      ],
      link: 'https://turbofanrulprediction.vercel.app/',
      image: '/images/projects/turbofan-rul.jpg',
      demo: 'https://turbofanrulprediction.vercel.app/',
      github: 'https://github.com/Sudarsonbalu',
    },
    {
      n: '04',
      slug: 'ibpfm-mission',
      title: 'IBPFM / ECO AI',
      subtitle: 'Intelligence Based Pollution Free Mission',
      client: 'Environmental AI Initiative',
      year: '2024',
      category: 'AI Environmental Monitoring Platform',
      tags: ['Gemini API', 'JavaScript', 'PHP', 'MySQL', 'Heatmaps', 'HTML5/CSS3'],
      tone: 'obsidian',
      summary:
        'An AI-powered environmental monitoring platform promoting pollution awareness, waste management, and sustainable practices through intelligent digital solutions.',
      metric: 'Gemini AI Chatbot · Heatmap Visualization · Community Rewards',
      deliverables:
        'Interactive Learning System · Waste Sorting AI · Pollution Heatmap Engine',
      challenge:
        'Civic communities lack accessible, interactive real-time visual tools to report pollution hotspots and learn actionable waste segregation techniques.',
      solution:
        'Architected an environmental monitoring platform fusing Gemini AI advisory chat with geographical pollution heatmaps and an incentivized community engagement reward system.',
      architectureList: [
        'Interactive spatial heatmap plotting local pollution reports and emission severity levels',
        'Gemini API conversational assistant trained on waste classification and recycling guidelines',
        'PHP & MySQL transactional layer recording user reports and calculating civic reward points',
        'Responsive mobile-first user interface with real-time feedback mechanisms',
      ],
      metricsList: [
        { label: 'AI Advisory', value: 'Gemini API' },
        { label: 'Spatial Engine', value: 'Pollution Heatmaps' },
        { label: 'Data Backend', value: 'PHP & MySQL' },
        { label: 'Civic Features', value: 'Waste Sorting & Rewards' },
      ],
      features: [
        'AI chatbot assistance with waste sorting recommendations and pollution awareness guidance.',
        'Interactive pollution heatmap visualization for real-time environmental insights.',
        'Community engagement system with user reward mechanisms and feedback modules.',
      ],
      link: 'https://ibpfm.netlify.app/ai',
      image: '/images/projects/ibpfm-mission.jpg',
      demo: 'https://ibpfm.netlify.app/ai',
      github: 'https://github.com/Sudarsonbalu',
    },
    {
      n: '05',
      slug: 'thekamalai-transports',
      title: 'THEKKAMALAI TRANSPORTS',
      subtitle: 'Business Website · Transportation & Logistics',
      client: 'Thekkamalai Transports',
      year: '2024',
      category: 'Business Website Development',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL', 'Responsive UI'],
      tone: 'crimson',
      summary:
        'A fully responsive business website developed for Thekkamalai Transports, a transportation and logistics company. The site establishes a professional digital presence with service information, contact capabilities, and an enquiry management system.',
      metric: 'HTML5 / CSS3 / JavaScript · PHP Backend · MySQL',
      deliverables:
        'Responsive Business Website · Service Pages · Enquiry Form System',
      challenge:
        'Thekkamalai Transports required a professional online presence to reach customers digitally. The business lacked a website, making it difficult for clients to discover their services, understand their fleet offerings, or make transport enquiries.',
      solution:
        'Designed and developed a clean, professional business website with structured service pages, a contact and enquiry form backed by PHP and MySQL, and a fully mobile-responsive layout to ensure accessibility across devices.',
      architectureList: [
        'HTML5 semantic page structure with service and contact sections',
        'CSS3 responsive layout with mobile-first design approach',
        'JavaScript for interactive UI elements and form validation',
        'PHP server-side form processing and enquiry data handling',
        'MySQL database for storing and managing contact form submissions',
      ],
      metricsList: [
        { label: 'Frontend Stack', value: 'HTML5 + CSS3 + JS' },
        { label: 'Backend', value: 'PHP' },
        { label: 'Database', value: 'MySQL' },
        { label: 'Design Approach', value: 'Mobile-First Responsive' },
      ],
      features: [
        'Professional business website with structured service and fleet information pages.',
        'Mobile-responsive layout designed to work seamlessly across desktop, tablet, and mobile devices.',
        'PHP and MySQL powered enquiry/contact form system for client lead management.',
        'Clean, trust-building visual design appropriate for a transportation business.',
        'SEO-friendly semantic HTML structure for better search engine discoverability.',
      ],
      link: 'https://thekkamalai-transports.vercel.app/',
      image: '/images/projects/thekamalai-transports.jpg',
      demo: 'https://thekkamalai-transports.vercel.app/',
      github: 'https://github.com/Sudarsonbalu',
    },
  ],
  experience: [
    {
      company: 'ServiceNow',
      role: 'Virtual Intern (AICTE / EduSkills / ServiceNow)',
      period: 'March 2026',
      type: 'Virtual Internship',
      highlights: [
        'Learned ServiceNow platform fundamentals, workflow automation, and IT service management (ITSM) concepts.',
        'Gained hands-on exposure to cloud-based enterprise solutions and scalable application development.',
      ],
    },
    {
      company: 'Tech Volt Software Pvt. Ltd.',
      role: 'Front-End Development Intern',
      period: 'February 2024',
      type: 'Internship',
      highlights: [
        'Gained hands-on training in core web technologies including HTML, CSS, and JavaScript.',
        'Built and styled interactive front-end web pages during training and project sprints.',
      ],
    },
  ],
  education: [
    {
      institution: 'VSB College of Engineering Technical Campus',
      degree: 'B. Tech in Artificial Intelligence and Data Science',
      period: '2023 – 2027',
      score: 'GPA: 8.45 / 10',
      location: 'Coimbatore, Tamil Nadu',
    },
    {
      institution: 'Akkv Aarnadu Matric Higher Secondary School',
      degree: 'Higher Secondary Certificate (Class XII)',
      period: '2022 – 2023',
      score: 'Score: 66.6%',
      location: 'Tiruchirappalli, Tamil Nadu',
    },
  ],
  publications: [
    {
      type: 'Patent',
      title: 'Smart Dustbin System with Automated Dust Collection, Waste Management and IoT Integration',
      venue: 'Patent Filed / Published',
    },
    {
      type: 'Journal',
      title: 'A Comprehensive Analysis of Cyber Crimes and Cyber Security Tools',
      venue: 'International Journal of Creative Research Thoughts (IJCRT)',
    },
  ],
  achievements: [
    {
      title: 'Research Paper Presentation: "AI in Cybersecurity"',
      event: 'NCRPAIDST-2K25 National Conference',
      organizer: 'Dept. of AI & Data Science, Er. Perumal Manimekalai College of Engineering',
      date: 'March 2025',
      badge: 'NATIONAL CONFERENCE',
    },
    {
      title: 'Second Prize Winner',
      event: 'Sparkathon-2K24 Technical Innovation Hackathon',
      organizer: 'Dept. of AI & Data Science, V.S.B College of Engineering Technical Campus',
      date: '2024',
      badge: '2ND PRIZE HACKATHON',
    },
  ],
  certifications: [
    { name: 'Python for Data Science', issuer: 'Infosys Springboard' },
    { name: 'Python Programming', issuer: 'HackerRank & Guvi' },
    { name: 'ServiceNow Virtual Internship', issuer: 'ServiceNow / AICTE / EduSkills' },
    { name: 'HTML & CSS Web Development', issuer: 'Udemy' },
  ],
}
