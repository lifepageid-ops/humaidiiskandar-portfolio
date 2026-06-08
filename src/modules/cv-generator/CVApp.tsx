'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, Briefcase, GraduationCap, Award, Sparkles, Download, 
  Plus, Trash2, ArrowLeft, ArrowRight, Check, FileText, X as XIcon, Copy
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

  const t = (key: keyof typeof TRANSLATIONS['id']) => {
    const lang = language === 'id' || language === 'en' ? language : 'id';
    return TRANSLATIONS[lang][key] || "";
  };

  // Safely Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('humcv-wizard-data');
      const savedLang = localStorage.getItem('humcv-language');
      const savedStep = localStorage.getItem('humcv-current-step');
      const savedTemplate = localStorage.getItem('humcv-template');

      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.personal) setCvData(parsed);
      }
      if (savedLang) setLanguage(savedLang as 'id' | 'en');
      if (savedStep) setCurrentStep(parseInt(savedStep) as Step);
      if (savedTemplate) setSelectedTemplate(savedTemplate as TemplateType);
    } catch (e) {
      console.error("Gagal memuat cache lokal, fallback ke data default", e);
    }
  }, []);

  // Auto-save data safely
  useEffect(() => {
    if (cvData && cvData.personal) {
      localStorage.setItem('humcv-wizard-data', JSON.stringify(cvData));
      localStorage.setItem('humcv-current-step', currentStep.toString());
      localStorage.setItem('humcv-language', language);
      localStorage.setItem('humcv-template', selectedTemplate);
    }
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
      education: [...(prev.education || []), { id: Date.now().toString(), institution: "", degree: "", period: "", gpa: "" }]
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setCvData(prev => ({
      ...prev,
      education: (prev.education || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeEducation = (id: string) => {
    setCvData(prev => ({ ...prev, education: (prev.education || []).filter(item => item.id !== id) }));
  };

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), { id: Date.now().toString(), title: "", company: "", location: "", period: "", description: "" }]
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setCvData(prev => ({
      ...prev,
      experience: (prev.experience || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeExperience = (id: string) => {
    setCvData(prev => ({ ...prev, experience: (prev.experience || []).filter(item => item.id !== id) }));
  };

  const addSkill = (type: 'hard' | 'soft', skill: string) => {
    if (!skill.trim()) return;
    setCvData(prev => {
      const key = type === 'hard' ? 'hardSkills' : 'softSkills';
      const arr = prev[key] || [];
      if (arr.includes(skill.trim())) return prev;
      return { ...prev, [key]: [...arr, skill.trim()] };
    });
  };

  const removeSkill = (type: 'hard' | 'soft', skill: string) => {
    const key = type === 'hard' ? 'hardSkills' : 'softSkills';
    setCvData(prev => ({ ...prev, [key]: (prev[key] || []).filter(s => s !== skill) }));
  };

  const optimizeWithAI = async (section: 'summary' | 'description' | 'skills', id?: string) => {
    const optimizationId = section === 'description' && id ? `desc-${id}` : section;
    let text = '';
    let type = section;

    if (section === 'summary') text = cvData.personal?.summary || '';
    else if (section === 'description' && id) {
      const exp = (cvData.experience || []).find(e => e.id === id);
      text = exp?.description || '';
    } else if (section === 'skills') {
      text = [...(cvData.hardSkills || []), ...(cvData.softSkills || [])].join(', ');
    }

    if (!text.trim()) {
      setAiMessage('⚠️ Silakan isi teks terlebih dahulu sebelum dioptimasi.');
      setTimeout(() => setAiMessage(null), 3000);
      return;
    }

    setIsOptimizing(optimizationId);
    setAiMessage(null);

    try {
      const res = await fetch('/api/ai-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type, language })
      });
      const data = await res.json();
      if (data.success) {
        if (section === 'summary') updatePersonal('summary', data.optimized);
        else if (section === 'description' && id) {
          setCvData(prev => ({
            ...prev,
            experience: (prev.experience || []).map(exp => exp.id === id ? { ...exp, description: data.optimized } : exp)
          }));
        } else if (section === 'skills') {
          const newSkills = data.optimized.split(',').map((s: string) => s.trim()).filter(Boolean);
          setCvData(prev => ({
            ...prev,
            hardSkills: [...new Set([...(prev.hardSkills || []), ...newSkills])]
          }));
        }
        setAiMessage('✅ ' + data.message);
      } else {
        throw new Error();
      }
    } catch (err) {
      setAiMessage('⚡ Mode offline aktif (Lokal engine otomatis)');
    } finally {
      setIsOptimizing(null);
      setTimeout(() => setAiMessage(null), 4000);
    }
  };

  const downloadPDF = async () => {
    setIsGenerating(true);
    setDownloadStatus({ type: 'pdf', message: 'Sedang mengalkulasi dimensi & mencetak PDF...' });
    try {
      const exportElement = document.getElementById('canvas-preview-target') as HTMLDivElement;
      if (!exportElement) throw new Error();

      const canvas = await html2canvas(exportElement, { 
        scale: 2.5, 
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollY: -window.scrollY,
        windowWidth: exportElement.scrollWidth,
        windowHeight: exportElement.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      const imgHeightPdf = canvas.height * (pdfWidth / canvas.width);

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
      pdf.save(`${(cvData.personal?.fullName || 'CV').replace(/\s+/g, '_')}_Hum-CV.pdf`);
      setDownloadStatus({ type: 'pdf', message: '✅ PDF Berhasil diunduh!' });
    } catch (err) {
      setDownloadStatus({ type: 'pdf', message: '⚠️ Gagal mencetak. Silakan ulangi kembali.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadDOCX = () => {
    setIsGenerating(true);
    try {
      const expTitle = selectedTemplate === 'graduate' ? t('cvInternship') : t('cvExperience');
      let expHtml = '';
      (cvData.experience || []).forEach(exp => {
        expHtml += `
          <div style="margin-bottom: 12px;">
            <p style="margin:0; font-size:12pt; font-weight:bold; color:#0f172a;">${exp.title || ''} — ${exp.company || ''}</p>
            <p style="margin:2px 0 6px 0; font-size:10pt; color:#64748b;">${exp.period || ''} | ${exp.location || ''}</p>
            <p style="margin:0; font-size:10.5pt; color:#334155; text-align:justify;">${exp.description ? exp.description.replace(/\n/g, '<br/>') : ''}</p>
          </div>
        `;
      });

      let eduHtml = '';
      (cvData.education || []).forEach(edu => {
        eduHtml += `
          <div style="margin-bottom: 10px;">
            <p style="margin:0; font-size:11.5pt; font-weight:bold; color:#0f172a;">${edu.degree || ''}</p>
            <p style="margin:2px 0 0 0; font-size:10pt; color:#475569;">${edu.institution || ''} (${edu.period || ''}) ${edu.gpa ? ` — IPK: ${edu.gpa}` : ''}</p>
          </div>
        `;
      });

      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <body>
          <h1>${cvData.personal?.fullName || ''}</h1>
          <p>${cvData.personal?.location || ''} | ${cvData.personal?.phone || ''} | ${cvData.personal?.email || ''}</p>
          <h2>${t('cvSummary')}</h2><p>${cvData.personal?.summary || ''}</p>
          <h2>${expTitle}</h2>${expHtml}
          <h2>${t('cvEducation')}</h2>${eduHtml}
        </body>
        </html>
      `;
      const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(cvData.personal?.fullName || 'CV').replace(/\s+/g, '_')}_Hum-CV.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadStatus({ type: 'docx', message: 'File Word berhasil diunduh!' });
    } catch (err) {
      setDownloadStatus({ type: 'docx', message: 'Gagal mengekspor file Word.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyNorek = () => {
    navigator.clipboard.writeText("7186886326");
    setCopiedNorek(true);
    setTimeout(() => setCopiedNorek(false), 3000);
  };

  const PreviewContent = ({ template }: { template: TemplateType }) => {
    const config = {
      classic: { primary: '#1e293b', secondary: '#475569', line: '#1e293b', borderStyle: '3px solid #1e293b', align: 'center' },
      modern: { primary: '#0d9488', secondary: '#115e59', line: '#0d9488', borderStyle: '3px solid #0d9488', align: 'left' },
      graduate: { primary: '#6d28d9', secondary: '#5b21b6', line: '#7c3aed', borderStyle: '3px solid #7c3aed', align: 'left' }
    }[template] || { primary: '#1e293b', secondary: '#475569', line: '#1e293b', borderStyle: '3px solid #1e293b', align: 'center' };

    return (
      <div 
        id="canvas-preview-target"
        style={{
          width: '100%', maxWidth: '210mm', minHeight: '297mm', backgroundColor: '#ffffff',
          padding: '20mm', fontFamily: 'Arial, sans-serif', lineHeight: '1.5', boxSizing: 'border-box',
          textAlign: 'left', color: '#1e293b'
        }}
      >
        <div style={{ textAlign: config.align as any, paddingBottom: '15px', borderBottom: config.borderStyle }}>
          <h1 style={{ fontSize: '24pt', fontWeight: 'bold', color: '#0f172a', margin: '0', textTransform: 'uppercase' }}>
            {cvData.personal?.fullName || ''}
          </h1>
          <p style={{ fontSize: '10pt', color: '#475569', margin: '6px 0 0 0' }}>
            {cvData.personal?.location || ''} | {cvData.personal?.phone || ''} | {cvData.personal?.email || ''}
          </p>
        </div>

        {cvData.personal?.summary && (
          <div style={{ marginTop: '18px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: config.primary, borderBottom: `1px solid ${config.line}`, paddingBottom: '2px', textTransform: 'uppercase' }}>
              {t('cvSummary')}
            </h2>
            <p style={{ fontSize: '10pt', color: '#334155', margin: '6px 0 0 0', textAlign: 'justify' }}>{cvData.personal.summary}</p>
          </div>
        )}

        {/* EXPERIENCE & EDUCATION RENDER SAFELY */}
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: config.primary, borderBottom: `1px solid ${config.line}`, paddingBottom: '2px', textTransform: 'uppercase' }}>
            {template === 'graduate' ? t('cvInternship') : t('cvExperience')}
          </h2>
          {(cvData.experience || []).map(exp => (
            <div key={exp.id} style={{ marginBottom: '12px' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{exp.title} — {exp.company}</p>
              <p style={{ margin: 0, fontSize: '9pt', color: '#64748b' }}>{exp.description || ''}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-950 text-white pb-12 font-sans text-center">
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50 px-4 py-4 flex items-center justify-between">
        <div className="font-black text-base">HC — {t('title')}</div>
        <div className="flex bg-white/5 rounded-2xl p-0.5 border border-white/10">
          <button onClick={() => setLanguage('id')} className={`px-4 py-1.5 rounded-xl text-xs font-black ${language === 'id' ? 'bg-white text-black' : 'text-zinc-400'}`}>ID</button>
          <button onClick={() => setLanguage('en')} className={`px-4 py-1.5 rounded-xl text-xs font-black ${language === 'en' ? 'bg-white text-black' : 'text-zinc-400'}`}>EN</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 pt-10">
        <div className="max-w-2xl mx-auto bg-white/[0.01] border border-white/5 p-6 sm:p-10 rounded-[32px] backdrop-blur-3xl shadow-2xl text-left">
          {renderStep() === null ? "" : renderStep()}
          
          {currentStep === 4 && (
            <div className="mt-6 p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 border border-emerald-500/20">
              <h4 className="text-sm font-black text-emerald-400">🌱 Dukung Ekosistem Hum-CV</h4>
              <p className="text-xs text-slate-400 mt-2">BSI: 7186886326 (a.n Humaidi Iskandar)</p>
              <button onClick={handleCopyNorek} className="mt-3 px-4 py-2 bg-white/10 text-white text-xs rounded-xl flex items-center gap-2">
                <Copy className="w-3 h-3" /> {copiedNorek ? 'Tersalin!' : 'Salin Rekening'}
              </button>
            </div>
          )}

          <div className="mt-8 flex border-t border-white/5 pt-6 justify-between">
            {currentStep > 1 && <button onClick={prevStep} className="text-xs text-slate-400 font-bold"> Kembali</button>}
            {currentStep < 4 && <button onClick={nextStep} className="px-6 py-2 bg-white text-black font-black text-xs rounded-xl">Lanjut</button>}
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col text-slate-900">
            <div className="p-4 border-b flex justify-between items-center bg-white">
              <span className="font-bold text-xs text-emerald-600">Gaya: {selectedTemplate.toUpperCase()}</span>
              <button onClick={() => setShowPreviewModal(false)} className="p-1 text-slate-400 hover:text-black"><XIcon className="w-5 h-5" /></button>
            </div>
            <div className="overflow-auto bg-slate-200 flex-1 p-4"><PreviewContent template={selectedTemplate} /></div>
            <div className="p-4 border-t bg-white flex gap-2">
              <button onClick={downloadPDF} className="flex-1 py-3 bg-slate-950 text-white text-xs font-bold rounded-xl">PDF</button>
              <button onClick={downloadDOCX} className="flex-1 py-3 border text-xs font-bold rounded-xl">Word</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
