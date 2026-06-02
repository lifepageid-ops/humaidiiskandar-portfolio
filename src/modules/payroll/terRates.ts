import { useState } from 'react';
import { Employee, TaxStatus, JKKRiskLevel, CustomDeduction, VoluntaryDeductionCategory, VOLUNTARY_CATEGORY_LABELS } from '../types/payroll';
import { formatRupiahInput } from '../utils/format';

interface EmployeeFormProps {
  onCalculate: (employee: Employee) => void;
  onSaveEmployee?: (employee: Employee) => void;
}

const taxStatusOptions: TaxStatus[] = ['TK/0', 'TK/1', 'TK/2', 'TK/3', 'K/0', 'K/1', 'K/2', 'K/3'];

const jkkRiskOptions: { value: JKKRiskLevel; label: string; rate: string }[] = [
  { value: 'sangat_rendah', label: 'Sangat Rendah', rate: '0,24%' },
  { value: 'rendah', label: 'Rendah', rate: '0,54%' },
  { value: 'sedang', label: 'Sedang', rate: '1%' },
  { value: 'tinggi', label: 'Tinggi', rate: '1,74%' },
  { value: 'sangat_tinggi', label: 'Sangat Tinggi', rate: '3%' },
];

const bulanOptions = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' },
];

export default function EmployeeForm({ onCalculate, onSaveEmployee }: EmployeeFormProps) {
  const [name, setName] = useState('Karyawan Contoh');
  const [employeeId, setEmployeeId] = useState('EMP-001');
  const [position, setPosition] = useState('Admin');
  const [taxStatus, setTaxStatus] = useState<TaxStatus>('TK/0');
  const [baseSalary, setBaseSalary] = useState('6.000.000');
  const [fixedAllowance, setFixedAllowance] = useState('');
  const [variableAllowance, setVariableAllowance] = useState('');
  const [communicationAllowance, setCommunicationAllowance] = useState('');
  const [positionAllowance, setPositionAllowance] = useState('');
  const [performanceAllowance, setPerformanceAllowance] = useState('');
  const [otherAllowance, setOtherAllowance] = useState('');
  const [jkkRiskLevel, setJkkRiskLevel] = useState<JKKRiskLevel>('sangat_rendah');
  const [payrollMonth, setPayrollMonth] = useState(1);
  const [payrollYear, setPayrollYear] = useState(2026);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customDeductions, setCustomDeductions] = useState<CustomDeduction[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [newDeductionName, setNewDeductionName] = useState('');
  const [newDeductionAmount, setNewDeductionAmount] = useState('');
  const [newDeductionType, setNewDeductionType] = useState<'fixed' | 'percentage'>('fixed');
  const [newDeductionCategory, setNewDeductionCategory] = useState<VoluntaryDeductionCategory | 'custom'>('custom');
  const [showExtraAllowances, setShowExtraAllowances] = useState(false);

  const getTerCategory = (status: TaxStatus) => {
    if (['TK/0', 'TK/1', 'K/0'].includes(status)) return 'A';
    if (['TK/2', 'TK/3', 'K/1', 'K/2'].includes(status)) return 'B';
    return 'C';
  };

  const parseAmount = (val: string): number => {
    const cleaned = val.replace(/\./g, '').replace(/[^0-9]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const salary = parseAmount(baseSalary);

    if (!name.trim()) newErrors.name = 'Nama karyawan wajib diisi';
    if (!employeeId.trim()) newErrors.employeeId = 'NIK/Employee ID wajib diisi';
    if (!baseSalary || salary <= 0) newErrors.baseSalary = 'Gaji pokok harus angka positif';
    if (!taxStatus) newErrors.taxStatus = 'Status pajak wajib dipilih';
    if (!payrollMonth) newErrors.payrollMonth = 'Bulan payroll wajib dipilih';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const empBase = {
      name: name.trim(),
      employeeId: employeeId.trim(),
      position: position.trim(),
      taxStatus,
      baseSalary: parseAmount(baseSalary),
      fixedAllowance: parseAmount(fixedAllowance),
      variableAllowance: parseAmount(variableAllowance),
      communicationAllowance: parseAmount(communicationAllowance),
      positionAllowance: parseAmount(positionAllowance),
      performanceAllowance: parseAmount(performanceAllowance),
      otherAllowance: parseAmount(otherAllowance),
      jkkRiskLevel,
      payrollMonth,
      payrollYear,
      customDeductions,
    };

    onCalculate(empBase);
  };

  const handleSave = () => {
    if (!validate()) return;
    const empBase: Employee = {
      name: name.trim(),
      employeeId: employeeId.trim(),
      position: position.trim(),
      taxStatus,
      baseSalary: parseAmount(baseSalary),
      fixedAllowance: parseAmount(fixedAllowance),
      variableAllowance: parseAmount(variableAllowance),
      communicationAllowance: parseAmount(communicationAllowance),
      positionAllowance: parseAmount(positionAllowance),
      performanceAllowance: parseAmount(performanceAllowance),
      otherAllowance: parseAmount(otherAllowance),
      jkkRiskLevel,
      payrollMonth,
      payrollYear,
      customDeductions,
    };
    onSaveEmployee?.(empBase);
  };

  const addCustomDeduction = () => {
    if (!newDeductionName.trim() || !newDeductionAmount) return;
    const deduction: CustomDeduction = {
      id: Date.now().toString(),
      name: newDeductionName.trim(),
      amount: parseAmount(newDeductionAmount),
      type: newDeductionType,
      category: newDeductionCategory,
    };
    setCustomDeductions((prev) => [...prev, deduction]);
    setNewDeductionName('');
    setNewDeductionAmount('');
    setNewDeductionCategory('custom');
    setShowCustomForm(false);
  };

  const removeCustomDeduction = (id: string) => {
    setCustomDeductions((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Data Karyawan */}
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100/60 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center text-sm">👤</span>
          Data Karyawan
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nama Karyawan</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all ${errors.name ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/50 hover:border-teal-200'}`}
              placeholder="Masukkan nama karyawan"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">NIK / Employee ID</label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all ${errors.employeeId ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/50 hover:border-teal-200'}`}
                placeholder="EMP-001"
              />
              {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Jabatan</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 bg-gray-50/50 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all hover:border-teal-200"
                placeholder="Admin"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Pajak */}
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100/60 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center text-sm">📋</span>
          Status Pajak & TER
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Status PTKP</label>
            <select
              value={taxStatus}
              onChange={(e) => setTaxStatus(e.target.value as TaxStatus)}
              className="w-full px-3 py-2.5 border border-gray-200 bg-gray-50/50 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all hover:border-teal-200"
            >
              {taxStatusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Kategori TER</label>
            <div className="px-3 py-2.5 bg-gradient-to-r from-teal-50 to-orange-50 border border-teal-200 rounded-xl text-sm font-bold text-teal-700">
              TER {getTerCategory(taxStatus)}
            </div>
          </div>
        </div>
      </div>

      {/* Gaji & Tunjangan */}
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100/60 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-amber-100 text-amber-500 rounded-xl flex items-center justify-center text-sm">💰</span>
          Gaji & Tunjangan
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Gaji Pokok (Rp)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 text-sm font-medium">Rp</span>
              <input
                type="text"
                value={baseSalary}
                onChange={(e) => setBaseSalary(formatRupiahInput(e.target.value))}
                className={`w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all ${errors.baseSalary ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/50 hover:border-teal-200'}`}
                placeholder="6.000.000"
              />
            </div>
            {errors.baseSalary && <p className="text-red-500 text-xs mt-1">{errors.baseSalary}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Tunjangan Tetap <span className="text-gray-400">(opsional)</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                <input
                  type="text"
                  value={fixedAllowance}
                  onChange={(e) => setFixedAllowance(formatRupiahInput(e.target.value))}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 bg-gray-50/50 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all hover:border-teal-200"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Tunjangan Tidak Tetap <span className="text-gray-400">(opsional)</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                <input
                  type="text"
                  value={variableAllowance}
                  onChange={(e) => setVariableAllowance(formatRupiahInput(e.target.value))}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 bg-gray-50/50 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all hover:border-teal-200"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          {/* Extra allowances toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowExtraAllowances(!showExtraAllowances)}
              className="w-full text-left text-sm text-teal-600 hover:text-teal-700 font-medium py-1 flex items-center gap-1"
            >
              {showExtraAllowances ? '▾' : '▸'} Tunjangan Lainnya (Komunikasi, Jabatan, Kinerja, dll)
            </button>
            {showExtraAllowances && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tunj. Komunikasi</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
                    <input type="text" value={communicationAllowance} onChange={(e) => setCommunicationAllowance(formatRupiahInput(e.target.value))} className="w-full pl-8 pr-3 py-2 border border-gray-200 bg-gray-50/50 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 hover:border-teal-200" placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tunj. Jabatan</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
                    <input type="text" value={positionAllowance} onChange={(e) => setPositionAllowance(formatRupiahInput(e.target.value))} className="w-full pl-8 pr-3 py-2 border border-gray-200 bg-gray-50/50 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 hover:border-teal-200" placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tunj. Kinerja</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
                    <input type="text" value={performanceAllowance} onChange={(e) => setPerformanceAllowance(formatRupiahInput(e.target.value))} className="w-full pl-8 pr-3 py-2 border border-gray-200 bg-gray-50/50 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 hover:border-teal-200" placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Komponen Lain</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
                    <input type="text" value={otherAllowance} onChange={(e) => setOtherAllowance(formatRupiahInput(e.target.value))} className="w-full pl-8 pr-3 py-2 border border-gray-200 bg-gray-50/50 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 hover:border-teal-200" placeholder="0" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Potongan Sukarela */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100/60 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center text-sm">✂️</span>
          Potongan Sukarela / Non-Wajib
          <span className="text-xs text-gray-400 font-normal">(Wakaf, Koperasi, Kasbon, dll)</span>
        </h3>

        {/* Existing custom deductions */}
        {customDeductions.length > 0 && (
          <div className="space-y-2 mb-3">
            {customDeductions.map((d) => (
              <div key={d.id} className="flex items-center justify-between bg-orange-50/60 border border-orange-100 rounded-xl px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-orange-400">•</span>
                  <span className="text-sm font-medium text-gray-700">{d.name}</span>
                  {d.category && d.category !== 'custom' && (
                    <span className="text-[10px] bg-orange-200/60 text-orange-700 px-1.5 py-0.5 rounded-md font-medium">{VOLUNTARY_CATEGORY_LABELS[d.category as VoluntaryDeductionCategory]}</span>
                  )}
                  <span className="text-xs text-gray-400">({d.type === 'fixed' ? 'Nominal' : `${d.amount}%`})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-orange-600">
                    {d.type === 'fixed' ? `Rp ${d.amount.toLocaleString('id-ID')}` : `${d.amount}%`}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCustomDeduction(d.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-1 transition"
                    title="Hapus potongan"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add new deduction form */}
        {showCustomForm ? (
          <div className="bg-gradient-to-r from-orange-50 to-teal-50 border border-orange-200 rounded-xl p-3 space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Kategori Potongan</label>
              <select
                value={newDeductionCategory}
                onChange={(e) => {
                  const cat = e.target.value as VoluntaryDeductionCategory | 'custom';
                  setNewDeductionCategory(cat);
                  if (cat !== 'custom') {
                    setNewDeductionName(VOLUNTARY_CATEGORY_LABELS[cat as VoluntaryDeductionCategory]);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 bg-white"
              >
                <option value="custom">-- Pilih Kategori --</option>
                {(Object.entries(VOLUNTARY_CATEGORY_LABELS) as [VoluntaryDeductionCategory, string][]).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={newDeductionName}
              onChange={(e) => setNewDeductionName(e.target.value)}
              placeholder="Nama potongan (cth: Wakaf, Koperasi, Hutang)"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newDeductionType}
                onChange={(e) => setNewDeductionType(e.target.value as 'fixed' | 'percentage')}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 bg-white"
              >
                <option value="fixed">Nominal Tetap (Rp)</option>
                <option value="percentage">Persen dari Gaji (%)</option>
              </select>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                  {newDeductionType === 'fixed' ? 'Rp' : '%'}
                </span>
                <input
                  type="text"
                  value={newDeductionAmount}
                  onChange={(e) => setNewDeductionAmount(
                    newDeductionType === 'fixed'
                      ? formatRupiahInput(e.target.value)
                      : e.target.value.replace(/[^0-9]/g, '')
                  )}
                  placeholder={newDeductionType === 'fixed' ? '500.000' : '2.5'}
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addCustomDeduction}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 rounded-lg transition"
              >
                ✓ Tambahkan
              </button>
              <button
                type="button"
                onClick={() => { setShowCustomForm(false); setNewDeductionName(''); setNewDeductionAmount(''); }}
                className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-600 text-sm font-medium py-2 rounded-lg transition"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowCustomForm(true)}
            className="w-full border-2 border-dashed border-orange-200 hover:border-orange-400 text-orange-500 hover:text-orange-600 font-medium py-2.5 rounded-xl text-sm transition-all hover:bg-orange-50/50"
          >
            + Tambah Potongan (Hutang / Wakaf / Koperasi / Lainnya)
          </button>
        )}
      </div>

      {/* BPJS & Periode */}
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100/60 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center text-sm">🏥</span>
          BPJS & Periode Payroll
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Risiko JKK</label>
            <select
              value={jkkRiskLevel}
              onChange={(e) => setJkkRiskLevel(e.target.value as JKKRiskLevel)}
              className="w-full px-3 py-2.5 border border-gray-200 bg-gray-50/50 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all hover:border-teal-200"
            >
              {jkkRiskOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.rate})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Bulan Payroll</label>
              <select
                value={payrollMonth}
                onChange={(e) => setPayrollMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 bg-gray-50/50 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all hover:border-teal-200"
              >
                {bulanOptions.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Tahun</label>
              <input
                type="number"
                value={payrollYear}
                onChange={(e) => setPayrollYear(parseInt(e.target.value) || 2026)}
                className="w-full px-3 py-2.5 border border-gray-200 bg-gray-50/50 rounded-xl text-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all hover:border-teal-200"
                min={2020}
                max={2030}
              />
            </div>
          </div>
          {payrollMonth === 12 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
              ⚠️ <strong>Perhatian:</strong> Perhitungan bulan Desember memerlukan rekalkulasi tahunan PPh 21. 
              Hasil yang ditampilkan saat ini menggunakan metode TER bulanan biasa dan mungkin berbeda dari perhitungan final.
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm shadow-teal-200 text-sm"
        >
          🔢 Hitung Payroll
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm shadow-orange-200 text-sm"
        >
          💾 Simpan Karyawan
        </button>
      </div>
    </form>
  );
}
