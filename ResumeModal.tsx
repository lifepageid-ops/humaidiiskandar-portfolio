import { X, Printer, Mail, Phone, MapPin, CheckCircle } from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-55 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/90 backdrop-blur-md" />

      {/* Modal Body */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 sm:rounded-3xl rounded-t-3xl shadow-2xl border-t sm:border border-slate-200 dark:border-slate-800 overflow-hidden z-10 max-h-[95vh] sm:max-h-[95vh] flex flex-col text-left">
        
        {/* Header controls - Hidden on Print */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50 print:hidden">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Interactive Executive CV
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Print-ready and perfectly styled for recruitment review
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-500 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* CV Scrollable container - Printable */}
        <div className="p-5 sm:p-8 md:p-12 overflow-y-auto flex-1 bg-white dark:bg-slate-950 print:p-0 print:overflow-visible scrollbar-none">
          
          {/* CV Page Style - A4 Grid */}
          <div className="max-w-3xl mx-auto text-slate-900 dark:text-slate-150 space-y-6 sm:space-y-8 print:text-black print:space-y-6">
            
            {/* CV HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-2 border-slate-200 print:pb-4">
              <div className="space-y-1 text-left">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white print:text-black">
                  Humaidi Iskandar, M.M.
                </h1>
                <p className="text-sm sm:text-base font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wide print:text-slate-750">
                  Community Development & Human Capital Professional
                </p>
              </div>
              
              {/* Contact details side */}
              <div className="text-xs font-semibold space-y-1.5 text-slate-600 dark:text-slate-400 print:text-slate-600 text-left md:text-right shrink-0">
                <div className="flex items-center md:justify-end gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-orange-500 print:text-black" />
                  <span>humaidicreativelabs@gmail.com</span>
                </div>
                <div className="flex items-center md:justify-end gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-orange-500 print:text-black" />
                  <span>+62 857-1730-6163</span>
                </div>
                <div className="flex items-center md:justify-end gap-1.5">
                  <svg className="w-3.5 h-3.5 fill-current text-orange-500 print:text-black" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>linkedin.com/in/humaidiiskandar</span>
                </div>
                <div className="flex items-center md:justify-end gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 print:text-black" />
                  <span>Jakarta, Indonesia</span>
                </div>
              </div>
            </div>

            {/* EXECUTIVE BIO */}
            <div className="space-y-2 text-left">
              <h2 className="text-sm font-extrabold text-orange-500 dark:text-orange-400 uppercase tracking-wider border-b border-slate-150 pb-1 print:text-black">
                Ringkasan Profil (Professional Summary)
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed print:text-slate-700 font-normal">
                Lulusan S1 Manajemen Zakat & Wakaf dan Magister Manajemen (SDM) dengan pengalaman lebih dari 4 tahun di bidang pemberdayaan masyarakat, pengelolaan program ZISWAF, CSR dan dana sosial lainnya serta kemitraan B2B. Terbiasa menangani siklus program dari hulu ke hilir mulai dari pemetaan sosial, penyaluran dana, hingga pemantauan dan evaluasi (M&E) kelayakan penerima manfaat. Memiliki rekam jejak dalam mencapai target kemitraan strategis, didukung oleh kemampuan public speaking (sebagai MC dan representatif presentasi untuk kebutuhan tim), pengolahan data operasional, serta pemanfaatan teknologi AI untuk efisiensi kerja. Tersertifikasi sebagai Amil (BNSP), Human Capital Officer (BNSP) dan terbiasa bekerja secara profesional, adaptif, serta detail.
              </p>
            </div>

            {/* EXPERIENCE TIMELINE */}
            <div className="space-y-4 text-left">
              <h2 className="text-sm font-extrabold text-orange-500 dark:text-orange-400 uppercase tracking-wider border-b border-slate-150 pb-1 print:text-black">
                Professional Experience
              </h2>
              
              <div className="space-y-4">
                {/* Job 1 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white print:text-black">
                      Officer – Retail & Network Group
                    </h3>
                    <span className="text-xs font-bold text-slate-500">BSI Maslahat | Present</span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic font-medium">Fund distribution validation, monitoring dashboards, and executive reporting coordination.</p>
                  <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-1.5 print:text-slate-700 font-normal">
                    <li>Developed dynamic program monitoring & evaluation dashboards enhancing tracking speeds by 35%.</li>
                    <li>Directed rigorous verification and fund distribution audits with zero critical errors.</li>
                    <li>Supported administrative operations and produced executive committee pitch decks.</li>
                  </ul>
                </div>

                {/* Job 2 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white print:text-black">
                      Data Reporting & Presentation Specialist
                    </h3>
                    <span className="text-xs font-bold text-slate-500">Kreasi | Contract</span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic font-medium">Sales data analysis, executive pitch layouts, and corporate database mapping.</p>
                  <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-1.5 print:text-slate-700 font-normal">
                    <li>Converted intricate data arrays into refined, high-retention board-ready presentations.</li>
                    <li>Supported management decision-making by delivering predictive target achievement analyses.</li>
                  </ul>
                </div>

                {/* Job 3 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white print:text-black">
                      Corporate Funding Group Officer
                    </h3>
                    <span className="text-xs font-bold text-slate-500">BSI Maslahat | 2022 - 2023</span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic font-medium">B2B fundraising strategies, partner stewardship, and high-scale events.</p>
                  <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 pl-1.5 print:text-slate-700 font-normal">
                    <li>Contributed to securing Rp420 Billion corporate and retail fund contributions.</li>
                    <li>Supported overall 109% target achievements through systematic partner coordination.</li>
                    <li>Served as event Emcee and presenter for massive corporate partnership summits.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* EDUCATION & CERTIFICATIONS SIDE-BY-SIDE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 print:grid-cols-2 text-left">
              {/* Left Side: Education */}
              <div className="space-y-3">
                <h2 className="text-sm font-extrabold text-orange-500 dark:text-orange-400 uppercase tracking-wider border-b border-slate-150 pb-1 print:text-black">
                  Education
                </h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white print:text-black">Master of Management - HR</h3>
                    <p className="text-[11px] text-slate-500 font-bold">Universitas Muhammadiyah Jakarta</p>
                    <p className="text-[10px] text-slate-400 leading-tight mt-1 font-normal">
                      Research: The Effect of Work Life Balance on Employee Performance with Organizational Commitment.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white print:text-black">Bachelor Degree - Zakat & Waqf Management</h3>
                    <p className="text-[11px] text-slate-500 font-bold">Universitas Muhammadiyah Jakarta</p>
                    <p className="text-[10px] text-slate-400 leading-tight mt-1 font-normal">
                      Focus: CSR Funds, Community Empowerment, Social Public Finance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side: Certifications */}
              <div className="space-y-3">
                <h2 className="text-sm font-extrabold text-orange-500 dark:text-orange-400 uppercase tracking-wider border-b border-slate-150 pb-1 print:text-black">
                  Professional Certifications
                </h2>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 print:text-slate-700 font-normal">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Sertifikasi Human Capital Officer (BNSP) - LSP MSDM Unggul Indonesia</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Sertifikasi Kompetensi Amil (BNSP) - Qualification 3 in Zakat Management (Forum Organisasi Zakat)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Sertifikat HRCP Online Structure & Jobdesc (HR Indo Society)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Sertifikat Penyelesaian (CoC) Kursus Bahasa Inggris (Cakap.com)</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
          
        </div>

        {/* Footer Print note - Hidden on Print */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-center text-xs text-slate-500 dark:text-slate-400 print:hidden">
          To save this as a PDF, choose &quot;Save as PDF&quot; under the printer destination dropdown.
        </div>
      </div>
    </div>
  );
}