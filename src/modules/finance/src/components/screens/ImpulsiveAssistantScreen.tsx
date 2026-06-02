import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  ShieldAlert, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { ExpenseCategory } from '../../types';

interface ImpulsiveAssistantProps {
  setActiveTab: (tab: string) => void;
}

export const ImpulsiveAssistantScreen: React.FC<ImpulsiveAssistantProps> = ({ setActiveTab }) => {
  const { user, transactions, addTransaction } = useFinance();

  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Belanja & Fashion');
  const [successMsg, setSuccessMsg] = useState('');

  const priceNum = parseFloat(itemPrice) || 0;

  // 1. Work-Hour Equivalence
  const hourlyRate = user.hourlyRate || 85000;
  const hoursNeeded = priceNum > 0 ? (priceNum / hourlyRate).toFixed(1) : '0';

  // 2. Category Tension Check
  const currentMonth = new Date().toISOString().slice(0, 7);
  const categorySpentThisMonth = transactions
    .filter(t => t.date.startsWith(currentMonth) && t.category === category && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const isCategoryHigh = categorySpentThisMonth > 1000000;

  // 3. 5-Year Investment Compound (assume 7% p.a.)
  // Formula: A = P * (1 + r)^t
  const futureValue = priceNum * Math.pow(1 + 0.07, 5);
  const passiveGain = futureValue - priceNum;

  const handleInterceptAndSave = () => {
    if (!itemName || priceNum <= 0) return;

    // We simulate saving this money by logging it as a saving transaction
    addTransaction({
      title: `Alokasi Batal Beli: ${itemName}`,
      amount: priceNum,
      type: 'expense',
      category: 'Investasi & Tabungan',
      walletId: 'w-1', // Default bank
      notes: 'Berhasil menahan hasrat impulsif! Uang dialihkan ke tabungan.'
    });

    setSuccessMsg('Keputusan sehat. Uang dialihkan ke tabungan dan kamu mendapat +100 XP.');
    
    setTimeout(() => {
      setSuccessMsg('');
      setActiveTab('home');
    }, 2500);
  };

  const handleProceedPurchase = () => {
    if (!itemName || priceNum <= 0) return;

    // Log as impulsive expense
    addTransaction({
      title: itemName,
      amount: priceNum,
      type: 'expense',
      category,
      walletId: 'w-3', // Default ewallet
      isImpulsive: true,
      mood: 'Happy',
      notes: 'Pembelian impulsif yang telah diuji asisten'
    });

    setSuccessMsg('Pembelian dicatat sebagai pengeluaran impulsif.');
    
    setTimeout(() => {
      setSuccessMsg('');
      setActiveTab('home');
    }, 2000);
  };

  return (
    <div className="p-4 space-y-4">
      
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-gray-100 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-400" /> Anti-Impulsive Assistant
        </h2>
        <p className="text-[10px] text-gray-400 mt-0.5">
          Uji hasrat belanjamu sebelum checkout. Apakah barang ini benar-benar *worth it*?
        </p>
      </div>

      {/* Input Form */}
      <div className="glass-card rounded-2xl p-3.5 space-y-3 border border-amber-500/20">
        <span className="text-[10px] font-bold text-amber-400 block uppercase tracking-wider">
          Simulasikan Barang Incaran
        </span>

        <div className="space-y-2.5 text-xs">
          <div>
            <label className="text-[9px] font-semibold text-gray-400 block mb-1">NAMA BARANG / PENGELUARAN</label>
            <input 
              type="text"
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              placeholder="Contoh: Sepatu Compass / Tiket Konser"
              className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="text-[9px] font-semibold text-gray-400 block mb-1">HARGA BARANG (RP)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">Rp</span>
              <input 
                type="number"
                value={itemPrice}
                onChange={e => setItemPrice(e.target.value)}
                placeholder="1500000"
                className="w-full bg-[#131722] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-[9px] font-semibold text-gray-400 block mb-1">KATEGORI</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as ExpenseCategory)}
              className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-gray-100 focus:outline-none focus:border-amber-500/50"
            >
              <option value="Belanja & Fashion">Belanja & Fashion</option>
              <option value="Nongkrong & Hiburan">Nongkrong & Hiburan</option>
              <option value="Makan & Minum">Makan & Minum</option>
              <option value="Gadget">Gadget & Elektronik</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="pt-1 flex flex-wrap gap-1">
          <span className="text-[8px] text-gray-500 self-center mr-1">Cepat:</span>
          {[
            { name: 'Sepatu Baru', price: '850000', cat: 'Belanja & Fashion' },
            { name: 'Kopi Kekinian', price: '45000', cat: 'Nongkrong & Hiburan' },
            { name: 'Upgrade HP', price: '12000000', cat: 'Gadget' },
            { name: 'Staycation', price: '1500000', cat: 'Nongkrong & Hiburan' }
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setItemName(preset.name);
                setItemPrice(preset.price);
                setCategory(preset.cat as ExpenseCategory);
              }}
              className="text-[9px] bg-white/5 hover:bg-white/10 text-gray-300 px-2 py-0.5 rounded-md border border-white/5 transition-all"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-2.5 rounded-xl text-xs flex items-center gap-1.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span className="leading-relaxed">{successMsg}</span>
        </div>
      )}

      {/* REAL-TIME INSIGHTS OUTPUT */}
      {priceNum > 0 && itemName && (
        <div className="space-y-2.5 animate-fadeIn">
          <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
            Hasil Analisis & Uji Kelayakan
          </span>

          {/* Insight 1: Work Hours */}
          <div className="glass-card rounded-2xl p-3 border-l-4 border-amber-500 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-semibold text-amber-400 block uppercase">
                Konversi Waktu Kerja
              </span>
              <h4 className="text-xs font-bold text-gray-100 mt-0.5">
                Setara dengan <span className="text-amber-400 font-extrabold">{hoursNeeded} Jam Kerja</span>
              </h4>
              <p className="text-[9px] text-gray-400 mt-0.5 leading-relaxed">
                Dengan tarif waktumu <strong className="text-gray-300">Rp {hourlyRate.toLocaleString('id-ID')} / jam</strong>, kamu harus bekerja selama {hoursNeeded} jam untuk membayar barang ini. Apakah sepadan dengan usahamu?
              </p>
            </div>
          </div>

          {/* Insight 2: Category Tension */}
          <div className={`glass-card rounded-2xl p-3 border-l-4 flex items-start gap-2.5 ${
            isCategoryHigh ? 'border-rose-500' : 'border-sky-500'
          }`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              isCategoryHigh ? 'bg-rose-500/10 text-rose-400' : 'bg-sky-500/10 text-sky-400'
            }`}>
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <span className={`text-[9px] font-semibold block uppercase ${
                isCategoryHigh ? 'text-rose-400' : 'text-sky-400'
              }`}>
                Kapasitas Kategori: {category}
              </span>
              
              <h4 className="text-xs font-bold text-gray-100 mt-0.5">
                {isCategoryHigh ? 'Pengeluaran Kategori Ini Sudah Tinggi' : 'Anggaran Kategori Masih Aman'}
              </h4>

              <p className="text-[9px] text-gray-400 mt-0.5 leading-relaxed">
                Bulan ini kamu sudah menghabiskan <strong className="text-gray-300">Rp {categorySpentThisMonth.toLocaleString('id-ID')}</strong> untuk {category}. 
                {isCategoryHigh 
                  ? ' Menambah pengeluaran ini akan membuat pos ini makin bengkak!' 
                  : ' Masih ada ruang, namun tetap pertimbangkan urgensinya.'}
              </p>
            </div>
          </div>

          {/* Insight 3: Opportunity Cost */}
          <div className="glass-card rounded-2xl p-3 border-l-4 border-emerald-500 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-semibold text-emerald-400 block uppercase">
                Peluang Investasi 5 Tahun
              </span>
              
              <h4 className="text-xs font-bold text-gray-100 mt-0.5">
                Bisa bertumbuh menjadi <span className="text-emerald-400 font-extrabold">Rp {Math.round(futureValue).toLocaleString('id-ID')}</span>
              </h4>

              <p className="text-[9px] text-gray-400 mt-0.5 leading-relaxed">
                Jika uang <strong className="text-gray-300">Rp {priceNum.toLocaleString('id-ID')}</strong> ini kamu investasikan ke instrumen reksadana atau SBN dengan imbal hasil santai 7% p.a., kamu akan mendapatkan <strong className="text-emerald-400">keuntungan pasif Rp {Math.round(passiveGain).toLocaleString('id-ID')}</strong> tanpa perlu bekerja!
              </p>
            </div>
          </div>

          {/* Interception Action Choices */}
          <div className="pt-2 space-y-2">
            <span className="text-[9px] font-bold text-gray-400 block text-center">
              TENTUKAN KEPUTUSANMU SEKARANG:
            </span>

            <button
              type="button"
              onClick={handleInterceptAndSave}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-gray-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1 scale-102"
            >
              <Sparkles className="w-4 h-4 fill-gray-950" /> Batal Beli & Tabung Uangnya (+100 XP)
            </button>

            <button
              type="button"
              onClick={handleProceedPurchase}
              className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 font-semibold rounded-xl text-xs transition-all border border-white/5 flex items-center justify-center gap-1"
            >
              Tetap Beli (Catat sbg Impulsif) <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
