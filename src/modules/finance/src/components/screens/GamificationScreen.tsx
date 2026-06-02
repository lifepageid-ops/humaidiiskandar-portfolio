import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  Flame, 
  Award, 
  ShieldAlert, 
  Scissors, 
  CheckCircle2, 
  Zap,
  Trophy,
  Lock
} from 'lucide-react';

export const GamificationScreen: React.FC = () => {
  const { gamification } = useFinance();

  const xpPercentage = Math.min(100, Math.round((gamification.xp / gamification.nextLevelXp) * 100));

  const renderIcon = (iconName: string) => {
    const props = { className: "w-5 h-5 text-amber-400" };
    switch (iconName) {
      case 'Award': return <Award {...props} />;
      case 'ShieldAlert': return <ShieldAlert {...props} />;
      case 'Scissors': return <Scissors {...props} />;
      case 'CheckCircle2': return <CheckCircle2 {...props} className="text-emerald-400" />;
      default: return <Trophy {...props} />;
    }
  };

  return (
    <div className="p-4 space-y-4">
      
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-gray-100 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-400" /> Financial Progress & XP
        </h2>
        <p className="text-[10px] text-gray-400 mt-0.5">
          Tingkatkan level finansialmu melalui kebiasaan baik harian.
        </p>
      </div>

      {/* Main Level & XP Card */}
      <div className="glass-card rounded-3xl p-5 relative overflow-hidden border border-amber-500/20 glow-accent">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>

        <div className="flex items-center gap-3">
          {/* Level Badge */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex flex-col items-center justify-center text-gray-950 font-black tracking-tight shadow-md shrink-0">
            <span className="text-[9px] uppercase tracking-widest block opacity-80">LEVEL</span>
            <span className="text-2xl leading-none">{gamification.level}</span>
          </div>

          <div className="flex-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Gelar Saat Ini
            </span>
            <h3 className="text-base font-black text-white">
              {gamification.level >= 5 ? 'Master Cashflow' :
               gamification.level >= 3 ? 'Sobat Cashflow' :
               'Pemula Adulthood'}
            </h3>
            <span className="text-[10px] text-gray-400 block mt-0.5">
              {gamification.nextLevelXp - gamification.xp} XP lagi menuju Level {gamification.level + 1}
            </span>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>Total XP: {gamification.xp}</span>
            <span>Target: {gamification.nextLevelXp} XP</span>
          </div>
          
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-sky-400 rounded-full transition-all duration-500"
              style={{ width: `${xpPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Active Streaks Grid */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Saving Streak */}
        <div className="glass-card rounded-2xl p-3.5 border border-amber-500/10 text-center space-y-1">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-400">
            <Flame className="w-5 h-5 fill-amber-400" />
          </div>

          <span className="text-2xl font-black text-gray-100 block">
            {gamification.savingStreakDays} <span className="text-xs font-normal text-gray-400">Hari</span>
          </span>
          
          <h4 className="text-xs font-bold text-amber-400">Saving Streak</h4>
          <p className="text-[8px] text-gray-500">Konsisten menabung atau berinvestasi</p>
        </div>

        {/* No Overspending Streak */}
        <div className="glass-card rounded-2xl p-3.5 border border-emerald-500/10 text-center space-y-1">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-400">
            <Zap className="w-4 h-4 fill-emerald-400" />
          </div>

          <span className="text-2xl font-black text-gray-100 block">
            {gamification.noOverspendingStreakDays} <span className="text-xs font-normal text-gray-400">Hari</span>
          </span>
          
          <h4 className="text-xs font-bold text-emerald-400">Anti-Impulsive</h4>
          <p className="text-[8px] text-gray-500">Tidak melampaui limit harian</p>
        </div>

      </div>

      {/* Achievements / Badges List */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
          Koleksi Pencapaian & Badge ({gamification.achievements.length} Terbuka)
        </span>

        <div className="space-y-2">
          {gamification.achievements.map(ach => (
            <div key={ach.id} className="glass-card rounded-2xl p-3 flex items-start gap-3 border border-white/5 animate-fadeIn">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                {renderIcon(ach.icon)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-100">{ach.title}</h4>
                  {ach.unlockedAt && (
                    <span className="text-[8px] text-emerald-400 bg-emerald-500/10 px-1 rounded">
                      Terbuka
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
                  {ach.description}
                </p>

                {ach.unlockedAt && (
                  <span className="text-[8px] text-gray-500 block mt-1">
                    Diperoleh: {ach.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Locked Mystery Badge */}
          <div className="glass-card rounded-2xl p-3 flex items-start gap-3 border border-white/5 opacity-50">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 mt-0.5 text-gray-600">
              <Lock className="w-4 h-4" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-400">Investor Sejati</h4>
                <span className="text-[8px] text-gray-500 bg-white/5 px-1 rounded">
                  Terkunci
                </span>
              </div>

              <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                Capai total portofolio investasi Rp 50 Juta di sistem.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Disclosure */}
      <div className="bg-white/5 p-3 rounded-xl space-y-1 text-[9px] text-gray-400">
        <span className="font-bold text-gray-300 block">Cara Mendapatkan XP:</span>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Catat pengeluaran sesuai rencana: <strong className="text-emerald-400">+50 XP</strong></li>
          <li>Batal beli impulsif & tabung uangnya: <strong className="text-amber-400">+100 XP</strong></li>
          <li>Batalkan langganan yang tidak terpakai: <strong className="text-sky-400">+150 XP</strong></li>
          <li>Topup tabungan Financial Goals: <strong className="text-emerald-400">+100 XP</strong></li>
        </ul>
      </div>

    </div>
  );
};
