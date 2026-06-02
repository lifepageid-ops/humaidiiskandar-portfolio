import React, { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  AlertTriangle,
  Calendar,
  CalendarCheck,
  Clock,
  Wallet
} from 'lucide-react';

function isMatchingSubscription(title: string, budgetName: string) {
  const cleanTitle = title.toLowerCase().trim();
  const cleanBudget = budgetName.toLowerCase().trim();
  return cleanTitle.includes(cleanBudget) || cleanBudget.includes(cleanTitle);
}

export const SubscriptionsScreen: React.FC = () => {
  const { budgets, transactions, wallets } = useFinance();
  const currentMonth = new Date().toISOString().slice(0, 7);

  const subscriptionBudgets = useMemo(() => {
    return budgets.filter(b =>
      b.month === currentMonth &&
      b.type === 'expense' &&
      b.tracker === 'subscription'
    );
  }, [budgets, currentMonth]);

  const subscriptionRows = useMemo(() => {
    return subscriptionBudgets.map(budget => {
      const matchedTransactions = transactions
        .filter(tx =>
          tx.date.startsWith(currentMonth) &&
          tx.type === 'expense' &&
          tx.category === 'Subscription' &&
          isMatchingSubscription(tx.title, budget.category)
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const paidAmount = matchedTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      const latestPayment = matchedTransactions[0];
      const wallet = latestPayment ? wallets.find(w => w.id === latestPayment.walletId) : undefined;

      return {
        budget,
        paidAmount,
        latestPayment,
        wallet,
        isActive: paidAmount > 0,
        remaining: budget.planned - paidAmount,
        progress: budget.planned > 0 ? Math.min(100, Math.round((paidAmount / budget.planned) * 100)) : 0
      };
    });
  }, [subscriptionBudgets, transactions, wallets, currentMonth]);

  const activeSubscriptions = subscriptionRows.filter(row => row.isActive);
  const plannedButUnpaid = subscriptionRows.filter(row => !row.isActive);
  const totalPlanned = subscriptionRows.reduce((sum, row) => sum + row.budget.planned, 0);
  const totalPaid = activeSubscriptions.reduce((sum, row) => sum + row.paidAmount, 0);
  const overBudgetItems = activeSubscriptions.filter(row => row.paidAmount > row.budget.planned);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-base font-bold text-gray-100 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-emerald-400" /> Subscription Tracker
        </h2>
        <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
          Item di sini berasal dari Anggaran yang ditandai sebagai Subscription Tracker dan sudah dibayarkan melalui pencatatan pengeluaran.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-4 flex items-center justify-between border border-white/5">
        <div>
          <span className="text-[10px] font-medium text-gray-400 block">Subscription Sudah Berjalan</span>
          <span className="text-lg font-black text-gray-100 block mt-0.5">
            Rp {totalPaid.toLocaleString('id-ID')} <span className="text-xs font-normal text-gray-500">/ bulan ini</span>
          </span>
          <span className="text-[9px] text-gray-500">Rencana: Rp {totalPlanned.toLocaleString('id-ID')}</span>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-emerald-400 block">
            {activeSubscriptions.length} Aktif
          </span>
          <span className="text-[8px] font-medium text-gray-500 block mt-0.5">
            {plannedButUnpaid.length} belum dibayar
          </span>
        </div>
      </div>

      {subscriptionBudgets.length === 0 && (
        <div className="glass-panel rounded-2xl p-3.5 border border-sky-500/20 bg-sky-950/10 text-[10px] text-gray-300 leading-relaxed">
          <span className="font-bold text-sky-300 block mb-1">Belum ada item Subscription Tracker</span>
          Buka menu Anggaran, pilih <strong>Tambah Item Subscription Tracker</strong>, lalu isi nama layanan seperti Netflix, Spotify, ChatGPT, iCloud, atau lainnya.
        </div>
      )}

      {subscriptionBudgets.length > 0 && activeSubscriptions.length === 0 && (
        <div className="glass-panel rounded-2xl p-3.5 border border-amber-500/25 bg-amber-950/10 text-[10px] text-gray-300 leading-relaxed">
          <span className="font-bold text-amber-300 block mb-1">Belum ada subscription yang berjalan</span>
          Anda sudah punya item subscription di Anggaran, tetapi belum ada pencatatan pengeluaran kategori <strong>Subscription</strong> dengan nama yang sama/mirip. Setelah dibayar dan dicatat, item akan muncul sebagai aktif di sini.
        </div>
      )}

      {overBudgetItems.length > 0 && (
        <div className="glass-panel rounded-2xl p-3.5 border border-rose-500/30 bg-rose-950/10 space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
            <AlertTriangle className="w-4 h-4" /> Ada Subscription Melebihi Anggaran
          </div>
          <p className="text-[10px] text-gray-300 leading-relaxed">
            {overBudgetItems.length} item sudah melewati nominal yang Anda anggarkan bulan ini.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
          Subscription Aktif dari Anggaran
        </span>

        <div className="space-y-2">
          {activeSubscriptions.map(row => {
            const isOver = row.paidAmount > row.budget.planned;

            return (
              <div key={row.budget.id} className={`glass-card rounded-2xl p-3 border-l-4 hover:bg-white/5 transition-all ${isOver ? 'border-rose-400' : 'border-emerald-400'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isOver ? 'bg-rose-500/10 text-rose-300' : 'bg-emerald-500/10 text-emerald-300'}`}>
                      <CalendarCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-gray-200 line-clamp-1">{row.budget.category}</h3>
                      <div className="flex flex-wrap items-center gap-1 mt-0.5">
                        <span className="text-[8px] bg-white/5 text-gray-400 px-1 rounded">Budget: Rp {row.budget.planned.toLocaleString('id-ID')}</span>
                        <span className={`text-[8px] px-1 rounded font-medium ${isOver ? 'text-rose-400 bg-rose-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>
                          {isOver ? 'Over budget' : 'Paid'}
                        </span>
                      </div>
                      <span className="text-[8px] text-gray-500 block mt-1">
                        Bayar via: {row.wallet ? row.wallet.name : 'Dompet tidak ditemukan'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-xs font-bold block ${isOver ? 'text-rose-400' : 'text-gray-100'}`}>
                      Rp {row.paidAmount.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[8px] text-gray-500 block mt-0.5">
                      {row.latestPayment?.date.split('-').slice(1).join('/')}
                    </span>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                    <span>Progress: {row.progress}%</span>
                    <span className={row.remaining < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                      Sisa: Rp {row.remaining.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${isOver ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${row.progress}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {plannedButUnpaid.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-gray-500 block uppercase tracking-wider">
            Dianggarkan, Belum Dibayar
          </span>
          {plannedButUnpaid.map(row => (
            <div key={row.budget.id} className="glass-card rounded-xl p-2.5 flex items-center justify-between border border-white/5 opacity-80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 text-gray-400 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-300 block">{row.budget.category}</span>
                  <span className="text-[8px] text-gray-500 block">Catat pengeluaran Subscription agar aktif</span>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-400">Rp {row.budget.planned.toLocaleString('id-ID')}</span>
            </div>
          ))}
        </div>
      )}

      <div className="glass-pill rounded-xl p-3 text-[9px] text-gray-400 leading-relaxed flex items-start gap-2">
        <Wallet className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" />
        <span>
          Alur data: buat item di <strong>Anggaran</strong> sebagai Subscription Tracker, lalu catat pembayaran di menu <strong>Catat</strong> dengan kategori <strong>Subscription</strong> dan nama yang sama/mirip.
        </span>
      </div>
    </div>
  );
};