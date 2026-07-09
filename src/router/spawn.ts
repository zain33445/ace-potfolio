// /src/router/spawn.ts
// Adapter layer - prepares Task tool parameters for GSD agent spawning

import { RouteResult } from './router';

export interface TaskParams {
  description: string;
  prompt: string;
  subagent_type: string;
}

export function prepareTask(result: RouteResult): TaskParams {
  return {
    description: `Execute ${result.intent} task (${result.domain})`,
    prompt: result.prompt,
    subagent_type: result.agentType,
  };
}