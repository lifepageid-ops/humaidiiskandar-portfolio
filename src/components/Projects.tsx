import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, BarChart3, Award, CheckCircle2, Camera, Images, Maximize2 } from "lucide-react";

interface ProjectPhoto {
  src: string;
  alt: string;
  caption: string;
}

interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  gridSpan: string; // custom tailwind class for bento grid
  metric: string;
  metricLabel: string;
  overview: string;
  problem: string;
  strategy: string;
  solution: string;
  result: string;
  impactMetrics: string[];
  tools: string[];
  documentation: ProjectPhoto[];
  gradient: string;
}

const projects: Project[] = [
  {
    id: "csr-empowerment",
    title: "CSR Community Empowerment Program",
    subtitle: "Socio-economic development model driving financial resilience in underserved locations.",
    category: "Community Development",
    gridSpan: "col-span-1 md:col-span-2",
    metric: "Rp1.2B+",
    metricLabel: "Direct Capital Managed",
    overview: "Designed and spearheaded a multi-stakeholder community development framework aimed at creating self-sustaining community hubs, enhancing family incomes, and expanding micro-enterprise initiatives.",
    problem: "Target communities lacked structural business guidance, access to capital, and sustainable market channels, leading to high dependency on temporary charity aids.",
    strategy: "Deployed a 3-tier approach: (1) Capability training, (2) Micro-fund seeding, (3) Linking local products directly to retail supply networks through corporate sponsorships.",
    solution: "Established micro-business cooperatives, conducted financial literacy coaching, and deployed smart tracking models to measure growth monthly.",
    result: "Cultivated 12 independent cooperatives, elevating average family incomes by 48% within 12 months. Achieved 100% fund disbursement accountability.",
    impactMetrics: [
      "48% Average household income growth",
      "12 Independent cooperatives active",
      "100% Resource deployment auditing audit pass"
    ],
    tools: ["Program Assessment Matrix", "Excel Modeling", "Community Action Frameworks"],
    documentation: [
      {
        // BARU: KITA UBAH JALUR FOTO PERTAMA INI BUAT PERCOBAAN BRE!
        src: "/images/csr-1.jpg", 
        alt: "Pemetaan sosial dan validasi penerima manfaat program CSR",
        caption: "Pemetaan sosial & validasi penerima manfaat"
      },
      {
        src: "/images/projects/csr-empowerment-2.jpg",
        alt: "Pendampingan komunitas dan pelatihan usaha mikro",
        caption: "Pendampingan komunitas & pelatihan usaha"
      },
      {
        src: "/images/projects/csr-empowerment-3.jpg",
        alt: "Monitoring dan evaluasi program pemberdayaan masyarakat",
        caption: "Monitoring lapangan & evaluasi dampak"
      }
    ],
    gradient: "from-orange-600/20 to-orange-500/10"
  },
  {
    id: "mosque-economics",
    title: "Mosque-Based Economic Development",
    subtitle: "Transforming local places of worship into modern centers for economic empowerment.",
    category: "Empowerment Program",
    gridSpan: "col-span-1",
    metric: "350+",
    metricLabel: "MSME Beneficiaries",
    overview: "Created a novel socio-finance program leveraging local mosque infrastructure to distribute interest-free micro-finance funds, train merchants, and support cooperative growth.",
    problem: "Traditional mosque fundraising was purely consumption-focused, missing opportunities to lift neighborhood families out of systemic poverty productively.",
    strategy: "Formulated a structured micro-philanthropy fund structure, creating assessment grids to pick the most resilient, high-motivation micro-merchants in the vicinity.",
    solution: "Integrated zakat and waqf funds into productive venture capital, delivering capital coupled with bi-weekly business mentorship circles.",
    result: "Successfully funded 350+ micro-businesses. The repayment/reinvestment rate stood at a stellar 96.5%, creating a model for local self-sufficiency.",
    impactMetrics: [
      "350+ Micro-merchants fully funded",
      "96.5% Repayment & reinvestment rate",
      "Rp500M+ Re-circulated capital"
    ],
    tools: ["Zakat & Waqf Allocation Index", "Mentorship Assessment Matrix", "Financial Tracking Templates"],
    documentation: [
      {
        src: "/images/projects/mosque-economics-1.jpg",
        alt: "Koordinasi program ekonomi berbasis masjid dengan pengurus lokal",
        caption: "Koordinasi pengurus masjid & stakeholder lokal"
      },
      {
        src: "/images/projects/mosque-economics-2.jpg",
        alt: "Pembinaan usaha mikro berbasis komunitas masjid",
        caption: "Pembinaan usaha mikro berbasis komunitas"
      },
      {
        src: "/images/projects/mosque-economics-3.jpg",
        alt: "Penyaluran modal produktif untuk penerima manfaat",
        caption: "Penyaluran modal produktif & pendampingan"
      }
    ],
    gradient: "from-teal-600/20 to-teal-500/10"
  },
  {
    id: "me-dashboard",
    title: "Monitoring & Evaluation Dashboard",
    subtitle: "Interactive program performance analytics for executive stakeholder visibility.",
    category: "Data & Analytics",
    gridSpan: "col-span-1",
    metric: "35%",
    metricLabel: "Faster Reporting",
    overview: "Built a corporate-grade program tracking system that aggregates nationwide fund distribution milestones and translates them into real-time decision charts.",
    problem: "Field reports were highly fragmented in static files, taking the management weeks to notice distribution bottlenecks or underperforming projects.",
    strategy: "Synthesized key M&E indices into a single database system, applying user-friendly visualization dashboards with red-flag alerts for delays.",
    solution: "Crafted dynamic visual spreadsheets and reports that update seamlessly with input from field coordinators.",
    result: "Reduced board reporting cycles by 35% and provided real-time tracking of Rp20B+ distributed funds, helping leadership react to bottlenecks instantly.",
    impactMetrics: [
      "35% Reduction in board reporting cycle",
      "Rp20B+ Distributed funds real-time verified",
      "100% Nationwide field operational compliance"
    ],
    tools: ["Advanced MS Excel", "PowerPoint Presentation Decks", "Data Validation Engines"],
    documentation: [
      {
        src: "/images/projects/me-dashboard-1.jpg",
        alt: "Dashboard monitoring dan evaluasi program berbasis data",
        caption: "Dashboard monitoring & evaluasi program"
      },
      {
        src: "/images/projects/me-dashboard-2.jpg",
        alt: "Validasi data operasional dan distribusi dana",
        caption: "Validasi data operasional & distribusi"
      },
      {
        src: "/images/projects/me-dashboard-3.jpg",
        alt: "Presentasi laporan M&E kepada stakeholder internal",
        caption: "Presentasi laporan M&E untuk stakeholder"
      }
    ],
    gradient: "from-blue-600/20 to-blue-500/10"
  },
  {
    id: "corporate-fundraising",
    title: "Corporate Fundraising Initiative",
    subtitle: "Securing major corporate sponsorships and scaling high-impact B2B partnerships.",
    category: "Strategic Partnership",
    gridSpan: "col-span-1 md:col-span-2",
    metric: "Rp420B",
    metricLabel: "Fundraising Target Secured",
    overview: "Coordinated multiple corporate-scale B2B pitch campaigns and formal sponsorship agreements, securing key capital for social projects and sustainability initiatives.",
    problem: "Corporate CSR partners found standard fundraising proposals to be too generic and lacking evidence of measurable sustainability impacts.",
    strategy: "Redesigned B2B pitching decks, embedding data-driven ESG KPIs directly aligned with target corporate objectives and showcasing high M&E transparency.",
    solution: "Facilitated high-profile executive pitches, organized grand-scale signing events, and served as the master of ceremonies for partner summits.",
    result: "Supported achieving 109% of the fundraising milestone, resulting in Rp420 Billion overall fund capture and expanding B2B active partners significantly.",
    impactMetrics: [
      "109% Over-achievement of fundraising target",
      "Rp420 Billion corporate & retail fund contributions",
      "35+ Active premium corporate CSR partners secured"
    ],
    tools: ["Strategic B2B Pitching Decks", "Corporate Event Management Protocols", "Sponsorship Valuation Models"],
    documentation: [
      {
        src: "/images/projects/corporate-fundraising-1.jpg",
        alt: "Kegiatan kemitraan korporasi dan fundraising strategis",
        caption: "Kegiatan kemitraan korporasi"
      },
      {
        src: "/images/projects/corporate-fundraising-2.jpg",
        alt: "Presentasi pitching B2B untuk mitra korporasi",
        caption: "Pitching B2B & presentasi strategis"
      },
      {
        src: "/images/projects/corporate-fundraising-3.jpg",
        alt: "Event corporate fundraising dan stakeholder engagement",
        caption: "Corporate event & stakeholder engagement"
      }
    ],
    gradient: "from-purple-600/20 to-purple-500/10"
  },
  {
    id: "executive-reporting",
    title: "Executive Reporting Presentation",
    subtitle: "Converting complex data arrays into polished strategic presentation narratives.",
    category: "Corporate Presentation",
    gridSpan: "col-span-1",
    metric: "150+",
    metricLabel: "Slides Designed",
    overview: "Acted as a data and presentation specialist, modernizing corporate board packs and corporate partnership proposals into high-retention, visually striking stories.",
    problem: "Complex operational spreadsheets were causing 'information overload' for board directors during critical decision-making meetings.",
    strategy: "Leveraged elite consultancy-style slide frameworks (e.g., McKinsey/BCG pyramid principles) to simplify and spotlight high-impact takeaways.",
    solution: "Designed custom dashboard decks and high-end business presentations using bespoke brand palettes, smart information grids, and visual icons.",
    result: "Approved unanimously for board-level pitches and corporate funding meetings. Greatly accelerated funding approvals and strategic sign-offs.",
    impactMetrics: [
      "100% Board presentation approval rate",
      "50% Reduction in slide text-density while tripling retention",
      "Direct adoption as the corporate design template standard"
    ],
    tools: ["Microsoft PowerPoint (Advanced)", "Canva Pro", "AI Layout Accelerators"],
    documentation: [
      {
        src: "/images/projects/executive-reporting-1.jpg",
        alt: "Penyusunan deck presentasi eksekutif untuk laporan strategis",
        caption: "Penyusunan deck presentasi eksekutif"
      },
      {
        src: "/images/projects/executive-reporting-2.jpg",
        alt: "Visualisasi data laporan untuk manajemen",
        caption: "Visualisasi data laporan manajemen"
      },
      {
        src: "/images/projects/executive-reporting-3.jpg",
        alt: "Review presentasi dan penyelarasan narasi laporan",
        caption: "Review narasi & penyelarasan materi"
      }
    ],
    gradient: "from-emerald-600/20 to-emerald-500/10"
  },
  {
    id: "economic-assistance",
    title: "Community-Based Economic Assistance Program",
    subtitle: "Targeted distribution of capital and resources to empower vulnerable communities.",
    category: "Social Impact",
    gridSpan: "col-span-1 md:col-span-2",
    metric: "1,200+",
    metricLabel: "Vulnerable Households Helped",
    overview: "Spearheaded a national-level economic support project targeting low-income families, delivering critical startup assets to kickstart micro-enterprises.",
    problem: "Direct cash aid programs suffered from high leakage rates, short-term consumption spending, and poor long-term economic value creation.",
    strategy: "Formulated 'asset-based assistance' where beneficiaries received productive assets (tools, machinery, livestock) paired with mandatory skills coaching.",
    solution: "Conducted extensive eligibility checks using field verification teams and mapped appropriate economic assets to candidate skillsets.",
    result: "Empowered 1,200+ families, driving a massive 78% transition rate from emergency welfare reliance into active self-employment.",
    impactMetrics: [
      "1,200+ Families transitioned to asset ownership",
      "78% Transition rate from charity reliance to business startup",
      "0% Asset liquidation leakage verified by M&E checks"
    ],
    tools: ["Social Vulnerability Survey Index", "Asset Matching Matrices", "M&E Mobile Triggers"],
    documentation: [
      {
        src: "/images/projects/economic-assistance-1.jpg",
        alt: "Distribusi bantuan ekonomi kepada penerima manfaat rentan",
        caption: "Distribusi bantuan ekonomi produktif"
      },
      {
        src: "/images/projects/economic-assistance-2.jpg",
        alt: "Verifikasi rumah tangga rentan dan asesmen kebutuhan",
        caption: "Verifikasi rumah tangga rentan"
      },
      {
        src: "/images/projects/economic-assistance-3.jpg",
        alt: "Monitoring penerima manfaat program bantuan ekonomi",
        caption: "Monitoring penerima manfaat di lapangan"
      }
    ],
    gradient: "from-orange-600/20 to-teal-500/10"
  }
];

function DocumentationPhotoCard({
  photo,
  index,
  onPreview,
}: {
  photo: ProjectPhoto;
  index: number;
  onPreview: (photo: ProjectPhoto) => void;
}) {
  const [hasError, setHasError] = useState(false);
  const hasImage = Boolean(photo.src) && !hasError;

  return (
    <button
      type="button"
      onClick={() => hasImage && onPreview(photo)}
      disabled={!hasImage}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 aspect-[4/3] text-left shadow-sm disabled:cursor-default"
    >
      {hasImage ? (
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          onError={() => setHasError(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-100 via-white to-teal-50 dark:from-slate-900 dark:via-slate-950 dark:to-teal-950/30 p-5 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
            <Images className="h-5 w-5 text-teal-500" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Photo Slot {index + 1}
            </p>
            <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">
              Replace this slot with real documentation photo.
            </p>
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-transparent p-4 text-white">
        <div className="flex items-end justify-between gap-3">
          <p className="text-xs font-bold leading-snug drop-shadow-sm">{photo.caption}</p>
          {hasImage && (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
              <Maximize2 className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default function Projects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activePhoto, setActivePhoto] = useState<ProjectPhoto | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const closeCaseStudy = () => {
    setActivePhoto(null);
    setActiveProject(null);
  };

  const categories = ["All", "Community Development", "Empowerment Program", "Data & Analytics", "Strategic Partnership", "Corporate Presentation", "Social Impact"];

  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section
      id="projects"
      className="py-16 sm:py-20 lg:py-24 relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden"
    >
      {/* Background Blurs */}
      <div className="absolute top-10 right-[-10%] w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-[-10%] w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-100/30 dark:border-teal-900/30 mb-4">
            <BarChart3 className="w-3.5 h-3.5 text-teal-500" />
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase">
              Case Studies & Initiatives
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            High-Impact Portfolio Projects
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed font-normal">
            A showcase of large-scale fundraising, structural monitoring dashboards, grassroots economic pilots, and executive-level corporate reports.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-teal-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 overflow-x-auto pb-2 max-w-4xl mx-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shrink-0 cursor-pointer ${
                filter === cat
                  ? "bg-gradient-to-r from-orange-500 to-teal-500 text-white shadow-md"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                setActivePhoto(null);
                setActiveProject(project);
              }}
              className={`${project.gridSpan} group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 dark:hover:border-teal-400/50 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between p-6 sm:p-8 cursor-pointer`}
            >
              {/* Gradient Card Accent */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0`} />

              <div className="relative z-10">
                {/* Top info */}
                <div className="flex justify-between items-start gap-4 mb-6">
                  <span className="text-[10px] font-black tracking-wider uppercase text-orange-500 bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-lg border border-orange-200/10">
                    {project.category}
                  </span>
                  <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                    <Eye className="w-4 h-4" />
                  </span>
                </div>

                {/* Project Title & Subtitle */}
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-normal">
                  {project.subtitle}
                </p>
              </div>

              {/* Core Metrics Bottom Display */}
              <div className="relative z-10 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {project.metricLabel}
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                    {project.metric}
                  </p>
                </div>
                <div className="text-xs font-bold text-teal-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                  View Case Study &rarr;
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Case Study Dialog Overlay */}
        <AnimatePresence>
          {activeProject && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeCaseStudy}
                className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
              />

              {/* Modal Body */}
              <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative w-full max-w-4xl bg-white dark:bg-slate-900 sm:rounded-3xl rounded-t-3xl shadow-2xl border-t sm:border border-slate-200 dark:border-slate-800 overflow-hidden z-10 max-h-[92vh] sm:max-h-[90vh] flex flex-col text-left"
              >
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start gap-6 bg-slate-50 dark:bg-slate-950/50">
                  <div>
                    <span className="text-[10px] font-black tracking-wider uppercase text-orange-500 bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-lg">
                      {activeProject.category}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 leading-tight">
                      {activeProject.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {activeProject.subtitle}
                    </p>
                  </div>
                  <button
                    onClick={closeCaseStudy}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors shadow-md border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
                  {/* Quick Metrics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-teal-50/30 dark:bg-teal-950/10 border border-teal-200/10 rounded-2xl p-4 sm:p-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Core Project Scale
                      </p>
                      <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                        {activeProject.metric}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {activeProject.metricLabel}
                      </p>
                    </div>
                    <div className="border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 col-span-2">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                        Primary Project Deliverable
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        {activeProject.overview}
                      </p>
                    </div>
                  </div>

                  {/* Activity Documentation Gallery */}
                  <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/30 p-4 sm:p-6 shadow-sm">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                          <Camera className="h-4 w-4 text-orange-500" />
                          Activity Documentation Evidence
                        </h4>
                        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                          Visual proof of field activities, stakeholder engagement, and program implementation.
                        </p>
                      </div>
                      <span className="inline-flex w-fit items-center rounded-full bg-teal-50 dark:bg-teal-950/40 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        {activeProject.documentation.length} Photo Slots
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeProject.documentation.map((photo, idx) => (
                        <DocumentationPhotoCard
                          key={`${activeProject.id}-${idx}`}
                          photo={photo}
                          index={idx}
                          onPreview={setActivePhoto}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Grid of Problem, Strategy, Solution, Result */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Problem Statement */}
                    <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-800/40 rounded-2xl p-5">
                      <h4 className="text-xs font-extrabold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        The Problem & Challenges
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {activeProject.problem}
                      </p>
                    </div>

                    {/* Strategy Deployed */}
                    <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-800/40 rounded-2xl p-5">
                      <h4 className="text-xs font-extrabold text-orange-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        Strategic Deployed Approach
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {activeProject.strategy}
                      </p>
                    </div>

                    {/* The Ultimate Solution */}
                    <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-800/40 rounded-2xl p-5">
                      <h4 className="text-xs font-extrabold text-teal-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        Delivered Solution
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {activeProject.solution}
                      </p>
                    </div>

                    {/* Quantitative Result */}
                    <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-800/40 rounded-2xl p-5">
                      <h4 className="text-xs font-extrabold text-emerald-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Measurable Outcomes
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {activeProject.result}
                      </p>
                    </div>

                  </div>

                  {/* Bottom details: Tools & Impact counters */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                    
                    {/* Tools Used (5 columns) */}
                    <div className="md:col-span-5">
                      <h4 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                        Instruments & Tools Utilized
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {activeProject.tools.map((tool, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bulleted impact (7 columns) */}
                    <div className="md:col-span-7">
                      <h4 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-orange-500" />
                        Verified Program Impact Metrics
                      </h4>
                      <div className="space-y-2">
                        {activeProject.impactMetrics.map((metric, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-200/10"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                              {metric}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer contact trigger */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Interested in implementing a similar framework for your organization?
                  </p>
                  <a
                    href="#contact"
                    onClick={() => {
                      closeCaseStudy();
                      const contactSection = document.getElementById("contact");
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-teal-500 text-white text-xs font-bold shadow-md shadow-teal-500/10 hover:scale-[1.02] transition-all shrink-0"
                  >
                    Discuss Implementation &rarr;
                  </a>
                </div>
              </motion.div>

              {/* Full Photo Preview */}
              <AnimatePresence>
                {activePhoto && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setActivePhoto(null)}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-lg"
                  >
                    <motion.div
                      initial={{ scale: 0.96, opacity: 0, y: 12 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.96, opacity: 0, y: 12 }}
                      onClick={(event) => event.stopPropagation()}
                      className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl"
                    >
                      <button
                        type="button"
                        onClick={() => setActivePhoto(null)}
                        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/70 text-white backdrop-blur-md transition-colors hover:bg-red-500"
                        aria-label="Close photo preview"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <img
                        src={activePhoto.src}
                        alt={activePhoto.alt}
                        className="max-h-[78vh] w-full object-contain bg-slate-950"
                      />
                      <div className="border-t border-white/10 bg-slate-950/95 p-4 sm:p-5">
                        <p className="text-sm font-bold text-white">{activePhoto.caption}</p>
                        <p className="mt-1 text-xs text-slate-400">Documentation evidence for {activeProject.title}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
