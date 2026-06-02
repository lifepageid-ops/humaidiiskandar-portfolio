import { PayrollSettings, JKKRiskLevel, BPJSBaseComponent, BPJS_BASE_LABELS } from '../types/payroll';

interface SettingsProps {
  settings: PayrollSettings;
  onUpdate: (settings: PayrollSettings) => void;
  onBack: () => void;
}

const jkkRiskLabels: Record<JKKRiskLevel, string> = {
  sangat_rendah: 'Sangat Rendah',
  rendah: 'Rendah',
  sedang: 'Sedang',
  tinggi: 'Tinggi',
  sangat_tinggi: 'Sangat Tinggi',
};

export default function Settings({ settings, onUpdate, onBack }: SettingsProps) {
  const updateRate = (key: keyof PayrollSettings, value: number) => {
    onUpdate({ ...settings, [key]: value });
  };

  const updateJkkRate = (level: JKKRiskLevel, value: number) => {
    onUpdate({
      ...settings,
      jkkRates: { ...settings.jkkRates, [level]: value },
    });
  };

  const updateToggle = (key: keyof PayrollSettings, value: boolean) => {
    onUpdate({ ...settings, [key]: value });
  };

  const RateInput = ({
    label,
    value,
    onChange,
    hint,
    accent = 'teal',
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    hint?: string;
    accent?: 'teal' | 'orange';
  }) => (
    <div className="flex items-center justify-between py-2.5 group">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={parseFloat((value * 100).toFixed(4))}
            onChange={(e) => onChange(parseFloat(e.target.value) / 100 || 0)}
            className={`w-24 px-3 py-2 border rounded-xl text-sm text-right font-mono font-semibold transition-all focus:ring-2 ${
              accent === 'teal'
                ? 'border-gray-200 bg-gray-50/50 focus:ring-teal-400 focus:border-teal-400 hover:border-teal-300'
                : 'border-gray-200 bg-gray-50/50 focus:ring-orange-400 focus:border-orange-400 hover:border-orange-300'
            }`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">%</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2.5 hover:bg-teal-50 rounded-xl transition text-teal-600 font-medium"
        >
          ← Kembali
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">⚙️ Pengaturan Payroll</h2>
          <p className="text-xs text-gray-500">Ubah tarif dan komponen sesuai regulasi terbaru</p>
        </div>
      </div>

      {/* Quick Info Banner */}
      <div className="bg-gradient-to-r from-teal-50 to-orange-50 border border-teal-200/60 rounded-2xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="text-sm font-semibold text-teal-800">Perubahan Langsung Aktif</p>
            <p className="text-xs text-teal-700/70 mt-0.5">
              Setiap perubahan tarif langsung diterapkan pada perhitungan berikutnya. 
              Cocok untuk menyesuaikan dengan peraturan baru tanpa perlu restart aplikasi.
            </p>
          </div>
        </div>
      </div>

      {/* BPJS Kesehatan */}
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100/60 p-5 mb-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-7 h-7 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center text-xs">🏥</span>
          BPJS Kesehatan
        </h3>
        <div className="divide-y divide-gray-100">
          <RateInput
            label="Tarif BPJS Kesehatan Perusahaan"
            value={settings.bpjsHealthCompanyRate}
            onChange={(v) => updateRate('bpjsHealthCompanyRate', v)}
          />
          <RateInput
            label="Tarif BPJS Kesehatan Karyawan"
            value={settings.bpjsHealthEmployeeRate}
            onChange={(v) => updateRate('bpjsHealthEmployeeRate', v)}
            accent="orange"
          />
        </div>
      </div>

      {/* JKK */}
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100/60 p-5 mb-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-7 h-7 bg-orange-100 text-orange-500 rounded-lg flex items-center justify-center text-xs">⚠️</span>
          JKK (Jaminan Kecelakaan Kerja)
        </h3>
        <div className="divide-y divide-gray-100">
          {(Object.keys(jkkRiskLabels) as JKKRiskLevel[]).map((level) => (
            <RateInput
              key={level}
              label={`Risiko ${jkkRiskLabels[level]}`}
              value={settings.jkkRates[level]}
              onChange={(v) => updateJkkRate(level, v)}
            />
          ))}
        </div>
      </div>

      {/* JKM */}
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100/60 p-5 mb-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-7 h-7 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center text-xs">🛡️</span>
          JKM (Jaminan Kematian)
        </h3>
        <div className="divide-y divide-gray-100">
          <RateInput
            label="Tarif JKM Perusahaan"
            value={settings.jkmCompanyRate}
            onChange={(v) => updateRate('jkmCompanyRate', v)}
          />
        </div>
      </div>

      {/* JHT */}
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100/60 p-5 mb-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-7 h-7 bg-orange-100 text-orange-500 rounded-lg flex items-center justify-center text-xs">👴</span>
          JHT (Jaminan Hari Tua)
        </h3>
        <div className="divide-y divide-gray-100">
          <RateInput
            label="Tarif JHT Perusahaan"
            value={settings.jhtCompanyRate}
            onChange={(v) => updateRate('jhtCompanyRate', v)}
            hint="Tidak termasuk penambah bruto pajak secara default"
          />
          <RateInput
            label="Tarif JHT Karyawan"
            value={settings.jhtEmployeeRate}
            onChange={(v) => updateRate('jhtEmployeeRate', v)}
            accent="orange"
          />
        </div>
      </div>

      {/* JP */}
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100/60 p-5 mb-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-7 h-7 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center text-xs">🏖️</span>
          JP (Jaminan Pensiun)
        </h3>
        <div className="divide-y divide-gray-100">
          <RateInput
            label="Tarif JP Perusahaan"
            value={settings.jpCompanyRate}
            onChange={(v) => updateRate('jpCompanyRate', v)}
            hint="Tidak termasuk penambah bruto pajak secara default"
          />
          <RateInput
            label="Tarif JP Karyawan"
            value={settings.jpEmployeeRate}
            onChange={(v) => updateRate('jpEmployeeRate', v)}
            accent="orange"
          />
        </div>
      </div>

      {/* BPJS Calculation Base */}
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100/60 p-5 mb-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-7 h-7 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center text-xs">🧮</span>
          Dasar Perhitungan BPJS
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Pilih komponen gaji yang digunakan sebagai dasar perhitungan iuran BPJS.
        </p>
        <div className="space-y-1">
          {(Object.entries(BPJS_BASE_LABELS) as [BPJSBaseComponent, string][]).map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 py-2 px-3 rounded-xl cursor-pointer hover:bg-teal-50/50 transition group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.bpjsBaseComponents[key]}
                  onChange={(e) => onUpdate({
                    ...settings,
                    bpjsBaseComponents: { ...settings.bpjsBaseComponents, [key]: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-teal-500 transition-colors"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform"></div>
              </div>
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Allowance Toggles */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100/60 p-5 mb-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-7 h-7 bg-orange-100 text-orange-500 rounded-lg flex items-center justify-center text-xs">🔄</span>
          Tunjangan Neto Nol (Allowance)
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Jika aktif, tunjangan ditambahkan ke pendapatan lalu dipotong kembali dengan nominal sama. Efek neto ke THP = 0, tapi tampil di slip gaji.
        </p>
        <div className="space-y-1">
          <label className="flex items-center gap-3 py-2 px-3 rounded-xl cursor-pointer hover:bg-orange-50/50 transition group">
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.enableBpjsAllowance}
                onChange={(e) => updateToggle('enableBpjsAllowance', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-orange-500 transition-colors"></div>
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform"></div>
            </div>
            <div>
              <span className="text-sm text-gray-700 group-hover:text-gray-900">BPJS Allowance</span>
              <p className="text-xs text-gray-400">BPJS Kesehatan karyawan 1% masuk pendapatan, lalu dipotong kembali</p>
            </div>
          </label>
          <label className="flex items-center gap-3 py-2 px-3 rounded-xl cursor-pointer hover:bg-orange-50/50 transition group">
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.enableTaxAllowance}
                onChange={(e) => updateToggle('enableTaxAllowance', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-orange-500 transition-colors"></div>
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform"></div>
            </div>
            <div>
              <span className="text-sm text-gray-700 group-hover:text-gray-900">Tax Allowance</span>
              <p className="text-xs text-gray-400">PPh 21 masuk tunjangan pajak di pendapatan, lalu dipotong kembali</p>
            </div>
          </label>
        </div>
      </div>

      {/* Komponen Bruto Pajak */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100/60 p-5 mb-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-7 h-7 bg-orange-100 text-orange-500 rounded-lg flex items-center justify-center text-xs">📊</span>
          Komponen Penambah Bruto Pajak
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Centang komponen yang dimasukkan sebagai penambah bruto untuk perhitungan PPh 21.
        </p>
        <div className="space-y-1">
          {[
            { key: 'includeBpjsHealthCompanyInTaxable' as const, label: 'BPJS Kesehatan Perusahaan', defaultOn: true },
            { key: 'includeJkkInTaxable' as const, label: 'JKK Perusahaan', defaultOn: true },
            { key: 'includeJkmInTaxable' as const, label: 'JKM Perusahaan', defaultOn: true },
            { key: 'includeJhtCompanyInTaxable' as const, label: 'JHT Perusahaan', defaultOn: false },
            { key: 'includeJpCompanyInTaxable' as const, label: 'JP Perusahaan', defaultOn: false },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 py-2 px-3 rounded-xl cursor-pointer hover:bg-teal-50/50 transition group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings[key] as boolean}
                  onChange={(e) => updateToggle(key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-teal-500 transition-colors"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform"></div>
              </div>
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Info Metode Pajak */}
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100/60 p-5 mb-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-7 h-7 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center text-xs">📝</span>
          Metode Pajak
        </h3>
        <div className="bg-gradient-to-r from-teal-50 to-orange-50 border border-teal-200/60 rounded-xl p-4 text-sm">
          <p className="font-semibold text-teal-800">TER Bulanan (Tarif Efektif Rata-rata)</p>
          <p className="text-teal-700/70 text-xs mt-1.5 leading-relaxed">
            <strong>Januari–November:</strong> Menggunakan tarif TER bulanan berdasarkan PP 58/2023.<br />
            <strong>Desember:</strong> Memerlukan rekalkulasi tahunan (annualized recalculation).
          </p>
        </div>
      </div>

      <button
        onClick={onBack}
        className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-2xl transition-all shadow-sm shadow-teal-200 text-sm"
      >
        ✅ Simpan & Kembali ke Kalkulator
      </button>
    </div>
  );
}
