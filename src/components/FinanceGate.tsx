import React, { useState } from 'react';

interface FinanceGateProps {
  children: React.ReactNode;
}

export const FinanceGate: React.FC<FinanceGateProps> = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(localStorage.getItem('humedly_premium') === 'true');
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Ambil data lisensi lokal jika sudah pernah di-unlock
  const licensedName = localStorage.getItem('humedly_username') || '';
  const licensedPhone = localStorage.getItem('humedly_userphone') || '';

  const handleUnlock = () => {
    const codeTrimmed = inputCode.trim().toUpperCase();
    const parts = codeTrimmed.split('-');

    // Validasi pola: MINIMAL 3 BAGIAN & AKHIRANNYA HARUS "HZFLOW"
    if (parts.length >= 3 && parts[parts.length - 1] === 'HZFLOW') {
      const phone = parts[parts.length - 2];
      // Gabungkan sisa bagian depan jika nama pembeli ada spasi (misal: REZA-RAHADIAN)
      const name = parts.slice(0, parts.length - 2).join(' ');

      // Simpan permanen di browser pembeli
      localStorage.setItem('humedly_premium', 'true');
      localStorage.setItem('humedly_username', name);
      localStorage.setItem('humedly_userphone', phone);

      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Waduh, kode akses salah atau format keliru bre! Hubungi Humaidi.');
    }
  };

  // Jika sudah sukses unlock, tampilkan aplikasi keuangan asli + Banner Lisensi
  if (isUnlocked) {
    return (
      <div className="relative min-h-screen pb-12">
        {/* BANNER PSIKOLOGIS: TAMPIL DI ATAS APLIKASI KEUANGAN */}
        <div className="bg-gradient-to-r from-emerald-950 to-gray-900 border-b border-emerald-500/20 px-4 py-2 text-center text-[11px] text-emerald-400 flex justify-center items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Premium Licensed to: <strong className="text-white tracking-wide">{licensedName} ({licensedPhone})</strong>
        </div>
        {children}
      </div>
    );
  }

  // TAMPILAN HALAMAN PENGUNCI (PREMIUM TEASER)
  return (
    <div className="p-6 text-white bg-gray-950 min-h-screen flex flex-col justify-between font-sans">
      {/* HEADLINE UTAMA */}
      <div className="text-center mt-6">
        <div className="inline-block bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
          Humedly Finance Pro
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-3 tracking-tight">Gated Financial Studio 📊</h1>
        <p className="text-gray-400 text-xs mt-1.5 max-w-xs mx-auto">
          Satu-satunya alat pencatatan keuangan yang didesain khusus buat Gen Z biar gak gampang boncos.
        </p>
      </div>

      {/* SUMMARY FITUR GOKIL (BIAR USER FOMO & MAU BELI) */}
      <div className="space-y-3 my-auto max-w-sm mx-auto w-full">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Fitur Eksklusif Yang Akan Kamu Unlock:</p>
        
        <div className="p-3 bg-white/[0.02] rounded-2xl border border-white/5 flex gap-3 items-start">
          <span className="text-xl">📈</span>
          <div>
            <h3 className="text-xs font-bold text-emerald-300">Cashflow Forecast</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Prediksi sisa dompetmu di akhir bulan berdasarkan gaya pengeluaran harianmu.</p>
          </div>
        </div>

        <div className="p-3 bg-white/[0.02] rounded-2xl border border-white/5 flex gap-3 items-start">
          <span className="text-xl">💳</span>
          <div>
            <h3 className="text-xs font-bold text-sky-300">Paylater & Debt Health Calculator</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Ukur skor kesehatan utangmu, biar gak over-limit dari ambang batas kritis 30%.</p>
          </div>
        </div>

        <div className="p-3 bg-white/[0.02] rounded-2xl border border-white/5 flex gap-3 items-start">
          <span className="text-xl">🍿</span>
          <div>
            <h3 className="text-xs font-bold text-rose-300">Subscription Tracker</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Deteksi semua kebocoran uang dari langganan Netflix, Spotify, hingga aplikasi yang lupa dicancel.</p>
          </div>
        </div>
      </div>

      {/* INPUT KODE & TOMBOL CTA */}
      <div className="max-w-sm mx-auto w-full bg-white/[0.03] p-4 rounded-3xl border border-white/10 space-y-3 backdrop-blur-md">
        <input 
          type="text" 
          placeholder="Masukkan Kode Akses Eksklusifmu..." 
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          className="w-full bg-gray-900 border border-white/10 p-3.5 rounded-xl text-center text-xs text-white placeholder-gray-600 font-mono focus:outline-none focus:border-emerald-400 transition-all"
        />
        {errorMsg && <p className="text-rose-400 text-[10px] text-center font-medium">{errorMsg}</p>}
        
        <button onClick={handleUnlock} className="w-full bg-emerald-400 text-gray-950 font-bold py-3.5 rounded-xl text-xs hover:bg-emerald-300 active:scale-95 transition-all shadow-lg shadow-emerald-950/50">
          Unlock Full Access ⚡
        </button>
        
        <a 
          href="https://wa.me/628123456789?text=Bre%20gue%20mau%20beli%20kode%20akses%20Humedly%20Finance!" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full bg-white/5 text-center text-gray-300 font-semibold py-3 rounded-xl text-[11px] hover:bg-white/10 transition-all"
        >
          Belum Punya Kode? Hubungi Humaidi 📲
        </a>
      </div>
    </div>
  );
};
