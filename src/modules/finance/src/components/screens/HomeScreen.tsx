import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  Smile, 
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { MoodType, Transaction } from '../../types';
import { moodOptions } from '../../utils/mood';

interface HomeScreenProps {
  setActiveTab: (tab: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ setActiveTab }) => {
  const { 
    wallets, 
    transactions, 
    financialHealth, 
    addMoodLog,
    updateTransaction,
    deleteTransaction,
    budgets
  } = useFinance();

  const [showDistribution, setShowDistribution] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState<string>('Makan & Minum');
  const [editWalletId, setEditWalletId] = useState('');
  const [editIsImpulsive, setEditIsImpulsive] = useState(false);
  const [editNotes, setEditNotes] = useState('');

  const defaultCategories: string[] = [
    'Makan & Minum',
    'Transportasi',
    'Nongkrong & Hiburan',
    'Subscription',
    'Investasi & Tabungan',
    'Cicilan & Paylater',
    'Belanja & Fashion',
    'Kesehatan',
    'Lainnya'
  ];

  const currentMonth = new Date().toISOString().slice(0, 7);
  const budgetCategories = budgets
    .filter(budget => budget.month === currentMonth && budget.type === 'expense')
    .map(budget => budget.category)
    .filter(categoryName => !defaultCategories.some(defaultCategory => defaultCategory.toLowerCase() === categoryName.toLowerCase()));

  const categories = [...defaultCategories, ...budgetCategories];

  // Consolidated liquid balance (Bank + Ewallet)
  const liquidBalance = wallets
    .filter(w => w.type === 'bank' || w.type === 'ewallet')
    .reduce((sum, w) => sum + w.balance, 0);

  // Paylater & CC total debt
  const totalDebt = wallets
    .filter(w => w.type === 'paylater' || w.type === 'credit_card')
    .reduce((sum, w) => sum + Math.abs(w.balance), 0);

  // Calculate this month's income & spending from actual transactions
  const thisMonthIncome = transactions
    .filter(t => t.date.startsWith(currentMonth) && t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthExpenses = transactions
    .filter(t => t.date.startsWith(currentMonth) && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Predict End of Month Balance
  const estimatedRemaining = thisMonthIncome - thisMonthExpenses;
  const isTekor = estimatedRemaining < 1000000;

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    addMoodLog(mood, 'Logged from home quick dashboard');
  };

  const startEditTransaction = (tx: Transaction) => {
    setEditingTx(tx);
    setEditTitle(tx.title);
    setEditAmount(String(tx.amount));
    setEditCategory(tx.category);
    setEditWalletId(tx.walletId);
    setEditIsImpulsive(Boolean(tx.isImpulsive));
    setEditNotes(tx.notes || '');
  };

  const closeEditTransaction = () => {
    setEditingTx(null);
    setEditTitle('');
    setEditAmount('');
    setEditNotes('');
  };

  const handleSaveTransaction = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingTx || !editTitle.trim() || !editAmount) return;

    updateTransaction(editingTx.id, {
      title: editTitle.trim(),
      amount: Number(editAmount),
      category: editCategory,
      walletId: editWalletId,
      isImpulsive: editIsImpulsive,
      notes: editNotes.trim() || undefined
    });

    closeEditTransaction();
  };

  const handleDeleteTransaction = (tx: Transaction) => {
    if (confirm(`Hapus pengeluaran "${tx.title}"? Saldo dompet akan dikembalikan.`)) {
      deleteTransaction(tx.id);
    }
  };

  return (
    <div className="p-4 space-y-4">
      
      {/* Premium Master Card: Cashflow Awareness */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/80 via-[#131A22] to-[#0D131A] p-5 border border-emerald-500/20 glow-primary">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-emerald-400/90 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Total Uang Siap Pakai
          </span>
          <button 
            onClick={() => setShowDistribution(!showDistribution)}
            className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-300 px-2 py-0.5 rounded-full border border-white/10 transition-all"
          >
            {showDistribution ? 'Tutup Rincian' : 'Distribusi'}
          </button>
        </div>

        <div className="mt-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Rp {liquidBalance.toLocaleString('id-ID')}
          </h2>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Di luar limit Paylater / Kartu Kredit
          </p>
        </div>

        {/* Quick Month Flow Preview */}
        <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ArrowDownLeft className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[9px] text-gray-400 block">Pemasukan Bulan Ini</span>
              <span className="text-xs font-bold text-gray-200">
                Rp {thisMonthIncome.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[9px] text-gray-400 block">Pengeluaran</span>
              <span className="text-xs font-bold text-rose-400">
                Rp {thisMonthExpenses.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Distribution Breakdown Toggle */}
        {showDistribution && (
          <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5 text-xs animate-fadeIn">
            <span className="text-[9px] font-semibold text-gray-400 block uppercase tracking-wider">
              Distribusi per Tipe
            </span>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Rekening Bank
                </span>
                <span className="font-medium">
                  Rp {wallets.filter(w => w.type === 'bank').reduce((s, w) => s + w.balance, 0).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span> E-Wallets & QRIS
                </span>
                <span className="font-medium">
                  Rp {wallets.filter(w => w.type === 'ewallet').reduce((s, w) => s + w.balance, 0).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-rose-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Tagihan Paylater/CC
                </span>
                <span className="font-medium">
                  - Rp {totalDebt.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Financial Health & Cashflow Forecast */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Financial Health Score Mini */}
        <button 
          onClick={() => setActiveTab('health')}
          className="glass-card rounded-2xl p-3 flex flex-col justify-between text-left group hover:border-emerald-500/30 transition-all"
        >
          <div>
            <span className="text-[10px] font-medium text-gray-400 block">Kesehatan Finansial</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-gray-100">{financialHealth.overallScore}</span>
              <span className="text-[10px] text-gray-500">/100</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
              financialHealth.overallScore >= 75 ? 'bg-emerald-500/10 text-emerald-400' :
              financialHealth.overallScore >= 50 ? 'bg-amber-500/10 text-amber-400' :
              'bg-rose-500/10 text-rose-400'
            }`}>
              {financialHealth.overallScore >= 75 ? 'Sehat & Grow' :
               financialHealth.overallScore >= 50 ? 'Perlu Perhatian' :
               'Risiko Tinggi'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>

        {/* Cashflow Forecast Mini */}
        <button 
          onClick={() => setActiveTab('forecast')}
          className="glass-card rounded-2xl p-3 flex flex-col justify-between text-left group hover:border-sky-500/30 transition-all"
        >
          <div>
            <span className="text-[10px] font-medium text-gray-400 block">Forecast Akhir Bulan</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-sm font-bold ${isTekor ? 'text-rose-400' : 'text-sky-400'}`}>
                Rp {(estimatedRemaining / 1000000).toFixed(1)} Juta
              </span>
            </div>
            <span className="text-[8px] text-gray-500 block">Estimasi sisa uang</span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            {isTekor ? (
              <span className="text-[9px] font-semibold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <AlertTriangle className="w-2.5 h-2.5" /> Potensi Tekor
              </span>
            ) : (
              <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> Cashflow Aman
              </span>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>

      </div>

      {/* Anti Impulsive Spending Assistant Prompt */}
      <div 
        onClick={() => setActiveTab('impulsive')}
        className="glass-panel rounded-2xl p-3.5 border border-amber-500/20 bg-gradient-to-r from-amber-950/20 to-transparent cursor-pointer group hover:border-amber-500/40 transition-all"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-300">Anti-Impulsive Assistant</h3>
              <span className="text-[9px] bg-amber-400/10 text-amber-300 px-1.5 py-0.5 rounded font-medium">
                Cek Sebelum Beli
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
              Mau checkout barang incaran? Uji dulu nilainya dengan simulasi jam kerja & peluang investasimu!
            </p>
          </div>
        </div>
      </div>

      {/* Mood & Spending Preview */}
      <div className="glass-card rounded-2xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
            <Smile className="w-3 h-3 text-sky-400" /> Gimana mood kamu hari ini?
          </span>
          <button 
            onClick={() => setActiveTab('mood')}
            className="text-[9px] text-emerald-400 hover:underline"
          >
            Lihat Insight
          </button>
        </div>

        <div className="flex items-center justify-between gap-1 pt-1">
          {moodOptions.map((mood) => {
            const isSelected = selectedMood === mood.value;
            const Icon = mood.Icon;
            return (
              <button
                key={mood.value}
                onClick={() => handleMoodSelect(mood.value)}
                className={`flex-1 py-1.5 px-1 rounded-lg text-xs transition-all text-center ${
                  isSelected 
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 scale-105' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-transparent'
                }`}
              >
                <Icon className="w-8 h-8 mx-auto" />
                <span className="text-[8px] block mt-0.5">{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions List (All types, sorted by date) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Transaksi Terkini</h3>
          <button 
            onClick={() => setActiveTab('track')}
            className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
          >
            <Plus className="w-3 h-3" /> Catat Baru
          </button>
        </div>

        <div className="space-y-1.5">
          {transactions.slice(0, 6).map((tx) => {
            const wallet = wallets.find(w => w.id === tx.walletId);
            const isIncome = tx.type === 'income';
            return (
              <div 
                key={tx.id}
                className={`glass-card rounded-xl p-2.5 flex items-center justify-between gap-2 hover:bg-white/5 transition-all border-l-2 ${
                  isIncome ? 'border-emerald-500/50' : 'border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-gray-300'
                  }`}>
                    {isIncome ? '+' : tx.category.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-gray-200 line-clamp-1">{tx.title}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[8px] px-1 py-0.5 rounded font-medium ${
                        isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-gray-400'
                      }`}>
                        {tx.category}
                      </span>
                      {wallet && (
                        <span className="text-[8px] text-gray-500">
                          {wallet.name.split(' ')[0]}
                        </span>
                      )}
                      {tx.isImpulsive && (
                        <span className="text-[8px] text-amber-400 bg-amber-500/10 px-1 rounded font-medium">
                          Impulsive
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-1.5">
                  <div>
                  <span className={`text-xs font-bold block ${
                    isIncome ? 'text-emerald-400' : 'text-gray-100'
                  }`}>
                    {isIncome ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[8px] text-gray-500 block">
                    {tx.date.split('-').slice(1).join('/')}
                  </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => startEditTransaction(tx)}
                      className="w-6 h-6 rounded-lg bg-white/5 hover:bg-emerald-500/10 text-gray-500 hover:text-emerald-300 flex items-center justify-center border border-white/5"
                      title="Edit transaksi"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(tx)}
                      className="w-6 h-6 rounded-lg bg-white/5 hover:bg-rose-500/10 text-gray-500 hover:text-rose-300 flex items-center justify-center border border-white/5"
                      title="Hapus transaksi"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editingTx && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end lg:items-center justify-center p-3">
          <form onSubmit={handleSaveTransaction} className="glass-panel w-full max-w-sm rounded-3xl p-4 space-y-3 border border-white/10 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-100">
                  {editingTx.type === 'income' ? 'Edit Pemasukan' : 'Edit Pengeluaran'}
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Perubahan akan otomatis menyesuaikan saldo dompet.</p>
              </div>
              <button type="button" onClick={closeEditTransaction} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-gray-400 block mb-1">
                {editingTx.type === 'income' ? 'SUMBER PEMASUKAN' : 'NAMA PENGELUARAN'}
              </label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-emerald-500/50"
                autoFocus
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-gray-400 block mb-1">JUMLAH (RP)</label>
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-emerald-500/50 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-gray-400 block mb-1">KATEGORI</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full bg-[#131722] border border-white/10 rounded-xl px-2 py-2 text-xs text-gray-100"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-gray-400 block mb-1">DOMPET</label>
                <select
                  value={editWalletId}
                  onChange={(e) => setEditWalletId(e.target.value)}
                  className="w-full bg-[#131722] border border-white/10 rounded-xl px-2 py-2 text-xs text-gray-100"
                >
                  {wallets.map(wallet => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
                </select>
              </div>
            </div>

            {editingTx.type === 'expense' && (
              <label className="glass-card rounded-xl p-2.5 flex items-start gap-2 cursor-pointer border border-amber-500/10">
                <input
                  type="checkbox"
                  checked={editIsImpulsive}
                  onChange={(e) => setEditIsImpulsive(e.target.checked)}
                  className="mt-0.5 rounded text-amber-500 focus:ring-0 bg-white/5 border-white/10"
                />
                <span>
                  <span className="text-xs font-bold text-amber-300 block">Tandai sebagai impulsif</span>
                  <span className="text-[9px] text-gray-500 block mt-0.5">Untuk membantu analisis kebiasaan belanja.</span>
                </span>
              </label>
            )}

            <div>
              <label className="text-[10px] font-semibold text-gray-400 block mb-1">CATATAN</label>
              <input
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Opsional"
                className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100 placeholder:text-gray-600"
              />
            </div>

            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs flex items-center justify-center gap-1">
              <Check className="w-3.5 h-3.5" /> Simpan Perubahan
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
