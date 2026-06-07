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

// ========================================================
// 🌟 KAMUS BAHASA UTAMA INDONESIA & ENGLISH (FULL COMPLIANT)
// ========================================================
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
    // 🌟 Judul Struktur CV Dinamis
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
    // 🌟 Dynamic CV Layout Titles
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
  const [language, setLanguage] = useState<'id' | 'en'>('id'); // 🌟 DEFAULT OTOMATIS INDONESIA ('id')
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

  // Load dari LocalStorage
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

  // Auto-save data simulasi
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
      education: prev.education.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
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
      experience: prev.experience.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
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
            experience: prev.experience.map(exp => 
              exp.id === id ? { ...exp, description: data.optimized } : exp
            )
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
          experience: prev.experience.map(exp => 
            exp.id === id ? { ...exp, description: fallbackDesc } : exp
          )
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

  const downloadPDF = async () => {
    setIsGenerating(true);
    setDownloadStatus({ type: 'pdf', message: '' });

    try {
      const exportElement = exportHiddenRef.current || exportPreviewRef.current;
      if (!exportElement) {
        throw new Error('Element export tidak tersedia');
      }

      const canvas = await html2canvas(exportElement, { 
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = canvas.height;
      const ratio = pdfWidth / canvas.width;
      const imgHeightPdf = imgHeight * ratio;

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, imgHeightPdf);
      const fileName = `${(cvData.personal.fullName || 'CV').replace(/\s+/g, '_')}_Hum-CV.pdf`;
      pdf.save(fileName);

      setDownloadStatus({ type: 'pdf', message: '✅ PDF berhasil diunduh!' });
    } catch (err) {
      console.error('Download PDF error:', err);
      setDownloadStatus({ type: 'pdf', message: '⚠️ Gagal membuat PDF. Coba ulangi dalam beberapa detik.' });
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setDownloadStatus({ type: null, message: '' });
      }, 2500);
    }
  };

  // ========================================================
  // 🌟 EXPORT WORD DINAMIS MENGIKUTI PILIHAN BAHASA USER
  // ========================================================
  const downloadDOCX = () => {
    setIsGenerating(true);
    setDownloadStatus({ type: 'docx', message: '' });

    try {
      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>${cvData.personal.fullName || 'CV'} - Hum-CV</title>
          <style>
            body { font-family: 'Arial', sans-serif; color: #1e293b; line-height: 1.6; }
            h1 { font-size: 22px; margin-bottom: 8px; letter-spacing: -0.5px; }
            h2 { font-size: 13px; color: #475569; letter-spacing: 2px; border-bottom: 2px solid #0ea5e9; padding-bottom: 4px; margin-top: 24px; }
            .contact { font-size: 11px; color: #64748b; }
            .job-title { font-size: 14px; font-weight: bold; }
            .job-info { font-size: 11px; color: #64748b; }
            .skill { background: #f1f5f9; padding: 3px 10px; border-radius: 12px; font-size: 11px; margin: 2px; display: inline-block; }
          </style>
        </head>
        <body>
          <h1>${cvData.personal.fullName || 'Nama Anda'}</h1>
          <div class="contact">
            ${cvData.personal.location} • ${cvData.personal.phone} • ${cvData.personal.email}
            ${cvData.personal.linkedin ? ` • ${cvData.personal.linkedin}` : ''}
          </div>
          ${cvData.personal.summary ? `<h2>${t('cvSummary').toUpperCase()}</h2><p>${cvData.personal.summary.replace(/\n/g, '<br/>')}</p>` : ''}
          ${cvData.experience.length > 0 ? `
            <h2>${(selectedTemplate === 'graduate' ? t('cvInternship') : t('cvExperience')).toUpperCase()}</h2>
            ${cvData.experience.map(exp => `
              <div style="margin-bottom: 16px;">
                <div class="job-title">${exp.title} — ${exp.company}</div>
                <div class="job-info">${exp.period} • ${exp.location}</div>
                <p style="margin-top: 6px;">${exp.description.replace(/\n/g, '<br/>')}</p>
              </div>
            `).join('')}
          ` : ''}
          ${cvData.education.length > 0 ? `
            <h2>${t('cvEducation').toUpperCase()}</h2>
            ${cvData.education.map(edu => `
              <div>
                <strong>${edu.degree}</strong><br/>
                ${edu.institution} • ${edu.period}
                ${edu.gpa ? ` • ${t('cvGpa')}: ${edu.gpa}` : ''}
              </div>
            `).join('<br/>')}
          ` : ''}
          ${(cvData.hardSkills.length > 0 || cvData.softSkills.length > 0) ? `
            <h2>${t('cvSkills').toUpperCase()}</h2>
            ${[...cvData.hardSkills, ...cvData.softSkills].map(s => `<span class="skill">${s}</span>`).join('')}
          ` : ''}
          ${(cvData.languages || cvData.certifications) ? `
            <h2>${t('cvOthers').toUpperCase()}</h2>
            ${cvData.languages ? `<p><strong>${t('cvLanguage')}</strong> ${cvData.languages}</p>` : ''}
            ${cvData.certifications ? `<p><strong>${t('cvCertification')}</strong> ${cvData.certifications.replace(/\n/g, '<br/>')}</p>` : ''}
          ` : ''}
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff' + htmlContent], { 
        type: 'application/msword;charset=utf-8' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(cvData.personal.fullName || 'CV').replace(/\s+/g, '_')}_Hum-CV.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadStatus({ type: 'docx', message: 'File Word berhasil diunduh!' });
    } catch (err) {
      console.error('Download DOCX error:', err);
      setDownloadStatus({ type: 'docx', message: '⚠️ Gagal membuat file Word.' });
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setDownloadStatus({ type: null, message: '' });
      }, 2500);
    }
  };

  const handlePremiumSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Halo, saya ingin menggunakan layanan Premium Expert Review (Terima Beres).\n\nNama: ${premiumForm.name}\nWhatsApp: ${premiumForm.whatsapp}\nEmail: ${premiumForm.email}\nPilihan Desain: ${premiumForm.designChoice === 'ats' ? 'ATS-Friendly' : 'Creative'}\n\nTerima kasih!`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank');
    setShowPremiumModal(false);
    alert('Mengalihkan ke WhatsApp...');
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep((currentStep + 1) as Step);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
  };

  const goToStep = (step: Step) => setCurrentStep(step);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5 sm:space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-600 rounded-2xl mb-3 sm:mb-4">
                <User className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{t('step1')}</h2>
              <p className="text-slate-500 mt-1 sm:mt-2 text-xs sm:text-sm">Mulai dengan informasi dasar Anda</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={cvData.personal.fullName}
                  onChange={(e) => updatePersonal('fullName', e.target.value)}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="Sinta Wijaya"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Lokasi</label>
                <input
                  type="text"
                  value={cvData.personal.location}
                  onChange={(e) => updatePersonal('location', e.target.value)}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="Jakarta, Indonesia"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nomor Telepon / WhatsApp</label>
                <input
                  type="tel"
                  value={cvData.personal.phone}
                  onChange={(e) => updatePersonal('phone', e.target.value)}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="+62 812-3456-7890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={cvData.personal.email}
                  onChange={(e) => updatePersonal('email', e.target.value)}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="sinta@email.com"
                />
              </div>
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn / Portofolio</label>
              <input
                type="text"
                value={cvData.personal.linkedin}
                onChange={(e) => updatePersonal('linkedin', e.target.value)}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="linkedin.com/in/sintawijaya"
              />
            </div>

            {aiMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-3 rounded-2xl text-sm text-center animate-pulse">
                {aiMessage}
              </div>
            )}

            <div className="text-left">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-slate-700">Ringkasan Profesional</label>
                <button
                  onClick={() => optimizeWithAI('summary')}
                  disabled={isOptimizing === 'summary'}
                  className={`flex items-center gap-2 text-xs px-5 py-2 rounded-2xl transition-all border border-emerald-200/40 cursor-pointer ${
                    isOptimizing === 'summary' 
                      ? 'bg-violet-100 text-violet-600 cursor-wait' 
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {isOptimizing === 'summary' ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Mengoptimasi...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> {t('optimizeAI')}
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={cvData.personal.summary}
                onChange={(e) => updatePersonal('summary', e.target.value)}
                rows={5}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border border-slate-200 text-slate-900 rounded-3xl focus:outline-none focus:border-emerald-500 transition-colors resize-y"
                placeholder="Tulis ringkasan profesional yang kuat..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5 sm:space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 text-blue-600 rounded-2xl mb-3 sm:mb-4">
                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{t('step2')}</h2>
              <p className="text-slate-500 mt-1 sm:mt-2 text-xs sm:text-sm">Tambahkan riwayat pendidikan Anda</p>
            </div>

            {cvData.education.map((edu, index) => (
              <div key={edu.id} className="border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative text-left">
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="text-sm font-medium text-slate-400 mb-4">Pendidikan #{index + 1}</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] sm:text-xs text-slate-500 mb-1.5 sm:mb-2">Nama Institusi</label>
                    <input
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base border border-slate-200 text-slate-900 rounded-2xl"
                      placeholder="Universitas Indonesia"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs text-slate-500 mb-1.5 sm:mb-2">Gelar / Jurusan</label>
                    <input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base border border-slate-200 text-slate-900 rounded-2xl"
                      placeholder="Sarjana Manajemen"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs text-slate-500 mb-1.5 sm:mb-2">Periode</label>
                      <input
                        value={edu.period}
                        onChange={(e) => updateEducation(edu.id, 'period', e.target.value)}
                        className="w-full px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base border border-slate-200 text-slate-900 rounded-2xl"
                        placeholder="2018 - 2022"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs text-slate-500 mb-1.5 sm:mb-2">IPK / Nilai</label>
                      <input
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                        className="w-full px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base border border-slate-200 text-slate-900 rounded-2xl"
                        placeholder="3.85"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addEducation}
              className="w-full py-3 sm:py-4 border-2 border-dashed border-slate-300 hover:border-emerald-300 rounded-3xl text-slate-500 hover:text-emerald-600 flex items-center justify-center gap-3 transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5" /> {t('add')} Pendidikan
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5 sm:space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 text-amber-600 rounded-2xl mb-3 sm:mb-4">
                <Briefcase className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{t('step3')}</h2>
              <p className="text-slate-500 mt-1 sm:mt-2 text-xs sm:text-sm">Tambahkan pengalaman kerja atau magang</p>
            </div>

            {cvData.experience.map((exp, index) => (
              <div key={exp.id} className="border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative text-left">
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="text-sm font-medium text-slate-400 mb-4">Pengalaman #{index + 1}</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] sm:text-xs text-slate-500 mb-1.5 sm:mb-2">Jabatan</label>
                    <input
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base border border-slate-200 text-slate-900 rounded-2xl"
                      placeholder="Manajer Produk"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs text-slate-500 mb-1.5 sm:mb-2">Perusahaan</label>
                    <input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base border border-slate-200 text-slate-900 rounded-2xl"
                      placeholder="PT. Teknologi Indonesia"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs text-slate-500 mb-1.5 sm:mb-2">Lokasi</label>
                    <input
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base border border-slate-200 text-slate-900 rounded-2xl"
                      placeholder="Jakarta"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs text-slate-500 mb-1.5 sm:mb-2">Periode</label>
                    <input
                      value={exp.period}
                      onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base border border-slate-200 text-slate-900 rounded-2xl"
                      placeholder="2022 - Sekarang"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <label className="block text-xs text-slate-500">Deskripsi Pekerjaan</label>
                    <button
                      onClick={() => optimizeWithAI('description', exp.id)}
                      disabled={isOptimizing === `desc-${exp.id}`}
                      className={`text-xs flex items-center gap-1 px-4 py-2 rounded-2xl transition-all border border-emerald-200/40 cursor-pointer ${
                        isOptimizing === `desc-${exp.id}`
                          ? 'bg-violet-100 text-violet-600 cursor-wait'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {isOptimizing === `desc-${exp.id}` ? (
                        <>
                          <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Mengoptimasi...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" /> {t('optimizeAI')}
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    rows={5}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border border-slate-200 text-slate-900 rounded-3xl focus:outline-none focus:border-emerald-500 resize-y"
                    placeholder="Deskripsikan tanggung jawab dan pencapaian Anda..."
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addExperience}
              className="w-full py-3 sm:py-4 border-2 border-dashed border-slate-300 hover:border-amber-300 rounded-3xl text-slate-500 hover:text-amber-600 flex items-center justify-center gap-3 transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5" /> {t('add')} Pengalaman
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 sm:space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-800">{t('step4')}</h2>
              </div>

              <div className="space-y-5 sm:space-y-8 text-left">
                {/* Hard Skills */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-medium text-slate-700">Keterampilan Teknis (Hard Skills)</label>
                    <button 
                      onClick={() => optimizeWithAI('skills')} 
                      disabled={isOptimizing === 'skills'}
                      className={`text-xs px-5 py-2 rounded-2xl flex items-center gap-2 transition-all border border-purple-200/40 cursor-pointer ${
                        isOptimizing === 'skills'
                          ? 'bg-violet-100 text-violet-600 cursor-wait'
                          : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                      }`}
                    >
                      {isOptimizing === 'skills' ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Mengoptimasi...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" /> {t('optimizeAI')}
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <input
                      id="hardSkill"
                      type="text"
                      placeholder="Contoh: Figma, SQL..."
                      className="flex-1 px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border border-slate-200 rounded-3xl text-slate-900 focus:outline-none focus:border-purple-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.currentTarget;
                          addSkill('hard', input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('hardSkill') as HTMLInputElement;
                        if (input && input.value) {
                          addSkill('hard', input.value);
                          input.value = '';
                        }
                      }}
                      className="px-8 bg-slate-900 text-white rounded-3xl font-medium cursor-pointer"
                    >
                      {t('add')}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {cvData.hardSkills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-100 text-slate-700 text-sm px-5 py-2 rounded-3xl">
                        {skill}
                        <button onClick={() => removeSkill('hard', skill)} className="text-slate-400 hover:text-red-500 cursor-pointer">×</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Soft Skills */}
                <div>
                  <label className="font-medium text-slate-700 block mb-3">Keterampilan Lunak (Soft Skills)</label>
                  <div className="flex gap-3">
                    <input
                      id="softSkill"
                      type="text"
                      placeholder="Contoh: Kepemimpinan..."
                      className="flex-1 px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border border-slate-200 rounded-3xl text-slate-900 focus:outline-none focus:border-purple-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.currentTarget;
                          addSkill('soft', input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('softSkill') as HTMLInputElement;
                        if (input && input.value) {
                          addSkill('soft', input.value);
                          input.value = '';
                        }
                      }}
                      className="px-8 bg-slate-900 text-white rounded-3xl font-medium cursor-pointer"
                    >
                      {t('add')}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {cvData.softSkills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-100 text-slate-700 text-sm px-5 py-2 rounded-3xl">
                        {skill}
                        <button onClick={() => removeSkill('soft', skill)} className="text-slate-400 hover:text-red-500 cursor-pointer">×</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-medium text-slate-700 block mb-3">Bahasa yang Dikuasai</label>
                    <textarea
                      value={cvData.languages}
                      onChange={(e) => setCvData(p => ({ ...p, languages: e.target.value }))}
                      className="w-full h-28 px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border border-slate-200 rounded-3xl text-slate-900"
                      placeholder="Bahasa Indonesia (Native), English (Advanced)"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-slate-700 block mb-3">Sertifikasi & Penghargaan</label>
                    <textarea
                      value={cvData.certifications}
                      onChange={(e) => setCvData(p => ({ ...p, certifications: e.target.value }))}
                      className="w-full h-28 px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border border-slate-200 rounded-3xl text-slate-900"
                      placeholder="• Google Data Analytics\n• Certified Product Manager"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Final Actions */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-slate-900">
              <h3 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6">Siap untuk Generate CV?</h3>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  onClick={generatePreview}
                  disabled={isGenerating}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white h-14 sm:h-16 rounded-2xl sm:rounded-3xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-3 transition-all active:scale-[0.985] cursor-pointer"
                >
                  {isGenerating ? 'Memproses...' : <span className="sm:hidden">Generate CV</span>}
                  {!isGenerating && <span className="hidden sm:inline">{t('generatePreview')}</span>}
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button 
                  onClick={() => setShowCoverModal(true)}
                  className="flex-1 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 h-14 sm:h-16 rounded-2xl sm:rounded-3xl font-medium text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-3 cursor-pointer"
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="sm:hidden">Surat Lamaran</span><span className="hidden sm:inline">{t('coverLetter')}</span>
                </button>
              </div>

              <div 
                onClick={() => setShowPremiumModal(true)}
                className="mt-5 sm:mt-8 bg-gradient-to-r from-amber-400 to-orange-500 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl cursor-pointer hover:brightness-110 transition-all flex items-center justify-between group"
              >
                <div className="text-left">
                  <div className="uppercase text-amber-100 text-[10px] sm:text-xs tracking-widest font-medium">PREMIUM</div>
                  <div className="text-base sm:text-2xl font-bold mt-1 group-active:scale-95 transition-transform">{t('premium')}</div>
                </div>
                <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 opacity-80 group-active:rotate-12 transition-transform" />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ========================================================
  // 🌟 PREVIEW AREA DENGAN JUDUL YANG MENYESUAIKAN BAHASA (DYNAMICAL FEEDS)
  // ========================================================
  const PreviewContent = ({ 
    template, 
    isExportMode = false,
    customRef,
  }: { 
    template: TemplateType; 
    isExportMode?: boolean;
    customRef?: React.MutableRefObject<HTMLDivElement | null>;
  }) => {
    const style = template === 'modern' 
      ? { accent: 'emerald', border: 'border-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' }
      : template === 'graduate' 
        ? { accent: 'violet', border: 'border-violet-500', text: 'text-violet-700', bg: 'bg-violet-50' }
        : { accent: 'slate', border: 'border-slate-800', text: 'text-slate-900', bg: 'bg-slate-50' };

    const containerClasses = isExportMode 
      ? "w-[210mm] min-h-[297mm] p-[15mm] mx-auto bg-white shadow-none text-slate-800 leading-snug text-left"
      : "w-full md:w-[210mm] md:min-h-[297mm] mx-auto bg-white shadow-2xl px-5 py-8 md:p-12 text-slate-800 leading-snug transition-all duration-300 overflow-hidden text-left";

    return (
      <div ref={customRef || exportPreviewRef} className={containerClasses}>
        {/* HEADER SECTION */}
        <div className={`text-center pb-6 md:pb-8 border-b-4 ${style.border}`}>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight break-words uppercase text-slate-900">
            {cvData.personal.fullName || 'Nama Lengkap Anda'}
          </h1>
          <div className="mt-4 flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-[11px] md:text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-1">{cvData.personal.location}</span>
            <span className="hidden md:inline opacity-30">•</span>
            <span className="flex items-center gap-1">{cvData.personal.phone}</span>
            <span className="hidden md:inline opacity-30">•</span>
            <span className="flex items-center gap-1 break-all px-2 md:px-0">{cvData.personal.email}</span>
            {cvData.personal.linkedin && (
              <>
                <span className="hidden md:inline opacity-30">•</span>
                <span className="flex items-center gap-1 text-blue-600 break-all">{cvData.personal.linkedin}</span>
              </>
            )}
          </div>
        </div>

        {/* SUMMARY SECTION */}
        {cvData.personal.summary && (
          <div className="my-6 md:my-8">
            <div className={`uppercase text-[10px] md:text-xs tracking-widest font-bold ${style.text} mb-3 opacity-70`}>{t('cvSummary')}</div>
            <p className="text-xs md:text-sm leading-relaxed text-slate-700 text-justify md:text-left">
              {cvData.personal.summary}
            </p>
          </div>
        )}

        {/* EDUCATION SECTION (If Graduate Template, Show First) */}
        {template === 'graduate' && cvData.education.length > 0 && (
          <div className="mb-8 md:mb-10">
            <div className={`uppercase text-[10px] md:text-xs tracking-widest font-bold ${style.text} mb-4 flex items-center gap-2 border-b border-slate-100 pb-2`}>
              <GraduationCap className="w-4 h-4" /> {t('cvEducation').toUpperCase()}
            </div>
            {cvData.education.map(edu => (
              <div key={edu.id} className="mb-5 last:mb-0">
                <div className="flex flex-col md:flex-row md:justify-between items-start">
                  <div className="flex-1 w-full">
                    <div className="font-bold text-sm md:text-base text-slate-900 break-words">{edu.degree}</div>
                    <div className="text-xs md:text-sm text-slate-600 font-medium">{edu.institution}</div>
                  </div>
                  <div className="md:text-right mt-1 md:mt-0 text-[10px] md:text-xs w-full md:w-auto flex md:flex-col justify-between md:justify-start">
                    <span className="text-slate-500 font-bold">{edu.period}</span>
                    {edu.gpa && <span className={`${style.text} font-bold`}>{t('cvGpa')} {edu.gpa}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EXPERIENCE SECTION */}
        {cvData.experience.length > 0 && (
          <div className="mb-8 md:mb-10">
            <div className={`uppercase text-[10px] md:text-xs tracking-widest font-bold ${style.text} mb-4 flex items-center gap-2 border-b border-slate-100 pb-2`}>
              <Briefcase className="w-4 h-4" /> 
              {template === 'graduate' ? t('cvInternship').toUpperCase() : t('cvExperience').toUpperCase()}
            </div>
            {cvData.experience.map((exp) => (
              <div key={exp.id} className="mb-6 last:mb-0">
                <div className="flex flex-col md:flex-row md:justify-between items-start gap-1">
                  <div className="flex-1 w-full">
                    <div className="font-bold text-sm md:text-base text-slate-900 break-words">{exp.title}</div>
                    <div className={`text-xs md:text-sm font-bold ${style.text}`}>{exp.company}</div>
                  </div>
                  <div className="text-[10px] md:text-xs text-slate-400 font-bold md:text-right w-full md:w-auto flex justify-between md:block">
                    <span>{exp.period}</span>
                    <span className="md:block md:mt-1">{exp.location}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs md:text-[13px] leading-relaxed whitespace-pre-line text-slate-600 pl-1 border-l-2 border-slate-100">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EDUCATION SECTION (Default placement) */}
        {template !== 'graduate' && cvData.education.length > 0 && (
          <div className="mb-8 md:mb-10">
            <div className={`uppercase text-[10px] md:text-xs tracking-widest font-bold ${style.text} mb-4 border-b border-slate-100 pb-2`}>{t('cvEducation').toUpperCase()}</div>
            {cvData.education.map(edu => (
              <div key={edu.id} className="mb-4 flex flex-col md:flex-row md:justify-between items-start">
                <div className="w-full">
                  <div className="font-bold text-sm md:text-base text-slate-900 break-words">{edu.degree}</div>
                  <div className="text-xs md:text-sm text-slate-600 font-medium">{edu.institution}</div>
                </div>
                <div className="text-[10px] md:text-xs text-slate-400 font-bold md:text-right w-full md:w-auto mt-1 md:mt-0">
                  {edu.period} {edu.gpa && `• ${t('cvGpa')}: ${edu.gpa}`}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SKILLS & OTHERS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {(cvData.hardSkills.length > 0 || cvData.softSkills.length > 0) && (
            <div>
              <div className={`uppercase text-[10px] md:text-xs tracking-widest font-bold ${style.text} mb-4 border-b border-slate-100 pb-2`}>{t('cvSkills').toUpperCase()}</div>
              <div className="flex flex-wrap gap-2 md:block md:space-y-1.5">
                {cvData.hardSkills.map((s, i) => (
                  <div key={i} className="text-xs md:text-sm bg-slate-50 px-2 py-1 rounded md:bg-transparent md:p-0 text-slate-700">
                    <span className="hidden md:inline mr-2 text-slate-300">•</span>{s}
                  </div>
                ))}
                {cvData.softSkills.map((s, i) => (
                  <div key={i} className="text-xs md:text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded md:bg-transparent md:p-0 italic">
                    <span className="hidden md:inline mr-2 text-slate-300">•</span>{s}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {(cvData.languages || cvData.certifications) && (
            <div>
              <div className={`uppercase text-[10px] md:text-xs tracking-widest font-bold ${style.text} mb-4 border-b border-slate-100 pb-2`}>{t('cvOthers').toUpperCase()}</div>
              {cvData.languages && (
                <div className="mb-4">
                  <span className="text-xs md:text-sm font-bold text-slate-800">{t('cvLanguage')}</span>
                  <p className="text-xs md:text-sm text-slate-600 mt-1">{cvData.languages}</p>
                </div>
              )}
              {cvData.certifications && (
                <div>
                  <span className="text-xs md:text-sm font-bold text-slate-800">{t('cvCertification')}</span>
                  <div className="text-xs md:text-sm text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                    {cvData.certifications}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-zinc-950 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-3 sm:py-5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-sm sm:text-base flex-shrink-0 tracking-tighter shadow-lg shadow-emerald-500/20">HC</div>
            <div className="font-bold text-sm sm:text-lg md:text-2xl tracking-tight truncate">{t('title')}</div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm flex-shrink-0">
            {/* 🌟 LANG SWITCH BUTTON DUA MODE */}
            <div className="flex items-center bg-zinc-900 rounded-2xl sm:rounded-3xl p-0.5 sm:p-1 border border-white/10">
              <button 
                onClick={() => setLanguage('id')} 
                className={`px-2.5 sm:px-5 py-1 sm:py-2 rounded-xl sm:rounded-3xl text-[10px] sm:text-sm font-bold transition-all cursor-pointer ${language === 'id' ? 'bg-white text-black scale-105 shadow-md' : 'text-zinc-400 hover:text-zinc-200'}`}
              >ID</button>
              <button 
                onClick={() => setLanguage('en')} 
                className={`px-2.5 sm:px-5 py-1 sm:py-2 rounded-xl sm:rounded-3xl text-[10px] sm:text-sm font-bold transition-all cursor-pointer ${language === 'en' ? 'bg-white text-black scale-105 shadow-md' : 'text-zinc-400 hover:text-zinc-200'}`}
              >EN</button>
            </div>
            <div className="hidden sm:block text-xs px-4 py-2 bg-white/5 rounded-3xl border border-white/10 whitespace-nowrap">100% Gratis • ATS Ready</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-5xl mx-auto px-3 sm:px-6 pb-3 sm:pb-4">
          <div className="flex justify-between text-[10px] sm:text-xs text-white/60 mb-2 gap-1">
            {Array.from({ length: 4 }, (_, i) => (
              <div 
                key={i}
                onClick={() => goToStep((i + 1) as Step)}
                className={`cursor-pointer transition-colors flex items-center gap-1 sm:gap-2 flex-1 ${currentStep === i + 1 ? 'text-white' : ''}`}
              >
                <div className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full border text-xs sm:text-sm font-bold flex-shrink-0 ${currentStep === i + 1 ? 'border-emerald-400 text-emerald-400 bg-emerald-400/10' : 'border-white/20'}`}>
                  {i + 1}
                </div>
                <span className="hidden md:inline text-xs truncate">
                  {i === 0 && t('step1')}
                  {i === 1 && t('step2')}
                  {i === 2 && t('step3')}
                  {i === 3 && t('step4')}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500 ease-out" 
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-3 sm:px-6 pt-6 sm:pt-12">
        <div className="max-w-2xl mx-auto">
          {renderStep()}

          {/* Navigation Footer */}
          <div className="mt-10 sm:mt-16 flex items-center gap-3 border-t border-white/10 pt-6 sm:pt-8 sticky bottom-0 bg-zinc-950/95 backdrop-blur-sm">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-3 sm:py-4 border border-white/20 rounded-2xl sm:rounded-3xl flex-shrink-0 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">{t('previous')}</span><span className="sm:hidden">Kembali</span>
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="ml-auto flex items-center justify-center gap-2 bg-white text-black px-6 sm:px-10 py-3 sm:py-4 rounded-2xl sm:rounded-3xl font-bold active:scale-95 transition-all text-xs sm:text-base cursor-pointer"
              >
                <span className="sm:hidden">Lanjut</span><span className="hidden sm:inline">{t('next')}</span> <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            ) : (
              <button
                onClick={generatePreview}
                className="ml-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 px-6 sm:px-10 py-3 sm:py-4 rounded-2xl sm:rounded-3xl font-bold active:scale-95 transition-all text-xs sm:text-base text-white cursor-pointer"
              >
                <span className="sm:hidden">Generate CV</span><span className="hidden sm:inline">{t('generatePreview')}</span> <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center sm:p-4">
          <div className="bg-white sm:rounded-3xl w-full max-w-5xl h-full sm:max-h-[95vh] overflow-hidden flex flex-col">
            <div className="px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base border-b flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex-1 min-w-0 text-left">
                <div className="font-bold text-sm md:text-xl text-slate-900 truncate">Preview CV</div>
                <div className="text-[10px] md:text-xs text-slate-500 truncate">Template: {TEMPLATES.find(t => t.id === selectedTemplate)?.name || selectedTemplate.toUpperCase()}</div>
              </div>
              
              <div className="flex items-center gap-2 md:gap-4 ml-4">
                <button
                  onClick={() => setSelectedTemplate(prev => 
                    prev === 'classic' ? 'modern' : prev === 'modern' ? 'graduate' : 'classic'
                  )}
                  className="whitespace-nowrap text-[10px] md:text-xs border border-slate-300 px-3 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl hover:bg-slate-50 transition-colors font-bold text-slate-700 cursor-pointer"
                >
                  <span className="md:hidden">Ganti</span>
                  <span className="hidden md:inline">Ganti Template</span>
                </button>
                <button 
                  onClick={() => setShowPreviewModal(false)} 
                  className="p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>

            <div className="overflow-auto bg-slate-100 flex-1 p-0 md:p-10 scrollbar-hide">
              <div className="min-h-full flex items-start justify-center p-3 md:p-0">
                <PreviewContent template={selectedTemplate} />
              </div>
            </div>

            <div className="fixed left-[-99999px] top-0 pointer-events-none opacity-0" aria-hidden="true">
              <PreviewContent template={selectedTemplate} isExportMode={true} customRef={exportHiddenRef} />
            </div>

            <div className="p-6 border-t bg-white">
              {downloadStatus.message && (
                <div className={`mb-4 px-5 py-3 rounded-2xl text-center text-sm font-medium animate-pulse ${
                  downloadStatus.message.includes('Gagal') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {downloadStatus.message}
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={downloadPDF}
                  disabled={isGenerating}
                  className="flex-1 flex items-center justify-center gap-3 bg-slate-900 disabled:bg-slate-400 text-white h-14 rounded-2xl font-medium hover:bg-black transition-all active:scale-[0.985] cursor-pointer"
                >
                  {isGenerating && downloadStatus.type === 'pdf' ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Memproses PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> {t('downloadPDF')}
                    </>
                  )}
                </button>
                <button 
                  onClick={downloadDOCX}
                  disabled={isGenerating}
                  className="flex-1 flex items-center justify-center gap-3 border border-slate-300 disabled:border-slate-200 disabled:text-slate-400 h-14 rounded-2xl font-medium hover:bg-slate-50 transition-all active:scale-[0.985] cursor-pointer"
                >
                  {downloadStatus.type === 'docx' && isGenerating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Memproses Word...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> {t('downloadDOCX')}
                    </>
                  )}
                </button>
              </div>
              <div className="mt-3 text-[10px] text-center text-slate-400">
                Jika PDF belum terunduh, scroll ke atas halaman CV terlebih dahulu lalu klik ulang.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COVER LETTER MODAL */}
      {showCoverModal && generatedCoverLetter && (
        <div className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col">
            <div className="p-8 border-b flex justify-between items-center text-slate-900">
              <h3 className="font-semibold text-2xl">Surat Lamaran</h3>
              <button onClick={() => setShowCoverModal(false)} className="text-slate-400 cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-10 overflow-auto flex-1 text-slate-700 leading-relaxed whitespace-pre-line text-[15px] text-left">
              {generatedCoverLetter}
            </div>

            <div className="p-6 border-t flex gap-4 text-slate-900">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generatedCoverLetter);
                  alert('Tersalin ke clipboard!');
                }}
                className="flex-1 py-4 border border-slate-300 bg-white rounded-2xl text-sm font-medium cursor-pointer"
              >
                📋 Salin ke Clipboard
              </button>
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(generatedCoverLetter)}`;
                  link.download = `Surat_Lamaran_${coverCompany || 'Perusahaan'}.txt`;
                  link.click();
                }}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-medium cursor-pointer"
              >
                Unduh sebagai TXT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREMIUM MODAL */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/80 z-[120] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full max-w-md text-slate-900">
            <div className="p-8 text-left">
              <h3 className="text-3xl font-semibold tracking-tight">Layanan Premium</h3>
              <p className="text-slate-600 mt-3">Dapatkan review profesional dan redesign CV oleh ahli karir. Hanya Rp35.000.</p>
            </div>

            <form onSubmit={handlePremiumSubmit} className="px-8 pb-8 space-y-4">
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={premiumForm.name}
                onChange={(e) => setPremiumForm({ ...premiumForm, name: e.target.value })}
                className="w-full border border-slate-200 rounded-2xl px-5 py-3.5"
                required
              />
              <input
                type="tel"
                placeholder="Nomor WhatsApp"
                value={premiumForm.whatsapp}
                onChange={(e) => setPremiumForm({ ...premiumForm, whatsapp: e.target.value })}
                className="w-full border border-slate-200 rounded-2xl px-5 py-3.5"
                required
              />
              <input
                type="email"
                placeholder="Alamat Email"
                value={premiumForm.email}
                onChange={(e) => setPremiumForm({ ...premiumForm, email: e.target.value })}
                className="w-full border border-slate-200 rounded-2xl px-5 py-3.5"
                required
              />

              <div className="pt-2 text-left">
                <label className="text-xs uppercase tracking-widest text-slate-500 block mb-3 font-bold">Pilih Desain</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPremiumForm(p => ({...p, designChoice: 'ats'}))}
                    className={`h-16 rounded-2xl border-2 transition-all font-bold cursor-pointer ${premiumForm.designChoice === 'ats' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500'}`}
                  >
                    ATS Friendly
                  </button>
                  <button
                    type="button"
                    onClick={() => setPremiumForm(p => ({...p, designChoice: 'creative'}))}
                    className={`h-16 rounded-2xl border-2 transition-all font-bold cursor-pointer ${premiumForm.designChoice === 'creative' ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-500'}`}
                  >
                    Kreatif
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-rose-500 h-14 text-white font-semibold rounded-3xl flex items-center justify-center gap-3 active:scale-[0.985] transition-transform cursor-pointer"
              >
                KIRIM KE WHATSAPP <MessageCircle className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HIDDEN GLOBAL CONTAINER */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none" aria-hidden="true">
        <PreviewContent template={selectedTemplate} isExportMode={true} />
      </div>
    </div>
  );
}
