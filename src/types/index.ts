export type UserRole = 'admin' | 'client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  onboardingCompleted: boolean;
}

export interface Message {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  isBroadcast?: boolean;
}

export interface TrainingModificationRequest {
  id: string;
  clientId: string;
  clientName: string;
  currentRoutine: string;
  requestedChanges: string;
  reason: string;
  injuryOrPain: boolean;
  injuryDetails?: string;
  preferredSchedule: string;
  additionalNotes?: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  createdAt: string;
}

export interface WeeklyFeedback {
  id: string;
  clientId: string;
  clientName: string;
  weekNumber: number;
  trainingAdherence: number; // 1-10
  nutritionAdherence: number; // 1-10
  energyLevel: number; // 1-10
  sleepQuality: number; // 1-10
  stressLevel: number; // 1-10
  weight?: number;
  bodyMeasurements?: string;
  difficulties: string;
  achievements: string;
  questionsForCoach: string;
  overallFeeling: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'message' | 'feedback' | 'training_request' | 'broadcast';
  title: string;
  body: string;
  data?: Record<string, string>;
  read: boolean;
  createdAt: string;
}

export interface OnboardingData {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  goal: string;
  activityLevel: string;
  dietaryRestrictions: string;
  medicalConditions: string;
  previousExperience: string;
}
