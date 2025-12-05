export enum Complexity {
  Basic = 'Basic',
  Intermediate = 'Intermediate',
  HighComplexity = 'High-Complexity'
}

export enum Tone {
  Neutral = 'Neutral',
  Stricter = 'Stricter',
  Looser = 'Looser'
}

export interface WorkflowResult {
  steps: string[];
  bottleneck: string;
  optimization: string;
  reasoning: string;
}

export interface GenerateWorkflowParams {
  task: string;
  complexity: Complexity;
  tone: Tone;
}