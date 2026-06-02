/**
 * Format angka ke format Rupiah Indonesia
 * Contoh: 6000000 -> "Rp 6.000.000"
 */
export function formatRupiah(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = rounded.toLocaleString('id-ID');
  return `Rp ${formatted}`;
}

/**
 * Format angka ke format Rupiah tanpa prefix (untuk input)
 * Contoh: 6000000 -> "6.000.000"
 */
export function formatNumber(amount: number): string {
  return Math.round(amount).toLocaleString('id-ID');
}

/**
 * Format persen
 * Contoh: 0.04 -> "4%"
 */
export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(2).replace(/\.?0+$/, '')}%`;
}

/**
 * Parse input string ke number (menghilangkan titik pemisah ribuan)
 */
export function parseRupiahInput(value: string): number {
  const cleaned = value.replace(/\./g, '').replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

/**
 * Format input Rupiah real-time
 */
export function formatRupiahInput(value: string): string {
  const num = parseRupiahInput(value);
  if (num === 0) return '';
  return num.toLocaleString('id-ID');
}
