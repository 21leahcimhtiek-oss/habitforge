export const APP_CONFIG = {
  appName: 'HabitForge',
  slug: 'habitforge',
  androidPackage: 'com.habitforge.app',
  category: 'Productivity',
  website: 'https://habitforge.app',
  supportEmail: 'support@habitforge.app',
  pricing: {
    monthly: '$3.99',
    yearly: '$29.99',
    trialDays: 7,
  },
} as const;

export const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
export const OPENROUTER_MODEL = 'gpt-4.1-mini';
