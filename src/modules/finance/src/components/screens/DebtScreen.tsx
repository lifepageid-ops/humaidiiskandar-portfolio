import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CreditCard, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

export const DebtScreen: React.FC = () => {
  const { wallets, user } = useFinance();

  const creditWallets = wallets.filter(w => w.type === 'paylater' || w.type === 'credit_card');
  const totalOutstanding = creditWallets.reduce((sum, w) => sum + Math.abs(w.balance), 0);
  const totalLimit = creditWallets.reduce((sum, w) => sum + (w.limit || 0), 0);
  const debtRatio = user.monthlyIncome > 0 ? Math.round((totalOutstanding / user.monthlyIncome) * 100) : 0;
  const limitUsageRatio = totalLimit > 0 ? Math.round((totalOutstanding / totalLimit) * 100) : 0;

  const isHighRatio = debtRatio > 30;
  const isWarningRatio = debtRatio >= 20 && debtRatio <= 30;

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-base font-bold text-gray-100 flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-rose-400" /> Paylater & Debt Health
        </h2>
        <p className="text-[10px] text-gray-400 mt-0.5">
          Data tagihan diambil langsung dari Dompet tipe Paylater dan Kartu Kredit.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-4 relative overflow-hidden border border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-medium text-gray-400 block">Rasio Tagihan vs Pendapatan</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-2xl font-black ${isHighRatio ? 'text-rose-400' : isWarningRatio ? 'text-amber-400' : 'text-emerald-400'}`}>
                {debtRatio}%
              </span>
              <span className="text-[10px] text-gray-500">dari pemasukan</span>
            </div>
          </div>

          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
            isHighRatio ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
            isWarningRatio ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {isHighRatio ? 'Risiko Tinggi' : isWarningRatio ? 'Mendekati Batas' : 'Kondisi Aman'}
          </span>
        </div>

        <div className="mt-3">
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${isHighRatio ? 'bg-rose-500' : isWarningRatio ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, debtRatio * 2.5)}%` }}
            />
          </div>
          <div className="flex justify-between text-[8px] text-gray-500 mt-1">
            <span>0% Ideal</span>
            <span>20% Waspada</span>
            <span>30% Batas Maksimal</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[9px] text-gray-400 block">Total Tagihan Dompet</span>
            <span className="font-bold text-gray-200">Rp {totalOutstanding.toLocaleString('id-ID')}</span>
          </div>
          <div>
            <span className="text-[9px] text-gray-400 block">Pemakaian Limit</span>
            <span className="font-bold text-rose-400">{limitUsageRatio}%</span>
          </div>
        </div>
      </div>

      {isHighRatio ? (
        <div className="glass-panel rounded-2xl p-3.5 border border-rose-500/30 bg-rose-950/10 space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
            <AlertTriangle className="w-4 h-4" /> Warning: Tagihan Terlalu Tinggi
          </div>
          <p className="text-[10px] text-gray-300 leading-relaxed">
            Total tagihan Paylater/Kartu Kredit dari Dompet sudah melewati 30% pemasukan. Hindari menambah cicilan baru sampai tagihan turun.
          </p>
        </div>
      ) : isWarningRatio ? (
        <div className="glass-panel rounded-2xl p-3.5 border border-amber-500/30 bg-amber-950/10 space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Info className="w-4 h-4" /> Perhatian: Mendekati Batas
          </div>
          <p className="text-[10px] text-gray-300 leading-relaxed">
            Rasio tagihan berada di {debtRatio}%. Jaga agar tidak melewati 30% dari pemasukan bulanan.
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-3.5 border border-emerald-500/20 bg-emerald-950/10 space-y-1 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-300">Debt Health Aman</h4>
            <p className="text-[9px] text-gray-400">Tagihan dari Dompet masih terkendali terhadap pemasukanmu.</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
          Paylater & Kartu Kredit dari Dompet
        </span>

        <div className="space-y-2">
          {creditWallets.map(wallet => {
            const used = Math.abs(wallet.balance);
            const limit = wallet.limit || 0;
            const usage = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

            return (
              <div key={wallet.id} className="glass-card rounded-2xl p-3.5 space-y-3 border border-white/5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${wallet.type === 'paylater' ? 'text-amber-400 bg-amber-500/10' : 'text-sky-400 bg-sky-500/10'}`}>
                      {wallet.type === 'paylater' ? 'Paylater' : 'Kartu Kredit'}
                    </span>
                    <h3 className="text-xs font-bold text-gray-100 mt-1">{wallet.name}</h3>
                    <span className="text-[9px] text-gray-400 block mt-0.5">
                      Jatuh tempo: {wallet.dueDate || 'Belum diatur'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-gray-500 block">Tagihan berjalan</span>
                    <span className="text-xs font-bold text-rose-400 block">Rp {used.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                    <span>Terpakai: {usage}%</span>
                    <span>Limit: Rp {limit.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${usage > 70 ? 'bg-rose-500' : usage > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${usage}%` }} />
                  </div>
                </div>
              </div>
            );
          })}

          {creditWallets.length === 0 && (
            <div className="glass-card rounded-2xl p-4 text-center text-xs text-gray-400">
              Belum ada Paylater atau Kartu Kredit di Dompet. Tambahkan dari menu Dompet agar muncul di sini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};