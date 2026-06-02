import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  TrendingUp, 
  AlertTriangle
} from 'lucide-react';

export const ForecastScreen: React.FC = () => {
  const { user, transactions, subscriptions, wallets } = useFinance();

  // Income
  const income = user.monthlyIncome;

  // Fixed Costs
  const fixedSubs = subscriptions.reduce((sum, s) => sum + s.amount, 0);
  const creditWallets = wallets.filter(w => w.type === 'paylater' || w.type === 'credit_card');
  const fixedDebts = creditWallets.reduce((sum, w) => sum + Math.abs(w.balance), 0);
  const totalFixed = fixedSubs + fixedDebts;

  // Current variable spent this month
  const currentMonth = new Date().toISOString().slice(0, 7);
  const variableSpent = transactions
    .filter(t => t.date.startsWith(currentMonth) && t.type === 'expense' && t.category !== 'Subscription' && t.category !== 'Cicilan & Paylater')
    .reduce((sum, t) => sum + t.amount, 0);

  // Estimate remaining days in the month
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const currentDay = today.getDate();
  const remainingDays = lastDay - currentDay;

  // Estimate average daily burn rate so far
  const dailyBurnRate = currentDay > 0 ? variableSpent / currentDay : 0;
  
  // Forecasted variable total for the whole month
  const forecastedVariable = variableSpent + (dailyBurnRate * remainingDays);

  // Projected End of Month remaining
  const projectedRemaining = income - totalFixed - forecastedVariable;
  const isTekor = projectedRemaining < 1000000;
  const isSevereTekor = projectedRemaining < 0;

  return (
    <div className="p-4 space-y-4">
      
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-gray-100 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-sky-400" /> Cashflow Forecast
        </h2>
        <p className="text-[10px] text-gray-400 mt-0.5">
          Prediksi sisa uang akhir bulan & deteksi dini potensi tekor.
        </p>
      </div>

      {/* Main Projected Reserve Card */}
      <div className={`glass-card rounded-3xl p-5 relative overflow-hidden border ${
        isSevereTekor ? 'border-rose-500/30' : isTekor ? 'border-amber-500/30' : 'border-sky-500/20'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-gray-400 block">
            Estimasi Sisa Uang Akhir Bulan
          </span>
          
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
            isSevereTekor ? 'bg-rose-500/10 text-rose-400' :
            isTekor ? 'bg-amber-500/10 text-amber-400' :
            'bg-emerald-500/10 text-emerald-400'
          }`}>
            {isSevereTekor ? 'Defisit / Minus' : isTekor ? 'Potensi Tekor' : 'Surplus Aman'}
          </span>
        </div>

        <div className="mt-2">
          <h3 className={`text-3xl font-black tracking-tight ${
            isSevereTekor ? 'text-rose-400' : isTekor ? 'text-amber-400' : 'text-sky-400'
          }`}>
            Rp {Math.round(projectedRemaining).toLocaleString('id-ID')}
          </h3>
          <p className="text-[10px] text-gray-400 mt-1">
            Berdasarkan tren pengeluaran harianmu saat ini.
          </p>
        </div>

        {/* Custom Mini Visual Burn Rate Chart */}
        <div className="mt-4 pt-3 border-t border-white/5 space-y-1">
          <div className="flex justify-between text-[9px] text-gray-400">
            <span>Awal Bln (Rp {income.toLocaleString('id-ID')})</span>
            <span>Hari ke-{currentDay}</span>
            <span>Akhir Bln</span>
          </div>

          <div className="h-12 w-full flex items-end gap-1 pt-2">
            {/* Generate 10 simulated columns representing the month's slope */}
            {Array.from({ length: 10 }).map((_, i) => {
              const fraction = i / 9;
              // linear slope from 100% to projected fraction
              const startVal = income;
              const endVal = projectedRemaining;
              const currentVal = startVal - (startVal - endVal) * fraction;
              const heightPercent = income > 0 ? Math.max(10, Math.min(100, (currentVal / income) * 100)) : 10;

              // check if current col is past today
              const isFuture = fraction > (currentDay / lastDay);

              return (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-sm transition-all ${
                    isFuture 
                      ? 'bg-sky-500/20 border-t border-sky-500/40' 
                      : 'bg-emerald-500/40'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Warning Module */}
      {isSevereTekor ? (
        <div className="glass-panel rounded-2xl p-3.5 border border-rose-500/30 bg-rose-950/10 space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
            <AlertTriangle className="w-4 h-4" /> Peringatan Darurat: Defisit Terdeteksi
          </div>
          <p className="text-[10px] text-gray-300 leading-relaxed">
            Proyeksi akhir bulanmu menunjukkan angka minus. Beban tetap dan tren pengeluaran harianmu saat ini melampaui total pemasukan! Segera rem pengeluaran sekunder.
          </p>
        </div>
      ) : isTekor ? (
        <div className="glass-panel rounded-2xl p-3.5 border border-amber-500/30 bg-amber-950/10 space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <AlertTriangle className="w-4 h-4" /> Warning: Sisa Uang Menipis
          </div>
          <p className="text-[10px] text-gray-300 leading-relaxed">
            Sisa uangmu diproyeksikan di bawah Rp 1 Juta. Jika ada pengeluaran mendadak, kamu berisiko terpaksa menggunakan paylater atau mencairkan dana darurat.
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-3.5 border border-emerald-500/20 bg-emerald-950/10 space-y-1">
          <h4 className="text-xs font-bold text-emerald-300">Tren Cashflow Sangat Terjaga</h4>
          <p className="text-[9px] text-gray-400">
            Kamu berada di jalur yang tepat untuk mencetak surplus. Sisa dana ini bisa kamu alokasikan ke Reksadana pada akhir bulan!
          </p>
        </div>
      )}

      {/* Breakout: Fixed vs Variable */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
          Struktur Estimasi Pengeluaran
        </span>

        {/* Fixed Overheads */}
        <div className="glass-card rounded-2xl p-3 space-y-2 border-l-4 border-sky-400">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-gray-200">Pengeluaran Rutin Tetap</span>
            <span className="font-extrabold text-sky-400">Rp {totalFixed.toLocaleString('id-ID')}</span>
          </div>

          <div className="space-y-1 text-[10px] text-gray-400">
            <div className="flex justify-between">
              <span>- Total Langganan Bulanan</span>
              <span>Rp {fixedSubs.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>- Tagihan Paylater / Kartu dari Dompet</span>
              <span>Rp {fixedDebts.toLocaleString('id-ID')}</span>
            </div>
            {creditWallets.length > 0 && creditWallets.map(wallet => (
              <div key={wallet.id} className="flex justify-between text-[9px] text-gray-500 pl-2">
                <span>{wallet.name}</span>
                <span>Rp {Math.abs(wallet.balance).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Variable Lifestyle */}
        <div className="glass-card rounded-2xl p-3 space-y-2 border-l-4 border-amber-500">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-gray-200">Estimasi Kebutuhan & Gaya Hidup</span>
            <span className="font-extrabold text-amber-400">Rp {Math.round(forecastedVariable).toLocaleString('id-ID')}</span>
          </div>

          <div className="space-y-1 text-[10px] text-gray-400">
            <div className="flex justify-between">
              <span>- Terpakai Hingga Hari Ini</span>
              <span>Rp {variableSpent.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>- Rata-rata Burn Rate Harian</span>
              <span>Rp {Math.round(dailyBurnRate).toLocaleString('id-ID')} / hr</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>- Proyeksi {remainingDays} Hari Kedepan</span>
              <span>+ Rp {Math.round(dailyBurnRate * remainingDays).toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
