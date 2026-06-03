import { Award, ShieldCheck, CheckCircle } from "lucide-react";

const certifications = [
  {
    title: "Sertifikasi Human Capital Officer (BNSP)",
    issuer: "LSP MSDM Unggul Indonesia",
    status: "BNSP Professional License",
    date: "Valid & Active",
    description: "Sertifikasi kompetensi resmi berskala nasional untuk membuktikan keahlian profesional di bidang pengelolaan Sumber Daya Manusia (SDM/Human Capital), mulai dari analisa jabatan, evaluasi kompetensi, hingga implementasi strategi pelatihan karyawan.",
    skillsValidated: ["Job Analysis", "HC Administration", "Competency Mapping"],
    color: "text-teal-500",
    bgColor: "bg-teal-50 dark:bg-teal-950/35"
  },
  {
    title: "Sertifikasi Kompetensi Amil (BNSP)",
    issuer: "Qualification 3 in Zakat Management (Forum Organisasi Zakat)",
    status: "BNSP Specialization License",
    date: "Valid & Active",
    description: "Sertifikasi kompetensi tingkat nasional untuk pengelolaan dana sosial ZISWAF (Zakat, Infaq, Shadaqah, dan Wakaf), mencakup tata kelola regulasi keuangan sosial, audit syariah, serta program pemberdayaan masyarakat.",
    skillsValidated: ["Zakat Management", "Socio-finance Compliance", "Program Seeding"],
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/35"
  },
  {
    title: "Sertifikat HRCP Online Structure & Jobdesc",
    issuer: "HR Indo Society",
    status: "Specialist Course Completion",
    date: "Verified Credential",
    description: "Sertifikasi profesional yang menvalidasi keahlian taktis dalam merancang struktur organisasi yang dinamis, merumuskan deskripsi pekerjaan (job descriptions) yang terukur, serta memformulasikan struktur grading karyawan.",
    skillsValidated: ["Job Grading", "Organizational Structure", "Job Description Design"],
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/35"
  },
  {
    title: "Sertifikat Penyelesaian (CoC) Kursus Bahasa Inggris",
    issuer: "Cakap.com",
    status: "Business Language Credential",
    date: "Verified Graduate",
    description: "Sertifikasi Certificate of Completion (CoC) kursus bahasa Inggris profesional untuk memvalidasi kecakapan komunikasi bisnis internasional, presentasi eksekutif, negosiasi kemitraan B2B, serta korespondensi formal.",
    skillsValidated: ["Business English", "B2B Communications", "Executive Presentation"],
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/35"
  }
];

export default function Certifications() {
  return (
    <section
      id="certifications"
      className="py-16 sm:py-20 lg:py-24 relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-100/30 dark:border-teal-900/30 mb-4">
            <Award className="w-3.5 h-3.5 text-teal-500" />
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase">
              Verified Credentials
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Professional Certifications
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed font-normal">
            Tersertifikasi secara resmi dalam penyusunan strategi human capital, monitoring program sosial ZISWAF, komunikasi bisnis, dan perancangan struktur organisasi.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-teal-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Certification grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Glowing Badge Ribbon */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-500/5 to-transparent rounded-bl-full pointer-events-none z-0" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex gap-3 sm:gap-4">
                    <div className={`p-3 rounded-2xl ${cert.bgColor} ${cert.color} shrink-0`}>
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mt-1 tracking-wider">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-extrabold uppercase border border-teal-500/20 shrink-0">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5 font-normal">
                  {cert.description}
                </p>
              </div>

              {/* Footer skills list */}
              <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
                  Skills Validated:
                </span>
                {cert.skillsValidated.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}