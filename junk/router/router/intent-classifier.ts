// /src/router/intent-classifier.ts
// Rule-based intent classifier - maps task descriptions to workflow intents

export type WorkflowIntent = 'plan' | 'build' | 'review' | 'debug';

interface IntentPattern {
  keywords: string[];
  intent: WorkflowIntent;
}

const patterns: IntentPattern[] = [
  {
    keywords: ['plan', 'design', 'architecture', 'structure', 'organize', 'strategy'],
    intent: 'plan',
  },
  {
    keywords: ['build', 'implement', 'create', 'add', 'feature', 'develop', 'scaffold', 'migrate', 'convert'],
    intent: 'build',
  },
  {
    keywords: ['review', 'audit', 'check', 'verify', 'validate', 'inspect', 'analyze'],
    intent: 'review',
  },
  {
    keywords: ['debug', 'investigate', 'fix', 'bug', 'error', 'problem', 'why', 'fail'],
    intent: 'debug',
  },
];

// Priority order: first match wins when multiple intents detected
const priority: WorkflowIntent[] = ['debug', 'review', 'plan', 'build'];

export function classifyIntent(task: string): WorkflowIntent {
  const lower = task.toLowerCase();
  
  const matches: WorkflowIntent[] = [];
  
  for (const pattern of patterns) {
    for (const keyword of pattern.keywords) {
      if (lower.includes(keyword)) {
        matches.push(pattern.intent);
        break; // One keyword per pattern is enough
      }
    }
  }
  
  if (matches.length === 0) {
    return 'build';
  }
  
  // Return highest priority match
  for (const intent of priority) {
    if (matches.includes(intent)) {
      return intent;
    }
  }
  
  return 'build';
}