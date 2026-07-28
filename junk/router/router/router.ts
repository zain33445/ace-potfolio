// /src/router/router.ts
// Orchestrates the routing pipeline

import { classifyIntent } from './intent-classifier';
import { selectWorkflow } from './workflow-selector';
import { resolveCapabilities } from './capability-resolver';
import { resolveSkills } from './skill-resolver';
import { loadContext } from './context-loader';
import { composePrompt } from './prompt-composer';

export interface RouteResult {
  prompt: string;
  agentType: string;
  intent: string;
  domain: string;
  skills: string[];
}

export function route(task: string): RouteResult {
  // 1. Classify intent
  const intent = classifyIntent(task);
  
  // 2. Select workflow
  const agentType = selectWorkflow(intent);
  
  // 3. Resolve capabilities
  const capabilities = resolveCapabilities(task);
  
  // 4. Load skills
  const skills = resolveSkills(capabilities.skills);
  
  // 5. Load context
  const context = loadContext(capabilities.domain, task);
  
  // 6. Compose prompt
  const prompt = composePrompt({
    intent,
    agentType,
    capabilities,
    skills,
    context,
    task,
  });
  
  return {
    prompt,
    agentType,
    intent,
    domain: capabilities.domain,
    skills: capabilities.skills,
  };
}