import React, { useEffect, useMemo, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Check,
  Edit3,
  Plus,
  PieChart,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
  CalendarCheck
} from 'lucide-react';
import { ExpenseCategory, IncomeCategory } from '../../types';

type BudgetType = 'income' | 'expense';

interface BudgetFormState {
  id?: string;
  type: BudgetType;
  category: string;
  planned: string;
  tracker?: 'subscription';
}

const defaultIncomeCategories: IncomeCategory[] = ['Gaji', 'Freelance', 'Bisnis', 'Investasi', 'Lainnya'];
const defaultExpenseCategories: ExpenseCategory[] = [
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

export const BudgetScreen: React.FC = () => {
  const {
    setBudget,
    updateBudgetEntry,
    deleteBudgetEntry,
    calculateBudget,
    budgets,
    user
  } = useFinance();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthLabel = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  const [rows, setRows] = useState<ReturnType<typeof calculateBudget>>(() => calculateBudget(currentMonth));
  const [form, setForm] = useState<BudgetFormState | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setRows(calculateBudget(currentMonth));
  }, [budgets, currentMonth, calculateBudget]);

  useEffect(() => {
    if (budgets.filter(b => b.month === currentMonth).length === 0) {
      setBudget(currentMonth, 'income', 'Gaji', user.monthlyIncome);
      setBudget(currentMonth, 'expense', 'Makan & Minum', 1000);
      setBudget(currentMonth, 'expense', 'Transportasi', 1000);
      setBudget(currentMonth, 'expense', 'Nongkrong & Hiburan', 1000);
      setBudget(currentMonth, 'expense', 'Subscription', 1000);
      setBudget(currentMonth, 'expense', 'Investasi & Tabungan', 1000);
      setBudget(currentMonth, 'expense', 'Cicilan & Paylater', 1000);
      setBudget(currentMonth, 'expense', 'Belanja & Fashion', 1000);
      setBudget(currentMonth, 'expense', 'Kesehatan', 1000);
      setBudget(currentMonth, 'expense', 'Lainnya', 1000);
    }
  }, []);

  const customIncomeCategories = useMemo(() => {
    return budgets
      .filter(b => b.month === currentMonth && b.type === 'income')
      .map(b => b.category)
      .filter(cat => !defaultIncomeCategories.some(defaultCat => defaultCat.toLowerCase() === cat.toLowerCase()));
  }, [budgets, currentMonth]);

  const customExpenseCategories = useMemo(() => {
    return budgets
      .filter(b => b.month === currentMonth && b.type === 'expense')
      .map(b => b.category)
      .filter(cat => !defaultExpenseCategories.some(defaultCat => defaultCat.toLowerCase() === cat.toLowerCase()));
  }, [budgets, currentMonth]);

  const categorySuggestions = form?.type === 'income'
    ? [...defaultIncomeCategories, ...customIncomeCategories]
    : [...defaultExpenseCategories, ...customExpenseCategories];

  const totalPlannedIncome = rows.income.reduce((s, r) => s + r.planned, 0);
  const totalActualIncome = rows.income.reduce((s, r) => s + r.actual, 0);
  const totalPlannedExpense = rows.expense.reduce((s, r) => s + r.planned, 0);
  const totalActualExpense = rows.expense.reduce((s, r) => s + r.actual, 0);

  const openAddForm = (type: BudgetType, tracker?: 'subscription') => {
    setErrorMsg('');
    setForm({ type, category: '', planned: '', tracker });
  };

  const openEditForm = (
    type: BudgetType,
    row: { id?: string; category: string; planned: number; actual: number; remaining: number; tracker?: 'subscription' }
  ) => {
    setErrorMsg('');
    setForm({ id: row.id, type, category: row.category, planned: row.planned.toString(), tracker: row.tracker });
  };

  const closeForm = () => {
    setForm(null);
    setErrorMsg('');
  };

  const handleSaveForm = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form) return;

    const category = form.category.trim();
    const planned = parseFloat(form.planned);

    if (!category) {
      setErrorMsg('Nama anggaran atau kategori wajib diisi.');
      return;
    }

    if (isNaN(planned) || planned < 0) {
      setErrorMsg('Nominal anggaran harus berupa angka valid.');
      return;
    }

    const duplicate = budgets.find(b =>
      b.month === currentMonth &&
      b.type === form.type &&
      b.category.toLowerCase() === category.toLowerCase() &&
      b.tracker === form.tracker &&
      b.id !== form.id
    );

    if (duplicate) {
      setErrorMsg('Kategori/anggaran dengan nama ini sudah ada pada tipe yang sama.');
      return;
    }

    if (form.id) {
      updateBudgetEntry(form.id, { category, planned, type: form.type, tracker: form.tracker });
    } else {
      setBudget(currentMonth, form.type, category, planned, form.tracker);
    }

    closeForm();
  };

  const handleDelete = (id?: string) => {
    if (!id) {
      setErrorMsg('Anggaran default belum tersimpan sebagai pos aktif. Atur nominal terlebih dahulu jika ingin mengubahnya.');
      return;
    }

    if (confirm('Hapus pos anggaran ini?')) {
      deleteBudgetEntry(id);
    }
  };

  const renderRow = (
    type: BudgetType,
    row: { id?: string; category: string; planned: number; actual: number; remaining: number; tracker?: 'subscription' }
  ) => {
    const isOverBudget = type === 'expense' && row.planned > 0 && row.actual > row.planned;
    const progress = row.planned > 0 ? Math.min(100, (row.actual / row.planned) * 100) : 0;
    const isActive = row.planned > 0 || row.actual > 0 || Boolean(row.id);

    return (
      <div
        key={`${type}-${row.category}`}
        className={`glass-card rounded-xl p-3 border-l-4 ${
          isOverBudget ? 'border-rose-400' : type === 'income' ? 'border-emerald-400' : 'border-sky-400'
        } ${!isActive ? 'opacity-70' : ''}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="text-xs font-semibold text-gray-200 line-clamp-1">{row.category}</span>
            <span className="text-[9px] text-gray-500 block mt-0.5">
              {row.tracker === 'subscription' ? 'Subscription Tracker' : type === 'income' ? 'Target pemasukan' : 'Pos pengeluaran'}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => openEditForm(type, row)}
              className="text-[9px] text-gray-400 hover:text-emerald-300 flex items-center gap-0.5 bg-white/5 px-2 py-1 rounded-lg border border-white/5"
            >
              <Edit3 className="w-3 h-3" />
              {row.planned > 0 ? `Rp ${row.planned.toLocaleString('id-ID')}` : 'Atur'}
            </button>
            {row.id && (
              <button
                onClick={() => handleDelete(row.id)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-rose-500/10 text-gray-500 hover:text-rose-300 flex items-center justify-center border border-white/5"
                title="Hapus anggaran"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {row.planned > 0 && (
          <div className="mt-2">
            <div className="flex justify-between text-[9px] text-gray-400 mb-1">
              <span>{type === 'income' ? 'Terealisasi' : 'Terpakai'}: Rp {row.actual.toLocaleString('id-ID')}</span>
              <span className={isOverBudget ? 'text-rose-400 font-bold' : row.remaining >= 0 ? 'text-emerald-300' : 'text-rose-400'}>
                Sisa: Rp {row.remaining.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${isOverBudget ? 'bg-rose-500' : type === 'income' ? 'bg-emerald-500' : 'bg-sky-500'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-base font-bold text-gray-100 flex items-center gap-1.5">
          <PieChart className="w-4 h-4 text-emerald-400" /> Budget Planner
        </h2>
        <p className="text-[10px] text-gray-400 mt-0.5">
          Tambah kategori, buat item Subscription Tracker, dan pantau realisasi vs rencana untuk {monthLabel}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-2xl p-3 border-l-4 border-emerald-500">
          <span className="text-[9px] text-gray-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Target Income</span>
          <span className="text-sm font-black text-emerald-400 block mt-0.5">Rp {totalPlannedIncome.toLocaleString('id-ID')}</span>
          <span className="text-[9px] text-gray-500">Terealisasi: Rp {totalActualIncome.toLocaleString('id-ID')}</span>
        </div>
        <div className="glass-card rounded-2xl p-3 border-l-4 border-sky-500">
          <span className="text-[9px] text-gray-400 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Budget Expense</span>
          <span className="text-sm font-black text-sky-400 block mt-0.5">Rp {totalPlannedExpense.toLocaleString('id-ID')}</span>
          <span className="text-[9px] text-gray-500">Terpakai: Rp {totalActualExpense.toLocaleString('id-ID')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => openAddForm('income')}
          className="py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 text-xs font-bold flex items-center justify-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah Income
        </button>
        <button
          onClick={() => openAddForm('expense')}
          className="py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/15 text-sky-300 border border-sky-500/20 text-xs font-bold flex items-center justify-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah Expense
        </button>
      </div>

      <button
        onClick={() => openAddForm('expense', 'subscription')}
        className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 text-amber-300 border border-amber-500/20 text-xs font-bold flex items-center justify-center gap-1"
      >
        <CalendarCheck className="w-3.5 h-3.5" /> Tambah Item Subscription Tracker
      </button>

      {errorMsg && (
        <div className="text-[10px] text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-xl p-2">
          {errorMsg}
        </div>
      )}

      {form && (
        <form onSubmit={handleSaveForm} className="glass-panel rounded-2xl p-3.5 space-y-3 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-100">
              {form.id ? 'Edit Pos Anggaran' : form.tracker === 'subscription' ? 'Tambah Item Subscription Tracker' : 'Tambah Kategori / Anggaran Baru'}
            </span>
            <button type="button" onClick={closeForm} className="text-gray-500 hover:text-gray-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-gray-400 block mb-1">TIPE ANGGARAN</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm(prev => prev ? { ...prev, type: 'income', tracker: undefined, category: '' } : prev)}
                className={`py-2 rounded-xl text-xs font-bold border ${form.type === 'income' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-white/5 text-gray-400 border-white/10'}`}
              >
                Pemasukan
              </button>
              <button
                type="button"
                onClick={() => setForm(prev => prev ? { ...prev, type: 'expense', category: '' } : prev)}
                className={`py-2 rounded-xl text-xs font-bold border ${form.type === 'expense' ? 'bg-sky-500/15 text-sky-300 border-sky-500/30' : 'bg-white/5 text-gray-400 border-white/10'}`}
              >
                Pengeluaran
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-gray-400 block mb-1">NAMA ANGGARAN / KATEGORI</label>
            <input
              value={form.category}
              onChange={(e) => setForm(prev => prev ? { ...prev, category: e.target.value } : prev)}
              list="budget-category-suggestions"
              placeholder={form.tracker === 'subscription' ? 'Contoh: Netflix, Spotify, iCloud' : form.type === 'income' ? 'Contoh: Bonus, Freelance UI' : 'Contoh: Skincare, Kucing, Groceries'}
              className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50"
              autoFocus
            />
            <datalist id="budget-category-suggestions">
              {categorySuggestions.map(cat => <option key={cat} value={cat} />)}
            </datalist>
            <p className="text-[9px] text-gray-500 mt-1">
              {form.tracker === 'subscription'
                ? 'Nama ini akan menjadi item yang muncul di Subscription Tracker setelah ada pengeluaran yang dibayarkan.'
                : 'Kamu bisa memilih kategori lama atau mengetik nama baru.'}
            </p>
          </div>

          {form.type === 'expense' && (
            <label className="glass-card rounded-xl p-2.5 flex items-start gap-2 cursor-pointer border border-amber-500/10">
              <input
                type="checkbox"
                checked={form.tracker === 'subscription'}
                onChange={(e) => setForm(prev => prev ? { ...prev, tracker: e.target.checked ? 'subscription' : undefined } : prev)}
                className="mt-0.5 rounded text-amber-500 focus:ring-0 bg-white/5 border-white/10"
              />
              <span>
                <span className="text-xs font-bold text-amber-300 block">Tampilkan di Subscription Tracker</span>
                <span className="text-[9px] text-gray-500 block mt-0.5">
                  Item akan aktif jika ada transaksi pengeluaran kategori Subscription dengan nama yang sama/mirip.
                </span>
              </span>
            </label>
          )}

          <div>
            <label className="text-[10px] font-semibold text-gray-400 block mb-1">NOMINAL ANGGARAN (RP)</label>
            <input
              type="number"
              value={form.planned}
              onChange={(e) => setForm(prev => prev ? { ...prev, planned: e.target.value } : prev)}
              placeholder="1500000"
              className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 font-bold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs transition-all flex items-center justify-center gap-1"
          >
            <Check className="w-3.5 h-3.5" /> Simpan Anggaran
          </button>
        </form>
      )}

      <div className="space-y-2">
        <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">Target Pemasukan</span>
        {rows.income.map(row => renderRow('income', row))}
      </div>

      <div className="space-y-2">
        <span className="text-[10px] font-bold text-sky-400 block uppercase tracking-wider">Anggaran Pengeluaran</span>
        {rows.expense.map(row => renderRow('expense', row))}
      </div>
    </div>
  );
};