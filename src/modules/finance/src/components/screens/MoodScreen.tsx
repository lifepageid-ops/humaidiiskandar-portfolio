import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  Smile, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { MoodType } from '../../types';
import { getMoodMeta, moodOptions } from '../../utils/mood';

export const MoodScreen: React.FC = () => {
  const { moodLogs, addMoodLog } = useFinance();
  const [selectedMood, setSelectedMood] = useState<MoodType>('Happy');
  const [note, setNote] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const moodsList: MoodType[] = moodOptions.map((mood) => mood.value);

  // Calculate Average Spent per Mood
  const moodStats = moodsList.map(m => {
    const logs = moodLogs.filter(log => log.mood === m);
    const total = logs.reduce((sum, l) => sum + l.totalSpent, 0);
    const avg = logs.length > 0 ? total / logs.length : 0;
    return {
      mood: m,
      count: logs.length,
      avgSpent: avg
    };
  });

  // Find the highest triggering mood
  const sortedStats = [...moodStats].sort((a, b) => b.avgSpent - a.avgSpent);
  const highestTrigger = sortedStats[0];

  const handleLogMood = (e: React.FormEvent) => {
    e.preventDefault();
    addMoodLog(selectedMood, note);
    setSuccessMsg('Mood hari ini berhasil dicatat. Data korelasi diperbarui.');
    setNote('');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  return (
    <div className="p-4 space-y-4">
      
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-gray-100 flex items-center gap-1.5">
          <Smile className="w-4 h-4 text-sky-400" /> Mood & Spending Lab
        </h2>
        <p className="text-[10px] text-gray-400 mt-0.5">
          Pahami bagaimana emosimu memicu keputusan belanja harian.
        </p>
      </div>

      {/* Primary Correlation Insight */}
      {highestTrigger && highestTrigger.avgSpent > 0 && (
        <div className="glass-card rounded-3xl p-4 border border-sky-500/20 glow-accent relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-xl"></div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Temuan Korelasi Utama
          </div>

          <div className="mt-2.5">
            <h3 className="text-xs font-bold text-gray-100 leading-relaxed">
              Kamu menghabiskan paling banyak uang saat merasa <span className="text-sky-400 font-extrabold">{getMoodMeta(highestTrigger.mood).label}</span>.
            </h3>
            
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">
                Rp {Math.round(highestTrigger.avgSpent).toLocaleString('id-ID')}
              </span>
              <span className="text-[9px] text-gray-400">rata-rata per hari</span>
            </div>

            <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
              {highestTrigger.mood.includes('Stressed') ? (
                'Hati-hati dengan fenomena "Retail Therapy". Saat stres, otak cenderung mencari dopamin instan lewat checkout keranjang belanja. Coba alihkan ke olahraga atau istirahat.'
              ) : highestTrigger.mood.includes('Social') ? (
                'FOMO dan tekanan pergaulan adalah pemicu utamamu. Tidak masalah nongkrong, namun tetapkan budget harian khusus agar tidak bablas.'
              ) : highestTrigger.mood.includes('Happy') ? (
                'Saat suasana hati sedang bagus, kamu cenderung merasa terlalu optimis dan royal mentraktir orang lain. Tetap kontrol batas wajar.'
              ) : (
                'Emosi harianmu cukup stabil, namun tetap pantau agar pengeluaran tidak terjadi secara tidak sadar.'
              )}
            </p>
          </div>
        </div>
      )}

      {/* Log Today's Mood Form */}
      <div className="glass-card rounded-2xl p-3.5 space-y-3 border border-white/5">
        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
          Catat Suasana Hati Hari Ini
        </span>

        <form onSubmit={handleLogMood} className="space-y-2.5">
          
          <div className="grid grid-cols-5 gap-1.5">
            {moodsList.map((m) => {
              const meta = getMoodMeta(m);
              const Icon = meta.Icon;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMood(m)}
                  className={`py-2.5 px-1 rounded-2xl text-center transition-all border ${
                    selectedMood === m 
                      ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 scale-105' 
                      : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-10 h-10 mx-auto" />
                  <span className="text-[9px] block mt-1 font-semibold">{meta.label}</span>
                </button>
              );
            })}
          </div>

          <div>
            <input 
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Catatan pemicu (opsional)..."
              className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-100 placeholder:text-gray-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-gray-950 font-bold rounded-xl text-xs transition-all"
          >
            Simpan & Analisis
          </button>

        </form>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-2.5 rounded-xl text-xs flex items-center gap-1.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span className="leading-relaxed">{successMsg}</span>
        </div>
      )}

      {/* Breakdown per Mood */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
          Rata-Rata Pengeluaran per Emosi
        </span>

        <div className="space-y-1.5">
          {sortedStats.map(stat => {
            const meta = getMoodMeta(stat.mood);
            const Icon = meta.Icon;
            return (
            <div key={stat.mood} className="glass-card rounded-xl p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-10 h-10 rounded-xl border flex items-center justify-center ${meta.tone}`}>
                  <Icon className="w-9 h-9" />
                </span>
                <div>
                  <span className="font-semibold text-gray-200 block">{meta.label}</span>
                  <span className="text-[8px] text-gray-500 block">{stat.count} kali tercatat</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-gray-100 block">
                  Rp {Math.round(stat.avgSpent).toLocaleString('id-ID')}
                </span>
                <span className="text-[8px] text-gray-500 block">rata-rata</span>
              </div>
            </div>
          );})}
        </div>
      </div>

      {/* Weekly History Summary */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
          Riwayat 7 Hari Terakhir
        </span>

        <div className="space-y-1">
          {moodLogs.map((log, idx) => {
            const meta = getMoodMeta(log.mood);
            const Icon = meta.Icon;
            return (
            <div key={idx} className="bg-white/5 p-2 rounded-lg flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-12 text-gray-400 font-medium">{log.date}</span>
                <span className="text-gray-200 font-bold flex items-center gap-1.5">
                  <Icon className="w-6 h-6" /> {meta.label}
                </span>
              </div>

              <div className="text-right">
                <span className="text-rose-400 font-medium">
                  Rp {log.totalSpent.toLocaleString('id-ID')}
                </span>
                {log.note && (
                  <span className="text-[8px] text-gray-500 block line-clamp-1 max-w-[120px]">
                    "{log.note}"
                  </span>
                )}
              </div>
            </div>
          );})}
        </div>
      </div>

    </div>
  );
};
