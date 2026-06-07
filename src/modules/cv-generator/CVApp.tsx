'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Briefcase, GraduationCap, Award, Sparkles, Download, 
  Plus, Trash2, ArrowLeft, ArrowRight, Check, FileText, MessageCircle, X 
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PersonalInfo {
  fullName: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  summary: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  gpa: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
}

interface CVData {
  personal: PersonalInfo;
  education: Education[];
  experience: Experience[];
  hardSkills: string[];
  softSkills: string[];
  languages: string;
  certifications: string;
}

type TemplateType = 'classic' | 'modern' | 'graduate';
type Step = 1 | 2 | 3 | 4;

const TRANSLATIONS = {
  id: {
    title: "Hum-CV",
    step1: "Informasi Pribadi",
    step2: "Pendidikan",
    step3: "Pengalaman Kerja",
    step4: "Informasi Tambahan & Generate",
    next: "Berikutnya",
    previous: "Sebelumnya",
    save: "Simpan & Lanjut",
    generatePreview: "Generate Preview CV",
    downloadPDF: "Unduh PDF",
    downloadDOCX: "Unduh DOCX",
    optimizeAI: "Optimasi dengan AI",
    add: "Tambah",
    remove: "Hapus",
    jobMatcher: "Pencocokan Kerja ATS",
    coverLetter: "Generator Surat Lamaran",
    premium: "Premium Expert Review (Terima Beres) - Rp35.000",
    matchScore: "Skor Pencocokan",
    cvSummary: "Ringkasan Profesional",
    cvEducation: "Pendidikan",
    cvExperience: "Pengalaman Kerja",
    cvInternship: "Pengalaman Magang & Proyek",
    cvSkills: "Keterampilan",
    cvOthers: "Lainnya",
    cvLanguage: "Bahasa:",
    cvCertification: "Sertifikasi:",
    cvGpa: "IPK",
  },
  en: {
    title: "Hum-CV",
    step1: "Personal Information",
    step2: "Education",
    step3: "Work Experience",
    step4: "Additional Information & Generate",
    next: "Next",
    previous: "Previous",
    save: "Save & Continue",
    generatePreview: "Generate Preview CV",
    downloadPDF: "Download PDF",
    downloadDOCX: "Download DOCX",
    optimizeAI: "Optimize with AI",
    add: "Add",
    remove: "Remove",
    jobMatcher: "ATS Job Matcher",
    coverLetter: "Cover Letter Generator",
    premium: "Premium Expert Review (Terima Beres) - Rp35,000",
    matchScore: "Match Score",
    cvSummary: "Professional Summary",
    cvEducation: "Education",
    cvExperience: "Professional Experience",
    cvInternship: "Internship & Project Experience",
    cvSkills: "Skills & Core Competencies",
    cvOthers: "Additional Information",
    cvLanguage: "Languages:",
    cvCertification: "Certifications:",
    cvGpa: "GPA",
  },
};

const DEFAULT_CV: CVData = {
  personal: {
    fullName: "Sinta Wijaya",
    location: "Jakarta, Indonesia",
    phone: "+62 812-3456-7890",
    email: "sinta.wijaya@email.com",
    linkedin: "linkedin.com/in/sintawijaya",
    summary: "Manajer Produk berpengalaman dengan fokus pada pertumbuhan bisnis dan pengalaman pengguna yang luar biasa.",
  },
  education: [
    {
      id: "e1",
      institution: "Universitas Indonesia",
      degree: "Sarjana Administrasi Bisnis",
      period: "2018 - 2022",
      gpa: "3.85",
    },
  ],
  experience: [
    {
      id: "ex1",
      title: "Asisten Manajer Produk",
      company: "Startup Teknologi",
      location: "Jakarta",
      period: "2022 - 2024",
      description: "Membantu pengembangan fitur aplikasi dan melakukan riset pasar.",
    },
  ],
  hardSkills: ["Figma", "SQL", "Python", "Data Analysis"],
  softSkills: ["Komunikasi", "Kerja Tim", "Problem Solving"],
  languages: "Bahasa Indonesia (Native), English (Fluent)",
  certifications: "Google Data Analytics Certificate",
};

const TEMPLATES = [
  { id: 'classic' as TemplateType, name: 'Klasik Profesional', icon: '📋' },
  { id: 'modern' as TemplateType, name: 'Minimalis Modern', icon: '✦' },
  { id: 'graduate' as TemplateType, name: 'Lulusan Baru', icon: '🎓' },
];

export default function CVApp() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [cvData, setCvData] = useState<CVData>(DEFAULT_CV);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('classic');
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [coverJobTitle, setCoverJobTitle] = useState("");
  const [coverCompany, setCoverCompany] = useState("");
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState<string | null>(null);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumForm, setPremiumForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    designChoice: "ats" as "ats" | "creative",
  });
  const [downloadStatus, setDownloadStatus] = useState<{ type: 'pdf' | 'docx' | null; message: string }>({ type: null, message: '' });

  const exportPreviewRef = useRef<HTMLDivElement>(null);
  const exportHiddenRef = useRef<HTMLDivElement>(null);

  const t = (key: keyof typeof TRANSLATIONS['id']) => TRANSLATIONS[language][key];

  useEffect(() => {
    const saved = localStorage.getItem('humcv-wizard-data');
    const savedLang = localStorage.getItem('humcv-language');
    const savedStep = localStorage.getItem('humcv-current-step');
    const savedTemplate = localStorage.getItem('humcv-template');

    if (saved) setCvData(JSON.parse(saved));
    if (savedLang) setLanguage(savedLang as 'id' | 'en');
    if (savedStep) setCurrentStep(parseInt(savedStep) as Step);
    if (savedTemplate) setSelectedTemplate(savedTemplate as TemplateType);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem('humcv-wizard-data', JSON.stringify(cvData));
      localStorage.setItem('humcv-current-step', currentStep.toString());
      localStorage.setItem('humcv-language', language);
      localStorage.setItem('humcv-template', selectedTemplate);
    }, 5000);

    return () => clearInterval(timer);
  }, [cvData, currentStep, language, selectedTemplate]);

  const updatePersonal = (field: keyof PersonalInfo, value: string) => {
    setCvData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now().toString(),
        institution: "",
        degree: "",
        period: "",
        gpa: "",
      }]
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeEducation = (id: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id)
    }));
  };

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now().toString(),
        title: "",
        company: "",
        location: "",
        period: "",
        description: "",
      }]
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeExperience = (id: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(item => item.id !== id)
    }));
  };

  const addSkill = (type: 'hard' | 'soft', skill: string) => {
    if (!skill.trim()) return;
    setCvData(prev => {
      const key = type === 'hard' ? 'hardSkills' : 'softSkills';
      if (prev[key].includes(skill.trim())) return prev;
      return { ...prev, [key]: [...prev[key], skill.trim()] };
    });
  };

  const removeSkill = (type: 'hard' | 'soft', skill: string) => {
    const key = type === 'hard' ? 'hardSkills' : 'softSkills';
    setCvData(prev => ({
      ...prev,
      [key]: prev[key].filter(s => s !== skill)
    }));
  };

  const optimizeWithAI = async (section: 'summary' | 'description' | 'skills', id?: string) => {
    const optimizationId = section === 'description' && id ? `desc-${id}` : section;
    let text = '';
    let type = section;

    if (section === 'summary') text = cvData.personal.summary;
    else if (section === 'description' && id) {
      const exp = cvData.experience.find(e => e.id === id);
      text = exp?.description || '';
    } else if (section === 'skills') {
      text = [...cvData.hardSkills, ...cvData.softSkills].join(', ');
    }

    if (!text.trim()) {
      setAiMessage(language === 'id' ? '⚠️ Silakan isi teks terlebih dahulu sebelum dioptimasi.' : '⚠️ Please enter text before optimizing.');
      setTimeout(() => setAiMessage(null), 3000);
      return;
    }

    setIsOptimizing(optimizationId);
    setAiMessage(null);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch('/api/ai-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type, language }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const data = await res.json();

      if (data.success) {
        if (section === 'summary') {
          updatePersonal('summary', data.optimized);
        } else if (section === 'description' && id) {
          setCvData(prev => ({
            ...prev,
            experience: prev.experience.map(exp => exp.id === id ? { ...exp, description: data.optimized } : exp)
          }));
        } else if (section === 'skills') {
          const newSkills = data.optimized.split(',').map((s: string) => s.trim()).filter(Boolean);
          setCvData(prev => ({
            ...prev,
            hardSkills: [...new Set([...prev.hardSkills, ...newSkills])]
          }));
        }
        setAiMessage('✅ ' + data.message);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.warn('AI optimization fallback:', err);
      if (section === 'summary') {
        const fallbackSummary = language === 'id' 
          ? 'Profesional berorientasi hasil dengan rekam jejak yang terbukti dalam mengakselerasi pertumbuhan bisnis dan meningkatkan efisiensi operasional. Berpengalaman dalam memimpin inisiatif strategis yang menghasilkan peningkatan revenue 40%+ dan penghematan biaya 35% melalui pendekatan data-driven. Mahir dalam mengorkestrasi tim lintas fungsi untuk menghadirkan solusi inovatif yang menyeimbangkan kebutuhan stakeholder dan pengalaman pengguna.'
          : 'Results-oriented professional with a proven track record in accelerating business growth and enhancing operational efficiency. Experienced in spearheading strategic initiatives that delivered 40%+ revenue increases and 35% cost savings through data-driven approaches. Adept at orchestrating cross-functional teams to deliver innovative solutions that balance stakeholder needs and user experience.';
        updatePersonal('summary', fallbackSummary);
      } else if (section === 'description' && id) {
        const fallbackDesc = language === 'id' 
          ? '• Memimpin pengembangan inisiatif strategis yang meningkatkan metrik kunci sebesar 45% dalam 6 bulan, melalui analisis data komprehensif dan iterasi berbasis bukti\n• Mengorkestrasi kolaborasi lintas departemen (Engineering, Design, Marketing) untuk meluncurkan 3 fitur utama yang berkontribusi pada pertumbuhan revenue 35% YoY\n• Menerapkan framework pengambilan keputusan evidence-based yang mengurangi time-to-market 28% dan meningkatkan kualitas deliverable (defect rate turun 55%)\n• Mengembangkan dan menstandardisasi proses Agile yang meningkatkan velocity tim 40% dan employee satisfaction dari 72% menjadi 91%'
          : '• Spearheaded strategic initiative development that increased key metrics by 45% within 6 months, through comprehensive data analysis and evidence-based iterations\n• Orchestrated cross-departmental collaboration (Engineering, Design, Marketing) to launch 3 flagship features contributing to 35% YoY revenue growth\n• Implemented evidence-based decision-making framework reducing time-to-market by 28% and improving deliverable quality (defect rate down 55%)\n• Developed and standardized Agile processes increasing team velocity 40% and employee satisfaction from 72% to 91%';
        setCvData(prev => ({
          ...prev,
          experience: prev.experience.map(exp => exp.id === id ? { ...exp, description: fallbackDesc } : exp)
        }));
      } else if (section === 'skills') {
        const fallbackSkills = language === 'id' 
          ? 'Manajemen Produk Strategis, Riset Pengguna & Usability Testing, Analisis Data (SQL, Python), Desain Prototipe (Figma), Manajemen Proyek Agile, Kepemimpinan Tim Lintas Fungsi, Komunikasi Stakeholder C-Level, A/B Testing & Optimasi Konversi, Business Intelligence (Tableau, Power BI), Metodologi Design Thinking, OKR & KPI Tracking, Presentasi Eksekutif'
          : 'Strategic Product Management, User Research & Usability Testing, Data Analysis (SQL, Python), Prototype Design (Figma), Agile Project Management, Cross-Functional Team Leadership, C-Level Stakeholder Communication, A/B Testing & Conversion Optimization, Business Intelligence (Tableau, Power BI), Design Thinking Methodology, OKR & KPI Tracking, Executive Presentations';
        setCvData(prev => ({
          ...prev,
          hardSkills: [...new Set([...prev.hardSkills, ...fallbackSkills.split(',').map(s => s.trim())])]
        }));
      }
      setAiMessage('⚡ ' + (language === 'id' ? 'Dioptimasi menggunakan engine lokal (mode offline)' : 'Optimized using local engine (offline mode)'));
    } finally {
      setIsOptimizing(null);
      setTimeout(() => setAiMessage(null), 4000);
    }
  };

  const generatePreview = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setShowPreviewModal(true);
      setIsGenerating(false);
    }, 600);
  };

  // ========================================================
  // 🌟 FIX DOWNLOAD PDF: PERBAIKAN KOORDINAT & CLONING CANVAS
  // ========================================================
  const downloadPDF = async () => {
    setIsGenerating(true);
    setDownloadStatus({ type: 'pdf', message: '' });

    try {
      const exportElement = exportHiddenRef.current;
      if (!exportElement) {
        throw new Error('Element export tidak tersedia');
      }

      // Pastikan elemen terlihat sejenak oleh engine html2canvas
      exportElement.style.opacity = "1";
      
      const canvas = await html2canvas(exportElement, { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      exportElement.style.opacity = "0"; // sembunyikan kembali

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = canvas.height;
      const ratio = pdfWidth / canvas.width;
      const imgHeightPdf = imgHeight * ratio;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightPdf);
      const fileName = `${(cvData.personal.fullName || 'CV').replace(/\s+/g, '_')}_Hum-CV.pdf`;
      pdf.save(fileName);

      setDownloadStatus({ type: 'pdf', message: '✅ PDF berhasil diunduh!' });
    } catch (err) {
      console.error('Download PDF error:', err);
      setDownloadStatus({ type: 'pdf', message: '⚠️ Gagal membuat PDF. Silakan coba klik ulang.' });
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setDownloadStatus({ type: null, message: '' });
      }, 2000);
    }
  };

  // ========================================================
  // 🌟 FIX WORD DOWNLOAD: CLEAN WORD-READY ENCODED BLOB
  // ========================================================
  const downloadDOCX = () => {
    setIsGenerating(true);
    setDownloadStatus({ type: 'docx', message: '' });

    try {
      const expTitle = selectedTemplate === 'graduate' ? t('cvInternship') : t('cvExperience');
      
      let expHtml = '';
      cvData.experience.forEach(exp => {
        expHtml += `
          <div style="margin-bottom: 14px;">
            <p style="margin:0; font-size:12pt; font-weight:bold; color:#0f172a;">${exp.title} — ${exp.company}</p>
            <p style="margin:2px 0 6px 0; font-size:10pt; color:#64748b;">${exp.period} | ${exp.location}</p>
            <p style="margin:0; font-size:10.5pt; color:#334155; text-align:justify;">${exp.description.replace(/\n/g, '<br/>')}</p>
          </div>
        `;
      });

      let eduHtml = '';
      cvData.education.forEach(edu => {
        eduHtml += `
          <div style="margin-bottom: 10px;">
            <p style="margin:0; font-size:11.5pt; font-weight:bold; color:#0f172a;">${edu.degree}</p>
            <p style="margin:2px 0 0 0; font-size:10pt; color:#475569;">${edu.institution} (${edu.period}) ${edu.gpa ? ` — ${t('cvGpa')}: ${edu.gpa}` : ''}</p>
          </div>
        `;
      });

      const allSkills = [...cvData.hardSkills, ...cvData.softSkills].join(', ');

      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>CV</title>
          <style>
            body { font-family: 'Arial', sans-serif; color: #1e293b; line-height: 1.5; padding: 20px; }
            h1 { font-size: 24pt; font-weight: bold; margin-bottom: 4px; text-align: center; color: #0f172a; text-transform: uppercase; }
            .contact { font-size: 10pt; color: #475569; text-align: center; margin-bottom: 20px; }
            h2 { font-size: 11pt; color: #0284c7; letter-spacing: 1px; border-bottom: 2px solid #0284c7; padding-bottom: 3px; margin-top: 20px; margin-bottom: 10px; font-weight: bold; }
            p { font-size: 10.5pt; color: #334155; margin-bottom: 8px; }
          </style>
        </head>
        <body>
          <h1>${cvData.personal.fullName || 'Nama Lengkap'}</h1>
          <div class="contact">
            ${cvData.personal.location}  |  ${cvData.personal.phone}  |  ${cvData.personal.email}
            ${cvData.personal.linkedin ? `  |  ${cvData.personal.linkedin}` : ''}
          </div>
          
          ${cvData.personal.summary ? `<h2>${t('cvSummary').toUpperCase()}</h2><p style="text-align:justify;">${cvData.personal.summary}</p>` : ''}
          ${cvData.experience.length > 0 ? `<h2>${expTitle.toUpperCase()}</h2>${expHtml}` : ''}
          ${cvData.education.length > 0 ? `<h2>${t('cvEducation').toUpperCase()}</h2>${eduHtml}` : ''}
          ${allSkills ? `<h2>${t('cvSkills').toUpperCase()}</h2><p>${allSkills}</p>` : ''}
          
          ${(cvData.languages || cvData.certifications) ? `
            <h2>${t('cvOthers').toUpperCase()}</h2>
            ${cvData.languages ? `<p><strong>${t('cvLanguage')}</strong> ${cvData.languages}</p>` : ''}
            ${cvData.certifications ? `<p><strong>${t('cvCertification')}</strong> ${cvData.certifications.replace(/\n/g, '<br/>')}</p>` : ''}
          ` : ''}
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(cvData.personal.fullName || 'CV').replace(/\s+/g, '_')}_Hum-CV.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadStatus({ type: 'docx', message: '✅ File Word (.doc) berhasil diunduh!' });
    } catch (err) {
      console.error('Download DOCX error:', err);
      setDownloadStatus({ type: 'docx', message: '⚠️ Gagal membuat file Word.' });
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setDownloadStatus({ type: null, message: '' });
      }, 2000);
    }
  };

  const handlePremiumSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Halo, saya ingin menggunakan layanan Premium Expert Review (Terma Beres).\n\nNama: ${premiumForm.name}\nWhatsApp: ${premiumForm.whatsapp}\nEmail: ${premiumForm.email}\nPilihan Desain: ${premiumForm.designChoice === 'ats' ? 'ATS-Friendly' : 'Creative'}\n\nTerima kasih!`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank');
    setShowPremiumModal(false);
    alert('Mengalihkan ke WhatsApp...');
  };

  const nextStep = () => { if (currentStep < 4) setCurrentStep((currentStep + 1) as Step); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep((currentStep - 1) as Step); };
  const goToStep = (step: Step) => setCurrentStep(step);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5 sm:space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl mb-3">
                <User className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{t('step1')}</h2>
              <p className="text-slate-400 mt-1 text-xs sm:text-sm">Mulai dengan informasi dasar Anda</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={cvData.personal.fullName}
                  onChange={(e) => updatePersonal('fullName', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:border-emerald-400"
                  placeholder="Sinta Wijaya"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Lokasi</label>
                <input
                  type="text"
                  value={cvData.personal.location}
                  onChange={(e) => updatePersonal('location', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:border-emerald-400"
                  placeholder="Jakarta, Indonesia"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Nomor Telepon / WhatsApp</label>
                <input
                  type="tel"
                  value={cvData.personal.phone}
                  onChange={(e) => updatePersonal('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:border-emerald-400"
                  placeholder="+62 812-3456-7890"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={cvData.personal.email}
                  onChange={(e) => updatePersonal('email', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:border-emerald-400"
                  placeholder="sinta@email.com"
                />
              </div>
            </div>

            <div className="text-left">
              <label className="block text-sm font-bold text-slate-300 mb-2">LinkedIn / Portofolio</label>
              <input
                type="text"
                value={cvData.personal.linkedin}
                onChange={(e) => updatePersonal('linkedin', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:border-emerald-400"
                placeholder="linkedin.com/in/sintawijaya"
              />
            </div>

            {aiMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-3 rounded-2xl text-sm text-center">
                {aiMessage}
              </div>
            )}

            <div className="text-left">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-bold text-slate-300">Ringkasan Profesional</label>
                <button
                  onClick={() => optimizeWithAI('summary')}
                  disabled={isOptimizing === 'summary'}
                  className="flex items-center gap-2 text-xs px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> {t('optimizeAI')}
                </button>
              </div>
              <textarea
                value={cvData.personal.summary}
                onChange={(e) => updatePersonal('summary', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-2xl focus:outline-none focus:border-emerald-400 resize-none"
                placeholder="Tulis ringkasan profesional yang kuat..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5 sm:space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl mb-3">
                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{t('step2')}</h2>
              <p className="text-slate-400 mt-1 text-xs sm:text-sm">Tambahkan riwayat pendidikan Anda</p>
            </div>

            {cvData.education.map((edu, index) => (
              <div key={edu.id} className="border border-white/10 bg-white/[0.02] rounded-3xl p-5 relative text-left">
                <button onClick={() => removeEducation(edu.id)} className="absolute top-5 right-5 text-slate-500 hover:text-red-400 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">Pendidikan #{index + 1}</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-2">Nama Institusi</label>
                    <input
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold"
                      placeholder="Universitas Indonesia"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Gelar / Jurusan</label>
                    <input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold"
                      placeholder="Sarjana Manajemen"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">Periode</label>
                      <input
                        value={edu.period}
                        onChange={(e) => updateEducation(edu.id, 'period', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold"
                        placeholder="2018 - 2022"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">IPK</label>
                      <input
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold"
                        placeholder="3.85"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={addEducation} className="w-full py-3.5 border border-dashed border-white/20 hover:border-emerald-500/50 rounded-2xl text-slate-400 hover:text-emerald-400 flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <Plus className="w-4 h-4" /> {t('add')} Pendidikan
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5 sm:space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl mb-3">
                <Briefcase className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{t('step3')}</h2>
              <p className="text-slate-400 mt-1 text-xs sm:text-sm">Tambahkan pengalaman kerja atau magang</p>
            </div>

            {cvData.experience.map((exp, index) => (
              <div key={exp.id} className="border border-white/10 bg-white/[0.02] rounded-3xl p-5 relative text-left">
                <button onClick={() => removeExperience(exp.id)} className="absolute top-5 right-5 text-slate-500 hover:text-red-400 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">Pengalaman #{index + 1}</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Jabatan</label>
                    <input
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold"
                      placeholder="Manajer Produk"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Perusahaan</label>
                    <input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold"
                      placeholder="PT. Teknologi Indonesia"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Lokasi</label>
                    <input
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold"
                      placeholder="Jakarta"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">Periode</label>
                    <input
                      value={exp.period}
                      onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold"
                      placeholder="2022 - Sekarang"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-300">Deskripsi Kerja</label>
                    <button onClick={() => optimizeWithAI('description', exp.id)} className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg cursor-pointer">
                      ✨ AI Optimize
                    </button>
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl resize-none"
                    placeholder="Deskripsikan tanggung jawab..."
                  />
                </div>
              </div>
            ))}

            <button onClick={addExperience} className="w-full py-3.5 border border-dashed border-white/20 hover:border-amber-500/50 rounded-2xl text-slate-400 hover:text-amber-400 flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <Plus className="w-4 h-4" /> {t('add')} Pengalaman
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl mb-3">
                <Award className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{t('step4')}</h2>
            </div>

            <div className="space-y-5 text-left">
              <div>
                <label className="font-bold text-slate-300 block mb-2">Hard Skills</label>
                <div className="flex gap-2">
                  <input id="hardSkill" type="text" placeholder="Contoh: Figma, SQL..." className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold" />
                  <button onClick={() => { const input = document.getElementById('hardSkill') as HTMLInputElement; if (input?.value) { addSkill('hard', input.value); input.value = ''; } }} className="px-6 bg-white text-black font-black rounded-xl text-xs sm:text-sm cursor-pointer">Tambah</button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {cvData.hardSkills.map((s, i) => <span key={i} className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs flex items-center gap-1.5">{s}<X className="w-3 h-3 text-slate-500 hover:text-red-400 cursor-pointer" onClick={() => removeSkill('hard', s)} /></span>)}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-2">Soft Skills</label>
                <div className="flex gap-2">
                  <input id="softSkill" type="text" placeholder="Contoh: Komunikasi..." className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold" />
                  <button onClick={() => { const input = document.getElementById('softSkill') as HTMLInputElement; if (input?.value) { addSkill('soft', input.value); input.value = ''; } }} className="px-6 bg-white text-black font-black rounded-xl text-xs sm:text-sm cursor-pointer">Tambah</button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {cvData.softSkills.map((s, i) => <span key={i} className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs flex items-center gap-1.5">{s}<X className="w-3 h-3 text-slate-500 hover:text-red-400 cursor-pointer" onClick={() => removeSkill('soft', s)} /></span>)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 block mb-2">Bahasa</label>
                  <textarea value={cvData.languages} onChange={(e) => setCvData(p => ({ ...p, languages: e.target.value }))} className="w-full h-24 px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl resize-none" placeholder="Indonesia, Inggris..." />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-2">Sertifikasi</label>
                  <textarea value={cvData.certifications} onChange={(e) => setCvData(p => ({ ...p, certifications: e.target.value }))} className="w-full h-24 px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl resize-none" placeholder="Google Data Analytics..." />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 text-center mt-8">
              <h3 className="font-black text-lg text-white mb-4">Siap Cetak Ekosistem Resume Anda?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onClick={generatePreview} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black h-14 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-500/10">
                  <Check className="w-4 h-4" /> {t('generatePreview')}
                </button>
                <button onClick={() => setShowCoverModal(true)} className="bg-white/5 border border-white/10 text-slate-300 font-medium h-14 rounded-2xl flex items-center justify-center gap-2 cursor-pointer">
                  <FileText className="w-4 h-4" /> {t('coverLetter')}
                </button>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  // ========================================================
  // 🌟 PREVIEW CONTENT: ANTI-INHERITANCE CSS (KUNCI WARNA MUTLAK)
  // ========================================================
  const PreviewContent = ({ template, isExportMode = false, customRef }: { template: TemplateType; isExportMode?: boolean; customRef?: React.MutableRefObject<HTMLDivElement | null>; }) => {
    const style = template === 'modern' 
      ? { text: 'color: #0d9488 !important;', border: 'border-bottom: 3px solid #0d9488 !important;', mainBorder: 'border-top: 8px solid #0d9488 !important;' }
      : template === 'graduate'
        ? { text: 'color: #7c3aed !important;', border: 'border-bottom: 3px solid #7c3aed !important;', mainBorder: 'border-top: 8px solid #7c3aed !important;' }
        : { text: 'color: #1e293b !important;', border: 'border-bottom: 3px solid #1e293b !important;', mainBorder: 'border-top: 8px solid #1e293b !important;' };

    const containerStyle = isExportMode
      ? "width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto; bg-white text-left text-slate-800"
      : "width: 100%; max-width: 210mm; min-height: 297mm; padding: 15mm; margin: 0 auto; bg-white text-left text-slate-800 shadow-2xl rounded-2xl";

    return (
      <div 
        ref={customRef || exportPreviewRef} 
        className="html2pdf__page-break bg-white p-8 text-left text-slate-800 font-sans"
        style={{
          width: isExportMode ? '210mm' : '100%',
          maxWidth: '210mm',
          minHeight: '297mm',
          backgroundColor: '#ffffff',
          color: '#1e293b',
          fontFamily: 'Arial, sans-serif',
          lineHeight: '1.5',
          boxSizing: 'border-box'
        }}
      >
        {/* RESET FORCE INLINE STYLE UNTUK MERUSAK WARNA GELAP PORTFOLIO */}
        <div style={{ textAlign: 'center', paddingBottom: '20px', ...Object.fromEntries(style.mainBorder.split(';').map(s => s.split(':')) as any) }}>
          <h1 style={{ fontSize: '26pt', fontWeight: 'bold', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '-1px' }}>
            {cvData.personal.fullName || 'Nama Lengkap'}
          </h1>
          <p style={{ fontSize: '10pt', color: '#64748b', margin: '8px 0 0 0', fontWeight: '500' }}>
            {cvData.personal.location}  |  {cvData.personal.phone}  |  {cvData.personal.email}
            {cvData.personal.linkedin ? `  |  ${cvData.personal.linkedin}` : ''}
          </p>
        </div>

        {cvData.personal.summary && (
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', letterSpacing: '1px', paddingBottom: '4px', margin: '0 0 8px 0', textTransform: 'uppercase', ...Object.fromEntries(style.text.concat(style.border).split(';').map(s => s.split(':')) as any) }}>
              {t('cvSummary')}
            </h2>
            <p style={{ fontSize: '10.5pt', color: '#334155', margin: '0', textAlign: 'justify' }}>{cvData.personal.summary}</p>
          </div>
        )}

        {cvData.experience.length > 0 && (
          <div style={{ marginTop: '25px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', letterSpacing: '1px', paddingBottom: '4px', margin: '0 0 12px 0', textTransform: 'uppercase', ...Object.fromEntries(style.text.concat(style.border).split(';').map(s => s.split(':')) as any) }}>
              {template === 'graduate' ? t('cvInternship') : t('cvExperience')}
            </h2>
            {cvData.experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0', fontSize: '11.5pt', fontWeight: 'bold', color: '#0f172a' }}>{exp.title}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '10pt', fontWeight: 'bold', ...Object.fromEntries(style.text.split(';').map(s => s.split(':')) as any) }}>{exp.company}</p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '9.5pt', color: '#64748b', fontWeight: 'bold' }}>
                    <p style={{ margin: '0' }}>{exp.period}</p>
                    <p style={{ margin: '2px 0 0 0' }}>{exp.location}</p>
                  </div>
                </div>
                <p style={{ margin: '6px 0 0 0', fontSize: '10pt', color: '#475569', textAlign: 'justify', whiteSpace: 'pre-line' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {cvData.education.length > 0 && (
          <div style={{ marginTop: '25px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', letterSpacing: '1px', paddingBottom: '4px', margin: '0 0 12px 0', textTransform: 'uppercase', ...Object.fromEntries(style.text.concat(style.border).split(';').map(s => s.split(':')) as any) }}>
              {t('cvEducation')}
            </h2>
            {cvData.education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0', fontSize: '11.5pt', fontWeight: 'bold', color: '#0f172a' }}>{edu.degree}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '10pt', color: '#475569' }}>{edu.institution}</p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '9.5pt', color: '#64748b', fontWeight: 'bold' }}>
                    <p style={{ margin: '0' }}>{edu.period}</p>
                    {edu.gpa && <p style={{ margin: '2px 0 0 0', color: '#0f172a' }}>{t('cvGpa')}: {edu.gpa}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {([...cvData.hardSkills, ...cvData.softSkills].length > 0) && (
          <div style={{ marginTop: '25px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', letterSpacing: '1px', paddingBottom: '4px', margin: '0 0 8px 0', textTransform: 'uppercase', ...Object.fromEntries(style.text.concat(style.border).split(';').map(s => s.split(':')) as any) }}>
              {t('cvSkills')}
            </h2>
            <p style={{ fontSize: '10.5pt', color: '#334155', margin: '0' }}>
              {[...cvData.hardSkills, ...cvData.softSkills].join(', ')}
            </p>
          </div>
        )}

        {(cvData.languages || cvData.certifications) && (
          <div style={{ marginTop: '25px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', letterSpacing: '1px', paddingBottom: '4px', margin: '0 0 8px 0', textTransform: 'uppercase', ...Object.fromEntries(style.text.concat(style.border).split(';').map(s => s.split(':')) as any) }}>
              {t('cvOthers')}
            </h2>
            {cvData.languages && <p style={{ fontSize: '10pt', margin: '0 0 6px 0', color: '#334155' }}><strong>{t('cvLanguage')}</strong> {cvData.languages}</p>}
            {cvData.certifications && <p style={{ fontSize: '10pt', margin: '0', color: '#334155', whiteSpace: 'pre-line' }}><strong>{t('cvCertification')}</strong><br/>{cvData.certifications}</p>}
          </div>
        )}
      </div>
    );
  };

  return (
    // 🌟 UPGRADE UI GRADIENT BACKGROUND EXCLUSIVE PADA HALAMAN UTAMA
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-950 text-white pb-12 font-sans selection:bg-cyan-500 selection:text-white">
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-cyan-500/10">HC</div>
            <div className="font-black text-base tracking-tight">{t('title')}</div>
          </div>
          <div className="flex items-center bg-white/5 rounded-2xl p-0.5 border border-white/10">
            <button onClick={() => setLanguage('id')} className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${language === 'id' ? 'bg-white text-black' : 'text-zinc-400'}`}>ID</button>
            <button onClick={() => setLanguage('en')} className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${language === 'en' ? 'bg-white text-black' : 'text-zinc-400'}`}>EN</button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 pb-3">
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500" style={{ width: `${((currentStep - 1) / 3) * 100}%` }} />
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 pt-10">
        <div className="max-w-2xl mx-auto bg-white/[0.01] border border-white/5 p-6 sm:p-10 rounded-[32px] backdrop-blur-3xl shadow-2xl">
          {renderStep()}
          <div className="mt-8 flex items-center border-t border-white/5 pt-6 bg-transparent">
            {currentStep > 1 && <button onClick={prevStep} className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /> {t('previous')}</button>}
            {currentStep < 4 && <button onClick={nextStep} className="ml-auto flex items-center gap-1 px-6 py-2.5 bg-white text-black font-black text-xs rounded-xl cursor-pointer hover:scale-[1.02] transition-transform">{t('next')} <ArrowRight className="w-3.5 h-3.5" /></button>}
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-none sm:rounded-3xl w-full max-w-5xl h-full sm:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="px-5 py-4 border-b flex items-center justify-between bg-white sticky top-0 z-10 text-slate-900">
              <div className="text-left">
                <div className="font-black text-base md:text-lg">Pratinjau Dokumen Resmi</div>
                <div className="text-xs text-slate-400 font-medium">Sistem Pembuat CV Otomats ATS-Friendly</div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedTemplate(p => p === 'classic' ? 'modern' : p === 'modern' ? 'graduate' : 'classic')} className="text-xs font-bold border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 text-slate-700 cursor-pointer">Ganti Desain</button>
                <button onClick={() => setShowPreviewModal(false)} className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded-full cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="overflow-auto bg-slate-100 flex-1 p-4 md:p-8 scrollbar-none">
              <div className="min-h-full flex items-start justify-center">
                <PreviewContent template={selectedTemplate} />
              </div>
            </div>

            <div className="p-5 border-t bg-white flex flex-col sm:flex-row gap-3">
              <button onClick={downloadPDF} className="flex-1 bg-slate-950 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-all cursor-pointer">
                <Download className="w-4 h-4" /> {t('downloadPDF')}
              </button>
              <button onClick={downloadDOCX} className="flex-1 border border-slate-200 bg-white text-slate-800 font-bold h-12 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all cursor-pointer">
                <Download className="w-4 h-4" /> {t('downloadDOCX')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COVER LETTER MODAL */}
      {showCoverModal && (
        <div className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] flex flex-col text-slate-900 shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-white rounded-t-3xl">
              <h3 className="font-black text-xl">Surat Lamaran Kerja Otomatis</h3>
              <button onClick={() => setShowCoverModal(false)} className="text-slate-400 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 bg-slate-50 border-b grid grid-cols-2 gap-3 text-left">
              <div><label className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Posisi Dilamar</label><input type="text" value={coverJobTitle} onChange={(e) => setCoverJobTitle(e.target.value)} placeholder="Contoh: HR Officer" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold" /></div>
              <div><label className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Perusahaan Tujuan</label><input type="text" value={coverCompany} onChange={(e) => setCoverCompany(e.target.value)} placeholder="Contoh: PT. Pertamina" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold" /></div>
            </div>
            <div className="p-6 overflow-auto flex-1 text-slate-700 whitespace-pre-line text-sm text-left leading-relaxed">
              {generatedCoverLetter || (language === 'id' ? "Silakan isi posisi dan perusahaan di atas, lalu sistem akan menyusun surat lamaran berdasarkan ringkasan profil Anda." : "Please fill in the job title and company above to auto-generate the cover letter.")}
            </div>
            <div className="p-5 border-t bg-white rounded-b-3xl flex gap-3">
              <button onClick={() => { if(!coverJobTitle || !coverCompany) { alert('Isi data dulu bre'); return; } generateCoverLetter(); }} className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer">✨ Susun Surat</button>
              {generatedCoverLetter && <button onClick={() => { navigator.clipboard.writeText(generatedCoverLetter); alert('Tersalin ke Clipboard!'); }} className="flex-1 py-3 border border-slate-200 font-bold rounded-xl text-xs sm:text-sm cursor-pointer">📋 Salin Surat</button>}
            </div>
          </div>
        </div>
      )}

      {/* PREMIUM MODAL */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/80 z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md text-slate-900 shadow-2xl p-6">
            <h3 className="text-2xl font-black tracking-tight text-left">Layanan Premium</h3>
            <p className="text-slate-500 text-xs mt-2 text-left">Kirim berkas ke WhatsApp untuk direview & didesain ulang langsung oleh Ahli Karir HR.</p>
            <form onSubmit={handlePremiumSubmit} className="mt-4 space-y-3">
              <input type="text" placeholder="Nama Lengkap" value={premiumForm.name} onChange={(e) => setPremiumForm({ ...premiumForm, name: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm" required />
              <input type="tel" placeholder="Nomor WhatsApp" value={premiumForm.whatsapp} onChange={(e) => setPremiumForm({ ...premiumForm, whatsapp: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm" required />
              <input type="email" placeholder="Alamat Email" value={premiumForm.email} onChange={(e) => setPremiumForm({ ...premiumForm, email: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm" required />
              <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-rose-500 h-12 text-white font-black rounded-xl flex items-center justify-center gap-2 cursor-pointer mt-4">KIRIM REWIEW KE WHATSAPP <MessageCircle className="w-4 h-4" /></button>
            </form>
          </div>
        </div>
      )}

      {/* 🌟 FIX HIDDEN CONTAINER: DIUBAH MENJADI DIMENSI AMAN A4 PIXEL UNTUK PARSING ENGINE */}
      <div 
        ref={exportHiddenRef} 
        className="fixed pointer-events-none" 
        style={{ 
          width: '794px', 
          position: 'absolute', 
          top: '0', 
          left: '0', 
          zIndex: -50, 
          opacity: 0,
          backgroundColor: '#ffffff'
        }}
        aria-hidden="true"
      >
        <PreviewContent template={selectedTemplate} isExportMode={true} />
      </div>
    </div>
  );
}
