import React, { useState } from 'react';
import { 
  Layers, 
  GitMerge, 
  Sparkles, 
  UserCheck, 
  Bot
} from 'lucide-react';

export const ConceptDocumentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'flow' | 'structure' | 'onboarding' | 'insights' | 'strategy'>('flow');

  return (
    <div className="w-full min-h-[calc(100svh-57px)] bg-[#111827] p-4 border-white/10 flex flex-col justify-between lg:max-w-xl lg:h-[800px] lg:min-h-0 lg:rounded-[40px] lg:p-6 lg:border">
      
      {/* Header */}
      <div className="space-y-1 shrink-0">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            KONSEP & STRATEGI
          </span>
          <span className="text-xs text-gray-500">- Target: Gen Z 25-30 Tahun</span>
        </div>
        <h1 className="text-xl font-black tracking-tight text-white">
          Humedly Concept Studio
        </h1>
        <p className="text-xs text-gray-400">
          Eksplorasi arsitektur, user flow, dan filosofi desain di balik aplikasi.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-5 gap-1 bg-[#151C2B] p-1 rounded-xl my-3 shrink-0">
        {[
          { id: 'flow', label: 'User Flow', icon: GitMerge },
          { id: 'structure', label: 'Struktur', icon: Layers },
          { id: 'onboarding', label: 'Onboarding', icon: UserCheck },
          { id: 'insights', label: 'AI Insights', icon: Bot },
          { id: 'strategy', label: 'Strategi', icon: Sparkles }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`py-2 px-1 rounded-lg text-center transition-all flex flex-col items-center gap-1 ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[9px] block line-clamp-1">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs text-gray-300 no-scrollbar">
        
        {/* SECTION 1: USER FLOW UTAMA */}
        {activeSection === 'flow' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <GitMerge className="w-4 h-4" /> Alur Pengguna (User Flow Utama)
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Siklus interaksi yang dirancang untuk membangun kesadaran tanpa membebani.
              </p>
            </div>

            <div className="space-y-2.5">
              
              {/* Flow 1 */}
              <div className="glass-card rounded-xl p-3 border-l-2 border-emerald-500">
                <span className="text-[9px] font-bold text-emerald-400 block uppercase">1. Fase Intersepsi Impulsif</span>
                <p className="text-[11px] text-gray-200 mt-0.5 font-medium">
                  Hasrat Belanja lalu Buka Aplikasi lalu Cek "Anti-Impulsive Assistant"
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Sebelum checkout e-commerce, user menguji barang incaran. Aplikasi mengonversi harga ke jam kerja, mengecek sisa kuota kategori, dan menyajikan *opportunity cost* investasi 5 tahun.
                </p>
              </div>

              {/* Flow 2 */}
              <div className="glass-card rounded-xl p-3 border-l-2 border-sky-400">
                <span className="text-[9px] font-bold text-sky-400 block uppercase">2. Pencatatan Harian Kilat</span>
                <p className="text-[11px] text-gray-200 mt-0.5 font-medium">
                  Transaksi Selesai lalu Voice Input / Scan Struk lalu AI Auto-Categorization
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  User tidak perlu memilih kategori secara manual. Cukup bicara *"Kopi Tuku 28 ribu pakai GoPay"* atau memotret struk, sistem langsung memperbarui saldo e-wallet dan skor kesehatan.
                </p>
              </div>

              {/* Flow 3 */}
              <div className="glass-card rounded-xl p-3 border-l-2 border-amber-500">
                <span className="text-[9px] font-bold text-amber-400 block uppercase">3. Evaluasi & Gamifikasi Rutin</span>
                <p className="text-[11px] text-gray-200 mt-0.5 font-medium">
                  Surplus Akhir Bulan lalu XP & Level Up lalu Alokasi Otomatis ke Financial Goals
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Setiap keberhasilan menahan diri atau membatalkan langganan siluman akan diganjar XP. Surplus kas disimulasikan masuk ke pos *Resign Fund* atau *Liburan*.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 2: STRUKTUR DASHBOARD */}
        {activeSection === 'structure' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Arsitektur & Struktur Dashboard
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Tata letak modular berbasis kartu bergaya Apple Wallet + Notion.
              </p>
            </div>

            <div className="space-y-2">
              <div className="bg-white/5 p-2.5 rounded-xl">
                <span className="font-bold text-white block text-xs">Zona 1: Liquid Awareness (Atas)</span>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Menampilkan konsolidasi uang siap pakai secara real-time. Dilengkapi *switch* untuk melihat sebaran aset di rekening bank vs e-wallet vs total utang paylater.
                </p>
              </div>

              <div className="bg-white/5 p-2.5 rounded-xl">
                <span className="font-bold text-white block text-xs">Zona 2: Quick Health & Forecast (Tengah)</span>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Dua modul ringkas yang menyajikan Skor Kesehatan Finansial (0-100) dan Proyeksi Sisa Uang Akhir Bulan dengan indikator warna (Hijau = Aman, Merah = Potensi Tekor).
                </p>
              </div>

              <div className="bg-white/5 p-2.5 rounded-xl">
                <span className="font-bold text-white block text-xs">Zona 3: Impulse Interceptor (Aksi Cepat)</span>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Banner interaktif berwarna emas untuk menguji kelayakan barang incaran sebelum pengguna melakukan *impulsive checkout*.
                </p>
              </div>

              <div className="bg-white/5 p-2.5 rounded-xl">
                <span className="font-bold text-white block text-xs">Zona 4: Behavioral & AI Feeds (Bawah)</span>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Modul input *Mood Harian* dan daftar pengeluaran terkini dengan *tag* otomatis hasil analisis AI.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: IDE ONBOARDING */}
        {activeSection === 'onboarding' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" /> Konsep Onboarding Gen Z
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Menghindari formulir akuntansi kaku, digantikan dengan dialog interaktif.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="glass-card rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 block">Langkah 1: Parameter Nilai Waktu</span>
                <p className="text-[10px] text-gray-300">
                  Sistem menanyakan estimasi pemasukan bulanan untuk menghitung secara otomatis **Tarif Per Jam Kerja** pengguna. Angka ini menjadi pondasi fitur *Work-Hour Equivalence*.
                </p>
              </div>

              <div className="glass-card rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-bold text-sky-400 block">Langkah 2: Integrasi Ekosistem Digital</span>
                <p className="text-[10px] text-gray-300">
                  Pengguna memilih e-wallet favorit (GoPay, OVO, ShopeePay) dan fasilitas Paylater yang aktif. Hal ini membangun *mental model* bahwa semua dompet terhubung dalam satu *hub*.
                </p>
              </div>

              <div className="glass-card rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 block">Langkah 3: Deklarasi "Musuh Finansial"</span>
                <p className="text-[10px] text-gray-300">
                  Alih-alih menanyakan *budget* kaku, aplikasi meminta pengguna memilih masalah utama mereka: *"Duit habis tiba-tiba"*, *"Kecanduan Paylater"*, atau *"Langganan Siluman"*. AI langsung menyesuaikan *tone* dan rekomendasinya.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: CONTOH AI INSIGHTS */}
        {activeSection === 'insights' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <Bot className="w-4 h-4" /> Contoh AI Financial Insights
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Saran proaktif yang terasa seperti nasihat dari *financial companion* seumuran.
              </p>
            </div>

            <div className="space-y-2.5">
              
              <div className="bg-[#131722] p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[9px] font-bold text-rose-400 block uppercase">Deteksi Kebocoran (Money Leaks)</span>
                <p className="text-xs text-gray-100 italic">
                  "Kevin, saya mendeteksi kamu membayar **Gym Membership Rp 450.000** tapi frekuensi kunjunganmu tercatat sangat rendah bulan ini. Membatalkan langganan ini bisa langsung menambal kebocoran kasmu."
                </p>
              </div>

              <div className="bg-[#131722] p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[9px] font-bold text-amber-400 block uppercase">Peringatan Rasio Utang (Debt Health)</span>
                <p className="text-xs text-gray-100 italic">
                  "Total tagihan SPayLater dan Kartu Kreditmu bulan ini mencapai **24% dari pemasukan**. Ini sudah mendekati batas maksimal 30%. Yuk, puasa *checkout* barang baru dulu sampai akhir bulan."
                </p>
              </div>

              <div className="bg-[#131722] p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[9px] font-bold text-sky-400 block uppercase">Korelasi Mood & Pengeluaran</span>
                <p className="text-xs text-gray-100 italic">
                  "Data menunjukkan kamu menghabiskan **rata-rata Rp 450.000** di hari saat kamu merasa *Stressed*. Sebagian besar lari ke *retail therapy* makanan premium. Besok kalau stres, coba ganti dengan lari sore ya."
                </p>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 5: STRATEGI & DESAIN */}
        {activeSection === 'strategy' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Strategi Pendekatan Gen Z
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Mengapa aplikasi ini dirancang berbeda dari pencatat keuangan konvensional.
              </p>
            </div>

            <div className="space-y-2 text-[11px] leading-relaxed">
              <div className="glass-card rounded-xl p-2.5">
                <strong className="text-white block text-xs">1. Anti-Accounting Mindset</strong>
                <p className="text-gray-400 mt-0.5">
                  Pengguna pekerja kreatif/freelancer sering terintimidasi oleh istilah *debit*, *kredit*, dan *ledger*. Humedly menggunakan pendekatan *cashflow awareness* langsung: *"Berapa uang siap pakai saya?"* dan *"Berapa hari lagi sisa uang ini bertahan?"*
                </p>
              </div>

              <div className="glass-card rounded-xl p-2.5">
                <strong className="text-white block text-xs">2. Intersepsi sebelum Transaksi</strong>
                <p className="text-gray-400 mt-0.5">
                  Aplikasi lain hanya mencatat *setelah* uang habis. Humedly hadir *sebelum* uang dihabiskan melalui fitur **Anti-Impulsive Assistant**, memberikan jeda rasional bagi pengguna untuk memikirkan ulang keputusan emosionalnya.
                </p>
              </div>

              <div className="glass-card rounded-xl p-2.5">
                <strong className="text-white block text-xs">3. Gamifikasi sebagai Pendorong Dopamin</strong>
                <p className="text-gray-400 mt-0.5">
                  Mengganti kepuasan instan berbelanja dengan kepuasan visual dari *Saving Streak*, *XP*, dan *Level Finansial*. Pengguna merasa sedang "bermain game" untuk *survive adulthood*.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer info */}
      <div className="pt-3 border-t border-white/5 shrink-0 flex items-center justify-between text-[10px] text-gray-500">
        <span>Teknologi: React + Tailwind CSS</span>
        <span>Desain: Premium Dark Fintech</span>
      </div>

    </div>
  );
};
