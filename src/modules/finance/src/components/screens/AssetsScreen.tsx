import React, { useMemo, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { AssetCategory, AssetItem } from '../../types';
import {
  Building2,
  Coins,
  Gem,
  Laptop,
  Pencil,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  WalletCards,
  X
} from 'lucide-react';

type AssetFormState = Omit<AssetItem, 'id'> & { id?: string };

const assetCategories: AssetCategory[] = ['Properti', 'Emas', 'Investasi', 'Kendaraan', 'Elektronik', 'Koleksi', 'Lainnya'];

const emptyForm: AssetFormState = {
  name: '',
  category: 'Properti',
  acquisitionValue: 0,
  currentValue: 0,
  annualRate: 6,
  valuationTrend: 'appreciating',
  acquiredDate: new Date().toISOString().split('T')[0],
  notes: ''
};

function formatCurrency(value: number) {
  return `Rp ${Math.round(value).toLocaleString('id-ID')}`;
}

function projectedValue(asset: AssetItem, years = 1) {
  const rate = asset.annualRate / 100;
  const multiplier = asset.valuationTrend === 'appreciating'
    ? Math.pow(1 + rate, years)
    : Math.pow(1 - rate, years);
  return Math.max(0, asset.currentValue * multiplier);
}

function AssetIcon({ category, className = 'w-4 h-4' }: { category: AssetCategory; className?: string }) {
  if (category === 'Properti') return <Building2 className={className} />;
  if (category === 'Emas') return <Gem className={className} />;
  if (category === 'Investasi') return <TrendingUp className={className} />;
  if (category === 'Kendaraan') return <WalletCards className={className} />;
  if (category === 'Elektronik') return <Laptop className={className} />;
  return <Coins className={className} />;
}

export const AssetsScreen: React.FC = () => {
  const { assets, addAsset, updateAsset, deleteAsset, wallets } = useFinance();
  const [form, setForm] = useState<AssetFormState | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const summary = useMemo(() => {
    const totalAssetValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const totalProjected12m = assets.reduce((sum, asset) => sum + projectedValue(asset, 1), 0);
    const totalProjected5y = assets.reduce((sum, asset) => sum + projectedValue(asset, 5), 0);
    const totalLiquid = wallets
      .filter(w => w.type === 'bank' || w.type === 'cash' || w.type === 'ewallet' || w.type === 'qris')
      .reduce((sum, wallet) => sum + wallet.balance, 0);
    const totalLiability = wallets
      .filter(w => w.type === 'paylater' || w.type === 'credit_card')
      .reduce((sum, wallet) => sum + Math.abs(wallet.balance), 0);

    return {
      totalAssetValue,
      totalProjected12m,
      totalProjected5y,
      totalLiquid,
      totalLiability,
      netWorth: totalLiquid + totalAssetValue - totalLiability
    };
  }, [assets, wallets]);

  const openAddForm = () => {
    setErrorMsg('');
    setForm(emptyForm);
  };

  const openEditForm = (asset: AssetItem) => {
    setErrorMsg('');
    setForm({ ...asset });
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form) return;

    if (!form.name.trim()) {
      setErrorMsg('Nama aset wajib diisi.');
      return;
    }

    if (form.currentValue < 0 || form.acquisitionValue < 0 || form.annualRate < 0 || form.annualRate > 100) {
      setErrorMsg('Nominal dan persentase harus valid. Persentase maksimal 100%.');
      return;
    }

    const payload: Omit<AssetItem, 'id'> = {
      name: form.name.trim(),
      category: form.category,
      acquisitionValue: Number(form.acquisitionValue),
      currentValue: Number(form.currentValue),
      annualRate: Number(form.annualRate),
      valuationTrend: form.valuationTrend,
      acquiredDate: form.acquiredDate,
      notes: form.notes?.trim()
    };

    if (form.id) updateAsset(form.id, payload);
    else addAsset(payload);

    setForm(null);
    setErrorMsg('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus aset ini dari daftar kekayaan?')) {
      deleteAsset(id);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-100 flex items-center gap-1.5">
            <WalletCards className="w-4 h-4 text-emerald-400" /> Aset & Net Worth
          </h2>
          <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
            Catat tanah, emas, kendaraan, elektronik, dan aset lain untuk melihat gambaran harta kekayaanmu.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-gray-950 px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Aset
        </button>
      </div>

      <div className="glass-card rounded-3xl p-4 border border-emerald-500/20 space-y-3">
        <div>
          <span className="text-[10px] text-gray-400 block">Estimasi Kekayaan Bersih</span>
          <span className="text-2xl font-black text-white block mt-1">{formatCurrency(summary.netWorth)}</span>
          <span className="text-[9px] text-gray-500">Aset + uang likuid - tagihan berjalan</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="bg-white/5 rounded-xl p-2">
            <span className="text-gray-500 block">Total Aset</span>
            <span className="text-emerald-300 font-bold">{formatCurrency(summary.totalAssetValue)}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2">
            <span className="text-gray-500 block">Uang Likuid</span>
            <span className="text-sky-300 font-bold">{formatCurrency(summary.totalLiquid)}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2">
            <span className="text-gray-500 block">Proyeksi 12 Bulan</span>
            <span className={summary.totalProjected12m >= summary.totalAssetValue ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
              {formatCurrency(summary.totalProjected12m)}
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-2">
            <span className="text-gray-500 block">Proyeksi 5 Tahun</span>
            <span className={summary.totalProjected5y >= summary.totalAssetValue ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
              {formatCurrency(summary.totalProjected5y)}
            </span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="text-[10px] text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-xl p-2">
          {errorMsg}
        </div>
      )}

      {form && (
        <form onSubmit={handleSave} className="glass-panel rounded-2xl p-3.5 space-y-3 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-100">{form.id ? 'Edit Aset' : 'Tambah Aset Baru'}</span>
            <button type="button" onClick={() => setForm(null)} className="text-gray-500 hover:text-gray-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-gray-400 block mb-1">NAMA ASET</label>
            <input
              value={form.name}
              onChange={(e) => setForm(prev => prev ? { ...prev, name: e.target.value } : prev)}
              placeholder="Contoh: Tanah Jogja, Emas 10 gram, Mobil"
              className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-gray-400 block mb-1">KATEGORI</label>
              <select
                value={form.category}
                onChange={(e) => setForm(prev => prev ? { ...prev, category: e.target.value as AssetCategory } : prev)}
                className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100"
              >
                {assetCategories.map(category => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-400 block mb-1">TREN NILAI</label>
              <select
                value={form.valuationTrend}
                onChange={(e) => setForm(prev => prev ? { ...prev, valuationTrend: e.target.value as AssetItem['valuationTrend'] } : prev)}
                className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100"
              >
                <option value="appreciating">Naik Nilai</option>
                <option value="depreciating">Turun Nilai</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-gray-400 block mb-1">HARGA BELI (RP)</label>
              <input
                type="number"
                value={form.acquisitionValue || ''}
                onChange={(e) => setForm(prev => prev ? { ...prev, acquisitionValue: Number(e.target.value) } : prev)}
                className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-400 block mb-1">NILAI SAAT INI (RP)</label>
              <input
                type="number"
                value={form.currentValue || ''}
                onChange={(e) => setForm(prev => prev ? { ...prev, currentValue: Number(e.target.value) } : prev)}
                className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-gray-400 block mb-1">POTENSI / DEPRESIASI PER TAHUN (%)</label>
              <input
                type="number"
                value={form.annualRate}
                onChange={(e) => setForm(prev => prev ? { ...prev, annualRate: Number(e.target.value) } : prev)}
                className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-400 block mb-1">TANGGAL BELI</label>
              <input
                type="date"
                value={form.acquiredDate}
                onChange={(e) => setForm(prev => prev ? { ...prev, acquiredDate: e.target.value } : prev)}
                className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-gray-400 block mb-1">CATATAN</label>
            <input
              value={form.notes || ''}
              onChange={(e) => setForm(prev => prev ? { ...prev, notes: e.target.value } : prev)}
              placeholder="Contoh: lokasi, gramasi, sertifikat, kondisi aset"
              className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100 placeholder:text-gray-600"
            />
          </div>

          {form.currentValue > 0 && (
            <div className="bg-white/5 rounded-xl p-2 text-[10px] text-gray-400">
              Proyeksi 12 bulan: <span className={form.valuationTrend === 'appreciating' ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                {formatCurrency(projectedValue({ ...(form as AssetItem), id: form.id || 'preview' }, 1))}
              </span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs transition-all"
          >
            Simpan Aset
          </button>
        </form>
      )}

      <div className="space-y-2">
        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Daftar Aset</span>
        {assets.map(asset => {
          const nextYear = projectedValue(asset, 1);
          const fiveYears = projectedValue(asset, 5);
          const delta = nextYear - asset.currentValue;
          const isUp = delta >= 0;
          const gainSinceBuy = asset.currentValue - asset.acquisitionValue;

          return (
            <div key={asset.id} className={`glass-card rounded-2xl p-3.5 border-l-4 ${isUp ? 'border-emerald-400' : 'border-rose-400'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isUp ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
                    <AssetIcon category={asset.category} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-gray-100 line-clamp-1">{asset.name}</h3>
                    <span className="text-[9px] text-gray-500 block mt-0.5">{asset.category} - {isUp ? 'potensi naik' : 'depresiasi'} {asset.annualRate}% / tahun</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEditForm(asset)} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 flex items-center justify-center">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(asset.id)} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-rose-500/10 text-gray-400 hover:text-rose-300 flex items-center justify-center">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-white/5 rounded-xl p-2">
                  <span className="text-gray-500 block">Nilai Saat Ini</span>
                  <span className="text-gray-100 font-bold">{formatCurrency(asset.currentValue)}</span>
                </div>
                <div className="bg-white/5 rounded-xl p-2">
                  <span className="text-gray-500 block">Dari Harga Beli</span>
                  <span className={gainSinceBuy >= 0 ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                    {gainSinceBuy >= 0 ? '+' : ''}{formatCurrency(gainSinceBuy)}
                  </span>
                </div>
                <div className="bg-white/5 rounded-xl p-2">
                  <span className="text-gray-500 block">12 Bulan</span>
                  <span className={isUp ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                    {formatCurrency(nextYear)}
                  </span>
                  <span className={`block ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isUp ? <TrendingUp className="inline w-3 h-3" /> : <TrendingDown className="inline w-3 h-3" />} {delta >= 0 ? '+' : ''}{formatCurrency(delta)}
                  </span>
                </div>
                <div className="bg-white/5 rounded-xl p-2">
                  <span className="text-gray-500 block">5 Tahun</span>
                  <span className={fiveYears >= asset.currentValue ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                    {formatCurrency(fiveYears)}
                  </span>
                </div>
              </div>

              {asset.notes && <p className="text-[9px] text-gray-500 mt-2 leading-relaxed">{asset.notes}</p>}
            </div>
          );
        })}

        {assets.length === 0 && (
          <div className="glass-card rounded-2xl p-4 text-center text-xs text-gray-400">
            Belum ada aset tercatat. Tambahkan tanah, emas, kendaraan, investasi, atau aset lain yang kamu miliki.
          </div>
        )}
      </div>
    </div>
  );
};