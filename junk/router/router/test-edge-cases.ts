// /src/router/test-edge-cases.ts
// Edge case testing for routing system

import { route } from './router';

const edgeCaseTests = [
  // Ambiguous tasks
  "understand the system",
  "evaluate architecture",
  "why is this slow",
  
  // Multi-domain tasks
  "fix the React component and update the API endpoint",
  "create a responsive layout with GSAP animations",
  
  // No keyword matches
  "do something",
  "help me",
  
  // Extreme specificity
  "add a button",
  "change the color",
  
  // Mixed intents
  "review and fix the accessibility issues",
  "debug and then implement a fix",
  
  // Non-English or casual
  "make it look better",
  "this doesn't work",
  
  // Technical depth
  "optimize the webpack build configuration",
  "implement server-side rendering with streaming",
  
  // Domain confusion
  "fix the database query in the React component",
  "add TypeScript types to the WordPress API",
];

console.log('EDGE CASE TEST RESULTS\n');

let passCount = 0;
let failCount = 0;

for (const task of edgeCaseTests) {
  const result = route(task);
  
  // Check for potential issues
  const issues: string[] = [];
  
  // Issue: No skills matched (falls back to default)
  if (result.skills.length === 1 && result.skills[0] === 'react') {
    issues.push('No specific skill matched (default react)');
  }
  
  // Issue: Domain doesn't match task
  if (task.includes('database') && result.domain !== 'backend') {
    issues.push('Database task not routed to backend');
  }
  
  if (task.includes('API') && result.domain !== 'backend') {
    issues.push('API task not routed to backend');
  }
  
  const status = issues.length === 0 ? '✓' : '⚠';
  if (issues.length === 0) {
    passCount++;
  } else {
    failCount++;
  }
  
  console.log(`${status} "${task}"`);
  console.log(`  Intent: ${result.intent} | Agent: ${result.agentType} | Domain: ${result.domain} | Skills: ${result.skills.join(', ')}`);
  
  if (issues.length > 0) {
    console.log(`  Issues: ${issues.join(', ')}`);
  }
  console.log('');
}

console.log(`\nSUMMARY: ${passCount} passed, ${failCount} warnings`);