export interface SupplementProtocol {
  id: string;
  supplementName: string;
  dosage: string | null;
  frequency: string | null;
  timing: string | null;
  notes: string | null;
}

export interface SupplementPlan {
  id: string;
  periodStart: string;
  periodEnd: string;
  notes: string | null;
  protocols: SupplementProtocol[];
}

export interface SupplementPlansResponse {
  plans: SupplementPlan[];
}

