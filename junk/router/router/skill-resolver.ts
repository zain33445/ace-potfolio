// /src/router/skill-resolver.ts
// Static registry lookup with skill weighting

import { Skill } from './capability-resolver';
import { readFileSync } from 'fs';
import { join } from 'path';

// Skill file registry - maps skill names to file paths
const skillRegistry: Record<Skill, string> = {
  react: 'skills/react.md',
  tailwind: 'skills/tailwind.md',
  a11y: 'skills/accessibility.md',
  wordpress: 'skills/wordpress.md',
  gsap: 'skills/gsap.md',
  threejs: 'skills/threejs.md',
  typescript: 'skills/typescript.md',
  api: 'skills/api.md',
  nextjs: 'skills/nextjs.md',
  general: 'skills/general.md',
};

// Cache for loaded skill content
const skillCache: Partial<Record<Skill, string>> = {};

// Extract summary from skill content (Purpose + Core capabilities only)
function extractSummary(content: string): string {
  const lines = content.split('\n');
  const summaryLines: string[] = [];
  let inSection = false;
  
  for (const line of lines) {
    if (line.startsWith('## Purpose') || line.startsWith('## Core capabilities')) {
      inSection = true;
      summaryLines.push(line);
    } else if (line.startsWith('## ') && inSection) {
      inSection = false;
    } else if (inSection) {
      summaryLines.push(line);
    }
  }
  
  return summaryLines.join('\n');
}

export function resolveSkills(skills: Skill[]): string[] {
  const loaded: string[] = [];
  
  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];
    
    if (skillCache[skill]) {
      // First skill gets full content, others get summary
      if (i === 0) {
        loaded.push(skillCache[skill]!);
      } else {
        loaded.push(extractSummary(skillCache[skill]!));
      }
      continue;
    }
    
    const path = skillRegistry[skill];
    if (!path) continue;
    
    try {
      const fullPath = join(process.cwd(), path);
      const content = readFileSync(fullPath, 'utf-8');
      skillCache[skill] = content;
      
      // First skill gets full content, others get summary
      if (i === 0) {
        loaded.push(content);
      } else {
        loaded.push(extractSummary(content));
      }
    } catch {
      // Skill file not found - skip silently
    }
  }
  
  return loaded;
}