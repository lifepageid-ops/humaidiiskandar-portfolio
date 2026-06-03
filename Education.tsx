import { GraduationCap, BookOpen, Award } from "lucide-react";

const educationList = [
  {
    degree: "Master of Management",
    specialization: "Human Resource Management",
    institution: "Universitas Muhammadiyah Jakarta",
    period: "Graduated with Distinction",
    focusTitle: "Core Executive Domains",
    focusAreas: [
      "Organizational Behavior & Dynamics",
      "Employee Performance Optimization",
      "Organizational Commitment & Culture",
      "Strategic Leadership Development",
      "Work-Life Balance Methodologies",
      "Human Capital Strategy Deployment",
      "Organizational Culture Development"
    ],
    research: {
      title: "The Effect of Work Life Balance on Employee Performance with Organizational Commitment as an Intervening Variable",
      summary: "A comprehensive study exploring how balancing personal wellness and professional drive influences strategic organizational commitment and fuels high-impact employee KPIs."
    }
  },
  {
    degree: "Bachelor Degree",
    specialization: "Management of Zakat & Waqf",
    institution: "Universitas Muhammadiyah Jakarta",
    period: "Undergraduate Degree",
    focusTitle: "Empowerment & Social Finance Focus",
    focusAreas: [
      "CSR Fund Strategy & Management",
      "Islamic & Social Public Finance",
      "Community Economic Empowerment Projects",
      "Sustainable Development Goals (SDGs) Alignment",
      "Philanthropic Asset Structuring & Auditing",
      "Grassroots Needs Mapping & Welfare Logistics"
    ],
    research: null
  }
];

export default function Education() {
  return (
    <section
      id="education"
      className="py-16 sm:py-20 lg:py-24 relative bg-white dark:bg-slate-900 transition-colors duration-300 overflow-hidden"
    >
      {/* Background decorative glow */}
      <div className="absolute top-[10%] left-[-10%] w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/30 mb-4">
            <GraduationCap className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 tracking-wider uppercase">
              Academic History
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Education & Academic Background
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-teal-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Elegant academic card layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {educationList.map((edu, index) => (
            <div
              key={index}
              className="bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Soft gradient corner effect */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/5 to-transparent rounded-bl-full pointer-events-none" />

              <div>
                {/* Header of Education */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex gap-3 sm:gap-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-teal-500 text-white shadow-md shrink-0 self-start">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2.5xl font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                        {edu.degree}
                      </h3>
                      <p className="text-sm sm:text-base font-bold text-teal-600 dark:text-teal-400 mt-1">
                        {edu.specialization}
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        {edu.institution}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 dark:bg-orange-950/40 border border-orange-200/10 px-3 py-1 rounded-lg shrink-0 self-start">
                    {edu.period}
                  </span>
                </div>

                {/* Core Areas of Focus */}
                <div className="mb-6">
                  <h4 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-orange-500" />
                    {edu.focusTitle}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {edu.focusAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800/60 shadow-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Research Thesis block (if any) */}
              {edu.research && (
                <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 mt-6">
                  <h4 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-teal-500" />
                    Strategic Research & Thesis
                  </h4>
                  <div className="bg-teal-50/30 dark:bg-teal-950/10 border border-teal-200/10 rounded-2xl p-4 sm:p-5">
                    <p className="text-sm font-bold text-slate-900 dark:text-white italic leading-snug">
                      &ldquo;{edu.research.title}&rdquo;
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2 font-normal">
                      {edu.research.summary}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}