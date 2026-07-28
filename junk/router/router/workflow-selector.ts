// /src/router/workflow-selector.ts
// Hard mapping from workflow intent to GSD agent types

import { WorkflowIntent } from './intent-classifier';

export type GsdAgentType = 
  | 'gsd-planner'
  | 'gsd-executor'
  | 'gsd-code-reviewer'
  | 'gsd-debugger';

const intentToAgent: Record<WorkflowIntent, GsdAgentType> = {
  plan: 'gsd-planner',
  build: 'gsd-executor',
  review: 'gsd-code-reviewer',
  debug: 'gsd-debugger',
};

export function selectWorkflow(intent: WorkflowIntent): GsdAgentType {
  return intentToAgent[intent];
}