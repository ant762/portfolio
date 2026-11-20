import type { Project, ProjectCategory } from '@/types';

export const projects: readonly Project[] = [
  {
    slug: 'character-customization',
    category: 'programming',
    title: 'Character Customization',
    headline: 'Advanced Character Customization',
    summary: 'Modular equipment & state-driven animations.',
    description:
      'High-performance system with persistent visual feedback. Features state-driven animation loops, encumbrance mechanics based on metadata, and R6/R15 compatibility with smooth orbital camera interpolation.',
    tags: ['Luau', 'State-Machine'],
    cover: '/images/vest.webp',
    detail: '/images/vest2.webp',
    links: [],
  },
  {
    slug: 'tactical-framework',
    category: 'programming',
    title: 'Tactical Framework',
    headline: 'Tactical Mission Framework',
    summary: 'Advanced AI & story-driven objectives.',
    description:
      'Large-scale tactical engine inspired by HELLMET. Includes dynamic dialogue systems, consequence-driven objectives (ROE), and advanced NPC AI capable of flanking and feigning surrender.',
    tags: ['Luau', 'AI Behavior'],
    cover: '/images/surrender.webp',
    detail: '/images/npc1.webp',
    links: [{ label: 'Watch the demo', href: 'https://youtu.be/m1GPZqT0LCU' }],
  },
  {
    slug: 'vehicle-damage',
    category: 'programming',
    title: 'Vehicle Damage System',
    headline: 'Dynamic Vehicle Destruction',
    summary: 'Localized damage engine & A-Chassis support.',
    description:
      'Comprehensive damage system compatible with A-Chassis. Features tiered visual feedback (smoke/fire), procedural tire removal, and localized damage multipliers based on impact points.',
    tags: ['Luau', 'Physics'],
    cover: '/images/vehicle1.webp',
    detail: '/images/vehicle2.webp',
    links: [],
  },
  {
    slug: 'trunk-burglary',
    category: 'programming',
    title: 'Trunk & Burglary',
    headline: 'Trunk & Inventory Burglary',
    summary: 'Security & weight-based storage system.',
    description:
      'Vehicle security system allowing players to lock/unlock storage for illegal cargo. Includes burglary mechanics where windows can be shattered and trunk locks destroyed.',
    tags: ['Luau', 'Inventory'],
    cover: '/images/trunk1.webp',
    detail: '/images/trunk2.webp',
    links: [],
  },
  {
    slug: 'open-world-economy',
    category: 'programming',
    title: 'Economy & Jobs',
    headline: 'Open World Economy',
    summary: 'Multi-job framework & player-to-player trade.',
    description:
      'Complete job system including mining, woodcutting, and farming. Features physical money dropping and a unique RDR2-style dynamic equipment system for lamps.',
    tags: ['Luau', 'Systems'],
    cover: '/images/economy1.webp',
    detail: '/images/economy2.webp',
    links: [{ label: 'Watch the demo', href: 'https://youtu.be/cmvxipBcthc' }],
  },
  {
    slug: 'industrial-iot-dashboard',
    category: 'programming',
    title: 'Industrial IoT Dashboard',
    headline: 'IoT Industrial Dashboard',
    summary: 'Fullstack data analytics & hardware integration.',
    description:
      'Complex data analytics platform developed as a technical final project. Features a high-fidelity dashboard for industrial monitoring. Currently implementing hardware-to-cloud integration using C and ESP32 for real-time IoT data collection.',
    tags: ['C', 'IoT', 'Frontend'],
    cover: '/images/dashboard1.webp',
    detail: '/images/dashboard2.webp',
    links: [{ label: 'Source on GitHub', href: 'https://github.com/MirellaMelo27/projeto-malwee' }],
  },
  {
    slug: 'personal-portfolio',
    category: 'programming',
    title: 'Personal Portfolio',
    headline: 'Modern Dev Portfolio',
    summary: 'The very website you are browsing right now.',
    description:
      'Full-stack portfolio rebuilt with Next.js and TypeScript. Features a site-wide WebGL background, smooth inertial scrolling, scroll-driven GSAP animations, route transitions and a typed content layer.',
    tags: ['Next.js', 'TypeScript', 'GSAP', 'WebGL'],
    cover: '/images/webs.webp',
    detail: '/images/webs2.webp',
    links: [{ label: 'Source on GitHub', href: 'https://github.com/ant762/portfolio' }],
  },
  {
    slug: 'facial-expressions',
    category: 'programming',
    title: 'Facial Expressions System',
    headline: 'Facial Expressions System',
    summary: "Randomizes the player's mouth and eyes.",
    description:
      'Every player has a randomized face. Their eyes and mouths change randomly every few seconds, with each facial expression updating at completely unpredictable times.',
    tags: ['Luau'],
    cover: '/images/face1.webp',
    detail: '/images/face2.webp',
    links: [],
  },
  {
    slug: 'caribbean-islands',
    category: 'environment',
    title: 'Caribbean Islands',
    headline: 'Caribbean Islands: Level Design',
    summary: 'Atmospheric environment & level design.',
    description:
      "An expansive environment study inspired by the golden age of piracy and Assassin's Creed IV: Black Flag. This project focuses on realistic terrain generation, tropical vegetation distribution, and high-fidelity lighting setups. Developed using advanced heightmap techniques and custom texture painting to achieve an authentic Caribbean atmosphere.",
    tags: ['Terrain', 'Lighting', 'Level Design'],
    cover: '/images/terrain11.webp',
    detail: '/images/terrain12.webp',
    links: [],
  },
  {
    slug: 'southern-highlands',
    category: 'environment',
    title: 'Southern Highlands',
    headline: 'Southern Highlands: Realistic Environment',
    summary: 'Regional environment & material study.',
    description:
      'An environment study focused on the unique topography of Southern Brazil (Serra Gaúcha). This project explores the integration of sub-tropical highlands with cold-climate atmospheric effects. Key technical features include custom heightmap sculpting, advanced fog density orchestration to create depth, and procedural rock-to-grass material transitions. Designed with a focus on natural biomes and realistic sunlight scattering.',
    tags: ['Terrain', 'Lighting', 'Level Design'],
    cover: '/images/terrain21.webp',
    detail: '/images/terrain22.webp',
    links: [],
  },
  {
    slug: 'caribbean-city-1715',
    category: 'environment',
    title: 'Caribbean City 1715',
    headline: 'Caribbean City: Historically Accurate',
    summary: 'Historical urban environment.',
    description:
      'A historical reconstruction of a Caribbean port city circa 1715, emphasizing colonial architectural accuracy and urban layout. This project focuses on the juxtaposition of high-density Caribbean townships against lush coastal environments, utilizing modular building kits and custom-baked lighting to capture the sweltering, salt-worn atmosphere of the West Indies.',
    tags: ['Building', 'Modeling', 'Lighting', 'Level Design'],
    cover: '/images/city1.webp',
    detail: '/images/city2.webp',
    links: [],
  },
  {
    slug: 'northeastern-badlands',
    category: 'environment',
    title: 'Northeastern Badlands',
    headline: 'Northeastern Brazil: Semi-Arid Biome',
    summary: 'Semi-arid terrain & vegetation study.',
    description:
      'An environment study based on the unique landscapes of the Brazilian Sertão. This project focuses on the arid topography and native vegetation distribution characteristic of the Northeast region. The terrain was sculpted entirely from scratch, utilizing BrushTool for organic shaping and MeshVox for high-fidelity environmental optimization.',
    tags: ['Terrain Sculpting', 'BrushTool', 'MeshVox', 'Environment Art'],
    cover: '/images/cat1.webp',
    detail: '/images/cat2.webp',
    links: [],
  },
  {
    slug: 'squid-game-replica',
    category: 'environment',
    title: 'Squid Game Replica',
    headline: 'Squid Games: Technical Replica',
    summary: 'Architectural geometry & precision design.',
    description:
      "A high-precision recreation of the iconic environments from the Squid Game series. This project emphasizes architectural scale, vibrant color palettes, and clean geometric shapes to replicate the show's surreal atmosphere. The map features custom-built modular assets, realistic lighting for a naturalistic look, and large-scale level design.",
    tags: ['Building', 'Modeling', 'Level Design', 'Environmental Art'],
    cover: '/images/stairs.webp',
    detail: '/images/beds.webp',
    links: [],
  },
  {
    slug: 'undstread-local',
    category: 'environment',
    title: 'Undstread Local',
    headline: 'Undstread Local: Advanced Biome Study',
    summary: 'Cinematic environment & biome study.',
    description:
      'A comprehensive environment project exploring the contrast between dense pine forests and rugged coastal shorelines. This study showcases custom-sculpted rock formations and intricate terrain painting. It features a heavy focus on atmospheric depth using layered fog and realistic sun-ray scattering (god rays) to create an immersive, cinematic experience.',
    tags: ['Terrain', 'Lighting', 'Biome Design'],
    cover: '/images/undstread.webp',
    detail: '/images/undstread.webp',
    links: [],
  },
];

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projects.filter((p) => p.category === category);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Próximo projeto na ordem global (circular). */
export function getNextProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  if (!next) throw new Error(`Project not found: ${slug}`);
  return next;
}
