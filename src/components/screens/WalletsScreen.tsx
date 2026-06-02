import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  Wallet as WalletIcon, 
  Building2, 
  Landmark, 
  Smartphone, 
  ShoppingBag, 
  CreditCard, 
  Plus,
  Sparkles,
  Edit3,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { WalletType } from '../../types';

export const WalletsScreen: React.FC = () => {
  const { wallets, addWallet, updateWallet, deleteWallet } = useFinance();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State (Add)
  const [name, setName] = useState('');
  const [type, setType] = useState<WalletType>('bank');
  const [balance, setBalance] = useState('');
  const [limit, setLimit] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Inline Edit State
  const [editName, setEditName] = useState('');
  const [editBalance, setEditBalance] = useState('');
  const [editLimit, setEditLimit] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !balance) return;
    addWallet({
      name,
      type,
      balance: parseFloat(balance),
      limit: limit ? parseFloat(limit) : undefined,
      dueDate: dueDate || undefined,
      color: type === 'bank' ? '#10B981' : type === 'ewallet' ? '#0EA5E9' : '#F43F5E',
      icon: type === 'bank' ? 'Landmark' : type === 'ewallet' ? 'Smartphone' : 'CreditCard'
    });
    setName('');
    setBalance('');
    setLimit('');
    setDueDate('');
    setShowAddModal(false);
  };

  const startEdit = (w: typeof wallets[0]) => {
    setEditingId(w.id);
    setEditName(w.name);
    setEditBalance(String(Math.abs(w.balance)));
    setEditLimit(w.limit ? String(w.limit) : '');
    setEditDueDate(w.dueDate || '');
  };

  const confirmEdit = (w: typeof wallets[0]) => {
    const parsedBalance = parseFloat(editBalance);
    if (!editName || isNaN(parsedBalance)) return;
    const payload: any = { name: editName };
    if (w.type === 'paylater' || w.type === 'credit_card') {
      payload.balance = -Math.abs(parsedBalance);
      payload.limit = parseFloat(editLimit) || w.limit;
      payload.dueDate = editDueDate || w.dueDate;
    } else {
      payload.balance = parsedBalance;
    }
    updateWallet(w.id, payload);
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const renderIcon = (iconName: string, color: string) => {
    const props = { className: "w-4 h-4", style: { color } };
    switch (iconName) {
      case 'Building2': return <Building2 {...props} />;
      case 'Landmark': return <Landmark {...props} />;
      case 'Smartphone': return <Smartphone {...props} />;
      case 'ShoppingBag': return <ShoppingBag {...props} />;
      case 'CreditCard': return <CreditCard {...props} />;
      default: return <WalletIcon {...props} />;
    }
  };

  const banks = wallets.filter(w => w.type === 'bank');
  const ewallets = wallets.filter(w => w.type === 'ewallet' || w.type === 'qris');
  const credits = wallets.filter(w => w.type === 'paylater' || w.type === 'credit_card');

  const renderWalletActions = (w: typeof wallets[0]) => {
    if (editingId === w.id) {
      return (
        <div className="flex gap-1">
          <button onClick={() => confirmEdit(w)} className="text-emerald-400 hover:text-emerald-300"><Check className="w-3.5 h-3.5" /></button>
          <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-200"><X className="w-3.5 h-3.5" /></button>
        </div>
      );
    }
    return (
      <div className="flex gap-1">
        <button onClick={() => startEdit(w)} className="text-gray-500 hover:text-emerald-400"><Edit3 className="w-3 h-3" /></button>
        <button onClick={() => { if (confirm(`Hapus dompet "${w.name}"?`)) deleteWallet(w.id); }} className="text-gray-500 hover:text-rose-400"><Trash2 className="w-3 h-3" /></button>
      </div>
    );
  };

  const renderEditableField = (w: typeof wallets[0], field: 'name' | 'balance') => {
    if (editingId !== w.id) {
      return field === 'name' ? (
        <h3 className="text-xs font-bold text-gray-200">{w.name}</h3>
      ) : (
        <span className="text-xs font-extrabold text-gray-100 block">
          Rp {Math.abs(w.balance).toLocaleString('id-ID')}
        </span>
      );
    }
    if (field === 'name') {
      return (
        <input
          value={editName}
          onChange={e => setEditName(e.target.value)}
          className="bg-[#131722] border border-white/10 rounded px-1.5 py-0.5 text-xs text-gray-100 w-full"
        />
      );
    }
    return (
      <input
        type="number"
        value={editBalance}
        onChange={e => setEditBalance(e.target.value)}
        className="bg-[#131722] border border-white/10 rounded px-1.5 py-0.5 text-xs text-gray-100 text-right"
      />
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-100 flex items-center gap-1.5">
            <WalletIcon className="w-4 h-4 text-emerald-400" /> Multi-Wallet Hub
          </h2>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Kelola semua sumber dana dan instrumen pembayaranmu.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah
        </button>
      </div>

      {/* REKENING BANK */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Rekening Bank Utama</span>
        {banks.map(w => (
          <div key={w.id} className="glass-card rounded-2xl p-3 flex items-center justify-between border-l-4" style={{ borderLeftColor: w.color }}>
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                {renderIcon(w.icon, w.color)}
              </div>
              <div className="min-w-0">
                {renderEditableField(w, 'name')}
                <span className="text-[9px] text-gray-500 block">Liquid Asset</span>
              </div>
            </div>
            <div className="text-right shrink-0 ml-2">
              {renderEditableField(w, 'balance')}
            </div>
            <div className="ml-2">{renderWalletActions(w)}</div>
          </div>
        ))}
      </div>

      {/* E-WALLETS */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">E-Wallets & Siap QRIS</span>
        <div className="space-y-2">
          {ewallets.map(w => (
            <div key={w.id} className="glass-card rounded-2xl p-3 flex items-center justify-between border-l-4" style={{ borderLeftColor: w.color }}>
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  {renderIcon(w.icon, w.color)}
                </div>
                <div className="min-w-0">
                  {renderEditableField(w, 'name')}
                  <span className="text-[9px] text-gray-500 block">Saldo Aktif</span>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                {renderEditableField(w, 'balance')}
              </div>
              <div className="ml-2">{renderWalletActions(w)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PAYLATER & KARTU KREDIT */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Paylater & Kartu Kredit</span>
        {credits.map(w => {
          const used = Math.abs(w.balance);
          const limitVal = w.limit || 1;
          const percentage = Math.min(100, Math.round((used / limitVal) * 100));
          const isEditing = editingId === w.id;

          return (
            <div key={w.id} className="glass-card rounded-2xl p-3 space-y-2 border border-rose-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                    {renderIcon(w.icon, w.color)}
                  </div>
                  <div className="min-w-0">
                    {editingId === w.id ? (
                      <input value={editName} onChange={e => setEditName(e.target.value)} className="bg-[#131722] border border-white/10 rounded px-1.5 py-0.5 text-xs text-gray-100 w-full" />
                    ) : (
                      <h3 className="text-xs font-bold text-gray-200">{w.name}</h3>
                    )}
                    {!isEditing && w.dueDate && (
                      <span className="text-[8px] text-rose-400 bg-rose-500/10 px-1 rounded font-medium">Jatuh Tempo: {w.dueDate}</span>
                    )}
                    {isEditing && (
                      <input value={editDueDate} onChange={e => setEditDueDate(e.target.value)} placeholder="Contoh: 25" className="bg-[#131722] border border-white/10 rounded px-1.5 py-0.5 text-[9px] text-gray-100 mt-0.5 w-full" />
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-[9px] text-gray-500 block">Tagihan Berjalan</span>
                  {editingId === w.id ? (
                    <input type="number" value={editBalance} onChange={e => setEditBalance(e.target.value)} className="bg-[#131722] border border-white/10 rounded px-1.5 py-0.5 text-xs text-gray-100 text-right w-20" />
                  ) : (
                    <span className="text-xs font-bold text-rose-400">Rp {used.toLocaleString('id-ID')}</span>
                  )}
                </div>
                <div className="ml-2">{renderWalletActions(w)}</div>
              </div>
              {isEditing && (
                <div>
                  <label className="text-[8px] text-gray-400 block">Limit</label>
                  <input type="number" value={editLimit} onChange={e => setEditLimit(e.target.value)} className="bg-[#131722] border border-white/10 rounded px-1.5 py-0.5 text-xs text-gray-100 w-full" />
                </div>
              )}
              {!isEditing && (
                <div>
                  <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                    <span>Terpakai: {percentage}%</span>
                    <span>Limit: Rp {limitVal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${percentage > 70 ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL TAMBAH DOMPET */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xs rounded-3xl p-4 space-y-3 border border-white/10 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-100 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Tambah Dompet Baru
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-xs text-gray-400 hover:text-gray-200">x</button>
            </div>
            <form onSubmit={handleAddWallet} className="space-y-2.5 text-xs">
              <div>
                <label className="text-[9px] font-semibold text-gray-400 block mb-0.5">NAMA DOMPET</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Bank Mandiri / DANA" className="w-full bg-[#131722] border border-white/10 rounded-lg p-2 text-gray-100" required />
              </div>
              <div>
                <label className="text-[9px] font-semibold text-gray-400 block mb-0.5">TIPE DOMPET</label>
                <select value={type} onChange={e => setType(e.target.value as WalletType)} className="w-full bg-[#131722] border border-white/10 rounded-lg p-2 text-gray-100">
                  <option value="bank">Rekening Bank</option>
                  <option value="ewallet">E-Wallet / QRIS</option>
                  <option value="paylater">Paylater</option>
                  <option value="credit_card">Kartu Kredit</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-semibold text-gray-400 block mb-0.5">
                  {type === 'paylater' || type === 'credit_card' ? 'TAGIHAN SAAT INI (RP)' : 'SALDO AWAL (RP)'}
                </label>
                <input type="number" value={balance} onChange={e => setBalance(e.target.value)} placeholder="0" className="w-full bg-[#131722] border border-white/10 rounded-lg p-2 text-gray-100" required />
              </div>
              {(type === 'paylater' || type === 'credit_card') && (
                <>
                  <div>
                    <label className="text-[9px] font-semibold text-gray-400 block mb-0.5">TOTAL LIMIT (RP)</label>
                    <input type="number" value={limit} onChange={e => setLimit(e.target.value)} placeholder="10000000" className="w-full bg-[#131722] border border-white/10 rounded-lg p-2 text-gray-100" />
                  </div>
                  <div>
                    <label className="text-[9px] font-semibold text-gray-400 block mb-0.5">TANGGAL JATUH TEMPO</label>
                    <input type="text" value={dueDate} onChange={e => setDueDate(e.target.value)} placeholder="Contoh: 25 setiap bulan" className="w-full bg-[#131722] border border-white/10 rounded-lg p-2 text-gray-100" />
                  </div>
                </>
              )}
              <button type="submit" className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold rounded-lg transition-all mt-2">Simpan Dompet</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
