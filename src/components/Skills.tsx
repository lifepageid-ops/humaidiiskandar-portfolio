import { useState } from "react";
import { motion } from "framer-motion";
import { Award, ShieldCheck, Zap, Heart } from "lucide-react";

const skillCategories = [
  {
    id: "csr",
    title: "CSR & Sustainability",
    description: "Leading community-centric impact, managing philanthropy capital, and implementing ESG/sustainability frameworks.",
    icon: Heart,
    color: "text-rose-500",
    skills: [
      { name: "Community Development", level: 95, status: "Strategic Mastery" },
      { name: "Social Impact Programs", level: 92, status: "Expert Practitioner" },
      { name: "Monitoring & Evaluation (M&E)", level: 90, status: "Expert Practitioner" },
      { name: "Sustainability Programs", level: 88, status: "Advanced" },
      { name: "CSR Program Management", level: 94, status: "Strategic Mastery" },
      { name: "Philanthropy Fund Management", level: 92, status: "Expert Practitioner" }
    ]
  },
  {
    id: "hc-od",
    title: "Human Capital & OD",
    description: "Architecting high-performance structures, boosting employee engagement, and aligning organizational culture.",
    icon: ShieldCheck,
    color: "text-teal-500",
    skills: [
      { name: "Organizational Development", level: 92, status: "Expert Practitioner" },
      { name: "Employee Engagement", level: 95, status: "Strategic Mastery" },
      { name: "Organizational Culture Development", level: 93, status: "Strategic Mastery" },
      { name: "Capacity Building & Training", level: 90, status: "Expert Practitioner" },
      { name: "Leadership Communication", level: 94, status: "Strategic Mastery" },
      { name: "Human Capital Support", level: 89, status: "Advanced" },
      { name: "Organizational Behavior Alignment", level: 91, status: "Expert Practitioner" }
    ]
  },
  {
    id: "strategy-comm",
    title: "Strategic Communication",
    description: "Pitching corporate fundraising campaigns, anchoring board presentations, and building strategic alliances.",
    icon: Award,
    color: "text-orange-500",
    skills: [
      { name: "Public Speaking & Presentation", level: 96, status: "Strategic Mastery" },
      { name: "Corporate Pitching / Presentation", level: 94, status: "Strategic Mastery" },
      { name: "Stakeholder Engagement", level: 92, status: "Expert Practitioner" },
      { name: "Strategic Partnership Development", level: 95, status: "Strategic Mastery" },
      { name: "Event Management & Emcee", level: 93, status: "Strategic Mastery" },
      { name: "B2B Professional Communication", level: 92, status: "Expert Practitioner" }
    ]
  },
  {
    id: "tech",
    title: "Technical & Digital Skills",
    description: "Harnessing professional office suites, data visualization instruments, and state-of-the-art AI productivity workflows.",
    icon: Zap,
    color: "text-indigo-500",
    skills: [
      { name: "Microsoft Excel (Advanced)", level: 88, status: "Advanced" },
      { name: "PowerPoint (Executive Design)", level: 96, status: "Strategic Mastery" },
      { name: "Microsoft Word", level: 90, status: "Expert Practitioner" },
      { name: "Canva & Photoshop Design", level: 85, status: "Advanced" },
      { name: "Generative AI Productivity Tools", level: 95, status: "Strategic Mastery" },
      { name: "Data Visualization & Dashboarding", level: 91, status: "Expert Practitioner" }
    ]
  }
];

export default function Skills() {
  const [activeTab, setActiveTab] = useState(skillCategories[0].id);

  return (
    <section
      id="skills"
      className="py-16 sm:py-20 lg:py-24 relative bg-white dark:bg-slate-900 transition-colors duration-300 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/3 right-[-10%] w-[350px] h-[350px] bg-orange-500/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-[-10%] w-[350px] h-[350px] bg-teal-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/30 mb-4">
            <Zap className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 tracking-wider uppercase">
              Expertise Matrix
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Pillars of Professional Competence
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed font-normal">
            A robust hybrid portfolio of human capital methodologies, community enrichment programs, executive messaging skills, and data efficiency tools.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-teal-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Grid Layout: Pillar Tabs & Interactive Skill Gauges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Side: Pillar Tabs (5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-none snap-x">
              {skillCategories.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = activeTab === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`flex-none w-[280px] lg:w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden group snap-center ${
                      isActive
                        ? "bg-white dark:bg-slate-900 border-orange-500/50 dark:border-orange-400/50 shadow-xl shadow-orange-500/10"
                        : "bg-white/40 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800/60 hover:bg-white dark:hover:bg-slate-900/50"
                    }`}
                  >
                    <div className="flex items-center lg:items-start gap-4">
                      <div className={`p-2.5 sm:p-3 rounded-xl ${
                        isActive ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-orange-500"
                      } transition-all`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-tight">
                          {cat.title}
                        </h3>
                        <p className="hidden lg:block text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2 font-normal">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Value Proposition Callout */}
            <div className="hidden lg:block bg-gradient-to-tr from-slate-900 to-slate-950 text-white border border-slate-800 rounded-3xl p-6 mt-6 shadow-2xl relative overflow-hidden">
              {/* background pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,var(--color-teal-500),transparent_50%)] opacity-20 pointer-events-none" />
              <h4 className="font-bold text-base text-orange-400 mb-2">Strategic Advantage</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Recruiters can rely on a balanced executive presence. Humaidi does not only direct grassroots initiatives but validates impact using quantitative metrics, builds operational presentations, and drives internal organization culture.
              </p>
            </div>
          </div>

          {/* Right Side: Animated Skill Cards & Level Meters (7 columns) */}
          <div className="lg:col-span-7">
            {skillCategories.map((cat) => {
              if (cat.id !== activeTab) return null;

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between h-full"
                >
                  <div>
                    {/* Active Section Heading */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-normal">
                        {cat.description}
                      </p>
                    </div>

                    {/* Skill Bars List */}
                    <div className="space-y-5">
                      {cat.skills.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {skill.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-200/10">
                                {skill.status}
                              </span>
                              <span className="font-black text-slate-900 dark:text-white">
                                {skill.level}%
                              </span>
                            </div>
                          </div>
                          
                          {/* Bar Container */}
                          <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-orange-500 to-teal-500 rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Action Badge */}
                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-teal-500" />
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      Continually refining methods through research, executive training, and certified practices.
                    </span>
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