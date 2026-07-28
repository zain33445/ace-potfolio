// /src/router/test.ts
// Test file for routing system

import { route } from './router';

const testTasks = [
  "Implement customer search with React and accessibility",
  "Debug slow SQL queries in the database",
  "Review the frontend code for performance issues",
  "Plan the new API architecture",
  "Create a responsive layout with Tailwind CSS",
  "Add GSAP scroll animations to the landing page",
  "Build a Next.js blog page with dynamic routing",
];

for (const task of testTasks) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TASK: ${task}`);
  console.log('='.repeat(60));
  
  const result = route(task);
  
  console.log(`\nIntent: ${result.intent}`);
  console.log(`Agent: ${result.agentType}`);
  console.log(`Domain: ${result.domain}`);
  console.log(`Skills: ${result.skills.join(', ')}`);
  console.log(`\nPrompt preview (first 500 chars):`);
  console.log(result.prompt.substring(0, 500) + '...');
}