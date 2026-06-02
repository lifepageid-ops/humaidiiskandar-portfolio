import { useState } from 'react';
import { Employee, PayrollResult, PayrollSettings } from './types/payroll';
import { calculatePayroll } from './engine/payrollEngine';
import { defaultPayrollSettings } from './config/defaultSettings';
import EmployeeForm from './components/EmployeeForm';
import PayslipResult from './components/PayslipResult';
import Settings from './components/Settings';

type Page = 'dashboard' | 'settings';

function PayrollApp() {
  const [page, setPage] = useState<Page>('dashboard');
  const [settings, setSettings] = useState<PayrollSettings>(defaultPayrollSettings);
  const [result, setResult] = useState<PayrollResult | null>(null);
  const [savedEmployees, setSavedEmployees] = useState<Employee[]>([]);
  const [showSavedList, setShowSavedList] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCalculate = (employee: Employee) => {
    const payrollResult = calculatePayroll(employee, settings);
    setResult(payrollResult);
    showToast('Payroll berhasil dihitung!');
  };

  const handleSaveEmployee = (employee: Employee) => {
    setSavedEmployees((prev) => {
      const existing = prev.findIndex((e) => e.employeeId === employee.employeeId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = employee;
        return updated;
      }
      return [...prev, employee];
    });
    showToast(`Karyawan "${employee.name}" berhasil disimpan!`);
  };

  const handleLoadEmployee = (employee: Employee) => {
    handleCalculate(employee);
    setShowSavedList(false);
  };

  if (page === 'settings') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/20 to-orange-50/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Settings
            settings={settings}
            onUpdate={setSettings}
            onBack={() => setPage('dashboard')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/20 to-orange-50/20">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-teal-600 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-teal-200/50 text-sm font-medium">
          {toast}
        </div>
      )}

      <header className="bg-white/80 backdrop-blur-md border-b border-teal-100/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
              <img src="/images/clay-icon.png" alt="Humedly Payroll" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Humedly <span className="text-teal-600">Payroll</span></h1>
              <p className="text-xs text-gray-400">Sistem Penggajian Karyawan Otomatis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {savedEmployees.length > 0 && (
              <button
                onClick={() => setShowSavedList(!showSavedList)}
                className="px-3 py-2 text-sm bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl transition font-medium border border-teal-200/60"
              >
                👥 Karyawan ({savedEmployees.length})
              </button>
            )}
            <button
              onClick={() => setPage('settings')}
              className="px-3 py-2 text-sm bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 rounded-xl transition font-medium border border-orange-200/60"
            >
              ⚙️ Pengaturan
            </button>
          </div>
        </div>
      </header>

      {showSavedList && savedEmployees.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-2">
          <div className="bg-white rounded-2xl shadow-lg border border-teal-100/60 p-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Karyawan Tersimpan</h3>
            <div className="space-y-1">
              {savedEmployees.map((emp) => (
                <button
                  key={emp.employeeId}
                  onClick={() => handleLoadEmployee(emp)}
                  className="w-full text-left px-3 py-2.5 hover:bg-teal-50 rounded-xl text-sm transition flex justify-between items-center group"
                >
                  <div>
                    <span className="font-medium text-gray-800 group-hover:text-teal-700">{emp.name}</span>
                    <span className="text-gray-400 ml-2 text-xs">{emp.employeeId}</span>
                  </div>
                  <span className="text-xs bg-teal-50 text-teal-600 px-2 py-0.5 rounded-md font-medium">{emp.taxStatus}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        {!result && (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-2xl shadow-sm border border-teal-200/60 p-4">
                <p className="text-xs text-teal-600 uppercase tracking-wider font-medium">Metode Pajak</p>
                <p className="text-lg font-bold text-teal-800 mt-1">TER Bulanan</p>
                <p className="text-xs text-teal-600/60 mt-0.5">PP 58 Tahun 2023</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl shadow-sm border border-orange-200/60 p-4">
                <p className="text-xs text-orange-600 uppercase tracking-wider font-medium">Karyawan Tersimpan</p>
                <p className="text-lg font-bold text-orange-800 mt-1">{savedEmployees.length}</p>
                <p className="text-xs text-orange-600/60 mt-0.5">Data karyawan</p>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-orange-50 rounded-2xl shadow-sm border border-teal-200/60 p-4">
                <p className="text-xs text-teal-600 uppercase tracking-wider font-medium">Tahun Pajak</p>
                <p className="text-lg font-bold text-gray-800 mt-1">2026</p>
                <p className="text-xs text-gray-500 mt-0.5">Jan-Nov: TER | Des: Annualized</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-teal-500 rounded-full"></span>
              Input Data Karyawan
            </h2>
            <EmployeeForm
              onCalculate={handleCalculate}
              onSaveEmployee={handleSaveEmployee}
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
              Hasil Perhitungan
            </h2>
            {result ? (
              <PayslipResult result={result} />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-teal-100/60 p-8 text-center">
                <div className="text-5xl mb-4">🧮</div>
                <h3 className="text-lg font-semibold text-gray-700">Belum Ada Perhitungan</h3>
                <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
                  Isi data karyawan di sebelah kiri, lalu klik <strong className="text-teal-600">"Hitung Payroll"</strong> untuk melihat rincian slip gaji.
                </p>
                <div className="mt-6 bg-gradient-to-br from-teal-50 to-orange-50 rounded-xl p-4 text-left text-xs max-w-sm mx-auto border border-teal-100/60">
                  <p className="font-semibold text-teal-700 mb-2">Contoh Simulasi:</p>
                  <ul className="space-y-1.5 text-gray-600">
                    <li className="flex justify-between"><span>• Gaji Pokok</span><span className="font-medium">Rp 6.000.000</span></li>
                    <li className="flex justify-between"><span>• Status Pajak</span><span className="font-medium">TK/0 (TER A)</span></li>
                    <li className="flex justify-between"><span>• Risiko JKK</span><span className="font-medium">Sangat Rendah</span></li>
                    <li className="flex justify-between pt-1 border-t border-teal-200/60">
                      <span className="font-semibold text-teal-700">• THP</span>
                      <span className="font-bold text-teal-700">Rp 5.712.957</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-teal-100/60 mt-12 py-6 text-center text-xs text-gray-400">
        <p>Humedly <span className="text-teal-600 font-medium">Payroll</span> © 2026 • Perhitungan PPh 21 berdasarkan PP 58 Tahun 2023 (TER)</p>
        <p className="mt-1">Aplikasi ini bersifat simulasi. Konsultasikan dengan konsultan pajak untuk perhitungan final.</p>
      </footer>
    </div>
  );
}

export default PayrollApp;
