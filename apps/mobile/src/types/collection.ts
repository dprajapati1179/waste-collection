export type CameraPermission = 'undetermined' | 'granted' | 'denied';

export type CollectionStatus = 'scanning' | 'scanned' | 'submitting' | 'success' | 'error';

export type SubmissionErrorKind = 'network' | 'validation' | 'duplicate' | 'server';

export interface SubmissionError {
  kind: SubmissionErrorKind;
  message: string;
}

export const SUBMISSION_MESSAGES = {
  submitting: 'Submitting...',
  success: 'Collection submitted successfully.',
  duplicate: 'This bag has already been collected.',
  network: 'Unable to reach the server. Please try again.',
  server: 'Something went wrong. Please try again.',
  validation: 'Please check the details and try again.',
} as const;
