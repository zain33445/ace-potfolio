// /src/router/capability-resolver.ts
// Extracts structured capabilities from task description

export type Domain = 'frontend' | 'backend' | 'architecture';
export type Skill = 'react' | 'tailwind' | 'a11y' | 'wordpress' | 'gsap' | 'threejs' | 'typescript' | 'api' | 'nextjs' | 'general';

export interface Capabilities {
  domain: Domain;
  skills: Skill[];
}

interface DomainPattern {
  keywords: string[];
  domain: Domain;
}

interface SkillPattern {
  keywords: string[];
  skill: Skill;
}

const domainPatterns: DomainPattern[] = [
  { keywords: ['component', 'ui', 'button', 'form', 'page', 'layout', 'css', 'style', 'tailwind', 'react', 'frontend', 'client'], domain: 'frontend' },
  { keywords: ['api', 'endpoint', 'database', 'server', 'wordpress', 'backend', 'fetch', 'data', 'query', 'sql', 'backend'], domain: 'backend' },
  { keywords: ['architecture', 'structure', 'system', 'design', 'pattern', 'organize'], domain: 'architecture' },
];

const skillPatterns: SkillPattern[] = [
  { keywords: ['react', 'component', 'hook', 'jsx', 'tsx'], skill: 'react' },
  { keywords: ['tailwind', 'css', 'style', 'class', 'responsive'], skill: 'tailwind' },
  { keywords: ['a11y', 'accessibility', 'aria', 'screen reader', 'keyboard'], skill: 'a11y' },
  { keywords: ['wordpress', 'wp', 'cms', 'blog', 'post'], skill: 'wordpress' },
  { keywords: ['gsap', 'animation', 'scroll', 'lenis', 'motion'], skill: 'gsap' },
  { keywords: ['three', 'threejs', '3d', 'webgl', 'canvas'], skill: 'threejs' },
  { keywords: ['typescript', 'types', 'interface', 'type', 'generic'], skill: 'typescript' },
  { keywords: ['api', 'endpoint', 'fetch', 'request', 'query', 'sql', 'rest', 'graphql'], skill: 'api' },
  { keywords: ['next', 'nextjs', 'app router', 'server component', 'page.tsx', 'layout.tsx', 'ssr', 'server-side'], skill: 'nextjs' },
  { keywords: ['build', 'implement', 'create', 'add', 'feature', 'develop', 'scaffold', 'migrate', 'convert'], skill: 'general' },
];

export function resolveCapabilities(task: string): Capabilities {
  const lower = task.toLowerCase();
  
  // Resolve domain
  let domain: Domain = 'frontend';
  for (const pattern of domainPatterns) {
    if (pattern.keywords.some(k => lower.includes(k))) {
      domain = pattern.domain;
      break;
    }
  }
  
  // Resolve skills (multiple can match)
  const skills: Skill[] = [];
  for (const pattern of skillPatterns) {
    if (pattern.keywords.some(k => lower.includes(k))) {
      skills.push(pattern.skill);
    }
  }
  
  // Ensure at least one skill
  if (skills.length === 0) {
    skills.push('general');
  }
  
  return { domain, skills };
}