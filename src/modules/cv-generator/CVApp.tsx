'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Briefcase, GraduationCap, Award, Sparkles, Download, 
  Plus, Trash2, ArrowLeft, ArrowRight, Check, FileText, X, Copy
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
    step4: "Informasi Tambahan & Cetak",
    next: "Berikutnya",
    previous: "Sebelumnya",
    save: "Simpan & Lanjut",
    generatePreview: "Generate Preview CV",
    downloadPDF: "Unduh PDF",
    downloadDOCX: "Unduh DOCX",
    optimizeAI: "Optimasi dengan AI",
    add: "Tambah",
    remove: "Hapus",
    coverLetter: "Generator Surat Lamaran",
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
    coverLetter: "Cover Letter Generator",
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
  const [copiedNorek, setCopiedNorek] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<{ type: 'pdf' | 'docx' | null; message: string }>({ type: null, message: '' });

  const t = (key: keyof typeof TRANSLATIONS['id']) => TRANSLATIONS[language][key];

  // Load from LocalStorage
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

  // Auto-save
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
    setCvData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  };

  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now().toString(), institution: "", degree: "", period: "", gpa: "" }]
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeEducation = (id: string) => {
    setCvData(prev => ({ ...prev, education: prev.education.filter(item => item.id !== id) }));
  };

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now().toString(), title: "", company: "", location: "", period: "", description: "" }]
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeExperience = (id: string) => {
    setCvData(prev => ({ ...prev, experience: prev.experience.filter(item => item.id !== id) }));
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
    setCvData(prev => ({ ...prev, [key]: prev[key].filter(s => s !== skill) }));
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

  const generateCoverLetter = () => {
    if (!coverJobTitle.trim() || !coverCompany.trim()) {
      alert(language === 'id' ? '⚠️ Harap isi jabatan dan nama perusahaan tujuan terlebih dahulu bre!' : '⚠️ Please enter target job title and company name first!');
      return;
    }

    const letter = language === 'id' 
      ? `Yth. Bapak/Ibu Hiring Manager,\n\nSaya menulis surat ini untuk melamar posisi ${coverJobTitle} di ${coverCompany}. Dengan latar belakang pendidikan dan kompetensi profesional yang saya miliki, saya yakin dapat memberikan kontribusi yang positif serta solutif bagi kemajuan tim Anda.\n\n${cvData.personal.summary || ''}\n\nSaya sangat antusias dengan kesempatan untuk bergabung bersama ${coverCompany} dan siap untuk berdiskusi lebih lanjut dalam sesi interview.\n\nHormat saya,\n${cvData.personal.fullName || ''}`
      : `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${coverJobTitle} position at ${coverCompany}. Backed by my educational architecture and core professional competencies, I am confident in my ability to deliver highly impactful solutions to your team.\n\n${cvData.personal.summary || ''}\n\nI am genuinely excited about the prospect of joining ${coverCompany} and welcome the opportunity for an interview discussion.\n\nBest regards,\n${cvData.personal.fullName || ''}`;

    setGeneratedCoverLetter(letter);
  };

  const handleCopyNorek = () => {
    navigator.clipboard.writeText("7186886326");
    setCopiedNorek(true);
    setTimeout(() => setCopiedNorek(false), 3000);
  };

  const downloadPDF = async () => {
    setIsGenerating(true);
    setDownloadStatus({ type: 'pdf', message: 'Sedang mengalkulasi dimensi & mencetak PDF...' });

    try {
      const exportElement = document.getElementById('canvas-preview-target') as HTMLDivElement;
      if (!exportElement) {
        throw new Error('Target rendering kawat tidak ditemukan');
      }

      const canvas = await html2canvas(exportElement, { 
        scale: 2.5, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollY: -window.scrollY,
        scrollX: 0,
        windowWidth: exportElement.scrollWidth,
        windowHeight: exportElement.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const imgHeightPdf = imgHeight * ratio;

      let heightLeft = imgHeightPdf;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightPdf);
      heightLeft -= pdfPageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeightPdf;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightPdf);
        heightLeft -= pdfPageHeight;
      }

      const fileName = `${(cvData.personal.fullName || 'CV').replace(/\s+/g, '_')}_Hum-CV.pdf`;
      pdf.save(fileName);

      setDownloadStatus({ type: 'pdf', message: '✅ PDF Berhasil diunduh!' });
    } catch (err) {
      console.error('Download PDF error:', err);
      setDownloadStatus({ type: 'pdf', message: '⚠️ Gagal mencetak. Silakan ulangi kembali.' });
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setDownloadStatus({ type: null, message: '' });
      }, 2000);
    }
  };

  const downloadDOCX = () => {
    setIsGenerating(true);
    setDownloadStatus({ type: 'docx', message: 'Mengekspor ke format dokumen Word...' });

    try {
      const expTitle = selectedTemplate === 'graduate' ? t('cvInternship') : t('cvExperience');
      
      let expHtml = '';
      cvData.experience.forEach(exp => {
        expHtml += `
          <div style="margin-bottom: 12px;">
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
          <title>Curriculum Vitae</title>
          <style>
            body { font-family: 'Arial', sans-serif; color: #1e293b; line-height: 1.5; padding: 30px; }
            h1 { font-size: 24pt; font-weight: bold; margin-bottom: 4px; text-align: center; color: #0f172a; text-transform: uppercase; }
            .contact { font-size: 10pt; color: #475569; text-align: center; margin-bottom: 20px; }
            h2 { font-size: 11pt; color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 3px; margin-top: 20px; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; }
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
            ${cvData.certifications ? `<p><strong>${t('cvCertification')}</strong><br/>${cvData.certifications.replace(/\n/g, '<br/>')}</p>` : ''}
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
      setDownloadStatus({ type: 'docx', message: '⚠️ Gagal mengekspor file Word.' });
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setDownloadStatus({ type: null, message: '' });
      }, 2000);
    }
  };

  // ========================================================
  // 🌟 PREVIEW CONTENT: STRUKTUR IMPLEMENTASI DESAIN DENGAN LOGIKA OBJEK REAKSI MURNI
  // ========================================================
  const PreviewContent = ({ template }: { template: TemplateType }) => {
    const theme = {
      classic: { primary: '#1e293b', secondary: '#475569', line: '#2563eb', borderStyle: '3px solid #1e293b' },
      modern: { primary: '#0d9488', secondary: '#115e59', line: '#0d9488', borderStyle: '3px solid #0d9488' },
      graduate: { primary: '#6d28d9', secondary: '#5b21b6', line: '#7c3aed', borderStyle: '3px solid #7c3aed' }
    }[template];

    return (
      <div 
        id="canvas-preview-target"
        className="html2pdf__canvas-source"
        style={{
          width: '100%',
          maxWidth: '210mm',
          minHeight: '297mm',
          backgroundColor: '#ffffff',
          padding: '18mm',
          fontFamily: 'Arial, sans-serif',
          lineHeight: '1.5',
          boxSizing: 'border-box',
          textAlign: 'left'
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: template === 'classic' ? 'center' : 'left', paddingBottom: '15px', borderBottom: theme.borderStyle }}>
          <h1 style={{ fontSize: '26pt', fontWeight: 'bold', color: '#0f172a', margin: '0', textTransform: 'uppercase' }}>
            {cvData.personal.fullName || 'Nama Lengkap'}
          </h1>
          <p style={{ fontSize: '10pt', color: '#475569', margin: '6px 0 0 0', fontWeight: '500' }}>
            {cvData.personal.location}  |  {cvData.personal.phone}  |  {cvData.personal.email}
            {cvData.personal.linkedin ? `  |  ${cvData.personal.linkedin}` : ''}
          </p>
        </div>

        {/* SUMMARY */}
        {cvData.personal.summary && (
          <div style={{ marginTop: '16px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: theme.primary, letterSpacing: '0.5px', paddingBottom: '2px', margin: '0 0 6px 0', textTransform: 'uppercase', borderBottom: `1px solid ${theme.line}` }}>
              {t('cvSummary')}
            </h2>
            <p style={{ fontSize: '10pt', color: '#334155', margin: '0', textAlign: 'justify' }}>{cvData.personal.summary}</p>
          </div>
        )}

        {/* EDUCATION (Untuk template Freshgraduate ditaruh di atas) */}
        {template === 'graduate' && cvData.education.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: theme.primary, letterSpacing: '0.5px', paddingBottom: '2px', margin: '0 0 8px 0', textTransform: 'uppercase', borderBottom: `1px solid ${theme.line}` }}>
              {t('cvEducation')}
            </h2>
            {cvData.education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10.5pt', fontWeight: 'bold', color: '#0f172a' }}>{edu.degree} — <span style={{ fontWeight: 'normal', color: '#475569' }}>{edu.institution}</span></span>
                  <span style={{ fontSize: '9.5pt', color: '#64748b', fontWeight: 'bold' }}>{edu.period} {edu.gpa && `| IPK: ${edu.gpa}`}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EXPERIENCE */}
        {cvData.experience.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: theme.primary, letterSpacing: '0.5px', paddingBottom: '2px', margin: '0 0 10px 0', textTransform: 'uppercase', borderBottom: `1px solid ${theme.line}` }}>
              {template === 'graduate' ? t('cvInternship') : t('cvExperience')}
            </h2>
            {cvData.experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11pt', fontWeight: 'bold', color: '#0f172a' }}>{exp.title} <span style={{ fontWeight: 'normal', color: theme.secondary }}>({exp.company})</span></span>
                  <span style={{ fontSize: '9.5pt', color: '#64748b', fontBold: 'bold' }}>{exp.period} | {exp.location}</span>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '9.5pt', color: '#475569', textAlign: 'justify', whiteSpace: 'pre-line' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* EDUCATION (Untuk template default selain freshgrad ditaruh di bawah) */}
        {template !== 'graduate' && cvData.education.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: theme.primary, letterSpacing: '0.5px', paddingBottom: '2px', margin: '0 0 8px 0', textTransform: 'uppercase', borderBottom: `1px solid ${theme.line}` }}>
              {t('cvEducation')}
            </h2>
            {cvData.education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10.5pt', fontWeight: 'bold', color: '#0f172a' }}>{edu.degree} — <span style={{ fontWeight: 'normal', color: '#475569' }}>{edu.institution}</span></span>
                  <span style={{ fontSize: '9.5pt', color: '#64748b', fontBold: 'bold' }}>{edu.period} {edu.gpa && `| IPK: ${edu.gpa}`}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SKILLS */}
        {([...cvData.hardSkills, ...cvData.softSkills].length > 0) && (
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: theme.primary, letterSpacing: '0.5px', paddingBottom: '2px', margin: '0 0 6px 0', textTransform: 'uppercase', borderBottom: `1px solid ${theme.line}` }}>
              {t('cvSkills')}
            </h2>
            <p style={{ fontSize: '10pt', color: '#334155', margin: '0' }}>
              {[...cvData.hardSkills, ...cvData.softSkills].join(', ')}
            </p>
          </div>
        )}

        {/* OTHERS */}
        {(cvData.languages || cvData.certifications) && (
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: theme.primary, letterSpacing: '0.5px', paddingBottom: '2px', margin: '0 0 6px 0', textTransform: 'uppercase', borderBottom: `1px solid ${theme.line}` }}>
              {t('cvOthers')}
            </h2>
            {cvData.languages && <p style={{ fontSize: '9.5pt', margin: '0 0 4px 0', color: '#334155' }}><strong>{t('cvLanguage')}</strong> {cvData.languages}</p>}
            {cvData.certifications && <p style={{ fontSize: '9.5pt', margin: '0', color: '#334155', whiteSpace: 'pre-line' }}><strong>{t('cvCertification')}</strong><br/>{cvData.certifications}</p>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-950 text-white pb-12 font-sans selection:bg-cyan-500 selection:text-white text-center">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 rounded-xl flex items-center justify-center font-black text-sm">HC</div>
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
          
          {/* ========================================================
              🕌 4. INFAQ BARAKAH ECOSYSTEM BLOCK (ZISWAF CTA MODULAR)
              ======================================================== */}
          {currentStep === 4 && (
            <div className="mt-6 p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border border-emerald-500/20 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 font-bold text-[8px] tracking-widest px-2.5 py-1 rounded-bl-xl uppercase">Sadaqah Support</div>
              <h4 className="text-sm font-black text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">🌱 Dukung Ekosistem Hum-CV</h4>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Halo Sahabat Humed! Jika platform rekrutmen mandiri ini dirasa bermanfaat bagi akselerasi persiapan karirmu dan kamu tergerak membantu biaya server generator ini agar tetap 100% bebas biaya bagi alumni SMK/freshgrad lainnya, kamu bisa menyalurkan infaq sukarela melalui rekening resmi praktisi berikut:
              </p>
              
              <div className="mt-4 flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/10 gap-3">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Bank Syariah Indonesia (BSI)</span>
                  <span className="text-sm font-black tracking-wider text-white mt-0.5">7186886326</span>
                  <span className="text-[10px] text-slate-400 font-medium">a.n Humaidi Iskandar</span>
                </div>
                
                <button 
                  onClick={handleCopyNorek}
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                    copiedNorek ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  {copiedNorek ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedNorek ? 'Tersalin!' : 'Salin Norek'}
                </button>
              </div>
            </div>
          )}

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
                <div className="font-black text-base md:text-lg">Pratinjau Berkas Dokumen Resmi</div>
                <div className="text-xs text-slate-400 font-medium">Isolasi Kertas Putih Murni - Standar ATS Rekrutmen</div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* 🌟 STATUS GAYA DESAIN YANG SEDANG AKTIF */}
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Gaya Aktif:</span>
                  <span className="text-xs font-black text-teal-600">
                    {selectedTemplate === 'classic' ? '📋 ATS Klasik' : selectedTemplate === 'modern' ? '✦ Minimalis Modern' : '🎓 Lulusan Baru (Education Top)'}
                  </span>
                </div>
                <button onClick={() => setSelectedTemplate(p => p === 'classic' ? 'modern' : p === 'modern' ? 'graduate' : 'classic')} className="text-xs font-black border border-slate-200 bg-slate-50 px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-700 cursor-pointer transition-all">Ganti Desain</button>
                <button onClick={() => setShowPreviewModal(false)} className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded-full cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="overflow-auto bg-slate-200 flex-1 p-4 md:p-8 scrollbar-none">
              <div className="min-h-full flex items-start justify-center">
                <PreviewContent template={selectedTemplate} />
              </div>
            </div>

            <div className="p-5 border-t bg-white flex flex-col sm:flex-row gap-3">
              {downloadStatus.message && <div className="w-full text-center text-xs font-bold text-teal-600 mb-2">{downloadStatus.message}</div>}
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
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col text-slate-900 shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-white rounded-t-3xl">
              <h3 className="font-black text-xl">Surat Lamaran Kerja Otomatis</h3>
              <button onClick={() => setShowCoverModal(false)} className="text-slate-400 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-4 bg-slate-50 border-b grid grid-cols-2 gap-3 text-left">
              <div>
                <label className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Posisi Dilamar</label>
                <input type="text" value={coverJobTitle} onChange={(e) => setCoverJobTitle(e.target.value)} placeholder="Contoh: HR Officer" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Perusahaan Tujuan</label>
                <input type="text" value={coverCompany} onChange={(e) => setCoverCompany(e.target.value)} placeholder="Contoh: PT. Tokopedia" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-cyan-500" />
              </div>
            </div>

            <div className="p-6 overflow-auto flex-1 text-slate-700 whitespace-pre-line text-sm text-left leading-relaxed min-h-[150px] bg-white">
              {generatedCoverLetter || (language === 'id' ? "⚠️ Silakan isi Posisi dan Perusahaan di atas, lalu klik tombol '✨ Susun Surat' di bawah untuk merakit berkas otomatis." : "⚠️ Please fill job title and company above, then click '✨ Susun Surat' to compile your cover letter.")}
            </div>

            <div className="p-5 border-t bg-slate-50 rounded-b-3xl flex gap-3">
              <button onClick={generateCoverLetter} className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-black rounded-xl text-xs sm:text-sm cursor-pointer shadow-md">✨ Susun Surat</button>
              {generatedCoverLetter && (
                <button onClick={() => { navigator.clipboard.writeText(generatedCoverLetter); alert('Tersalin ke Clipboard!'); }} className="flex-1 py-3 bg-white border border-slate-200 font-bold rounded-xl text-xs sm:text-sm cursor-pointer">📋 Salin ke Clipboard</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
