export type TaxStatus = 'TK/0' | 'TK/1' | 'TK/2' | 'TK/3' | 'K/0' | 'K/1' | 'K/2' | 'K/3';
export type TERCategory = 'A' | 'B' | 'C';
export type JKKRiskLevel = 'sangat_rendah' | 'rendah' | 'sedang' | 'tinggi' | 'sangat_tinggi';

export type VoluntaryDeductionCategory =
  | 'wakaf'
  | 'koperasi'
  | 'kasbon'
  | 'pinjaman'
  | 'denda'
  | 'lainnya';

export const VOLUNTARY_CATEGORY_LABELS: Record<VoluntaryDeductionCategory, string> = {
  wakaf: 'Wakaf',
  koperasi: 'Koperasi',
  kasbon: 'Kasbon',
  pinjaman: 'Pinjaman Karyawan',
  denda: 'Denda',
  lainnya: 'Lain-lain',
};

export type BPJSBaseComponent =
  | 'baseSalary'
  | 'fixedAllowance'
  | 'communicationAllowance'
  | 'positionAllowance'
  | 'performanceAllowance'
  | 'otherAllowance';

export const BPJS_BASE_LABELS: Record<BPJSBaseComponent, string> = {
  baseSalary: 'Gaji Pokok',
  fixedAllowance: 'Tunjangan Tetap',
  communicationAllowance: 'Tunjangan Komunikasi',
  positionAllowance: 'Tunjangan Jabatan',
  performanceAllowance: 'Tunjangan Kinerja',
  otherAllowance: 'Komponen Lain',
};

export interface CustomDeduction {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'percentage';
  category?: VoluntaryDeductionCategory | 'custom';
}

export interface Employee {
  name: string;
  employeeId: string;
  position: string;
  taxStatus: TaxStatus;
  baseSalary: number;
  fixedAllowance: number;
  variableAllowance: number;
  // Additional allowance components for BPJS base
  communicationAllowance: number;
  positionAllowance: number;
  performanceAllowance: number;
  otherAllowance: number;
  jkkRiskLevel: JKKRiskLevel;
  payrollMonth: number;
  payrollYear: number;
  customDeductions: CustomDeduction[];
}

export interface PayrollSettings {
  bpjsHealthCompanyRate: number;
  bpjsHealthEmployeeRate: number;
  jkkRates: Record<JKKRiskLevel, number>;
  jkmCompanyRate: number;
  jhtCompanyRate: number;
  jhtEmployeeRate: number;
  jpCompanyRate: number;
  jpEmployeeRate: number;
  // Which components are included in taxable gross
  includeBpjsHealthCompanyInTaxable: boolean;
  includeJkkInTaxable: boolean;
  includeJkmInTaxable: boolean;
  includeJhtCompanyInTaxable: boolean;
  includeJpCompanyInTaxable: boolean;
  // BPJS calculation base components
  bpjsBaseComponents: Record<BPJSBaseComponent, boolean>;
  // Allowances (net-zero toggles)
  enableBpjsAllowance: boolean;
  enableTaxAllowance: boolean;
}

export interface TERBracket {
  minIncome: number;
  maxIncome: number;
  rate: number;
}

export interface TERRateTable {
  A: TERBracket[];
  B: TERBracket[];
  C: TERBracket[];
}

export interface CompanyContributions {
  bpjsHealthCompany: number;
  jkk: number;
  jkm: number;
  jhtCompany: number;
  jpCompany: number;
  totalTaxableAdditions: number;
}

export interface CompanyBenefits {
  bpjsHealthCompany: number;
  jkk: number;
  jkm: number;
  jhtCompany: number;
  jpCompany: number;
  total: number;
}

export interface EmployeeDeductions {
  bpjsHealthEmployee: number;
  jhtEmployee: number;
  jpEmployee: number;
  totalBpjsDeductions: number;
}

export interface ProcessedCustomDeduction {
  id: string;
  name: string;
  amount: number;
  category?: VoluntaryDeductionCategory | 'custom';
}

export interface PayrollResult {
  employee: Employee;
  baseSalary: number;
  fixedAllowance: number;
  variableAllowance: number;
  bpjsBase: number;
  companyContributions: CompanyContributions;
  companyBenefits: CompanyBenefits;
  taxableGrossIncome: number;
  terCategory: TERCategory;
  terRate: number;
  pph21: number;
  bpjsAllowance: number;
  taxAllowance: number;
  employeeDeductions: EmployeeDeductions;
  processedCustomDeductions: ProcessedCustomDeduction[];
  totalCustomDeductions: number;
  takeHomePay: number;
  isDecember: boolean;
}
