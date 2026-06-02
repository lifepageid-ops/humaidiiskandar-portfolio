import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  Target, 
  ShieldCheck, 
  Plane, 
  Coffee, 
  Camera, 
  Car, 
  Home, 
  Plus, 
  CheckCircle2,
  Edit2,
  Trash2,
  X,
  ChevronRight
} from 'lucide-react';
import { FinancialGoal } from '../../types';

type GoalCategory = FinancialGoal['category'];

const goalCategories: GoalCategory[] = ['Emergency Fund', 'Travelling', 'Gadget', 'Kendaraan', 'Resign Fund', 'Rumah'];

export const GoalsScreen: React.FC = () => {
  const { goals, wallets, addDepositToGoal, withdrawFromGoal, addGoal, updateGoal, deleteGoal } = useFinance();
  
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [actionMode, setActionMode] = useState<'topup' | 'withdraw'>('topup');
  const [depositAmount, setDepositAmount] = useState('');
  const [sourceWalletId, setSourceWalletId] = useState(wallets[0]?.id || '');
  const [successMsg, setSuccessMsg] = useState('');

  // CRUD Form State
  const [isAdding, setIsAdding] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCategory, setGoalCategory] = useState<GoalCategory>('Emergency Fund');
  const [goalColor, setGoalColor] = useState('#10B981');

  const openAddForm = () => {
    resetForm();
    setIsAdding(true);
  };

  // Total stats
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  const renderIcon = (icon: string, color: string, className = "w-4 h-4") => {
    const props = { className, style: { color } };
    switch (icon) {
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Plane': return <Plane {...props} />;
      case 'Coffee': return <Coffee {...props} />;
      case 'Camera': return <Camera {...props} />;
      case 'Car': return <Car {...props} />;
      case 'Home': return <Home {...props} />;
      default: return <Target {...props} />;
    }
  };

  const getIconForCategory = (cat: GoalCategory) => {
    switch (cat) {
      case 'Emergency Fund': return 'ShieldCheck';
      case 'Travelling': return 'Plane';
      case 'Gadget': return 'Camera';
      case 'Kendaraan': return 'Car';
      case 'Resign Fund': return 'Coffee';
      case 'Rumah': return 'Home';
      default: return 'Target';
    }
  };

  const getColorForCategory = (cat: GoalCategory) => {
    switch (cat) {
      case 'Emergency Fund': return '#10B981';
      case 'Travelling': return '#EC4899';
      case 'Gadget': return '#6366F1';
      case 'Kendaraan': return '#F59E0B';
      case 'Resign Fund': return '#8B5CF6';
      case 'Rumah': return '#3B82F6';
      default: return '#10B981';
    }
  };

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId || !depositAmount) return;

    const amt = parseFloat(depositAmount);
    const goal = goals.find(g => g.id === selectedGoalId);

    if (actionMode === 'topup') {
      addDepositToGoal(selectedGoalId, amt, sourceWalletId);
      setSuccessMsg(`Berhasil menabung Rp ${amt.toLocaleString('id-ID')} ke ${goal?.title}.`);
    } else {
      withdrawFromGoal(selectedGoalId, amt, sourceWalletId);
      setSuccessMsg(`Berhasil mencairkan Rp ${amt.toLocaleString('id-ID')} dari ${goal?.title} ke dompet.`);
    }

    setDepositAmount('');
    setSelectedGoalId(null);

    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !goalTarget) return;

    const targetAmount = parseFloat(goalTarget);

    if (editingGoal) {
      updateGoal(editingGoal.id, {
        title: goalTitle,
        targetAmount,
        category: goalCategory,
        color: goalColor,
        icon: getIconForCategory(goalCategory)
      });
      setSuccessMsg('Target berhasil diperbarui.');
    } else {
      addGoal({
        title: goalTitle,
        targetAmount,
        category: goalCategory,
        targetDate: new Date(Date.now() + 86400000 * 365).toISOString().split('T')[0], // Default 1 year
        color: goalColor,
        icon: getIconForCategory(goalCategory)
      });
      setSuccessMsg('Target menabung baru berhasil ditambahkan.');
    }

    resetForm();
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingGoal(null);
    setGoalTitle('');
    setGoalTarget('');
    setGoalCategory('Emergency Fund');
    setGoalColor('#10B981');
  };

  const startEdit = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setGoalTitle(goal.title);
    setGoalTarget(goal.targetAmount.toString());
    setGoalCategory(goal.category);
    setGoalColor(goal.color);
    setIsAdding(true);
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('Hapus target menabung ini? Saldo yang sudah terkumpul tidak akan hilang dari dompet asal.')) {
      deleteGoal(id);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-100 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-400" /> Financial Goals Studio
          </h2>
          <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
            Rencanakan masa depanmu tanpa mengorbankan gaya hidup masa kini.
          </p>
        </div>
        <button 
          onClick={openAddForm}
          className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Target
        </button>
      </div>

      {/* Master Progress */}
      <div className="glass-card rounded-2xl p-4 border border-white/5 space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-medium text-gray-400 block">Total Tabungan Masa Depan</span>
            <span className="text-lg font-black text-gray-100 block mt-0.5">
              Rp {totalSaved.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-emerald-400 block">{overallProgress}%</span>
            <span className="text-[8px] text-gray-500 block">dari total target</span>
          </div>
        </div>

        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-2.5 rounded-xl text-xs flex items-center gap-1.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span className="leading-relaxed">{successMsg}</span>
        </div>
      )}

      {/* CRUD Form Overlay */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xs rounded-3xl p-5 space-y-4 border border-white/10 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-100">
                {editingGoal ? 'Edit Target' : 'Target Baru'}
              </h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3 text-xs">
              <div>
                <label className="text-[9px] font-semibold text-gray-400 block mb-1 uppercase">NAMA TARGET</label>
                <input 
                  type="text" 
                  value={goalTitle} 
                  onChange={e => setGoalTitle(e.target.value)} 
                  placeholder="Contoh: Dana Darurat / Kawin Fund" 
                  className="w-full bg-[#131722] border border-white/10 rounded-xl p-2 text-gray-100" 
                  required 
                />
              </div>

              <div>
                <label className="text-[9px] font-semibold text-gray-400 block mb-1 uppercase">KATEGORI</label>
                <select 
                  value={goalCategory} 
                  onChange={e => {
                    const val = e.target.value as GoalCategory;
                    setGoalCategory(val);
                    setGoalColor(getColorForCategory(val));
                  }} 
                  className="w-full bg-[#131722] border border-white/10 rounded-xl p-2 text-gray-100"
                >
                  {goalCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[9px] font-semibold text-gray-400 block mb-1 uppercase">TARGET NOMINAL (RP)</label>
                <input 
                  type="number" 
                  value={goalTarget} 
                  onChange={e => setGoalTarget(e.target.value)} 
                  placeholder="1000000" 
                  className="w-full bg-[#131722] border border-white/10 rounded-xl p-2 text-gray-100 font-bold" 
                  required 
                />
              </div>

              <button type="submit" className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold rounded-xl transition-all">
                Simpan Target
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
            Target & Alokasi Aktif
          </span>
          <span className="text-[9px] text-gray-500 italic">Tap kartu untuk topup</span>
        </div>

        <div className="space-y-3">
          {goals.map(goal => {
            const progress = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
            const isSelected = selectedGoalId === goal.id;

            return (
              <div 
                key={goal.id} 
                className={`glass-card rounded-3xl p-4 space-y-3 transition-all border ${
                  isSelected ? 'border-emerald-500/50 ring-1 ring-emerald-500/10' : 'border-white/5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div 
                    className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                    onClick={() => setSelectedGoalId(isSelected ? null : goal.id)}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                      {renderIcon(goal.icon, goal.color, "w-5 h-5")}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-100 line-clamp-1">{goal.title}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] text-gray-500 font-medium">{goal.category}</span>
                        {progress >= 100 && (
                          <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 rounded-full font-bold">Goal Achieved!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); startEdit(goal); }}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 flex items-center justify-center border border-white/5 transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteGoal(goal.id); }}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-rose-500/10 text-gray-500 flex items-center justify-center border border-white/5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div 
                  className="cursor-pointer"
                  onClick={() => setSelectedGoalId(isSelected ? null : goal.id)}
                >
                  <div className="flex justify-between items-end mb-1.5">
                    <div className="text-[10px]">
                      <span className="text-gray-400">Terkumpul: </span>
                      <span className="text-white font-bold">Rp {goal.currentAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="text-[9px] text-right">
                      <span className="text-gray-500">Target: </span>
                      <span className="text-gray-300 font-semibold">Rp {goal.targetAmount.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                  
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%`, backgroundColor: goal.color }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-[9px] mt-2">
                    <span className="text-gray-400">{progress}% Terkumpul</span>
                    <span className={remaining > 0 ? 'text-emerald-400' : 'text-emerald-500'}>
                      {remaining > 0 ? `Sisa: Rp ${remaining.toLocaleString('id-ID')}` : 'Target Terpenuhi!'}
                    </span>
                  </div>
                </div>

                {/* Inline Action Form */}
                {isSelected && (
                  <form onSubmit={handleAction} className="pt-3 border-t border-white/5 space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2 bg-[#131722] p-1 rounded-xl border border-white/10">
                      <button
                        type="button"
                        onClick={() => setActionMode('topup')}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          actionMode === 'topup' 
                            ? 'bg-emerald-500 text-gray-950' 
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        Topup Tabungan
                      </button>
                      <button
                        type="button"
                        onClick={() => setActionMode('withdraw')}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          actionMode === 'withdraw' 
                            ? 'bg-amber-500 text-gray-950' 
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        Pencairan Dana
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <label className="text-[8px] text-gray-500 uppercase">
                          {actionMode === 'topup' ? 'NOMINAL TABUNG' : 'NOMINAL CAIR'}
                        </label>
                        <input 
                          type="number"
                          value={depositAmount}
                          onChange={e => setDepositAmount(e.target.value)}
                          placeholder="500.000"
                          max={actionMode === 'withdraw' ? goal.currentAmount : undefined}
                          className="w-full bg-[#131722] border border-white/10 rounded-xl p-2 text-gray-100 font-bold"
                          required
                          autoFocus
                        />
                        {actionMode === 'withdraw' && (
                          <span className="text-[8px] text-amber-400 block mt-0.5">
                            Maksimal: Rp {goal.currentAmount.toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] text-gray-500 uppercase">
                          {actionMode === 'topup' ? 'DARI DOMPET' : 'KE DOMPET'}
                        </label>
                        <select
                          value={sourceWalletId}
                          onChange={e => setSourceWalletId(e.target.value)}
                          className="w-full bg-[#131722] border border-white/10 rounded-xl p-2 text-gray-100"
                        >
                          {wallets.filter(w => w.type === 'bank' || w.type === 'ewallet' || w.type === 'cash').map(w => (
                            <option key={w.id} value={w.id}>
                              {w.name} (Rp {w.balance.toLocaleString('id-ID')})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className={`w-full py-2 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 ${
                        actionMode === 'topup'
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-gray-950'
                          : 'bg-amber-500 hover:bg-amber-400 text-gray-950'
                      }`}
                    >
                      {actionMode === 'topup' ? 'Konfirmasi Menabung' : 'Konfirmasi Pencairan'} <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}

              </div>
            );
          })}

          {goals.length === 0 && (
            <div className="glass-card rounded-3xl p-10 text-center space-y-3">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-600">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-300">Belum Ada Target</h4>
                <p className="text-[10px] text-gray-500 mt-1">Mulai rencanakan masa depanmu dengan menambahkan target menabung pertama.</p>
              </div>
              <button 
                onClick={openAddForm}
                className="text-xs text-emerald-400 font-bold underline"
              >
                Buat Target Sekarang
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
