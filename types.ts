export enum AnalysisPhase {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING', // Unified phase for UX simplicity
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface FeedbackItem {
  type: 'strength' | 'gap' | 'neutral';
  text: string;
  reference?: string; 
}

export interface Insight {
  title: string;
  description: string;
  trend: 'stable' | 'improving' | 'declining' | 'new';
}

export interface GuidanceStep {
  step: string;
  rationale: string;
}

export interface HandwritingAnalysis {
  quality: 'excellent' | 'good' | 'fair' | 'poor' | 'illegible';
  feedback: string;
}

export interface ConceptStability {
  status: 'emerging' | 'unstable_pressure' | 'stabilizing' | 'robust' | 'unknown';
  evidence: string;
}

export interface TaskAlignment {
  goal: string;
  status: 'aligned' | 'misaligned' | 'partial';
  reasoning: string;
}

export interface InterpretationStability {
  ambiguityDetected: boolean;
  studentInterpretation: string;
  status: 'valid' | 'invalid' | 'ambiguous_but_reasonable';
}

export interface ReasoningAssumption {
  id: string;
  type: 'explicit' | 'implicit';
  content: string;
}

export interface ReasoningStep {
  id: string;
  content: string;
  dependencies: string[]; // IDs of assumptions or previous steps
}

export interface StructuralFlag {
  type: 'contradiction' | 'shift' | 'discontinuity';
  location: string;
  details: string;
}

export interface GlobalReasoningStructure {
  assumptions: ReasoningAssumption[];
  progression: ReasoningStep[];
  flags: StructuralFlag[];
  consistencyScore: number; // 0-1 scale
}

export interface ImplicitAssumption {
  id: string;
  content: string;
  relatedStepIds: string[];
  legitimacy: 'permitted' | 'acceptable' | 'unjustified';
  justification: string;
}

export interface AssumptionIntegrityFlag {
  type: 'constraint_exceeded' | 'scope_narrowing' | 'hidden_condition';
  assumptionId: string;
  details: string;
}

export interface AssumptionIntegrity {
  implicitAssumptions: ImplicitAssumption[];
  flags: AssumptionIntegrityFlag[];
}

export interface CLVResult {
  status: 'verified' | 'mismatch' | 'skipped';
  computedResult?: string;
  studentResult?: string;
  discrepancy?: string;
}

export interface FactGroundingResult {
  status: 'verified' | 'disputed' | 'uncertain' | 'skipped';
  verifiedFacts: string[];
  flaggedClaims: string[];
}

export interface VerificationResult {
  branch: 'clv' | 'fact_grounding' | 'none';
  clv?: CLVResult;
  factGrounding?: FactGroundingResult;
}

export interface ValidatedStep {
  stepId: string;
  content: string;
  status: 'correct' | 'partial' | 'incorrect' | 'skipped';
  confidence: 'high' | 'medium' | 'low';
  errorType?: 'calculation' | 'logic' | 'constraint_violation' | 'fact_error' | 'assumption_error';
  relatedAssumptionId?: string;
}

export interface LocalReasoning {
  steps: ValidatedStep[];
}

export interface StudentInfo {
  name?: string;
  class?: string;
  confidence: 'high' | 'medium' | 'low';
}

export type OwnershipContextType = 'student_direct' | 'teacher_uploaded_student_work';

export interface OwnershipContext {
  type: OwnershipContextType;
  student?: StudentInfo;
}

export interface AnalysisResult {
  id: string; // Links to Submission ID
  timestamp: number;
  subject: string;
  topic: string;
  score: {
    value: number | string; 
    label: string;
    reasoning: string;
  };
  feedback: FeedbackItem[];
  insights: Insight[];
  guidance: GuidanceStep[];
  handwriting?: HandwritingAnalysis; // New dimension
  conceptStability?: ConceptStability; // Internal intelligence signal (v1.1)
  taskAlignment?: TaskAlignment; // Goal-State Alignment (v1.2)
  interpretationStability?: InterpretationStability; // Interpretation Stability Check (v1.2)
  globalReasoning?: GlobalReasoningStructure; // Global Reasoning Structure Pass (v1.2)
  assumptionIntegrity?: AssumptionIntegrity; // Assumption Integrity Pass (v1.2)
  verification?: VerificationResult; // Precision & Truth Anchoring (v1.2)
  localReasoning?: LocalReasoning; // Local Reasoning Validation (v1.2)
  ownership?: OwnershipContext; // Role-aware context
  teacherInsight?: string; // Teacher Insight Moment (v1.1) - Conversational cue
  rawText?: string;
}

// --- SUBMISSION LIFECYCLE ABSTRACTIONS ---

export type SubmissionStatus = 'CREATED' | 'PROCESSING' | 'COMPLETED' | 'ERROR';

export interface Submission {
  id: string;
  timestamp: number;
  status: SubmissionStatus;
  fileName?: string;
  result?: AnalysisResult;
  error?: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  subject: string;
  topic: string;
  scoreLabel: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  type: 'text' | 'analysis' | 'error';
  content?: string;
  analysisResult?: AnalysisResult;
  isStreaming?: boolean;
  phase?: AnalysisPhase; // For displaying orchestration status
}

// Orchestration Types
export type OrchestratorEvent = 
  | { type: 'PHASE_UPDATE'; phase: AnalysisPhase }
  | { type: 'STREAM_CHUNK'; text: string }
  | { type: 'SUBMISSION_COMPLETE'; submission: Submission }
  | { type: 'TASK_COMPLETE' }
  | { type: 'ERROR'; message: string }
  | { type: 'FOLLOW_UP'; text: string };

export interface UnifiedInput {
  text: string;
  file?: File;
}

export type UserRole = 'TEACHER' | 'STUDENT';