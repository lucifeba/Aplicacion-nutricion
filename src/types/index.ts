export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client';
  phone?: string;
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
  preferredSchedule?: string;
  additionalNotes?: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  createdAt: string;
}

export interface WeeklyFeedback {
  id: string;
  clientId: string;
  clientName: string;
  weekNumber: number;
  trainingAdherence: number;
  nutritionAdherence: number;
  energyLevel: number;
  sleepQuality: number;
  stressLevel: number;
  weight?: string;
  bodyMeasurements?: string;
  difficulties: string;
  achievements?: string;
  questionsForCoach?: string;
  overallFeeling: string;
  createdAt: string;
}

export interface AppNotification {
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
  dietaryRestrictions?: string;
  medicalConditions?: string;
  previousExperience?: string;
}
