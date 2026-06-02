import { PayrollSettings } from '../types/payroll';

export const defaultPayrollSettings: PayrollSettings = {
  bpjsHealthCompanyRate: 0.04,
  bpjsHealthEmployeeRate: 0.01,
  jkkRates: {
    sangat_rendah: 0.0024,
    rendah: 0.0054,
    sedang: 0.01,
    tinggi: 0.0174,
    sangat_tinggi: 0.03,
  },
  jkmCompanyRate: 0.003,
  jhtCompanyRate: 0.037,
  jhtEmployeeRate: 0.02,
  jpCompanyRate: 0.02,
  jpEmployeeRate: 0.01,
  includeBpjsHealthCompanyInTaxable: true,
  includeJkkInTaxable: true,
  includeJkmInTaxable: true,
  includeJhtCompanyInTaxable: false,
  includeJpCompanyInTaxable: false,
  bpjsBaseComponents: {
    baseSalary: true,
    fixedAllowance: false,
    communicationAllowance: false,
    positionAllowance: false,
    performanceAllowance: false,
    otherAllowance: false,
  },
  enableBpjsAllowance: false,
  enableTaxAllowance: false,
};
