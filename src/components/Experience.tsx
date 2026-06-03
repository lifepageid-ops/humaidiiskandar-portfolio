import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, Award, CheckCircle2, Target } from "lucide-react";

const experiences = [
  {
    id: "bsi-retail",
    company: "BSI Maslahat",
    role: "Officer – Retail & Network Group",
    period: "Present",
    category: "Retail & Network",
    responsibilities: [
      "Fund distribution validation, verifying accuracy and compliance of resource allocations.",
      "Monitoring & Evaluation (M&E) dashboard development to streamline performance tracking.",
      "Program tracking and data-driven reporting for stakeholders and corporate boards.",
      "Real-time data visualization to monitor funding metrics and campaign reaches.",
      "Powerpoint presentation deck creation for executive committees and management.",
      "Operational coordination across multiple regional networks to enhance programmatic speed."
    ],
    highlights: [
      "Detail-oriented fund distribution management with zero critical errors.",
      "Built integrated real-time monitoring dashboard which enhanced evaluation speed by 35%.",
      "Supported overall strategic reporting efficiency for regional managers."
    ],
    tag: "Fund Distribution & M&E"
  },
  {
    id: "kreasi",
    company: "Kreasi",
    role: "Data Reporting & Presentation Specialist",
    period: "Contract / Freelance",
    category: "Data & Presentation",
    responsibilities: [
      "Sales data analysis and pattern identification for business performance assessment.",
      "Executive reporting to high-level corporate management detailing target achievement levels.",
      "Professional PowerPoint presentation design with clean corporate visuals.",
      "Data visualization utilizing charts, graphs, and interactive dashboards.",
      "Strategic reporting support to align business development pitches with raw quantitative data."
    ],
    highlights: [
      "Converted complex datasets into intuitive, executive-level visual presentations.",
      "Directly supported management in data-backed strategic decision-making."
    ],
    tag: "Data Analytics"
  },
  {
    id: "bsi-funding",
    company: "BSI Maslahat",
    role: "Corporate Funding Group Officer",
    period: "2022 - 2023",
    category: "Corporate Partnership",
    responsibilities: [
      "Corporate partnership management and executive-level client relations.",
      "B2B fundraising strategy execution matching corporate CSR goals with philanthropic funds.",
      "Corporate scale event coordination and organizational alignment.",
      "Public speaking & professional MC at prestigious corporate events.",
      "Strategic pitching and partnership deck delivery to high-net-worth companies."
    ],
    highlights: [
      "Contributed to Rp420 Billion retail/corporate fundraising milestone.",
      "Directly supported achieving 109% of the organizational fundraising targets.",
      "Successfully coordinated high-profile corporate CSR events and signings."
    ],
    tag: "B2B Fundraising & Partnership"
  },
  {
    id: "bsi-empowerment",
    company: "BSI Maslahat",
    role: "Innovation & Empowerment Directorate Officer",
    period: "2021 - 2022",
    category: "Community Empowerment",
    responsibilities: [
      "Community empowerment project planning, design, and field execution.",
      "Mosque-based economic development programs to empower micro-entrepreneurs.",
      "Comprehensive program assessment and socio-economic needs mapping.",
      "Continuous monitoring & evaluation of localized aid and community programs.",
      "Direct beneficiary engagement, support, training, and capacity building."
    ],
    highlights: [
      "Managed end-to-end empowerment programs from pilot to full scalability.",
      "Successfully executed pilot projects that established templates for national expansion.",
      "Acquired extensive grassroots development experience in rural and urban areas."
    ],
    tag: "Social Impact"
  },
  {
    id: "umj",
    company: "Universitas Muhammadiyah Jakarta",
    role: "Creative & Promotion Staff",
    period: "2020 - 2021",
    category: "Marketing & Admin",
    responsibilities: [
      "Creative marketing campaign development targeting prospective students.",
      "Digital and print promotion asset design utilizing professional creative suites.",
      "Student registration administration, support, and onboarding workflows.",
      "Validation and verification of academic registration data."
    ],
    highlights: [
      "Created campaign designs that increased digital engagement.",
      "Maintained highly accurate student validation registers."
    ],
    tag: "Creative Marketing"
  }
];

export default function Experience() {
  const [activeExp, setActiveExp] = useState(experiences[0].id);

  return (
    <section
      id="experience"
      className="py-16 sm:py-20 lg:py-24 relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden"
    >
      {/* Decorative items */}
      <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-orange-500/5 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/5 blur-[120px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-100/30 dark:border-teal-900/30 mb-4">
            <Briefcase className="w-3.5 h-3.5 text-teal-500" />
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase">
              Professional History
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Career Timeline & Accomplishments
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-teal-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Dashboard style Tabbed Timeline layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Tabs (4 columns) */}
          <div className="lg:col-span-4 flex flex-col">
            <p className="hidden lg:block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-4">
              Select Career Phase
            </p>
            <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory">
              {experiences.map((exp) => {
                const isActive = activeExp === exp.id;
                return (
                  <button
                    key={exp.id}
                    onClick={() => setActiveExp(exp.id)}
                    className={`flex-none lg:flex-1 w-[260px] lg:w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer snap-center ${
                      isActive
                        ? "bg-white dark:bg-slate-900 border-teal-500/50 dark:border-teal-400/50 shadow-xl shadow-teal-500/10"
                        : "bg-white/40 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800/60 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        isActive ? "bg-teal-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}>
                        {exp.period}
                      </span>
                      <span className="text-[10px] font-black text-orange-500 whitespace-nowrap">{exp.tag}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-[15px] mt-3 leading-tight group-hover:text-teal-500">
                      {exp.company}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                      {exp.role}
                    </p>

                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-500 to-teal-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Details Pane (8 columns) */}
          <div className="lg:col-span-8">
            {experiences.map((exp) => {
              if (exp.id !== activeExp) return null;
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-sm"
                >
                  {/* Header of Role */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-150 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-lg sm:text-xl">
                        <Briefcase className="w-5 h-5 text-orange-500" />
                        {exp.role}
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                        {exp.company} — <span className="text-slate-500 font-medium">{exp.category} Group</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold tracking-wider">
                      <Calendar className="w-3.5 h-3.5 text-orange-500" />
                      {exp.period}
                    </div>
                  </div>

                  {/* Job Responsibilities */}
                  <div className="py-6">
                    <h4 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-500" />
                      Core Responsibilities & Deliverables
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {exp.responsibilities.map((resp, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Performance Highlights & Impact Metrics */}
                  <div className="pt-6 border-t border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-6 sm:p-8 rounded-b-3xl">
                    <h4 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4 text-teal-500" />
                      Strategic Achievements & High Impact Details
                    </h4>
                    <div className="space-y-3">
                      {exp.highlights.map((highlight, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}