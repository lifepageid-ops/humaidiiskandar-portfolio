import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Leaf, Briefcase, Compass, MessageSquare, BarChart3, FileText, Cpu, ArrowRight, Star } from "lucide-react";

const highlightCards = [
  {
    title: "Community Empowerment",
    description: "Initiating and scaling sustainable local economic and social models with local leaders.",
    icon: Users,
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-100 dark:border-orange-900/30",
  },
  {
    title: "CSR & Sustainability",
    description: "End-to-end CSR program design, ESG aligned practices, and philanthropic fund management.",
    icon: Leaf,
    color: "text-teal-500",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    borderColor: "border-teal-100 dark:border-teal-900/30",
  },
  {
    title: "Human Capital Development",
    description: "Designing capacity building, competency matrices, training workshops, and career structures.",
    icon: Briefcase,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-100 dark:border-blue-900/30",
  },
  {
    title: "Organizational Culture",
    description: "Developing core values, employee engagement programs, and driving high-performance dynamics.",
    icon: Compass,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-100 dark:border-purple-900/30",
  },
  {
    title: "Strategic Partnership",
    description: "Fostering corporate B2B fundraising relations, stakeholder alliances, and joint ventures.",
    icon: Users,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    borderColor: "border-indigo-100 dark:border-indigo-900/30",
  },
  {
    title: "Public Speaking",
    description: "Professional MC, executive presenter, pitch deck delivery, and public communication.",
    icon: MessageSquare,
    color: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    borderColor: "border-pink-100 dark:border-pink-900/30",
  },
  {
    title: "Monitoring & Evaluation",
    description: "Translating field data into program quality improvements through robust tracking models.",
    icon: BarChart3,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    borderColor: "border-emerald-100 dark:border-emerald-900/30",
  },
  {
    title: "Data Reporting & Viz",
    description: "Simplifying complex spreadsheet datasets into intuitive dashboards and executive decks.",
    icon: FileText,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    borderColor: "border-yellow-100 dark:border-yellow-900/30",
  },
  {
    title: "AI & Productivity Tech",
    description: "Utilizing state-of-the-art generative AI workflows to amplify presentation and reporting output.",
    icon: Cpu,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-100 dark:border-red-900/30",
  },
];

export default function About() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="about"
      className="py-16 sm:py-20 lg:py-24 relative bg-white dark:bg-slate-900 transition-colors duration-300 overflow-hidden"
    >
      {/* Decorative background blur elements */}
      <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/30 mb-4">
            <Star className="w-3.5 h-3.5 text-orange-500 fill-current" />
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 tracking-wider uppercase">
              Core Expertise
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Core Competencies & Skills
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Humaidi Iskandar possesses high-level technical and strategic expertise to drive social impact and organizational excellence.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-teal-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Professional Pillars
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 font-medium">
              9 Key Highlights
            </span>
          </h3>
          <span className="hidden sm:flex text-xs text-slate-400 dark:text-slate-500 items-center gap-1">
            Hover cards to explore <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlightCards.map((card, index) => {
            const IconComponent = card.icon;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 transition-all duration-300 cursor-pointer ${
                  isHovered
                    ? "bg-white dark:bg-slate-950 border-orange-400/50 dark:border-orange-500/50 shadow-2xl shadow-orange-500/10 -translate-y-2"
                    : `bg-slate-50/40 dark:bg-slate-900/20 ${card.borderColor} hover:border-slate-300 dark:hover:border-slate-700`
                }`}
                layout
              >
                {/* Top Row */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3 rounded-2xl ${card.bgColor} ${card.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                    />
                  )}
                </div>

                {/* Title & Description */}
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors">
                  {card.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  {card.description}
                </p>

                {/* Subtle Bottom Indicator */}
                <div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-teal-500 transition-all duration-500 ${
                    isHovered ? "w-full" : "w-0"
                  }`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
