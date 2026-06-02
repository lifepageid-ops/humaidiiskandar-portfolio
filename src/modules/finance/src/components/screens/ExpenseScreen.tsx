import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Sparkles,
  Mic,
  MicOff,
  Camera,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Upload,
  X
} from 'lucide-react';
import { MoodType } from '../../types';
import { moodOptions } from '../../utils/mood';
import {
  parseNaturalInput,
  parseReceiptText,
  loadTesseract,
  getSpeechRecognition
} from '../../utils/inputParser';

interface ExpenseScreenProps {
  setActiveTab: (tab: string) => void;
}

export const ExpenseScreen: React.FC<ExpenseScreenProps> = ({ setActiveTab }) => {
  const { wallets, addTransaction, budgets } = useFinance();

  const [activeMode, setActiveMode] = useState<'manual' | 'voice' | 'scan'>('manual');
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');

  // Manual Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('Makan & Minum');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [isImpulsive, setIsImpulsive] = useState(false);
  const [mood, setMood] = useState<MoodType>('Neutral');
  const [notes, setNotes] = useState('');

  // UI status
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // VOICE
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceFinalText, setVoiceFinalText] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // SCAN
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptRawText, setReceiptRawText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check browser support on mount
  useEffect(() => {
    const SR = getSpeechRecognition();
    if (!SR) setVoiceSupported(false);
  }, []);

  // Cleanup on mode switch
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const defaultCategories: string[] = [
    'Makan & Minum', 'Transportasi', 'Nongkrong & Hiburan', 'Subscription',
    'Investasi & Tabungan', 'Cicilan & Paylater', 'Belanja & Fashion',
    'Kesehatan', 'Lainnya'
  ];

  const budgetCategories = budgets
    .filter(budget => budget.month === currentMonth && budget.type === 'expense')
    .map(budget => budget.category)
    .filter(categoryName => !defaultCategories.some(defaultCategory => defaultCategory.toLowerCase() === categoryName.toLowerCase()));

  const categories = [...defaultCategories, ...budgetCategories];

  const defaultIncomeCategories: string[] = ['Gaji', 'Freelance', 'Bisnis', 'Investasi', 'Lainnya'];
  const budgetIncomeCategories = budgets
    .filter(budget => budget.month === currentMonth && budget.type === 'income')
    .map(budget => budget.category)
    .filter(categoryName => !defaultIncomeCategories.some(dc => dc.toLowerCase() === categoryName.toLowerCase()));
  const incomeCategories = [...defaultIncomeCategories, ...budgetIncomeCategories];

  // ============ AI AUTO CATEGORIZE ============
  const handleAiAutoCategorize = () => {
    if (!title) return;
    setIsAiThinking(true);
    setTimeout(() => {
      const parsed = parseNaturalInput(title);
      setCategory(parsed.category);
      setIsAiThinking(false);
    }, 500);
  };

  // ============ MANUAL SUBMIT ============
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;
    addTransaction({
      title,
      amount: parseFloat(amount),
      type: txType,
      category,
      walletId,
      isImpulsive: txType === 'expense' ? isImpulsive : false,
      mood: txType === 'expense' ? mood : undefined,
      notes
    });
    setSuccessMsg(txType === 'expense' ? 'Pengeluaran berhasil dicatat.' : 'Pemasukan berhasil dicatat.');
    setTitle(''); setAmount(''); setIsImpulsive(false); setNotes('');
    setTimeout(() => { setSuccessMsg(''); setActiveTab('home'); }, 1200);
  };

  // ============ VOICE INPUT (REAL) ============
  const startListening = () => {
    setErrorMsg('');
    const SR = getSpeechRecognition();
    if (!SR) {
      setErrorMsg('Browser kamu tidak mendukung voice input. Coba pakai Chrome / Edge / Safari versi terbaru.');
      return;
    }

    const recognition = new SR();
    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceTranscript('');
      setVoiceFinalText('');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
        else interim += transcript;
      }
      setVoiceTranscript(interim);
      if (finalText) setVoiceFinalText(prev => prev + finalText);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setErrorMsg('Akses mikrofon ditolak. Izinkan mikrofon di pengaturan browser.');
      } else if (event.error === 'no-speech') {
        setErrorMsg('Tidak ada suara terdeteksi. Coba lagi.');
      } else if (event.error === 'network') {
        setErrorMsg('Voice recognition butuh koneksi internet. Cek jaringanmu.');
      } else {
        setErrorMsg(`Error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    try { recognition.start(); } catch (err: any) { setErrorMsg(err.message || 'Gagal memulai mikrofon'); }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsListening(false);
  };

  const processVoiceResult = () => {
    const fullText = (voiceFinalText + ' ' + voiceTranscript).trim();
    if (!fullText) {
      setErrorMsg('Belum ada hasil suara. Coba bicara dulu.');
      return;
    }
    const parsed = parseNaturalInput(fullText);

    setTitle(parsed.title);
    if (parsed.amount) setAmount(String(parsed.amount));
    setCategory(parsed.category);

    // Cari wallet
    if (parsed.walletHint) {
      const matchedWallet = wallets.find(w =>
        w.name.toLowerCase().includes(parsed.walletHint!.replace(/[\s-]/g, ''))
      ) || wallets.find(w => w.name.toLowerCase().includes(parsed.walletHint!.split(' ')[0]));
      if (matchedWallet) setWalletId(matchedWallet.id);
    }

    setActiveMode('manual');
    setSuccessMsg('AI berhasil memproses suaramu. Cek & konfirmasi datanya.');
    setVoiceFinalText('');
    setVoiceTranscript('');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  // ============ RECEIPT OCR (REAL) ============
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');

    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setReceiptImage(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Start OCR
    setIsScanning(true);
    setScanProgress(0);
    setScanStatus('Memuat library OCR...');
    setReceiptRawText('');

    try {
      const Tesseract = await loadTesseract();
      setScanStatus('Membaca teks pada struk...');

      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            setScanProgress(Math.round(m.progress * 100));
            setScanStatus(`Mengenali teks... ${Math.round(m.progress * 100)}%`);
          } else if (m.status) {
            setScanStatus(m.status);
          }
        }
      });

      const rawText = result.data.text || '';
      setReceiptRawText(rawText);

      const parsed = parseReceiptText(rawText);
      if (!parsed.amount) {
        setErrorMsg('Nominal pada struk tidak terdeteksi. Mohon input manual atau scan ulang.');
        setTitle(parsed.merchant);
        setCategory(parsed.category);
      } else {
        setTitle(parsed.merchant);
        setAmount(String(parsed.amount));
        setCategory(parsed.category);
        setSuccessMsg(`Struk berhasil dibaca. Total: Rp ${parsed.amount.toLocaleString('id-ID')}`);
        setTimeout(() => {
          setSuccessMsg('');
          setActiveMode('manual');
        }, 2500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memproses struk. Coba foto ulang dengan pencahayaan lebih baik.');
    } finally {
      setIsScanning(false);
      setScanProgress(0);
      setScanStatus('');
    }

    // Reset input agar bisa pilih file yang sama lagi
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetScan = () => {
    setReceiptImage(null);
    setReceiptRawText('');
    setErrorMsg('');
  };

  return (
    <div className="p-4 space-y-4">

      {/* Title */}
      <div>
        <h2 className="text-base font-bold text-gray-100 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-400" /> Smart Transaction Tracker
        </h2>
        <p className="text-[10px] text-gray-400 mt-0.5">
          Catat pemasukan dan pengeluaran instan dengan bantuan asisten AI.
        </p>
      </div>

      {/* Transaction Type Switcher */}
      <div className="grid grid-cols-2 gap-1 bg-[#141720] p-1 rounded-xl">
        <button
          onClick={() => { setTxType('expense'); setCategory('Makan & Minum'); }}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            txType === 'expense' ? 'bg-rose-500/80 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Pengeluaran
        </button>
        <button
          onClick={() => { setTxType('income'); setCategory('Gaji'); }}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            txType === 'income' ? 'bg-emerald-500 text-gray-950 shadow-sm' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Pemasukan
        </button>
      </div>

      {/* Input Mode Switcher */}
      <div className="grid grid-cols-3 gap-1 bg-[#141720] p-1 rounded-xl">
        <button
          onClick={() => setActiveMode('manual')}
          className={`py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${
            activeMode === 'manual' ? 'bg-emerald-500 text-gray-950 font-bold shadow-sm' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <FileText className="w-3 h-3" /> Manual
        </button>
        <button
          onClick={() => setActiveMode('voice')}
          className={`py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${
            activeMode === 'voice' ? 'bg-emerald-500 text-gray-950 font-bold shadow-sm' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Mic className="w-3 h-3" /> Voice
        </button>
        <button
          onClick={() => setActiveMode('scan')}
          className={`py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${
            activeMode === 'scan' ? 'bg-emerald-500 text-gray-950 font-bold shadow-sm' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Camera className="w-3 h-3" /> Struk
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-2 rounded-xl text-xs flex items-center gap-1.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-2 rounded-xl text-xs flex items-start gap-1.5 animate-fadeIn">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMsg}</span>
        </div>
      )}

      {/* ============ MANUAL MODE ============ */}
      {activeMode === 'manual' && (
        <form onSubmit={handleManualSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-semibold text-gray-400 block mb-1">
              {txType === 'expense' ? 'NAMA PENGELUARAN' : 'SUMBER PEMASUKAN'}
            </label>
            <div className="relative">
              <input
                type="text" value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={txType === 'expense' ? handleAiAutoCategorize : undefined}
                placeholder={txType === 'expense' ? 'Contoh: Kopi Susu Senopati' : 'Contoh: Gaji Juni, Project Freelance'}
                className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50"
                required
              />
              {title && txType === 'expense' && (
                <button
                  type="button"
                  onClick={handleAiAutoCategorize}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/20 flex items-center gap-0.5"
                >
                  <Sparkles className={`w-2.5 h-2.5 ${isAiThinking ? 'animate-spin' : ''}`} />
                  {isAiThinking ? 'Menebak...' : 'Auto Kategori'}
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-gray-400 block mb-1">
              {txType === 'expense' ? 'JUMLAH PENGELUARAN (RP)' : 'JUMLAH PEMASUKAN (RP)'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">Rp</span>
              <input
                type="number" value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50000"
                className="w-full bg-[#131722] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-gray-400 block mb-1">
              {txType === 'expense' ? 'KATEGORI PENGELUARAN' : 'KATEGORI PEMASUKAN'}
            </label>
            <select
              value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-emerald-500/50"
            >
              {(txType === 'expense' ? categories : incomeCategories).map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-gray-400 block mb-1">
              {txType === 'expense' ? 'SUMBER DANA / DOMPET' : 'MASUK KE DOMPET'}
            </label>
            <select
              value={walletId} onChange={(e) => setWalletId(e.target.value)}
              className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-emerald-500/50"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} - Saldo: Rp {w.balance.toLocaleString('id-ID')}
                </option>
              ))}
            </select>
          </div>

          {txType === 'expense' && (
            <div className="glass-card rounded-xl p-2.5 border border-amber-500/10">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox" checked={isImpulsive}
                  onChange={(e) => setIsImpulsive(e.target.checked)}
                  className="mt-0.5 rounded text-amber-500 focus:ring-0 bg-white/5 border-white/10"
                />
                <div>
                  <span className="text-xs font-bold text-amber-400 block">
                    <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Pengeluaran Impulsif?</span>
                  </span>
                  <span className="text-[9px] text-gray-400 block mt-0.5">
                    Tandai jika ini belanja emosional di luar budget agar sistem bisa memberikan laporan evaluasi.
                  </span>
                </div>
              </label>
            </div>
          )}

          {txType === 'expense' && (
            <div>
              <label className="text-[10px] font-semibold text-gray-400 block mb-1">MOOD SAAT BELANJA</label>
              <div className="grid grid-cols-5 gap-1">
                {moodOptions.map((m) => {
                  const Icon = m.Icon;
                  return (
                    <button
                      key={m.value} type="button"
                      onClick={() => setMood(m.value)}
                      className={`py-1.5 text-xs rounded-xl transition-all border flex flex-col items-center gap-0.5 ${
                        mood === m.value ? 'bg-sky-500/20 border-sky-500/40 text-sky-300' : 'bg-white/5 border-transparent text-gray-400'
                      }`}
                    >
                      <Icon className="w-8 h-8" />
                      <span className="text-[8px]">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-semibold text-gray-400 block mb-1">CATATAN (OPSIONAL)</label>
            <input
              type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder={txType === 'expense' ? 'Contoh: Traktir teman / diskon akhir bulan' : 'Contoh: Transfer dari klien / bonus tahunan'}
              className="w-full bg-[#131722] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all shadow-md mt-2 ${
              txType === 'expense'
                ? 'bg-emerald-500 hover:bg-emerald-400 text-gray-950 shadow-emerald-500/20'
                : 'bg-sky-500 hover:bg-sky-400 text-gray-950 shadow-sky-500/20'
            }`}
          >
            {txType === 'expense' ? 'Simpan Pengeluaran' : 'Simpan Pemasukan'}
          </button>
        </form>
      )}

      {/* ============ VOICE MODE (REAL) ============ */}
      {activeMode === 'voice' && (
        <div className="glass-panel rounded-2xl p-5 text-center space-y-4">

          {!voiceSupported && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-2.5 rounded-xl text-[10px] leading-relaxed">
              Browser kamu tidak mendukung voice recognition. Gunakan Chrome, Edge, atau Safari versi terbaru.
            </div>
          )}

          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            disabled={!voiceSupported}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto relative transition-all border-2 ${
              isListening
                ? 'bg-rose-500/20 border-rose-500/50'
                : 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
            } ${!voiceSupported ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping"></div>
                <div className="absolute inset-[-8px] rounded-full border-2 border-rose-500/30 animate-pulse"></div>
              </>
            )}
            {isListening ? (
              <MicOff className="w-8 h-8 text-rose-400 relative z-10" />
            ) : (
              <Mic className="w-8 h-8 text-emerald-400 relative z-10" />
            )}
          </button>

          <div>
            <h3 className="text-xs font-bold text-gray-200">
              {isListening ? 'Mendengarkan...' : 'Pencatatan Berbasis Suara'}
            </h3>
            <p className="text-[10px] text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
              {isListening
                ? 'Ucapkan dengan jelas. Tekan tombol lagi untuk berhenti.'
                : 'Tekan tombol mikrofon lalu sebutkan nominal, nama barang, dan e-wallet.'}
            </p>
          </div>

          {/* Live transcript */}
          {(voiceFinalText || voiceTranscript) && (
            <div className="bg-[#151C2B] p-3 rounded-xl border border-white/10 text-left">
              <span className="text-[9px] text-gray-500 block mb-1 uppercase tracking-wide">Hasil Suara</span>
              <p className="text-xs text-gray-200 leading-relaxed">
                <span className="text-emerald-300">{voiceFinalText}</span>
                <span className="text-gray-500 italic"> {voiceTranscript}</span>
              </p>
            </div>
          )}

          {!isListening && !voiceFinalText && !voiceTranscript && (
            <div className="bg-[#151C2B] p-2.5 rounded-xl border border-white/5 text-[10px] text-gray-500">
              Contoh: <span className="text-gray-300">"Beli Kopi Susu Tuku 28 ribu pakai GoPay"</span>
            </div>
          )}

          {(voiceFinalText || voiceTranscript) && !isListening && (
            <button
              type="button"
              onClick={processVoiceResult}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs transition-all flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Proses & Isi Form
            </button>
          )}

          {!voiceFinalText && !voiceTranscript && voiceSupported && (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                isListening
                  ? 'bg-rose-500 hover:bg-rose-400 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-gray-950'
              }`}
            >
              {isListening ? 'Hentikan Rekaman' : 'Mulai Bicara'}
            </button>
          )}
        </div>
      )}

      {/* ============ SCAN STRUK MODE (REAL OCR) ============ */}
      {activeMode === 'scan' && (
        <div className="glass-panel rounded-2xl p-5 space-y-4">

          {/* Preview area */}
          <div className="relative w-full aspect-[4/5] mx-auto max-w-[260px] bg-[#151C2B] rounded-xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center overflow-hidden">
            {receiptImage ? (
              <>
                <img src={receiptImage} alt="Receipt" className="w-full h-full object-contain" />
                {!isScanning && (
                  <button
                    onClick={resetScan}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            ) : (
              <>
                <Camera className="w-10 h-10 text-gray-600 mb-2" />
                <span className="text-[10px] text-gray-500 px-3 text-center">Tekan tombol di bawah untuk membuka kamera atau pilih foto struk</span>
              </>
            )}

            {isScanning && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-2 px-4">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                <span className="text-[10px] font-bold text-emerald-300 text-center">{scanStatus}</span>
                {scanProgress > 0 && (
                  <div className="w-full max-w-[180px] h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 transition-all" style={{ width: `${scanProgress}%` }}></div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-center">
            <h3 className="text-xs font-bold text-gray-200">Scan Struk Otomatis</h3>
            <p className="text-[10px] text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
              AI OCR akan membaca nama merchant dan total belanja dari foto struk.
            </p>
          </div>

          {/* File input (hidden) - dengan capture untuk buka kamera di mobile */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.setAttribute('capture', 'environment');
                  fileInputRef.current.click();
                }
              }}
              disabled={isScanning}
              className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-1"
            >
              <Camera className="w-3.5 h-3.5" /> Buka Kamera
            </button>
            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.removeAttribute('capture');
                  fileInputRef.current.click();
                }
              }}
              disabled={isScanning}
              className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 font-bold text-xs transition-all border border-white/10 disabled:opacity-50 flex items-center justify-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" /> Pilih File
            </button>
          </div>

          {/* Raw OCR text preview (collapsible) */}
          {receiptRawText && !isScanning && (
            <details className="bg-[#151C2B] p-2.5 rounded-xl border border-white/5">
              <summary className="text-[10px] text-gray-400 cursor-pointer">Lihat hasil OCR mentah</summary>
              <pre className="text-[9px] text-gray-500 whitespace-pre-wrap mt-2 max-h-40 overflow-y-auto">{receiptRawText}</pre>
            </details>
          )}

          <p className="text-[9px] text-gray-500 text-center leading-relaxed">
            Tips: foto dengan pencahayaan terang dan struk dalam kondisi rata agar OCR akurat.
          </p>
        </div>
      )}

    </div>
  );
};
