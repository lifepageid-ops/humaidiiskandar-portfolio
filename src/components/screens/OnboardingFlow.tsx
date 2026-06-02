import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Wallet, 
  ShieldAlert 
} from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { updateUserProfile } = useFinance();

  const [step, setStep] = useState(1);
  
  // Step 1 State
  const [name, setName] = useState('Kevin');
  const [income, setIncome] = useState('13500000');
  
  // Step 2 State
  const [selectedWallets, setSelectedWallets] = useState<string[]>(['Bank Jago', 'BCA', 'GoPay', 'SPayLater']);

  // Step 3 State
  const [primaryEnemy, setPrimaryEnemy] = useState<string>('Duit habis tiba-tiba');

  const availableWallets = [
    { name: 'Bank Jago', type: 'Bank' },
    { name: 'BCA', type: 'Bank' },
    { name: 'GoPay', type: 'E-Wallet' },
    { name: 'OVO', type: 'E-Wallet' },
    { name: 'ShopeePay', type: 'E-Wallet' },
    { name: 'SPayLater', type: 'Paylater' },
    { name: 'Jenius', type: 'Credit Card' }
  ];

  const enemies = [
    { id: 'habis', title: 'Duit Habis Tiba-Tiba', desc: 'Gaji numpang lewat tanpa jejak yang jelas.' },
    { id: 'paylater', title: 'Kecanduan Paylater', desc: 'Sering tergoda checkout cicilan barang konsumtif.' },
    { id: 'subs', title: 'Langganan Siluman', desc: 'Banyak bayar subscription tapi jarang dipakai.' },
    { id: 'nabung', title: 'Susah Konsisten Nabung', desc: 'Selalu menunda alokasi dana darurat.' }
  ];

  const toggleWallet = (wName: string) => {
    setSelectedWallets(prev => 
      prev.includes(wName) ? prev.filter(w => w !== wName) : [...prev, wName]
    );
  };

  const handleFinish = () => {
    const incNum = parseFloat(income) || 10000000;
    // Estimate hourly rate: roughly income / 160 hours
    const hrRate = Math.round(incNum / 160);

    updateUserProfile({
      name: name + ' Pratama',
      monthlyIncome: incNum,
      hourlyRate: hrRate
    });

    onComplete();
  };

  return (
    <div className="absolute inset-0 bg-[#111827] z-50 flex flex-col justify-between p-6 animate-fadeIn">
      
      {/* Top Progress Indicators */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-emerald-400">Langkah {step} dari 3</span>
          <button 
            onClick={onComplete}
            className="text-[10px] text-gray-500 hover:text-gray-300"
          >
            Lewati
          </button>
        </div>

        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden flex gap-1">
          <div className={`h-full flex-1 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-gray-800'}`}></div>
          <div className={`h-full flex-1 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-800'}`}></div>
          <div className={`h-full flex-1 rounded-full ${step >= 3 ? 'bg-emerald-500' : 'bg-gray-800'}`}></div>
        </div>
      </div>

      {/* STEP 1: PROFIL & INCOME */}
      {step === 1 && (
        <div className="space-y-6 my-auto">
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Kenalan Dulu Yuk!</h2>
            <p className="text-xs text-gray-400">
              Bantu Humedly menyesuaikan simulasi burn rate dan asisten AI personalmu.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">
                Nama Panggilan
              </label>
              <input 
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Contoh: Kevin"
                className="w-full bg-[#131722] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-100 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">
                Pemasukan Bersih per Bulan (Rp)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">Rp</span>
                <input 
                  type="number"
                  value={income}
                  onChange={e => setIncome(e.target.value)}
                  placeholder="10000000"
                  className="w-full bg-[#131722] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-100 font-black focus:outline-none focus:border-emerald-500"
                />
              </div>
              <span className="text-[9px] text-gray-500 block mt-1">
                Digunakan untuk menghitung nilai waktu kerja dan batas aman guilt-free spending.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black rounded-xl text-xs flex items-center justify-center gap-1 transition-all shadow-lg shadow-emerald-500/20"
          >
            Lanjutkan <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: PILIH WALLET */}
      {step === 2 && (
        <div className="space-y-6 my-auto">
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400 mb-2">
              <Wallet className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Hubungkan Ekosistemmu</h2>
            <p className="text-xs text-gray-400">
              Pilih e-wallet, bank, atau paylater yang paling aktif kamu gunakan sehari-hari.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
            {availableWallets.map(w => {
              const isSelected = selectedWallets.includes(w.name);
              return (
                <button
                  key={w.name}
                  type="button"
                  onClick={() => toggleWallet(w.name)}
                  className={`p-3 rounded-xl text-left transition-all border flex flex-col justify-between h-20 ${
                    isSelected 
                      ? 'bg-sky-500/10 border-sky-500/50 text-white ring-1 ring-sky-500/20' 
                      : 'bg-[#131722] border-white/5 text-gray-400 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-bold block text-gray-200">{w.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />}
                  </div>
                  <span className="text-[9px] text-gray-500 block">{w.type}</span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl text-xs transition-all"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-2/3 py-3.5 bg-sky-500 hover:bg-sky-400 text-gray-950 font-black rounded-xl text-xs flex items-center justify-center gap-1 transition-all shadow-lg shadow-sky-500/20"
            >
              Lanjutkan <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: MUSUH TERBESAR */}
      {step === 3 && (
        <div className="space-y-6 my-auto">
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Apa Musuh Terbesarmu?</h2>
            <p className="text-xs text-gray-400">
              Pilih satu kebiasaan yang paling ingin kamu perbaiki bersama Humedly.
            </p>
          </div>

          <div className="space-y-2.5">
            {enemies.map(e => {
              const isSelected = primaryEnemy === e.title;
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setPrimaryEnemy(e.title)}
                  className={`w-full p-3.5 rounded-xl text-left transition-all border flex items-start gap-3 ${
                    isSelected 
                      ? 'bg-amber-500/10 border-amber-500/50 text-white ring-1 ring-amber-500/20' 
                      : 'bg-[#131722] border-white/5 text-gray-400 hover:border-white/10'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'border-amber-400 bg-amber-400' : 'border-gray-600'
                  }`}>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-gray-950"></span>}
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-gray-200">{e.title}</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5 leading-relaxed">{e.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-1/3 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl text-xs transition-all"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className="w-2/3 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-gray-950 font-black rounded-xl text-xs flex items-center justify-center gap-1 transition-all shadow-lg shadow-emerald-500/20"
            >
              Mulai Eksplorasi
            </button>
          </div>
        </div>
      )}

      {/* Bottom Legal */}
      <div className="text-center pb-2">
        <span className="text-[8px] text-gray-600 block">
          Terlindungi Enkripsi Lokal - Tanpa Iklan
        </span>
      </div>

    </div>
  );
};
