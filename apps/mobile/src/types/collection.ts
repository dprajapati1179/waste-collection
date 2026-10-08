export type CameraPermission = 'undetermined' | 'granted' | 'denied';

export type CollectionStatus = 'scanning' | 'scanned' | 'submitting' | 'success' | 'error';

export type SubmissionErrorKind = 'network' | 'validation' | 'duplicate' | 'server';

export interface SubmissionError {
  kind: SubmissionErrorKind;
  message: string;
}
