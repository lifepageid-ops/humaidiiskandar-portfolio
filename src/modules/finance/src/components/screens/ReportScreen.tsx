import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  FileDown, 
  History, 
  BarChart3, 
  CheckCircle2, 
  Sparkles,
  Loader2,
  FileText
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const ReportScreen: React.FC = () => {
  const { transactions, user, wallets, financialHealth, assets } = useFinance();
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthName = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  // Filter transactions for current month
  const monthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
  
  const formatCurrency = (val: number) => {
    return `Rp ${Math.round(val).toLocaleString('id-ID')}`;
  };

  // 1. Transaction History PDF
  const generateHistoryPdf = async () => {
    setIsGenerating('history');
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text('Humedly', 14, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(`Riwayat Transaksi - ${monthName}`, 14, 30);
    
    doc.setFontSize(10);
    doc.text(`User: ${user.name}`, 14, 38);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 44);

    // Table
    const tableData = monthTransactions.map(t => {
      const wallet = wallets.find(w => w.id === t.walletId);
      return [
        t.date,
        t.title,
        t.category,
        wallet?.name || '-',
        t.type === 'expense' ? `-${formatCurrency(t.amount)}` : `+${formatCurrency(t.amount)}`
      ];
    });

    autoTable(doc, {
      startY: 50,
      head: [['Tanggal', 'Judul', 'Kategori', 'Dompet', 'Nominal']],
      body: tableData,
      headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 255, 250] },
    });

    // Summary at bottom
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    const totalIncome = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    doc.setFontSize(12);
    doc.text(`Total Pemasukan: ${formatCurrency(totalIncome)}`, 14, finalY + 15);
    doc.setTextColor(225, 29, 72); // rose-600
    doc.text(`Total Pengeluaran: ${formatCurrency(totalExpense)}`, 14, finalY + 22);

    doc.save(`Humedly_History_${currentMonth}.pdf`);
    setIsGenerating(null);
  };

  // 2. Summary & Insight PDF
  const generateSummaryPdf = async () => {
    setIsGenerating('summary');
    const doc = new jsPDF();

    // Vibe Check Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 50, 'F');
    
    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.text('HUMEDLY SUMMARY', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(52, 211, 153); // emerald-400
    doc.text(`Vibe Check Keuangan: ${monthName}`, 105, 30, { align: 'center' });

    // Net Worth Section
    const totalAssets = assets.reduce((s, a) => s + a.currentValue, 0);
    const totalLiquid = wallets.filter(w => w.type !== 'paylater' && w.type !== 'credit_card').reduce((s, w) => s + w.balance, 0);
    const totalDebt = wallets.filter(w => w.type === 'paylater' || w.type === 'credit_card').reduce((s, w) => s + Math.abs(w.balance), 0);
    const netWorth = totalAssets + totalLiquid - totalDebt;

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text(`Halo, ${user.name.split(' ')[0]}!`, 14, 65);
    doc.setFontSize(10);
    doc.text('Ini rangkuman kondisi "harta karun" kamu bulan ini:', 14, 72);

    // Box for Net Worth
    doc.setDrawColor(200);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 78, 180, 25, 3, 3, 'FD');
    doc.setFontSize(10);
    doc.text('Estimasi Kekayaan Bersih (Net Worth):', 20, 88);
    doc.setFontSize(16);
    doc.setTextColor(16, 185, 129);
    doc.text(formatCurrency(netWorth), 20, 96);

    // Pillar Scores
    doc.setTextColor(100);
    doc.setFontSize(11);
    doc.text('Financial Health Score:', 14, 115);
    
    doc.setFontSize(28);
    doc.setTextColor(16, 185, 129);
    doc.text(`${financialHealth.overallScore}/100`, 14, 130);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    const scoreComment = financialHealth.overallScore >= 75 ? "Gokil, keuangan kamu 'Slay' banget!" : 
                       financialHealth.overallScore >= 50 ? "Lumayan lah, tapi jangan 'Ghosting' tabungan ya." :
                       "Aduh, dompet kamu lagi kena 'Mental Breakdance'.";
    doc.text(scoreComment, 14, 137);

    // Expenses Breakdown Table
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('Top Splurges (Pengeluaran Terbesar):', 14, 155);

    const expensesByCat = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc: any, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const sortedCats = Object.entries(expensesByCat)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 5);

    autoTable(doc, {
      startY: 160,
      head: [['Kategori', 'Total']],
      body: sortedCats.map(([cat, amt]: any) => [cat, formatCurrency(amt)]),
      margin: { left: 14, right: 100 },
      styles: { fontSize: 9 },
      headStyles: { fillColor: [15, 23, 42] }
    });

    // Game Plan for Next Month
    const planY = 210;
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Game Plan Bulan Depan (Tips Pro):', 14, planY);
    
    doc.setFontSize(9);
    doc.setTextColor(80);
    
    const tips = [
      `1. Kurangi pengeluaran 'Impulsive' biar gak 'FOMO' di akhir bulan.`,
      `2. Dana Darurat kamu baru cover ${financialHealth.emergencyFundMonths} bulan. Yuk gas pol lagi!`,
      `3. Rasio utang kamu di ${financialHealth.debtRatio}%. Kalo bisa di bawah 15% biar makin 'Cool'.`,
      `4. Cek lagi menu Budget Planner, ada pos yang boncos gak?`,
      `5. Inget prinsip: Nabung di awal gaji, jangan nunggu sisa 'remah-remah rengginang'.`
    ];

    tips.forEach((tip, i) => {
      doc.text(tip, 14, planY + 8 + (i * 7));
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Dibuat otomatis oleh Humedly AI Assistant', 105, 285, { align: 'center' });

    doc.save(`Humedly_Summary_${currentMonth}.pdf`);
    setIsGenerating(null);
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-base font-bold text-gray-100 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-emerald-400" /> Pusat Laporan Finansial
        </h2>
        <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
          Download data keuanganmu dalam format PDF untuk evaluasi mendalam.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        
        {/* Card 1: History */}
        <div className="glass-card rounded-3xl p-5 border border-white/5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400 shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-100">Riwayat Transaksi Lengkap</h3>
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                Berisi daftar semua transaksi (pemasukan & pengeluaran) kamu selama bulan ini dalam format tabel yang rapi.
              </p>
            </div>
          </div>
          
          <button
            onClick={generateHistoryPdf}
            disabled={isGenerating !== null}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isGenerating === 'history' ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            ) : (
              <FileDown className="w-4 h-4 text-sky-400" />
            )}
            Download Laporan History
          </button>
        </div>

        {/* Card 2: Summary */}
        <div className="glass-card rounded-3xl p-5 border border-emerald-500/20 glow-primary space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-gray-100">Summary & Insight Personal</h3>
                <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 rounded-full font-black uppercase">AI Powered</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                Rangkuman "vibe check" keuangan, total kekayaan bersih, dan strategi perbaikan untuk bulan depan dengan bahasa yang asik.
              </p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="flex items-center gap-2 text-[10px] text-emerald-300 font-bold mb-2">
              <Sparkles className="w-3 h-3" /> Termasuk di Laporan Ini:
            </div>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-2 text-[9px] text-gray-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Analisis Kekayaan Bersih (Net Worth)
              </li>
              <li className="flex items-center gap-2 text-[9px] text-gray-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Perbandingan Rencana vs Realisasi
              </li>
              <li className="flex items-center gap-2 text-[9px] text-gray-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Tips Perbaikan "Game Plan" Bulan Depan
              </li>
            </ul>
          </div>
          
          <button
            onClick={generateSummaryPdf}
            disabled={isGenerating !== null}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/20 disabled:opacity-50"
          >
            {isGenerating === 'summary' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            Generate Laporan Summary
          </button>
        </div>

      </div>

      <div className="glass-pill rounded-xl p-3 text-[9px] text-gray-500 leading-relaxed italic">
        Data laporan ini bersifat privasi dan hanya tersimpan di perangkatmu. Humedly tidak mengirimkan data transaksi ke server mana pun.
      </div>
    </div>
  );
};
