export const resumeData = {
  personalInfo: {
    name: "Supreeth Gollapally",
    email: "gollapallysupreeth@gmail.com",
    phone: "+91 9491436678",
    linkedin: "gollapally-supreeth",
    github: "gollapally-supreeth",
    instagram: "suprith_111",
    leetcode: "Suprith_111",
    role: "Software Developer",
    summary: "Tech Enthusiast Software Developer skilled in Java, Python, and C, with a passion for AI, automation,full-stack development and Cyber Security. Strong in DSA and real-world problem-solving, also experienced in stock trading and risk analysis."
  },
  education: [
    {
      institution: "Anurag University Hyderabad",
      degree: "Bachelor of Technology - Computer Science and Engineering",
      dates: "July 2024 - Present",
      gpa: "7.99"
    },
    {
      institution: "Govt Polytechnic Siddipet",
      degree: "Diploma - Computer Science and Engineering",
      dates: "Sept 2021 - May 2024",
      gpa: "9.13"
    }
  ],
  skills: {
    languages: [
      { name: "Python", level: 90 },
      { name: "Java", level: 100 },
      { name: "C++", level: 30 },
      { name: "C", level: 50 },
      { name: "JavaScript", level: 80 },
      { name: "SQL", level: 70 },
      { name: "HTML/CSS", level: 90 },
      { name: "Bash", level: 50 }
    ],
    frameworks: [
      { name: "React.js", level: 95 },
      { name: "Next.js", level: 30 },
      { name: "Django", level: 30 },
      { name: "Node.js", level: 100 },
      { name: "PyTorch", level: 30 },
      { name: "LangChain", level: 40 },
      { name: "Tailwind CSS", level: 90 },
      { name: "GSAP", level: 70 }
    ],
    databases: [
      { name: "MongoDB", level: 90 },
      { name: "PostgreSQL", level: 70 },
      { name: "MySQL", level: 50 },
      { name: "SQLite", level: 40 },
      { name: "Firebase", level: 60 }
    ],
    tools: [
      { name: "Git & GitHub", level: 100 },
      { name: "Docker", level: 60 },
      { name: "Wireshark", level: 45 },
      { name: "Nmap", level: 30 },
      { name: "Postman", level: 40 },
      { name: "VS Code", level: 95 },
      { name: "Burp Suite", level: 35 },
      { name: "Ollama", level: 80 }
    ],
    platforms: [
      { name: "Linux (Kali/Ubuntu)", level: 75 },
      { name: "Windows", level: 90 },
      { name: "AWS", level: 80 },
      { name: "Raspberry Pi", level: 55 },
      { name: "Vercel", level: 85 },
      { name: "Netlify", level: 75 }
    ],
    trading: [
      { name: "Risk Management", level: 90 },
      { name: "Technical Analysis", level: 40 },
      { name: "Price Action", level: 59 },
      { name: "Market Psychology", level: 70 },
      { name: "Swing Trading", level: 85 },
      { name: "Options Trading", level: 90 },
      { name: "Forex", level: 60 },
      { name: "Fundamental Analysis", level: 60 },

    ],
    marquee: [
      { name: "React.js", icon: "Layout" },
      { name: "Java", icon: "Code" },
      { name: "Python", icon: "Terminal" },
      { name: "Node.js", icon: "Cpu" },
      { name: "Next.js", icon: "Zap" },
      { name: "MongoDB", icon: "Database" },
      { name: "Docker", icon: "Shield" },
      { name: "Tailwind", icon: "Layers" },
      { name: "MySQL", icon: "Database" },
      { name: "Linux", icon: "Shield" }
    ]
  },
  experience: [
    {
      company: "Bhuvih HR Solutions Private Limited",
      role: "Software Developer - Intern",
      dates: "May 2025 – Oct 2025",
      location: "Remote",
      points: [
        "Engineered secure backend authentication and session management using Django, Supabase, and PostgreSQL.",
        "Coordinated with the frontend team to ensure seamless integration and consistent user experience.",
        "Worked in Agile sprints using GitHub for issue tracking, version control, and code reviews."
      ]
    },
    {
      company: "NSIC Technical Services Centre Hyderabad",
      role: "Industrial Trainee",
      dates: "Dec 2023 – June 2024",
      points: [
        "Gained practical exposure to Python, Java, Linux, and backend frameworks like Django.",
        "Developed and tested backend modules using PostgreSQL, And automated tasks using shell scripts.",
        "Explored fundamental concepts of Data Science, including data cleaning and analysis using Python libraries."
      ]
    }

  ],
  projects: [

    {
      name: "E-Library v2.0 – Production-Ready Digital Library Platform",
      tech: ["MERN-Stack", "AWS EC2", "Cloudflare", "CI/CD", "Docker"],
      image: "/assets/e-library.webp",
      link: "https://e-library.tech/",
      github: "https://github.com/gollapally-supreeth/eLibrary/tree/E-Library-v2.0",
      description: "Redesigned and rebuilt a MERN-stack production-ready digital library with secure JWT auth and role-based access.",
      points: [
        "Built a fully responsive UI with modern design principles and role-based access control (RBAC).",
        "Deployed backend on AWS EC2 (Nginx + SSL) and frontend on Cloudflare Pages with custom domain.",
        "Implemented GitHub Actions CI/CD and production process management using PM2."
      ]
    },
    {
      name: "Drop & Share – File Sharing Platform",
      tech: ["React", "Vite", "Node.js", "Express", "Appwrite"],
      image: "/assets/drop&share_project.webp",
      link: "https://simple-transfile.netlify.app/",
      github: "https://github.com/gollapally-supreeth/Trans-File", // Add your GitHub repo URL here
      description: "A Simple file transfer system supporting 500MB uploads and drag-and-drop UI.",
      points: [
        "Used React + Vite on frontend and Node.js + Express on backend with modular routing.",
        "Integrated GSAP animations, and TailwindCSS for responsive, accessible UI.",
        "Integrated Appwrite for backend services including authentication, database, and file storage."
      ]
    },
    {
      name: "Semantic Entropy File System",
      tech: ["Python", "PyQt6", "HDBSCAN", "UMAP"],
      image: "/assets/project-3.webp",
      description: "A revolutionary AI-powered file organization system that uses Deep Learning and LLMs to understand file meaning and auto-organize them into semantically relevant folders — beyond just extensions.",
      github: "https://github.com/gollapally-supreeth/Semantic-Entropy-File-System-Project",
      points: [
        "Groups files by semantic content using embeddings — PDFs and TXTs on the same topic live together, named by Gemini API.",
        "Real-time Watchdog monitoring auto-reorganizes files on any change, with PyQt6 2D Semantic Map for cluster visualization.",
        "Multi-format text extraction (PDFs, Word Docs, Markdown, plain text) with HDBSCAN + UMAP clustering pipeline."
      ]
    }
  ],
  certifications: [
    "MongoDB Atlas Administrator Path – MongoDB",
    "Industrial Training Certification – NSIC Technical Services Centre, Hyderabad",
    "GitHub Foundations Certification – GitHub Education",
    "Cyber Job Simulation Certification – Deloitte Australia (Forage)"
  ],
  hero: {
    title1: "SUPREETH",
    title2: "GOLLAPALLY"
  },
  navbar: {
    ctaText: "Resume",
    resumeLink: "https://drive.google.com/file/d/18dGjHJX6mZJqkJiTq8zeNJscDRCSi9MG/view?usp=sharing"
  },
  contact: {
    cta: "Let's Work Together."
  },
  about: {
    title: "About Me",
    heading: "Turning Ideas Into",
    headingHighlight: "Reality",
    symbol: "HELLO",
    description: [
      "I'm a Tech Enthusiast Software Developer skilled in Java, Python, and C, with a deep passion for AI, automation, full-stack development, and Cyber Security.",
      "Currently pursuing my B.Tech in Computer Science at Anurag University, I bring hands-on experience from building scalable applications, secure backend systems, and intuitive user interfaces.",
      "Beyond coding, I have a keen interest in stock trading with expertise in technical analysis, chart patterns, and risk management—skills that translate into analytical thinking and calculated decision-making in software development."
    ],
    features: [
      {
        title: "Full-Stack Development",
        description: "Building end-to-end solutions with modern frameworks and scalable architectures.",
        icon: "Code",
        symbol: "WEB"
      },
      {
        title: "AI & Automation",
        description: "Passionate about intelligent systems, LLMs, and streamlining complex workflows.",
        icon: "Cpu",
        symbol: "AI"
      },
      {
        title: "Stock Trading",
        description: "Technical analysis and risk management expertise for calculated growth.",
        icon: "TrendingUp",
        symbol: "TRADE"
      },
      {
        title: "Problem Solving",
        description: "Strong DSA skills focused on delivering efficient, real-world solutions.",
        icon: "Zap",
        symbol: "DSA"
      }
    ]
  }
};
