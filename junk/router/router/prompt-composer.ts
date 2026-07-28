// /src/router/prompt-composer.ts
// Deterministic prompt assembly

import { WorkflowIntent } from './intent-classifier';
import { GsdAgentType } from './workflow-selector';
import { Capabilities } from './capability-resolver';

interface PromptInput {
  intent: WorkflowIntent;
  agentType: GsdAgentType;
  capabilities: Capabilities;
  skills: string[];
  context: string[];
  task: string;
}

export function composePrompt(input: PromptInput): string {
  const sections: string[] = [];
  
  // System section
  sections.push(`# System\nYou are a ${input.agentType} agent.`);
  
  // Workflow section
  sections.push(`# Workflow\nIntent: ${input.intent}`);
  
  // Domain section
  sections.push(`# Domain\n${input.capabilities.domain}`);
  
  // Skills section
  if (input.skills.length > 0) {
    sections.push(`# Skills\n${input.skills.join('\n\n')}`);
  }
  
  // Context section
  if (input.context.length > 0) {
    sections.push(`# Context\n${input.context.join('\n\n')}`);
  }
  
  // Task section
  sections.push(`# Task\n${input.task}`);
  
  return sections.join('\n\n');
}