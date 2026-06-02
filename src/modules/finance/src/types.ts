export type WalletType = 'bank' | 'cash' | 'ewallet' | 'qris' | 'paylater' | 'credit_card';

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  balance: number;
  limit?: number; // For paylater / credit card
  dueDate?: string;
  accountNumber?: string;
  color: string;
  icon: string;
}

export type ExpenseCategory = 
  | 'Makan & Minum' 
  | 'Transportasi' 
  | 'Nongkrong & Hiburan' 
  | 'Subscription' 
  | 'Investasi & Tabungan' 
  | 'Cicilan & Paylater' 
  | 'Belanja & Fashion' 
  | 'Kesehatan' 
  | 'Lainnya';

export type IncomeCategory = 'Gaji' | 'Freelance' | 'Bisnis' | 'Investasi' | 'Lainnya';

export interface BudgetEntry {
  id: string;
  month: string;
  type: 'income' | 'expense';
  category: string;
  planned: number;
  spent: number;
  tracker?: 'subscription';
}

export type AssetCategory = 'Properti' | 'Emas' | 'Investasi' | 'Kendaraan' | 'Elektronik' | 'Koleksi' | 'Lainnya';

export interface AssetItem {
  id: string;
  name: string;
  category: AssetCategory;
  acquisitionValue: number;
  currentValue: number;
  annualRate: number;
  valuationTrend: 'appreciating' | 'depreciating';
  acquiredDate: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'expense' | 'income';
  category: string;
  title: string;
  date: string;
  walletId: string;
  notes?: string;
  isImpulsive?: boolean;
  mood?: MoodType;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  category: string;
  walletId: string;
  icon: string;
  usageFrequency: 'High' | 'Medium' | 'Low'; // Low triggers insight
  color: string;
}

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyInstallment: number;
  dueDate: string;
  provider: string; // e.g. Shopee Paylater, GoPayLater, Kredivo
  interestRate: number;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: 'Emergency Fund' | 'Travelling' | 'Gadget' | 'Kendaraan' | 'Resign Fund' | 'Rumah';
  targetDate: string;
  icon: string;
  color: string;
}

export type MoodType = 'Happy' | 'Stressed' | 'Tired' | 'Social' | 'Neutral';

export interface MoodLog {
  date: string;
  mood: MoodType;
  note?: string;
  totalSpent: number;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    action: () => void;
  }[];
}

export interface UserProfile {
  name: string;
  age: number;
  occupation: string;
  monthlyIncome: number;
  hourlyRate: number; // Used for "setara X jam kerja"
  avatar: string;
}

export interface GamificationState {
  savingStreakDays: number;
  noOverspendingStreakDays: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  achievements: {
    id: string;
    title: string;
    description: string;
    unlockedAt?: string;
    icon: string;
  }[];
}

export interface FinancialHealth {
  savingRatio: number; // percentage
  spendingHabitScore: number; // 0-100
  emergencyFundMonths: number; // months covered
  debtRatio: number; // percentage
  cashflowConsistencyScore: number; // 0-100
  overallScore: number; // 0-100
}
