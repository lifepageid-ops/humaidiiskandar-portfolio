import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Wallet, 
  Transaction, 
  Subscription, 
  Debt, 
  FinancialGoal, 
  MoodLog, 
  UserProfile, 
  GamificationState,
  FinancialHealth,
  MoodType,
  BudgetEntry,
  ExpenseCategory,
  IncomeCategory,
  AssetItem
} from '../types';
import { 
  mockUserProfile, 
  mockWallets, 
  mockTransactions, 
  mockSubscriptions, 
  mockDebts, 
  mockGoals, 
  mockMoodLogs, 
  mockGamification,
  mockFinancialHealth 
} from '../data/mockData';

interface FinanceContextType {
  user: UserProfile;
  wallets: Wallet[];
  transactions: Transaction[];
  subscriptions: Subscription[];
  debts: Debt[];
  goals: FinancialGoal[];
  moodLogs: MoodLog[];
  gamification: GamificationState;
  financialHealth: FinancialHealth;
  assets: AssetItem[];
  
  // Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'> & { date?: string }) => void;
  updateTransaction: (id: string, data: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  addWallet: (wallet: Omit<Wallet, 'id'>) => void;
  updateWallet: (id: string, data: Partial<Omit<Wallet, 'id'>>) => void;
  deleteWallet: (id: string) => void;
  updateWalletBalance: (id: string, amountChange: number) => void;
  addDepositToGoal: (goalId: string, amount: number, sourceWalletId: string) => void;
  cancelSubscription: (subId: string) => void;
  addMoodLog: (mood: MoodType, note?: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  resetToDefaults: () => void;
  // Budget
  budgets: BudgetEntry[];
  setBudget: (month: string, type: 'income' | 'expense', category: string, planned: number, tracker?: BudgetEntry['tracker']) => void;
  updateBudgetEntry: (id: string, data: Partial<Pick<BudgetEntry, 'category' | 'planned' | 'type' | 'tracker'>>) => void;
  deleteBudgetEntry: (id: string) => void;
  calculateBudget: (month: string) => { income: { id?: string; category: string; planned: number; actual: number; remaining: number; tracker?: BudgetEntry['tracker'] }[]; expense: { id?: string; category: string; planned: number; actual: number; remaining: number; tracker?: BudgetEntry['tracker'] }[] };
  addAsset: (asset: Omit<AssetItem, 'id'>) => void;
  updateAsset: (id: string, data: Partial<Omit<AssetItem, 'id'>>) => void;
  deleteAsset: (id: string) => void;
  addGoal: (goal: Omit<FinancialGoal, 'id' | 'currentAmount'>) => void;
  updateGoal: (id: string, data: Partial<Omit<FinancialGoal, 'id'>>) => void;
  deleteGoal: (id: string) => void;
  withdrawFromGoal: (goalId: string, amount: number, targetWalletId: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);
const APP_DATA_VERSION = 'humedly-subscription-budget-tracker-v2';

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (typeof window !== 'undefined' && localStorage.getItem('humedly_data_version') !== APP_DATA_VERSION) {
    Object.keys(localStorage)
      .filter(key => key.startsWith('zflow_') || key === 'humedly_data_version')
      .forEach(key => localStorage.removeItem(key));
    localStorage.setItem('humedly_data_version', APP_DATA_VERSION);
    localStorage.setItem('zflow_onboarded', 'true');
  }

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('zflow_user');
    return saved ? JSON.parse(saved) : mockUserProfile;
  });

  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const saved = localStorage.getItem('zflow_wallets');
    return saved ? JSON.parse(saved) : mockWallets;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('zflow_transactions');
    return saved ? JSON.parse(saved) : mockTransactions;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('zflow_subscriptions');
    return saved ? JSON.parse(saved) : mockSubscriptions;
  });

  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem('zflow_debts');
    return saved ? JSON.parse(saved) : mockDebts;
  });

  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    const saved = localStorage.getItem('zflow_goals');
    return saved ? JSON.parse(saved) : mockGoals;
  });

  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(() => {
    const saved = localStorage.getItem('zflow_moods');
    return saved ? JSON.parse(saved) : mockMoodLogs;
  });

  const [gamification, setGamification] = useState<GamificationState>(() => {
    const saved = localStorage.getItem('zflow_gamification');
    return saved ? JSON.parse(saved) : mockGamification;
  });

  // Budget entries
  const [budgets, setBudgets] = useState<BudgetEntry[]>(() => {
    const saved = localStorage.getItem('zflow_budgets');
    return saved ? JSON.parse(saved) : [];
  });

  const [assets, setAssets] = useState<AssetItem[]>(() => {
    const saved = localStorage.getItem('zflow_assets');
    return saved ? JSON.parse(saved) : [
      {
        id: 'asset-1',
        name: 'Tanah Kavling Bekasi',
        category: 'Properti',
        acquisitionValue: 1000,
        currentValue: 1000,
        annualRate: 1,
        valuationTrend: 'appreciating',
        acquiredDate: '2022-06-01',
        notes: 'Estimasi harga pasar sekitar lokasi berkembang.'
      },
      {
        id: 'asset-2',
        name: 'Simpanan Emas 25 gram',
        category: 'Emas',
        acquisitionValue: 1000,
        currentValue: 1000,
        annualRate: 1,
        valuationTrend: 'appreciating',
        acquiredDate: '2021-01-15',
        notes: 'Nilai mengikuti estimasi kenaikan harga emas tahunan.'
      },
      {
        id: 'asset-3',
        name: 'Motor Harian',
        category: 'Kendaraan',
        acquisitionValue: 1000,
        currentValue: 1000,
        annualRate: 1,
        valuationTrend: 'depreciating',
        acquiredDate: '2020-08-20',
        notes: 'Kendaraan cenderung turun nilai setiap tahun.'
      },
      {
        id: 'asset-4',
        name: 'Laptop Kerja',
        category: 'Elektronik',
        acquisitionValue: 1000,
        currentValue: 1000,
        annualRate: 1,
        valuationTrend: 'depreciating',
        acquiredDate: '2023-02-10',
        notes: 'Aset produktif, tetapi nilai jual turun karena depresiasi teknologi.'
      }
    ];
  });

  const setBudget = (month: string, type: 'income' | 'expense', category: string, planned: number, tracker?: BudgetEntry['tracker']) => {
    setBudgets(prev => {
      const normalizedCategory = category.trim();
      const existing = prev.find(b =>
        b.month === month &&
        b.type === type &&
        b.category.toLowerCase() === normalizedCategory.toLowerCase() &&
        b.tracker === tracker
      );
      if (existing) {
        return prev.map(b => b.id === existing.id ? { ...b, planned, tracker } : b);
      }
      return [...prev, { id: 'b-' + Date.now(), month, type, category: normalizedCategory, planned, spent: 0, tracker }];
    });
  };

  const updateBudgetEntry = (id: string, data: Partial<Pick<BudgetEntry, 'category' | 'planned' | 'type' | 'tracker'>>) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...data, category: data.category?.trim() || b.category } : b));
  };

  const deleteBudgetEntry = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const calculateBudget = (month: string) => {
    const monthBudgets = budgets.filter(b => b.month === month);
    const monthTxs = transactions.filter(t => t.date.startsWith(month));

    const incomeCategories: IncomeCategory[] = ['Gaji', 'Freelance', 'Bisnis', 'Investasi', 'Lainnya'];
    const expenseCategories: ExpenseCategory[] = ['Makan & Minum', 'Transportasi', 'Nongkrong & Hiburan', 'Subscription', 'Investasi & Tabungan', 'Cicilan & Paylater', 'Belanja & Fashion', 'Kesehatan', 'Lainnya'];

    const buildRows = (type: 'income' | 'expense', cats: string[]) => {
      const customCategories = monthBudgets
        .filter(b => b.type === type)
        .map(b => b.category)
        .filter(cat => !cats.some(defaultCat => defaultCat.toLowerCase() === cat.toLowerCase()));

      return [...cats, ...customCategories].map(cat => {
        const budgetEntry = monthBudgets.find(b => b.type === type && b.category === cat);
        const planned = budgetEntry?.planned || 0;
        const actual = monthTxs
          .filter(t => {
            if (t.type !== type) return false;
            if (budgetEntry?.tracker === 'subscription') {
              const txTitle = t.title.toLowerCase();
              const budgetName = cat.toLowerCase();
              return t.category === 'Subscription' && (txTitle.includes(budgetName) || budgetName.includes(txTitle));
            }
            return t.category === cat;
          })
          .reduce((sum, t) => sum + t.amount, 0);
        return { id: budgetEntry?.id, category: cat, planned, actual, remaining: planned - actual, tracker: budgetEntry?.tracker };
      });
    };

    return {
      income: buildRows('income', incomeCategories),
      expense: buildRows('expense', expenseCategories)
    };
  };

  // Save budgets to localStorage
  useEffect(() => {
    localStorage.setItem('zflow_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('zflow_assets', JSON.stringify(assets));
  }, [assets]);

  const addAsset = (asset: Omit<AssetItem, 'id'>) => {
    setAssets(prev => [{ ...asset, id: 'asset-' + Date.now() }, ...prev]);
  };

  const updateAsset = (id: string, data: Partial<Omit<AssetItem, 'id'>>) => {
    setAssets(prev => prev.map(asset => asset.id === id ? { ...asset, ...data } : asset));
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const addGoal = (goalData: Omit<FinancialGoal, 'id' | 'currentAmount'>) => {
    const newGoal: FinancialGoal = {
      ...goalData,
      id: 'g-' + Date.now(),
      currentAmount: 0
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, data: Partial<Omit<FinancialGoal, 'id'>>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Calculate dynamic health scores based on live transactions & wallets
  const [financialHealth, setFinancialHealth] = useState<FinancialHealth>(mockFinancialHealth);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('zflow_user', JSON.stringify(user));
    localStorage.setItem('zflow_wallets', JSON.stringify(wallets));
    localStorage.setItem('zflow_transactions', JSON.stringify(transactions));
    localStorage.setItem('zflow_subscriptions', JSON.stringify(subscriptions));
    localStorage.setItem('zflow_debts', JSON.stringify(debts));
    localStorage.setItem('zflow_goals', JSON.stringify(goals));
    localStorage.setItem('zflow_moods', JSON.stringify(moodLogs));
    localStorage.setItem('zflow_gamification', JSON.stringify(gamification));
  }, [user, wallets, transactions, subscriptions, debts, goals, moodLogs, gamification]);

  // Dynamic recalculation of Financial Health whenever transactions or wallets change
  useEffect(() => {
    // Total Income vs Total Expense this month
    const currentMonth = new Date().toISOString().slice(0, 7);
    let monthIncome = user.monthlyIncome; 
    let monthExpense = 0;

    transactions.forEach(t => {
      if (t.date.startsWith(currentMonth)) {
        if (t.type === 'expense') monthExpense += t.amount;
      }
    });

    // Current paylater / credit-card bills from Wallets.
    const totalMonthlyDebt = wallets
      .filter(w => w.type === 'paylater' || w.type === 'credit_card')
      .reduce((sum, w) => sum + Math.abs(w.balance), 0);

    // Saving ratio
    const savedAmount = monthIncome - monthExpense - totalMonthlyDebt;
    const savingRatio = monthIncome > 0
      ? Math.max(0, Math.min(100, Math.round((savedAmount / monthIncome) * 100)))
      : 0;

    // Debt ratio
    const debtRatio = monthIncome > 0 ? Math.round((totalMonthlyDebt / monthIncome) * 100) : 0;

    // Emergency fund coverage
    const primaryBankBal = wallets.filter(w => w.type === 'bank').reduce((sum, w) => sum + w.balance, 0);
    const estMonthlyNeed = monthExpense > 0 ? monthExpense : 5000000;
    const emergencyFundMonths = parseFloat((primaryBankBal / estMonthlyNeed).toFixed(1));

    // Spending Habit Score (penalize if high ratio of impulsive spending)
    const impulsiveCount = transactions.filter(t => t.isImpulsive).length;
    const totalCount = transactions.length || 1;
    const spendingHabitScore = Math.max(30, 100 - Math.round((impulsiveCount / totalCount) * 50));

    // Cashflow Consistency
    const cashflowConsistencyScore = monthExpense > monthIncome ? 45 : 85;

    // Overall Score
    const overallScore = Math.round(
      (savingRatio * 0.25) + 
      (spendingHabitScore * 0.2) + 
      (Math.min(emergencyFundMonths / 6, 1) * 100 * 0.25) + 
      ((100 - debtRatio) * 0.2) + 
      (cashflowConsistencyScore * 0.1)
    );

    setFinancialHealth({
      savingRatio,
      spendingHabitScore,
      emergencyFundMonths,
      debtRatio,
      cashflowConsistencyScore,
      overallScore: Math.min(100, Math.max(10, overallScore))
    });

  }, [transactions, wallets, debts, user.monthlyIncome]);

  const addTransaction = (txData: Omit<Transaction, 'id' | 'date'> & { date?: string }) => {
    const newTx: Transaction = {
      ...txData,
      id: 'tx-' + Date.now(),
      date: txData.date || new Date().toISOString().split('T')[0]
    };

    setTransactions(prev => [newTx, ...prev]);

    // Update wallet balance
    setWallets(prev => prev.map(w => {
      if (w.id === newTx.walletId) {
        const change = newTx.type === 'expense' ? -newTx.amount : newTx.amount;
        return { ...w, balance: w.balance + change };
      }
      return w;
    }));

    // Add XP for good habits
    setGamification(prev => {
      const addedXp = newTx.isImpulsive ? 10 : 50;
      const newXp = prev.xp + addedXp;
      let newLevel = prev.level;
      let nextXp = prev.nextLevelXp;

      if (newXp >= nextXp) {
        newLevel += 1;
        nextXp = Math.round(nextXp * 1.5);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        nextLevelXp: nextXp
      };
    });
  };

  const updateTransaction = (id: string, data: Partial<Omit<Transaction, 'id'>>) => {
    const oldTx = transactions.find(t => t.id === id);
    if (!oldTx) return;

    const updatedTx: Transaction = { ...oldTx, ...data };

    setTransactions(prev => prev.map(t => t.id === id ? updatedTx : t));

    // Revert old wallet effect, then apply new wallet effect.
    setWallets(prev => prev.map(wallet => {
      let nextBalance = wallet.balance;

      if (wallet.id === oldTx.walletId) {
        nextBalance += oldTx.type === 'expense' ? oldTx.amount : -oldTx.amount;
      }

      if (wallet.id === updatedTx.walletId) {
        nextBalance += updatedTx.type === 'expense' ? -updatedTx.amount : updatedTx.amount;
      }

      return { ...wallet, balance: nextBalance };
    }));
  };

  const deleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    setTransactions(prev => prev.filter(t => t.id !== id));

    // Revert wallet balance effect from deleted transaction.
    setWallets(prev => prev.map(wallet => {
      if (wallet.id !== tx.walletId) return wallet;
      const revertedBalance = wallet.balance + (tx.type === 'expense' ? tx.amount : -tx.amount);
      return { ...wallet, balance: revertedBalance };
    }));
  };

  const addWallet = (walletData: Omit<Wallet, 'id'>) => {
    const newWallet: Wallet = {
      ...walletData,
      id: 'w-' + Date.now()
    };
    setWallets(prev => [...prev, newWallet]);
  };

  const updateWallet = (id: string, data: Partial<Omit<Wallet, 'id'>>) => {
    setWallets(prev => prev.map(w => w.id === id ? { ...w, ...data } : w));
  };

  const deleteWallet = (id: string) => {
    setWallets(prev => prev.filter(w => w.id !== id));
  };

  const updateWalletBalance = (id: string, amountChange: number) => {
    setWallets(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, balance: w.balance + amountChange };
      }
      return w;
    }));
  };

  const addDepositToGoal = (goalId: string, amount: number, sourceWalletId: string) => {
    // Add to goal
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, currentAmount: g.currentAmount + amount };
      }
      return g;
    }));

    // Log as transaction (this automatically deducts from wallet)
    const targetGoal = goals.find(g => g.id === goalId);
    addTransaction({
      amount,
      type: 'expense',
      category: 'Investasi & Tabungan',
      title: `Topup Goal: ${targetGoal?.title || 'Tabungan'}`,
      walletId: sourceWalletId,
      notes: 'Alokasi tabungan otomatis'
    });

    // Reward extra XP for saving
    setGamification(prev => ({
      ...prev,
      xp: prev.xp + 100
    }));
  };

  const withdrawFromGoal = (goalId: string, amount: number, targetWalletId: string) => {
    // Deduct from goal
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, currentAmount: Math.max(0, g.currentAmount - amount) };
      }
      return g;
    }));

    // Log as income transaction (addTransaction already adds balance to wallet)
    const targetGoal = goals.find(g => g.id === goalId);
    addTransaction({
      amount,
      type: 'income',
      category: 'Investasi & Tabungan',
      title: `Pencairan Goal: ${targetGoal?.title || 'Tabungan'}`,
      walletId: targetWalletId,
      notes: 'Pencairan dana tabungan'
    });
  };

  const cancelSubscription = (subId: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== subId));
    // Reward for stopping unneeded subscription
    setGamification(prev => ({
      ...prev,
      xp: prev.xp + 150
    }));
  };

  const addMoodLog = (mood: MoodType, note?: string) => {
    const todayStr = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()];
    
    // Sum spent today
    const todayIso = new Date().toISOString().split('T')[0];
    const spentToday = transactions
      .filter(t => t.date === todayIso && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    setMoodLogs(prev => {
      // replace or add today
      const filtered = prev.filter(m => m.date !== todayStr);
      return [...filtered, { date: todayStr, mood, note, totalSpent: spentToday }];
    });
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...profile }));
  };

  const resetToDefaults = () => {
    setUser(mockUserProfile);
    setWallets(mockWallets);
    setTransactions(mockTransactions);
    setSubscriptions(mockSubscriptions);
    setDebts(mockDebts);
    setGoals(mockGoals);
    setMoodLogs(mockMoodLogs);
    setGamification(mockGamification);
    setBudgets([]);
    setAssets([]);
    localStorage.clear();
  };

  return (
    <FinanceContext.Provider value={{
      user,
      wallets,
      transactions,
      subscriptions,
      debts,
      goals,
      moodLogs,
      gamification,
      financialHealth,
      budgets,
      assets,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addWallet,
      updateWallet,
      deleteWallet,
      updateWalletBalance,
      addDepositToGoal,
      withdrawFromGoal,
      cancelSubscription,
      addMoodLog,
      updateUserProfile,
      setBudget,
      updateBudgetEntry,
      deleteBudgetEntry,
      calculateBudget,
      addAsset,
      updateAsset,
      deleteAsset,
      addGoal,
      updateGoal,
      deleteGoal,
      resetToDefaults
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
