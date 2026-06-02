import { ExpenseCategory } from '../types';

/**
 * Parse natural language Indonesian input untuk extract:
 * - amount (number)
 * - item title (string)
 * - wallet hint (string keyword untuk dicari di nama wallet)
 * - category guess
 */
export interface ParsedInput {
  amount: number | null;
  title: string;
  walletHint: string | null;
  category: ExpenseCategory;
}

const walletKeywords = [
  'gopay', 'go-pay', 'go pay',
  'ovo',
  'dana',
  'shopeepay', 'shopee pay', 'spay',
  'linkaja', 'link aja',
  'bca', 'klikbca', 'm-banking bca',
  'mandiri', 'livin',
  'bni',
  'bri', 'brimo',
  'jago', 'bank jago',
  'jenius',
  'seabank',
  'permata',
  'cimb',
  'spaylater', 'shopee paylater',
  'kredivo',
  'akulaku',
  'paylater',
  'kartu kredit', 'credit card',
  'cash', 'tunai'
];

function parseAmount(text: string): number | null {
  const t = text.toLowerCase().replace(/\./g, '').replace(/,/g, '');

  // Format: "1 juta 500 ribu", "2 juta", "150 ribu", "25rb", "50k", "Rp 25000"
  // Strategi: cari semua angka + satuan, jumlahkan
  let total = 0;
  let found = false;

  // 1. "X juta" → X * 1.000.000
  const jutaMatch = t.match(/(\d+(?:[.,]\d+)?)\s*(?:juta|jt)/);
  if (jutaMatch) {
    total += parseFloat(jutaMatch[1].replace(',', '.')) * 1_000_000;
    found = true;
  }

  // 2. "X ribu" / "X rb" / "X k" → X * 1.000
  const ribuMatch = t.match(/(\d+(?:[.,]\d+)?)\s*(?:ribu|rb|k\b)/);
  if (ribuMatch) {
    total += parseFloat(ribuMatch[1].replace(',', '.')) * 1_000;
    found = true;
  }

  if (found) return Math.round(total);

  // 3. Angka langsung (5 digit atau lebih → kemungkinan nominal langsung)
  const directMatches = t.match(/\d{4,}/g);
  if (directMatches && directMatches.length > 0) {
    // Pilih angka terbesar (biasanya total)
    const numbers = directMatches.map(n => parseInt(n, 10));
    return Math.max(...numbers);
  }

  // 4. Angka kecil di akhir kalimat
  const smallMatch = t.match(/(\d{1,3})(?!.*\d)/);
  if (smallMatch) {
    const val = parseInt(smallMatch[1], 10);
    if (val >= 10) return val * 1000;
  }

  return null;
}

function detectWallet(text: string): string | null {
  const t = text.toLowerCase();
  for (const kw of walletKeywords) {
    if (t.includes(kw)) return kw;
  }
  return null;
}

function detectCategory(text: string): ExpenseCategory {
  const t = text.toLowerCase();
  if (/kopi|starbucks|nongkrong|bioskop|cafe|tongkrongan|bar|izakaya|konser|game|netflix|movie/.test(t))
    return 'Nongkrong & Hiburan';
  if (/nasi|makan|sate|kfc|mcd|gofood|grabfood|sarapan|brunch|sushi|ramen|warteg|padang|seblak|bakso/.test(t))
    return 'Makan & Minum';
  if (/mrt|grab|gojek|gocar|goride|taxi|bensin|parkir|tol|busway|krl|ojek/.test(t))
    return 'Transportasi';
  if (/netflix|spotify|chatgpt|langganan|subscribe|canva|disney|hbo|youtube premium/.test(t))
    return 'Subscription';
  if (/reksadana|saham|bibit|tabungan|emas|invest|sbn|deposito/.test(t))
    return 'Investasi & Tabungan';
  if (/cicilan|paylater|spaylater|kredivo|tagihan kartu/.test(t))
    return 'Cicilan & Paylater';
  if (/baju|sepatu|uniqlo|zara|skincare|kosmetik|fashion|h&m|tas|jeans|kaos/.test(t))
    return 'Belanja & Fashion';
  if (/dokter|obat|apotek|rumah sakit|vitamin|klinik|kesehatan|gym/.test(t))
    return 'Kesehatan';
  return 'Lainnya';
}

function extractTitle(text: string, amount: number | null): string {
  let cleaned = text.trim();

  // Hilangkan kata kerja awalan
  cleaned = cleaned.replace(/^(tadi |barusan |habis |baru aja |aku |saya )/i, '');
  cleaned = cleaned.replace(/^(beli |bayar |jajan |order |belanja )/i, '');

  // Hilangkan bagian nominal
  if (amount) {
    cleaned = cleaned.replace(/(?:rp\s*)?\d+(?:[.,]\d+)?\s*(?:juta|jt|ribu|rb|k\b)?/gi, '');
  }

  // Hilangkan "pakai/pake/dengan/di GoPay"
  cleaned = cleaned.replace(/\s*(?:pakai|pake|dengan|via|di|lewat)\s+[\w\s-]+$/i, '');

  // Cleanup spasi
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Kapitalisasi
  if (cleaned.length > 0) {
    cleaned = cleaned.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  return cleaned || 'Pengeluaran';
}

export function parseNaturalInput(raw: string): ParsedInput {
  const amount = parseAmount(raw);
  const walletHint = detectWallet(raw);
  const category = detectCategory(raw);
  const title = extractTitle(raw, amount);

  return { amount, title, walletHint, category };
}

/**
 * Parse OCR text dari struk → extract merchant + total
 */
export interface ParsedReceipt {
  amount: number | null;
  merchant: string;
  category: ExpenseCategory;
  rawText: string;
}

export function parseReceiptText(ocrText: string): ParsedReceipt {
  const lines = ocrText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  // Cari merchant: biasanya 1-2 baris pertama yang panjang (>3 char, mostly text)
  let merchant = '';
  for (const line of lines.slice(0, 4)) {
    const letterCount = (line.match(/[A-Za-z]/g) || []).length;
    if (letterCount >= 3 && letterCount > line.length * 0.5) {
      merchant = line;
      break;
    }
  }
  if (!merchant) merchant = 'Struk Belanja';

  // Cari total: cari baris yang mengandung TOTAL/GRAND TOTAL/TOTAL BAYAR/JUMLAH
  let amount: number | null = null;
  const totalKeywords = /\b(grand\s*total|total\s*bayar|total\s*akhir|jumlah\s*bayar|total|jumlah|net\s*sales|amount\s*due)\b/i;

  // Pass 1: baris dengan keyword total
  for (const line of lines) {
    if (totalKeywords.test(line)) {
      const numMatch = line.match(/[\d.,]+/g);
      if (numMatch) {
        const candidates = numMatch
          .map(n => parseInt(n.replace(/[.,]/g, ''), 10))
          .filter(n => !isNaN(n) && n >= 1000);
        if (candidates.length > 0) {
          amount = Math.max(...candidates);
          break;
        }
      }
    }
  }

  // Pass 2: fallback - angka terbesar di dokumen (>= 1000)
  if (!amount) {
    const allNumbers: number[] = [];
    for (const line of lines) {
      const matches = line.match(/[\d.,]{4,}/g);
      if (matches) {
        for (const m of matches) {
          const n = parseInt(m.replace(/[.,]/g, ''), 10);
          if (!isNaN(n) && n >= 1000 && n < 100_000_000) allNumbers.push(n);
        }
      }
    }
    if (allNumbers.length > 0) amount = Math.max(...allNumbers);
  }

  const category = detectCategory(merchant + ' ' + ocrText);

  return {
    amount,
    merchant: merchant.length > 50 ? merchant.slice(0, 50) : merchant,
    category,
    rawText: ocrText
  };
}

/**
 * Load Tesseract.js dari CDN secara dinamis
 */
let tesseractPromise: Promise<any> | null = null;
export function loadTesseract(): Promise<any> {
  if ((window as any).Tesseract) return Promise.resolve((window as any).Tesseract);
  if (tesseractPromise) return tesseractPromise;

  tesseractPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/tesseract.js@5.1.0/dist/tesseract.min.js';
    script.async = true;
    script.onload = () => {
      const T = (window as any).Tesseract;
      if (T) resolve(T);
      else reject(new Error('Tesseract gagal dimuat'));
    };
    script.onerror = () => reject(new Error('Tidak dapat memuat library OCR dari CDN'));
    document.head.appendChild(script);
  });

  return tesseractPromise;
}

/**
 * SpeechRecognition wrapper - cek dukungan browser
 */
export function getSpeechRecognition(): any | null {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}
