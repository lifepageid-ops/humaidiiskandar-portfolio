import { PayrollResult } from '../types/payroll';
import { formatRupiah, formatPercent } from '../utils/format';
import { generatePayslipBreakdown } from '../engine/payrollEngine';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PayslipResultProps {
  result: PayrollResult;
}

const bulanNames = [
  '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export default function PayslipResult({ result }: PayslipResultProps) {
  const breakdown = generatePayslipBreakdown(result);
  const hasCustomDeductions = result.processedCustomDeductions.length > 0;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const { employee } = result;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('SLIP GAJI KARYAWAN', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Periode: ${bulanNames[employee.payrollMonth]} ${employee.payrollYear}`, 105, 28, { align: 'center' });
    doc.line(14, 32, 196, 32);

    doc.setFontSize(10);
    const infoData = [
      ['Nama', employee.name],
      ['NIK / ID', employee.employeeId],
      ['Jabatan', employee.position],
      ['Status Pajak', `${employee.taxStatus} (TER ${result.terCategory})`],
    ];
    autoTable(doc, {
      startY: 36,
      body: infoData,
      theme: 'plain',
      styles: { fontSize: 9 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
    });

    const incomeData = Object.entries(breakdown.pendapatan).map(([k, v]) => [k, formatRupiah(v)]);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 6,
      head: [['PENDAPATAN', '']],
      body: incomeData,
      theme: 'grid',
      headStyles: { fillColor: [13, 148, 136], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 1: { halign: 'right', cellWidth: 60 } },
    });

    const companyData = Object.entries(breakdown.penambahBrutoPajak).map(([k, v]) => [k, formatRupiah(v)]);
    companyData.push(['Total Penambah Bruto Pajak', formatRupiah(result.companyContributions.totalTaxableAdditions)]);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 4,
      head: [['PENAMBAH BRUTO PAJAK (Dibayar Perusahaan)', '']],
      body: companyData,
      theme: 'grid',
      headStyles: { fillColor: [13, 148, 136], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 1: { halign: 'right', cellWidth: 60 } },
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 4,
      body: [
        ['Penghasilan Bruto PPh 21', formatRupiah(result.taxableGrossIncome)],
        ['Kategori TER', `TER ${result.terCategory}`],
        ['Tarif TER', formatPercent(result.terRate)],
        ['PPh 21', formatRupiah(result.pph21)],
      ],
      theme: 'grid',
      bodyStyles: { fontSize: 9, fontStyle: 'bold' },
      columnStyles: { 1: { halign: 'right', cellWidth: 60 } },
    });

    const deductionData = Object.entries(breakdown.potonganKaryawan).map(([k, v]) => [k, formatRupiah(v)]);
    deductionData.push(['Total Potongan BPJS', formatRupiah(breakdown.totalPotonganBpjs)]);
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 4,
      head: [['POTONGAN KARYAWAN', '']],
      body: deductionData,
      theme: 'grid',
      headStyles: { fillColor: [234, 88, 12], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 1: { halign: 'right', cellWidth: 60 } },
    });

    if (hasCustomDeductions) {
      const customData = result.processedCustomDeductions.map((d) => [d.name, formatRupiah(d.amount)]);
      customData.push(['Total Potongan Tambahan', formatRupiah(result.totalCustomDeductions)]);
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 4,
        head: [['POTONGAN TAMBAHAN', '']],
        body: customData,
        theme: 'grid',
        headStyles: { fillColor: [234, 88, 12], fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        columnStyles: { 1: { halign: 'right', cellWidth: 60 } },
      });
    }

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 6,
      body: [['TAKE HOME PAY', formatRupiah(result.takeHomePay)]],
      theme: 'grid',
      bodyStyles: { fontSize: 12, fontStyle: 'bold', textColor: [13, 148, 136] },
      columnStyles: { 1: { halign: 'right', cellWidth: 60 } },
    });

    doc.save(`slip-gaji-${employee.name.replace(/\s+/g, '_')}-${bulanNames[employee.payrollMonth]}-${employee.payrollYear}.pdf`);
  };

  return (
    <div className="space-y-4">
      {result.isDecember && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-sm text-amber-800">
          ⚠️ <strong>Bulan Desember:</strong> Perhitungan PPh 21 bulan Desember memerlukan rekalkulasi tahunan (annualized). 
          Hasil di bawah menggunakan metode TER bulanan biasa dan bersifat estimasi.
        </div>
      )}

      {/* Employee Info Card */}
      <div className="bg-gradient-to-br from-teal-600 via-teal-500 to-teal-700 rounded-2xl p-5 text-white shadow-lg shadow-teal-200/50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-teal-200 text-xs uppercase tracking-wider font-medium">Slip Gaji</p>
            <h2 className="text-xl font-bold mt-1">{result.employee.name}</h2>
            <p className="text-teal-200 text-sm">{result.employee.position} &bull; {result.employee.employeeId}</p>
          </div>
          <div className="text-right">
            <p className="text-teal-200 text-xs">Periode</p>
            <p className="font-semibold">{bulanNames[result.employee.payrollMonth]} {result.employee.payrollYear}</p>
            <p className="text-teal-200 text-xs mt-1">Status: {result.employee.taxStatus} &bull; TER {result.terCategory}</p>
          </div>
        </div>
      </div>

      {/* Pendapatan */}
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100/60 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100/50 px-4 py-2.5 border-b border-teal-100">
          <h3 className="font-semibold text-teal-800 text-sm">💵 Pendapatan</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {Object.entries(breakdown.pendapatan).map(([label, amount]) => (
            <div key={label} className="flex justify-between px-4 py-2.5 text-sm">
              <span className="text-gray-600">{label}</span>
              <span className="font-medium text-gray-900">{formatRupiah(amount)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Penambah Bruto Pajak */}
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100/60 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 px-4 py-2.5 border-b border-teal-100">
          <h3 className="font-semibold text-teal-800 text-sm">🏢 Penambah Bruto Pajak (Dibayar Perusahaan)</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {Object.entries(breakdown.penambahBrutoPajak).map(([label, amount]) => (
            <div key={label} className="flex justify-between px-4 py-2.5 text-sm">
              <span className="text-gray-600">{label}</span>
              <span className="font-medium text-gray-900">{formatRupiah(amount)}</span>
            </div>
          ))}
          <div className="flex justify-between px-4 py-2.5 text-sm bg-teal-50/50 font-semibold">
            <span className="text-teal-800">Total Penambah Bruto Pajak</span>
            <span className="text-teal-800">{formatRupiah(result.companyContributions.totalTaxableAdditions)}</span>
          </div>
        </div>
      </div>

      {/* Company Benefits (separate from employee income) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/60 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-4 py-2.5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-600 text-sm">🏛️ Benefit Perusahaan (Tidak Menambah THP)</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {Object.entries(breakdown.companyBenefits).map(([label, amount]) => (
            <div key={label} className="flex justify-between px-4 py-2.5 text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-gray-500">{formatRupiah(amount)}</span>
            </div>
          ))}
          <div className="flex justify-between px-4 py-2.5 text-sm bg-gray-50/50 font-semibold">
            <span className="text-gray-600">Total Benefit Perusahaan</span>
            <span className="text-gray-600">{formatRupiah(breakdown.companyBenefitsTotal)}</span>
          </div>
        </div>
      </div>

      {/* BPJS Base Info */}
      {result.bpjsBase !== result.baseSalary && (
        <div className="bg-teal-50/60 border border-teal-200/60 rounded-xl px-4 py-2.5 text-sm text-teal-700 flex justify-between">
          <span>📐 Dasar Perhitungan BPJS</span>
          <span className="font-semibold">{formatRupiah(result.bpjsBase)}</span>
        </div>
      )}

      {/* Bruto PPh 21 */}
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100/60 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2.5 border-b border-orange-100">
          <h3 className="font-semibold text-orange-800 text-sm">
            📊 Perhitungan PPh 21 (TER Bulanan)
            {result.taxAllowance > 0 && <span className="ml-2 text-[10px] bg-orange-200 text-orange-800 px-1.5 py-0.5 rounded-md font-bold">GROSS-UP</span>}
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {result.taxAllowance > 0 && (
            <div className="px-4 py-2 bg-amber-50/40">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Bruto Sebelum Tunjangan Pajak</span>
                <span className="font-medium text-gray-700">{formatRupiah(result.taxableGrossIncome - result.taxAllowance)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                <span>Formula: bruto × {formatPercent(result.terRate)} ÷ (1 - {formatPercent(result.terRate)})</span>
              </div>
            </div>
          )}
          <div className="flex justify-between px-4 py-2.5 text-sm">
            <span className="text-gray-600">{result.taxAllowance > 0 ? 'Bruto Final Pajak (termasuk Tunj. Pajak)' : 'Penghasilan Bruto PPh 21'}</span>
            <span className="font-semibold text-gray-900">{formatRupiah(result.taxableGrossIncome)}</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 text-sm">
            <span className="text-gray-600">Kategori TER</span>
            <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md text-xs">TER {result.terCategory}</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 text-sm">
            <span className="text-gray-600">Tarif TER</span>
            <span className="font-medium text-gray-900">{formatPercent(result.terRate)}</span>
          </div>
          {result.taxAllowance > 0 && (
            <div className="flex justify-between px-4 py-2.5 text-sm bg-teal-50/40">
              <span className="text-teal-700">Tunjangan Pajak (PPh 21 ditanggung perusahaan)</span>
              <span className="font-semibold text-teal-700">+ {formatRupiah(result.taxAllowance)}</span>
            </div>
          )}
          <div className="flex justify-between px-4 py-2.5 text-sm bg-orange-50/50 font-semibold">
            <span className="text-orange-800">PPh 21</span>
            <span className="text-orange-600">- {formatRupiah(result.pph21)}</span>
          </div>
        </div>
      </div>

      {/* Potongan Karyawan */}
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100/60 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 px-4 py-2.5 border-b border-orange-100">
          <h3 className="font-semibold text-orange-800 text-sm">✂️ Potongan Karyawan</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <div className="flex justify-between px-4 py-2.5 text-sm">
            <span className="text-gray-600">BPJS Kesehatan Karyawan</span>
            <span className="font-medium text-gray-900">- {formatRupiah(result.employeeDeductions.bpjsHealthEmployee)}</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 text-sm">
            <span className="text-gray-600">JHT Karyawan</span>
            <span className="font-medium text-gray-900">- {formatRupiah(result.employeeDeductions.jhtEmployee)}</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 text-sm">
            <span className="text-gray-600">JP Karyawan</span>
            <span className="font-medium text-gray-900">- {formatRupiah(result.employeeDeductions.jpEmployee)}</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 text-sm bg-orange-50/40">
            <span className="text-gray-600 font-medium">Total Potongan BPJS</span>
            <span className="font-semibold text-orange-600">- {formatRupiah(result.employeeDeductions.totalBpjsDeductions)}</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 text-sm bg-orange-50/40">
            <span className="text-gray-600 font-medium">PPh 21</span>
            <span className="font-semibold text-orange-600">- {formatRupiah(result.pph21)}</span>
          </div>
        </div>
      </div>

      {/* Potongan Custom */}
      {hasCustomDeductions && (
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100/60 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2.5 border-b border-orange-100">
            <h3 className="font-semibold text-orange-800 text-sm">🏷️ Potongan Tambahan</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {result.processedCustomDeductions.map((d) => (
              <div key={d.id} className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-gray-600">{d.name}</span>
                <span className="font-medium text-orange-600">- {formatRupiah(d.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between px-4 py-2.5 text-sm bg-orange-50/40 font-semibold">
              <span className="text-orange-700">Total Potongan Tambahan</span>
              <span className="text-orange-600">- {formatRupiah(result.totalCustomDeductions)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Take Home Pay */}
      <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 rounded-2xl p-5 text-white shadow-lg shadow-teal-200/50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-teal-100 text-xs uppercase tracking-wider font-medium">Take Home Pay</p>
            <p className="text-3xl font-bold mt-1">{formatRupiah(result.takeHomePay)}</p>
            {hasCustomDeductions && (
              <p className="text-teal-200 text-xs mt-1">Setelah potongan tambahan</p>
            )}
          </div>
          <div className="text-4xl">💸</div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownloadPDF}
        className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-semibold py-3 px-4 rounded-2xl transition-all shadow-sm text-sm flex items-center justify-center gap-2"
      >
        📄 Download Slip Gaji PDF
      </button>
    </div>
  );
}
