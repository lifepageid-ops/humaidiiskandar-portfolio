import {
  Employee,
  PayrollSettings,
  PayrollResult,
  TERCategory,
  CompanyContributions,
  CompanyBenefits,
  EmployeeDeductions,
  ProcessedCustomDeduction,
} from '../types/payroll';
import { terRateTable } from '../config/terRates';

/**
 * Menentukan kategori TER berdasarkan status pajak karyawan.
 * - TER A: TK/0, TK/1, K/0
 * - TER B: TK/2, TK/3, K/1, K/2
 * - TER C: K/3
 */
export function determineTERCategory(taxStatus: string): TERCategory {
  const terAMapping = ['TK/0', 'TK/1', 'K/0'];
  const terBMapping = ['TK/2', 'TK/3', 'K/1', 'K/2'];

  if (terAMapping.includes(taxStatus)) return 'A';
  if (terBMapping.includes(taxStatus)) return 'B';
  return 'C'; // K/3
}

/**
 * Menentukan tarif TER berdasarkan kategori dan penghasilan bruto.
 */
export function determineTERRate(category: TERCategory, taxableIncome: number): number {
  const brackets = terRateTable[category];

  for (const bracket of brackets) {
    if (taxableIncome > bracket.minIncome && taxableIncome <= bracket.maxIncome) {
      return bracket.rate;
    }
  }

  // Fallback: jika di atas semua bracket, gunakan rate tertinggi
  return brackets[brackets.length - 1].rate;
}

/**
 * Menghitung dasar perhitungan BPJS berdasarkan komponen yang diaktifkan.
 */
export function calculateBpjsBase(
  employee: Employee,
  settings: PayrollSettings
): number {
  let base = 0;
  const components = settings.bpjsBaseComponents;
  if (components.baseSalary) base += employee.baseSalary;
  if (components.fixedAllowance) base += employee.fixedAllowance;
  if (components.communicationAllowance) base += (employee.communicationAllowance || 0);
  if (components.positionAllowance) base += (employee.positionAllowance || 0);
  if (components.performanceAllowance) base += (employee.performanceAllowance || 0);
  if (components.otherAllowance) base += (employee.otherAllowance || 0);
  return base;
}

/**
 * Menghitung iuran/kontribusi perusahaan.
 * Menggunakan BPJS base yang bisa dikonfigurasi.
 */
export function calculateCompanyContributions(
  employee: Employee,
  settings: PayrollSettings
): CompanyContributions {
  const bpjsBase = calculateBpjsBase(employee, settings);

  const bpjsHealthCompany = Math.round(settings.bpjsHealthCompanyRate * bpjsBase);
  const jkk = Math.round(settings.jkkRates[employee.jkkRiskLevel] * bpjsBase);
  const jkm = Math.round(settings.jkmCompanyRate * bpjsBase);
  const jhtCompany = Math.round(settings.jhtCompanyRate * bpjsBase);
  const jpCompany = Math.round(settings.jpCompanyRate * bpjsBase);

  let totalTaxableAdditions = 0;
  if (settings.includeBpjsHealthCompanyInTaxable) totalTaxableAdditions += bpjsHealthCompany;
  if (settings.includeJkkInTaxable) totalTaxableAdditions += jkk;
  if (settings.includeJkmInTaxable) totalTaxableAdditions += jkm;
  if (settings.includeJhtCompanyInTaxable) totalTaxableAdditions += jhtCompany;
  if (settings.includeJpCompanyInTaxable) totalTaxableAdditions += jpCompany;

  return {
    bpjsHealthCompany,
    jkk,
    jkm,
    jhtCompany,
    jpCompany,
    totalTaxableAdditions,
  };
}

/**
 * Menghitung benefit perusahaan (ditampilkan di slip, tidak menambah THP).
 */
export function calculateCompanyBenefits(
  companyContributions: CompanyContributions
): CompanyBenefits {
  const total =
    companyContributions.bpjsHealthCompany +
    companyContributions.jkk +
    companyContributions.jkm +
    companyContributions.jhtCompany +
    companyContributions.jpCompany;
  return {
    bpjsHealthCompany: companyContributions.bpjsHealthCompany,
    jkk: companyContributions.jkk,
    jkm: companyContributions.jkm,
    jhtCompany: companyContributions.jhtCompany,
    jpCompany: companyContributions.jpCompany,
    total,
  };
}

/**
 * Menghitung bruto sebelum tunjangan pajak.
 * Komponen: gajiPokok + bpjsAllowance + tunjanganKomunikasi + tunjanganKinerja
 *           + overtime/variable + company taxable additions
 */
export function calculateBrutoSebelumTunjanganPajak(
  employee: Employee,
  companyContributions: CompanyContributions,
  bpjsAllowance: number
): number {
  return (
    employee.baseSalary +
    employee.fixedAllowance +
    bpjsAllowance +
    (employee.communicationAllowance || 0) +
    (employee.performanceAllowance || 0) +
    (employee.positionAllowance || 0) +
    (employee.otherAllowance || 0) +
    employee.variableAllowance +
    companyContributions.totalTaxableAdditions
  );
}

/**
 * Menghitung total penghasilan bruto yang dikenakan PPh 21.
 */
export function calculateTaxableGrossIncome(
  employee: Employee,
  companyContributions: CompanyContributions
): number {
  return (
    employee.baseSalary +
    employee.fixedAllowance +
    employee.variableAllowance +
    (employee.communicationAllowance || 0) +
    (employee.positionAllowance || 0) +
    (employee.performanceAllowance || 0) +
    (employee.otherAllowance || 0) +
    companyContributions.totalTaxableAdditions
  );
}

/**
 * Menghitung tunjangan pajak dengan metode gross-up TER.
 *
 * Algoritma:
 * 1. Cari TER rate dari baseGrossBeforeTaxAllowance
 * 2. Hitung taxAllowance = round(baseGross * rate / (1 - rate))
 * 3. Hitung finalTaxableGross = baseGross + taxAllowance
 * 4. Cari rate baru dari finalTaxableGross
 * 5. Jika rate berubah, ulangi dari step 2 dengan rate baru
 * 6. Jika rate stabil, hitung pph21 = round(finalTaxableGross * rate)
 * 7. Return { taxAllowance, pph21, finalTaxableGross, terRate }
 *
 * Max 10 iterasi. Throw error jika tidak konvergen.
 */
export function calculateTaxAllowanceGrossUp(
  baseGrossBeforeTaxAllowance: number,
  terCategory: TERCategory
): { taxAllowance: number; pph21: number; finalTaxableGross: number; terRate: number } {
  let rate = determineTERRate(terCategory, baseGrossBeforeTaxAllowance);

  for (let i = 0; i < 10; i++) {
    const taxAllowance = rate > 0 && rate < 1
      ? Math.round((baseGrossBeforeTaxAllowance * rate) / (1 - rate))
      : 0;

    const finalTaxableGross = baseGrossBeforeTaxAllowance + taxAllowance;
    const newRate = determineTERRate(terCategory, finalTaxableGross);

    if (newRate === rate) {
      const pph21 = Math.round(finalTaxableGross * rate);
      return { taxAllowance, pph21, finalTaxableGross, terRate: rate };
    }

    rate = newRate;
  }

  throw new Error(
    `TER gross-up calculation did not converge after 10 iterations. ` +
    `baseGross=${baseGrossBeforeTaxAllowance}, category=${terCategory}, lastRate=${rate}`
  );
}

/**
 * Menghitung PPh 21 bulanan menggunakan metode TER (Januari-November).
 */
export function calculateMonthlyPPh21(
  taxableGrossIncome: number,
  terCategory: TERCategory
): { rate: number; amount: number } {
  const rate = determineTERRate(terCategory, taxableGrossIncome);
  const amount = Math.round(rate * taxableGrossIncome);
  return { rate, amount };
}

/**
 * Menghitung potongan BPJS karyawan.
 * Menggunakan BPJS base yang bisa dikonfigurasi.
 */
export function calculateEmployeeDeductions(
  employee: Employee,
  settings: PayrollSettings
): EmployeeDeductions {
  const bpjsBase = calculateBpjsBase(employee, settings);

  const bpjsHealthEmployee = Math.round(settings.bpjsHealthEmployeeRate * bpjsBase);
  const jhtEmployee = Math.round(settings.jhtEmployeeRate * bpjsBase);
  const jpEmployee = Math.round(settings.jpEmployeeRate * bpjsBase);
  const totalBpjsDeductions = bpjsHealthEmployee + jhtEmployee + jpEmployee;

  return {
    bpjsHealthEmployee,
    jhtEmployee,
    jpEmployee,
    totalBpjsDeductions,
  };
}

/**
 * Memproses potongan custom karyawan (hutang, wakaf, dll).
 * - fixed: nominal tetap
 * - percentage: persentase dari gaji pokok
 */
export function processCustomDeductions(
  employee: Employee
): { processed: ProcessedCustomDeduction[]; total: number } {
  const processed: ProcessedCustomDeduction[] = (employee.customDeductions || []).map((d) => ({
    id: d.id,
    name: d.name,
    amount: d.type === 'fixed' ? Math.round(d.amount) : Math.round((d.amount / 100) * employee.baseSalary),
    category: d.category,
  }));
  const total = processed.reduce((sum, d) => sum + d.amount, 0);
  return { processed, total };
}

/**
 * Menghitung Take Home Pay.
 * THP = Gaji Pokok + Tunjangan + BPJS Allowance + Tax Allowance
 *     - Potongan BPJS Karyawan - PPh 21 - Potongan Custom
 * BPJS Allowance dan Tax Allowance bersifat net-zero (masuk pendapatan, lalu dipotong lagi).
 */
export function calculateTakeHomePay(
  employee: Employee,
  employeeDeductions: EmployeeDeductions,
  pph21: number,
  totalCustomDeductions: number,
  bpjsAllowance: number,
  taxAllowance: number
): number {
  return (
    employee.baseSalary +
    employee.fixedAllowance +
    employee.variableAllowance +
    (employee.communicationAllowance || 0) +
    (employee.positionAllowance || 0) +
    (employee.performanceAllowance || 0) +
    (employee.otherAllowance || 0) +
    bpjsAllowance +
    taxAllowance -
    employeeDeductions.totalBpjsDeductions -
    pph21 -
    totalCustomDeductions
  );
}

/**
 * Fungsi utama: menjalankan seluruh pipeline perhitungan payroll.
 */
export function calculatePayroll(
  employee: Employee,
  settings: PayrollSettings
): PayrollResult {
  const bpjsBase = calculateBpjsBase(employee, settings);
  const companyContributions = calculateCompanyContributions(employee, settings);
  const companyBenefits = calculateCompanyBenefits(companyContributions);
  const employeeDeductions = calculateEmployeeDeductions(employee, settings);
  const terCategory = determineTERCategory(employee.taxStatus);

  // BPJS Allowance: jika aktif, BPJS Kesehatan karyawan ditambahkan ke pendapatan
  const bpjsAllowance = settings.enableBpjsAllowance ? employeeDeductions.bpjsHealthEmployee : 0;

  let pph21: number;
  let taxAllowance: number;
  let terRate: number;
  let taxableGrossIncome: number;

  if (settings.enableTaxAllowance) {
    // === MODE: TAX ALLOWANCE (GROSS-UP) ===
    // brutoSebelumTunjanganPajak = gajiPokok + bpjsAllowance + tunjangan + overtime + company taxable
    const brutoSebelumTunjanganPajak = calculateBrutoSebelumTunjanganPajak(
      employee, companyContributions, bpjsAllowance
    );

    // Hitung tunjangan pajak dengan gross-up formula
    const grossUp = calculateTaxAllowanceGrossUp(brutoSebelumTunjanganPajak, terCategory);
    taxAllowance = grossUp.taxAllowance;
    pph21 = grossUp.pph21;
    terRate = grossUp.terRate;
    taxableGrossIncome = grossUp.finalTaxableGross;
  } else {
    // === MODE: NORMAL (tanpa tax allowance) ===
    taxAllowance = 0;
    taxableGrossIncome = calculateBrutoSebelumTunjanganPajak(
      employee, companyContributions, bpjsAllowance
    );
    const { rate, amount } = calculateMonthlyPPh21(taxableGrossIncome, terCategory);
    terRate = rate;
    pph21 = amount;
  }

  const { processed: processedCustomDeductions, total: totalCustomDeductions } = processCustomDeductions(employee);
  const takeHomePay = calculateTakeHomePay(
    employee, employeeDeductions, pph21, totalCustomDeductions, bpjsAllowance, taxAllowance
  );
  const isDecember = employee.payrollMonth === 12;

  return {
    employee,
    baseSalary: employee.baseSalary,
    fixedAllowance: employee.fixedAllowance,
    variableAllowance: employee.variableAllowance,
    bpjsBase,
    companyContributions,
    companyBenefits,
    taxableGrossIncome,
    terCategory,
    terRate,
    pph21,
    bpjsAllowance,
    taxAllowance,
    employeeDeductions,
    processedCustomDeductions,
    totalCustomDeductions,
    takeHomePay,
    isDecember,
  };
}

/**
 * Generate payslip breakdown untuk ditampilkan.
 */
export function generatePayslipBreakdown(result: PayrollResult) {
  const { employee, companyContributions, companyBenefits, employeeDeductions } = result;

  const pendapatan: Record<string, number> = {
    'Gaji Pokok': result.baseSalary,
  };
  if (employee.fixedAllowance > 0) pendapatan['Tunjangan Tetap'] = employee.fixedAllowance;
  if (employee.variableAllowance > 0) pendapatan['Tunjangan Tidak Tetap'] = employee.variableAllowance;
  if ((employee.communicationAllowance || 0) > 0) pendapatan['Tunjangan Komunikasi'] = employee.communicationAllowance;
  if ((employee.positionAllowance || 0) > 0) pendapatan['Tunjangan Jabatan'] = employee.positionAllowance;
  if ((employee.performanceAllowance || 0) > 0) pendapatan['Tunjangan Kinerja'] = employee.performanceAllowance;
  if ((employee.otherAllowance || 0) > 0) pendapatan['Komponen Lain'] = employee.otherAllowance;
  // BPJS Allowance & Tax Allowance (net-zero)
  if (result.bpjsAllowance > 0) pendapatan['Tunjangan BPJS Kesehatan'] = result.bpjsAllowance;
  if (result.taxAllowance > 0) pendapatan['Tunjangan Pajak (PPh 21)'] = result.taxAllowance;

  return {
    pendapatan,
    companyBenefits: {
      'BPJS Kesehatan Perusahaan': companyBenefits.bpjsHealthCompany,
      'JKK Perusahaan': companyBenefits.jkk,
      'JKM Perusahaan': companyBenefits.jkm,
      'JHT Perusahaan': companyBenefits.jhtCompany,
      'JP Perusahaan': companyBenefits.jpCompany,
    },
    companyBenefitsTotal: companyBenefits.total,
    penambahBrutoPajak: {
      'BPJS Kesehatan Perusahaan': companyContributions.bpjsHealthCompany,
      'JKK Perusahaan': companyContributions.jkk,
      'JKM Perusahaan': companyContributions.jkm,
    },
    brutoPPh21: result.taxableGrossIncome,
    bpjsBase: result.bpjsBase,
    terInfo: {
      kategori: result.terCategory,
      tarif: result.terRate,
      pph21: result.pph21,
    },
    potonganCustom: result.processedCustomDeductions.reduce(
      (acc, d) => ({ ...acc, [d.name]: d.amount }),
      {} as Record<string, number>
    ),
    potonganKaryawan: {
      'BPJS Kesehatan Karyawan': employeeDeductions.bpjsHealthEmployee,
      'JHT Karyawan': employeeDeductions.jhtEmployee,
      'JP Karyawan': employeeDeductions.jpEmployee,
      'PPh 21': result.pph21,
    },
    totalPotonganBpjs: employeeDeductions.totalBpjsDeductions,
    totalCustomDeductions: result.totalCustomDeductions,
    takeHomePay: result.takeHomePay,
  };
}
