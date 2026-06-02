import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  Bot, 
  Send, 
  User
} from 'lucide-react';
import { AIChatMessage } from '../../types';

export const AIChatScreen: React.FC = () => {
  const { user, transactions, subscriptions, wallets, goals, financialHealth, budgets } = useFinance();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthTxs = transactions.filter(t => t.date.startsWith(currentMonth));
  const totalIncome = user.monthlyIncome + monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalLiquid = wallets.filter(w => w.type !== 'paylater' && w.type !== 'credit_card').reduce((s, w) => s + w.balance, 0);
  const totalDebt = wallets.filter(w => w.type === 'paylater' || w.type === 'credit_card').reduce((s, w) => s + Math.abs(w.balance), 0);
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const impulsiveCount = monthTxs.filter(t => t.isImpulsive).length;

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Halo ${user.name.split(' ')[0]}! 👋 Aku **Humedly AI**, personal financial companion kamu. Aku udah analisis semua data keuanganmu bulan ini dan siap bantu kamu *level up* finansial!`,
      timestamp: '09:30'
    },
    {
      id: 'm-2',
      sender: 'ai',
      text: `**📊 Quick Vibe Check Keuanganmu:**\n\n💰 Pemasukan bulan ini: **Rp ${totalIncome.toLocaleString('id-ID')}**\n💸 Pengeluaran: **Rp ${totalExpense.toLocaleString('id-ID')}**\n🏦 Sisa uang likuid: **Rp ${totalLiquid.toLocaleString('id-ID')}**\n💳 Tagihan paylater/CC: **Rp ${totalDebt.toLocaleString('id-ID')}**\n\nHealth Score kamu: **${financialHealth.overallScore}/100** ${financialHealth.overallScore >= 75 ? '🔥 Slay banget!' : financialHealth.overallScore >= 50 ? '💪 Lumayan, tapi bisa lebih gokil!' : '⚠️ Perlu attention nih, bro!'}`,
      timestamp: '09:31'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const formatCurrency = (val: number) => `Rp ${Math.round(val).toLocaleString('id-ID')}`;

  const appendAiResponse = (text: string, actions?: any[]) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: 'm-' + Date.now(),
          sender: 'ai',
          text,
          timestamp: new Date().toTimeString().slice(0, 5),
          suggestedActions: actions
        }
      ]);
      setIsTyping(false);
    }, 800);
  };

  const generateResponse = (userMsg: string) => {
    const lower = userMsg.toLowerCase();

    // Budget & Anggaran
    if (lower.includes('anggaran') || lower.includes('budget') || lower.includes('rencana pengeluaran')) {
      const budgetTotal = budgets.filter(b => b.month === currentMonth && b.type === 'expense').reduce((s, b) => s + b.planned, 0);
      const budgetUsed = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return `**🎯 Budget Planner Kamu Bulan Ini**\n\nTotal anggaran: **${formatCurrency(budgetTotal)}**\nTerpakai: **${formatCurrency(budgetUsed)}**\nSisa: **${formatCurrency(budgetTotal - budgetUsed)}**\n\n💡 **Tips Gen Z:** Kalo ada pos yang boncos, langsung adjust di menu Budget Planner ya! Jangan sampe *over budget* terus-terusan, nanti cashflow kamu *mental breakdance*! 😅`;
    }

    // Subscription
    if (lower.includes('langganan') || lower.includes('subscription') || lower.includes('netflix') || lower.includes('spotify')) {
      const totalSubs = subscriptions.reduce((s, sub) => s + sub.amount, 0);
      const lowUsage = subscriptions.filter(s => s.usageFrequency === 'Low');
      return `**📺 Subscription Tracker Kamu**\n\nTotal langganan aktif: **${subscriptions.length} layanan**\nTotal biaya/bulan: **${formatCurrency(totalSubs)}**\n\n${lowUsage.length > 0 ? `⚠️ **Red flag nih!** Ada ${lowUsage.length} langganan yang jarang kamu pakai. Ini *money leak* terbesar kamu! Pertimbangkan buat cancel biar uang bisa dialokasikan ke hal yang lebih produktif. Mau aku bantu batalkan?` : '✅ Semua langganan kamu masih aktif terpakai. Good job!'}`;
    }

    // Tabungan & Goals
    if (lower.includes('tabungan') || lower.includes('goals') || lower.includes('target') || lower.includes('dana darurat')) {
      const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
      const progress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
      return `**🎯 Financial Goals Kamu**\n\nTotal terkumpul: **${formatCurrency(totalSaved)}** dari target **${formatCurrency(totalTarget)}**\nProgress: **${progress}%**\n\n💡 **Prinsip Financial Management:** Dana darurat idealnya 3-6x pengeluaran bulanan. Kalo pengeluaranmu rata-rata ${formatCurrency(totalExpense)}/bulan, target dana darurat minimal **${formatCurrency(totalExpense * 3)} - ${formatCurrency(totalExpense * 6)}**. Konsisten nabung di awal bulan, bukan dari sisa akhir bulan ya! 💪`;
    }

    // Paylater & Utang
    if (lower.includes('paylater') || lower.includes('utang') || lower.includes('cicilan') || lower.includes('kartu kredit')) {
      const debtRatio = totalIncome > 0 ? Math.round((totalDebt / totalIncome) * 100) : 0;
      return `**💳 Kondisi Paylater & Utang Kamu**\n\nTotal tagihan: **${formatCurrency(totalDebt)}**\nRasio terhadap pemasukan: **${debtRatio}%**\n\n${debtRatio > 30 ? `🚨 **ALERT!** Rasio utangmu udah di atas 30% — ini zona bahaya menurut prinsip *Debt-to-Income Ratio*! Segera kurangi penggunaan paylater dan fokus lunasin yang ada.` : debtRatio > 15 ? `⚠️ Rasio utangmu ${debtRatio}%. Masih aman tapi waspada ya. Jangan sampe tembus 30%!` : `✅ Rasio utangmu ${debtRatio}%. Masih dalam zona aman! Pertahankan!`}\n\n💡 **Strategi Debt Avalanche:** Prioritaskan bayar utang dengan bunga tertinggi dulu. Ini cara paling efisien buat bebas utang!`;
    }

    // Impulsive spending
    if (lower.includes('impulsif') || lower.includes('foya') || lower.includes('boros') || lower.includes('belanja')) {
      return `**🛍️ Analisis Impulsive Spending**\n\nBulan ini kamu punya **${impulsiveCount} transaksi impulsif**. \n\n💡 **Aturan 24 Jam:** Sebelum checkout barang non-esensial, tunggu 24 jam dulu. Kalo masih pengen setelah 24 jam, baru beli. Ini bisa kurangi belanja impulsif hingga 70%! \n\nCoba fitur **Anti-Impulsive Assistant** di menu Growth untuk simulasi berapa jam kerja yang kamu butuhkan untuk beli barang itu. Mind-blowing banget! 🤯`;
    }

    // Cashflow & Sisa uang
    if (lower.includes('sisa') || lower.includes('cashflow') || lower.includes('foya-foya') || lower.includes('nongkrong')) {
      const remaining = totalIncome - totalExpense;
      const dailyRemaining = remaining / Math.max(1, 30 - new Date().getDate());
      return `**💰 Cashflow Analysis**\n\nSisa uang bulan ini: **${formatCurrency(remaining)}**\nEstimasi burn rate harian aman: **${formatCurrency(dailyRemaining)}/hari**\n\n💡 **Aturan 50/30/20 untuk Gen Z:**\n- 50% Kebutuhan pokok\n- 30% Lifestyle & fun (nongkrong, hobi, self-reward)\n- 20% Tabungan & investasi\n\nKalo sisa uangmu masih positif, kamu masih bisa *guilt-free spending* asal jangan lewat batas harian ya! 🎉`;
    }

    // Investasi
    if (lower.includes('investasi') || lower.includes('saham') || lower.includes('reksadana') || lower.includes('100 juta') || lower.includes('kaya')) {
      const monthlySaving = totalIncome * 0.2;
      const yearsTo100M = 100000000 / (monthlySaving * 12);
      return `**📈 Roadmap Investasi ala Gen Z**\n\nDengan pemasukan ${formatCurrency(totalIncome)}/bulan, kalo kamu konsisten sisihkan 20% (**${formatCurrency(monthlySaving)}/bulan**):\n\n- Dalam 1 tahun: **${formatCurrency(monthlySaving * 12)}**\n- Dalam 3 tahun: **${formatCurrency(monthlySaving * 36)}** (belum termasuk return investasi)\n- Target 100 Juta: sekitar **${Math.ceil(yearsTo100M)} tahun**\n\n💡 **Prinsip Compound Interest:** Mulai investasi sekarang, sekecil apapun. Reksadana pasar uang atau SBN cocok buat pemula. Jangan taruh semua telur di satu keranjang — diversifikasi adalah kunci! 🔑`;
    }

    // Emergency fund
    if (lower.includes('darurat') || lower.includes('emergency') || lower.includes('dana darurat')) {
      const emergencyTarget = totalExpense * 6;
      const emergencyProgress = emergencyTarget > 0 ? Math.round((totalSaved / emergencyTarget) * 100) : 0;
      return `**🛡️ Dana Darurat Kamu**\n\nTarget ideal (6x pengeluaran): **${formatCurrency(emergencyTarget)}**\nProgress saat ini: **${emergencyProgress}%**\n\n💡 **Financial Literacy 101:** Dana darurat itu BEDA dengan tabungan biasa. Ini harus liquid (mudah dicairkan) dan cukup untuk 3-6 bulan pengeluaran. Simpan di rekening terpisah atau reksadana pasar uang. Jangan dicampur dengan uang jajan! 🚫`;
    }

    // Financial health score
    if (lower.includes('skor') || lower.includes('health') || lower.includes('kesehatan') || lower.includes('nilai')) {
      return `**🏆 Financial Health Score Kamu: ${financialHealth.overallScore}/100**\n\n📊 Breakdown:\n- Rasio tabungan: **${financialHealth.savingRatio}%**\n- Skor kebiasaan belanja: **${financialHealth.spendingHabitScore}/100**\n- Dana darurat: **${financialHealth.emergencyFundMonths} bulan**\n- Rasio utang: **${financialHealth.debtRatio}%**\n- Konsistensi cashflow: **${financialHealth.cashflowConsistencyScore}/100**\n\n${financialHealth.overallScore >= 75 ? '🔥 Kamu udah di jalur yang benar! Pertahankan!' : financialHealth.overallScore >= 50 ? '💪 Masih bisa ditingkatkan. Fokus kurangi pengeluaran impulsif dan tambah tabungan!' : '⚠️ Perlu perhatian serius. Mulai dari catat semua pengeluaran dan buat budget planner ya!'}`;
    }

    // Aset & Net worth
    if (lower.includes('aset') || lower.includes('kekayaan') || lower.includes('net worth') || lower.includes('harta')) {
      return `**💎 Estimasi Kekayaan Bersih (Net Worth)**\n\nUang likuid: **${formatCurrency(totalLiquid)}**\nTagihan berjalan: **-${formatCurrency(totalDebt)}**\n\n💡 **Konsep Net Worth:** Aset - Liabilitas = Kekayaan Bersih. Fokus tingkatkan aset produktif (investasi, properti, emas) dan kurangi liabilitas konsumtif (paylater, kartu kredit). Net worth positif = kamu udah di jalur yang benar! 📈`;
    }

    // Tips umum financial management
    if (lower.includes('tips') || lower.includes('saran') || lower.includes('cara') || lower.includes('bagaimana') || lower.includes('gimana')) {
      return `**💡 Top 5 Tips Financial Management ala Gen Z:**\n\n1️⃣ **Pay Yourself First** - Nabung di awal bulan, bukan dari sisa\n2️⃣ **Aturan 50/30/20** - 50% kebutuhan, 30% lifestyle, 20% tabungan\n3️⃣ **Hindari Lifestyle Inflation** - Gaji naik ≠ boleh boros\n4️⃣ **Dana Darurat Dulu** - Sebelum investasi, pastikan dana darurat aman\n5️⃣ **Catat Semua Pengeluaran** - Apa yang tidak diukur, tidak bisa diperbaiki\n\nMau aku jelaskan lebih detail salah satu tips di atas? 🤓`;
    }

    // Default response
    return `Hmm, pertanyaan menarik! 🤔 Berdasarkan data keuanganmu:\n\n- Pemasukan bulan ini: **${formatCurrency(totalIncome)}**\n- Pengeluaran: **${formatCurrency(totalExpense)}**\n- Health Score: **${financialHealth.overallScore}/100**\n\nCoba tanya aku tentang:\n• Anggaran & budget planner\n• Cara kurangi impulsive spending\n• Tips investasi untuk pemula\n• Strategi lunasi paylater\n• Dana darurat ideal\n• Atau tips financial management lainnya!\n\nAku siap bantu kamu *level up* finansial! 💪🔥`;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = inputVal;
    setInputVal('');

    setMessages(prev => [
      ...prev,
      {
        id: 'u-' + Date.now(),
        sender: 'user',
        text: userMsg,
        timestamp: new Date().toTimeString().slice(0, 5)
      }
    ]);

    setIsTyping(true);

    setTimeout(() => {
      const reply = generateResponse(userMsg);
      appendAiResponse(reply);
    }, 1000);
  };

  const handleQuickAsk = (question: string) => {
    setInputVal(question);
  };

  const quickQuestions = [
    "Analisis cashflow & sisa uangku",
    "Tips kurangi belanja impulsif",
    "Berapa dana darurat ideal?",
    "Strategi lunasi paylater",
    "Roadmap investasi 100 juta",
    "Tips financial management Gen Z"
  ];

  return (
    <div className="p-4 flex flex-col h-[640px] justify-between">
      
      {/* Header */}
      <div className="shrink-0 mb-2">
        <h2 className="text-base font-bold text-gray-100 flex items-center gap-1.5">
          <Bot className="w-4 h-4 text-emerald-400" /> Humedly AI Assistant
        </h2>
        <p className="text-[10px] text-gray-400 mt-0.5">
          Konsultan finansial pribadi yang aktif menganalisis kebiasaanmu.
        </p>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-2 no-scrollbar">
        {messages.map(msg => {
          const isAi = msg.sender === 'ai';
          return (
            <div key={msg.id} className={`flex gap-2 animate-fadeIn ${isAi ? '' : 'flex-row-reverse'}`}>
              
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                isAi ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/10 text-gray-300'
              }`}>
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-3.5 h-3.5" />}
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] space-y-1.5 ${isAi ? '' : 'text-right'}`}>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed inline-block text-left ${
                  isAi 
                    ? 'bg-[#131722] border border-white/5 text-gray-100' 
                    : 'bg-emerald-500 text-gray-950 font-medium'
                }`}>
                  <div className="space-y-1 whitespace-pre-line">
                    {msg.text}
                  </div>
                </div>

                {/* Suggested Actions */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {msg.suggestedActions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={act.action}
                        className="text-[10px] bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-2.5 py-1 rounded-lg transition-all shadow-sm"
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[8px] text-gray-500 block px-1">
                  {msg.timestamp}
                </span>
              </div>

            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-2 items-center">
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#131722] px-3 py-2 rounded-2xl border border-white/5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="shrink-0 py-2 border-t border-white/5">
        <span className="text-[9px] text-gray-500 block mb-1">Tanya Cepat:</span>
        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleQuickAsk(q)}
              className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-300 px-2.5 py-1 rounded-full border border-white/5 shrink-0 transition-all whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <form onSubmit={handleSend} className="mt-1 flex gap-1">
          <input 
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Tanyakan insight atau tips keuangan..."
            className="flex-1 bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50"
          />
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 px-3 rounded-xl flex items-center justify-center transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
