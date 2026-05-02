// src/types/index.ts
export interface User {
  id: string;
  trial_active?: boolean;
  trial_start_date?: string;
  subscription_active?: boolean;
}