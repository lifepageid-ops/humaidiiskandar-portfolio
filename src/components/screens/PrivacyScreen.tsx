import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  EyeOff, 
  Download, 
  Trash2, 
  CheckCircle2
} from 'lucide-react';

export const PrivacyScreen: React.FC = () => {
  const { resetToDefaults, transactions } = useFinance();
  
  const [localFirst, setLocalFirst] = useState(true);
  const [encrypted, setEncrypted] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  const handleExport = () => {
    // Generate simple readable JSON
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ 
        app: "Humedly Financial Tracker", 
        version: "1.0-Concept",
        encrypted: encrypted,
        transactions: transactions 
      }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "zflow_backup_encrypted.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setSuccessMsg('File backup lokal berhasil diunduh.');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleReset = () => {
    if (confirm("Reset seluruh data ke kondisi awal simulasi (Mock Data)?")) {
      resetToDefaults();
      setSuccessMsg('Data berhasil direset ke pengaturan pabrik.');
      setTimeout(() => setSuccessMsg(''), 2000);
    }
  };

  return (
    <div className="p-4 space-y-4">
      
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-gray-100 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Privacy & Data Vault
        </h2>
        <p className="text-[10px] text-gray-400 mt-0.5">
          Keamanan berstandar tinggi. Data finansialmu adalah milikmu sepenuhnya.
        </p>
      </div>

      {/* Premium Privacy Guarantee Banner */}
      <div className="glass-card rounded-3xl p-4 border border-emerald-500/20 bg-gradient-to-r from-emerald-950/10 to-transparent space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
          <EyeOff className="w-4 h-4" /> 100% No Ads & No Data Selling
        </div>
        
        <p className="text-[10px] text-gray-300 leading-relaxed">
          Berbeda dengan aplikasi fintech atau accounting tradisional yang memonetisasi data transaksimu untuk penawaran pinjaman pihak ketiga, <strong className="text-white">Humedly beroperasi secara independen</strong>. Kami tidak menayangkan iklan dan tidak pernah menjual riwayat belanjamu.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-2.5 rounded-xl text-xs flex items-center gap-1.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span className="leading-relaxed">{successMsg}</span>
        </div>
      )}

      {/* Control Toggles */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
          Pengaturan Penyimpanan
        </span>

        {/* Local First */}
        <div className="glass-card rounded-2xl p-3.5 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-sky-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-200">Local-First Storage</h4>
              <p className="text-[9px] text-gray-400 mt-0.5">
                Simpan seluruh data di perangkatmu sendiri tanpa cloud.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input 
              type="checkbox" 
              checked={localFirst} 
              onChange={e => {
                setLocalFirst(e.target.checked);
                setSuccessMsg(e.target.checked ? 'Mode Local-First diaktifkan.' : 'Mode Hybrid Cloud diaktifkan.');
                setTimeout(() => setSuccessMsg(''), 1500);
              }}
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {/* Client-Side Encryption */}
        <div className="glass-card rounded-2xl p-3.5 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-200">AES-256 Data Encryption</h4>
              <p className="text-[9px] text-gray-400 mt-0.5">
                Enkripsi lapis ganda sebelum disimpan ke memori lokal.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input 
              type="checkbox" 
              checked={encrypted} 
              onChange={e => {
                setEncrypted(e.target.checked);
                setSuccessMsg(e.target.checked ? 'Simulasi Enkripsi AES-256 diaktifkan.' : 'Enkripsi dimatikan.');
                setTimeout(() => setSuccessMsg(''), 1500);
              }}
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

      </div>

      {/* Live Visual Demonstration */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
          Status Memori Perangkat
        </span>

        <div className="bg-[#151C2B] p-3 rounded-xl border border-white/5 space-y-1 font-mono text-[9px]">
          <div className="flex justify-between text-gray-400">
            <span>STORAGE ENGINE:</span>
            <span className="text-emerald-400">{localFirst ? 'IndexedDB / LocalStorage' : 'Encrypted Cloud Relay'}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>ENCRYPTION KEY:</span>
            <span className="text-amber-400">{encrypted ? 'MASKED_KEY_ACTIVE' : 'UNENCRYPTED_RAW'}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>RECORDS COUNT:</span>
            <span className="text-gray-200">{transactions.length} Transaksi Tersimpan</span>
          </div>
        </div>

        {/* Scrambled Payload Preview */}
        {encrypted && (
          <div className="bg-black p-2 rounded-lg text-[8px] text-emerald-500/80 font-mono overflow-x-hidden select-none line-clamp-2">
            Payload: U2FsdGVkX1+Qz3b8z5x...cW1rZzBvYm1sdA== [ENCRYPTED_BLOB_OK]
          </div>
        )}
      </div>

      {/* Data Export & Reset Actions */}
      <div className="space-y-2 pt-2">
        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
          Manajemen File & Backup
        </span>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1 transition-all border border-white/10"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" /> Export JSON
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold rounded-xl text-xs flex items-center justify-center gap-1 transition-all border border-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" /> Reset Pabrik
          </button>
        </div>

        <p className="text-[8px] text-gray-500 text-center">
          Reset pabrik akan mengembalikan seluruh e-wallet, transaksi, dan poin XP ke awal demonstrasi.
        </p>
      </div>

    </div>
  );
};
