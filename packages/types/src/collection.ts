export interface CreateCollectionRequest {
  qr_id: string;
  weight: number;
  timestamp: string;
}

export interface Collection {
  id: string;
  qr_id: string;
  weight: number;
  points: number;
  timestamp: string;
  created_at: string;
}
