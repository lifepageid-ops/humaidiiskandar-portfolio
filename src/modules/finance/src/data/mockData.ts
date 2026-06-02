import { 
  Wallet, 
  Transaction, 
  Subscription, 
  Debt, 
  FinancialGoal, 
  MoodLog, 
  UserProfile, 
  GamificationState,
  FinancialHealth
} from '../types';

export const mockUserProfile: UserProfile = {
  name: 'Kevin Pratama',
  age: 26,
  occupation: 'Product Designer & Freelancer',
  monthlyIncome: 0,
  hourlyRate: 0,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

export const mockWallets: Wallet[] = [
  {
    id: 'w-1',
    name: 'Bank Jago (Utama)',
    type: 'bank',
    balance: 1000,
    color: '#F58220',
    icon: 'Building2'
  },
  {
    id: 'w-2',
    name: 'BCA Tahapan',
    type: 'bank',
    balance: 1000,
    color: '#0066AE',
    icon: 'Landmark'
  },
  {
    id: 'w-3',
    name: 'GoPay',
    type: 'ewallet',
    balance: 1000,
    color: '#00AED6',
    icon: 'Smartphone'
  },
  {
    id: 'w-4',
    name: 'OVO Cash',
    type: 'ewallet',
    balance: 1000,
    color: '#4C2A86',
    icon: 'Wallet'
  },
  {
    id: 'w-5',
    name: 'ShopeePay',
    type: 'ewallet',
    balance: 1000,
    color: '#EE4D2D',
    icon: 'ShoppingBag'
  },
  {
    id: 'w-6',
    name: 'SPayLater',
    type: 'paylater',
    balance: -1000,
    limit: 1000,
    dueDate: '25 Set',
    color: '#FF5722',
    icon: 'CreditCard'
  },
  {
    id: 'w-7',
    name: 'Jenius Visa Card',
    type: 'credit_card',
    balance: -1000,
    limit: 1000,
    dueDate: '12 Set',
    color: '#00C4B4',
    icon: 'CreditCard'
  }
];

export const mockTransactions: Transaction[] = [];

export const mockSubscriptions: Subscription[] = [];

export const mockDebts: Debt[] = [
  {
    id: 'd-1',
    name: 'iPhone 15 Pro (SPayLater)',
    totalAmount: 1000,
    remainingAmount: 1000,
    monthlyInstallment: 1000,
    dueDate: '25',
    provider: 'Shopee PayLater',
    interestRate: 1
  },
  {
    id: 'd-2',
    name: 'MacBook M3 Pro Service',
    totalAmount: 1000,
    remainingAmount: 1000,
    monthlyInstallment: 1000,
    dueDate: '12',
    provider: 'Jenius Flexi Cash',
    interestRate: 1
  }
];

export const mockGoals: FinancialGoal[] = [
  {
    id: 'g-1',
    title: 'Dana Darurat (6x Pengeluaran)',
    targetAmount: 1000,
    currentAmount: 1000,
    category: 'Emergency Fund',
    targetDate: '2026-12-31',
    icon: 'ShieldCheck',
    color: '#10B981'
  },
  {
    id: 'g-2',
    title: 'Japan Autumn Trip',
    targetAmount: 1000,
    currentAmount: 1000,
    category: 'Travelling',
    targetDate: '2026-10-15',
    icon: 'Plane',
    color: '#EC4899'
  },
  {
    id: 'g-3',
    title: 'Resign & Sabbatical Fund',
    targetAmount: 1000,
    currentAmount: 1000,
    category: 'Resign Fund',
    targetDate: '2027-06-01',
    icon: 'Coffee',
    color: '#F59E0B'
  },
  {
    id: 'g-4',
    title: 'Upgrade Mirrorless Sony',
    targetAmount: 1000,
    currentAmount: 1000,
    category: 'Gadget',
    targetDate: '2026-05-10',
    icon: 'Camera',
    color: '#6366F1'
  }
];

export const mockMoodLogs: MoodLog[] = [];

export const mockGamification: GamificationState = {
  savingStreakDays: 0,
  noOverspendingStreakDays: 0,
  level: 1,
  xp: 0,
  nextLevelXp: 1000,
  achievements: [
    {
      id: 'ach-1',
      title: 'First Step to Adulting',
      description: 'Berhasil mencatat pengeluaran pertama tanpa terlewat.',
      unlockedAt: '2026-01-10',
      icon: 'Award'
    },
    {
      id: 'ach-2',
      title: 'Impulse Interceptor',
      description: 'Membatalkan 5 keinginan belanja impulsif setelah melihat simulasi jam kerja.',
      unlockedAt: '2026-02-14',
      icon: 'ShieldAlert'
    },
    {
      id: 'ach-3',
      title: 'Subscription Cleanser',
      description: 'Membatalkan langganan yang tidak pernah dipakai selama 2 bulan.',
      unlockedAt: '2026-02-28',
      icon: 'Scissors'
    },
    {
      id: 'ach-4',
      title: 'Emergency Shield: Activated',
      description: 'Mencapai 50% dari target Dana Darurat.',
      unlockedAt: '2026-03-01',
      icon: 'CheckCircle2'
    }
  ]
};

export const mockFinancialHealth: FinancialHealth = {
  savingRatio: 0,
  spendingHabitScore: 100,
  emergencyFundMonths: 0,
  debtRatio: 0,
  cashflowConsistencyScore: 100,
  overallScore: 0
};
