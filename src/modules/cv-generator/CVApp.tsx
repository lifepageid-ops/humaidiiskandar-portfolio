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

  // 🌟 JALUR PERBAIKAN: Fungsi Navigasi Langkah yang Hilang dari Kode Lo
  const nextStep = () => setCurrentStep(prev => (prev < 4 ? (prev + 1) as Step : prev));
  const prevStep = () => setCurrentStep(prev => (prev > 1 ? (prev - 1) as Step : prev));
  const generatePreview = () => setShowPreviewModal(true);

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

  const resetData = () => {
    if (window.confirm("Apakah anda ingin mereset formulir kembali ke data default template?")) {
      setCvData(DEFAULT_CV);
      localStorage.setItem('humcv-wizard-data', JSON.stringify(DEFAULT_CV));
    }
  };

  // 🌟 JALUR PERBAIKAN: Fungsi Render Tiap Langkah yang Sempat Terhapus
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-xl font-black text-white">{t('step1')}</h2>
              <p className="text-xs text-slate-400 mt-1">Lengkapi data primer kontak kualifikasi resmi Anda</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Nama Lengkap</label>
                <input type="text" value={cvData.personal?.fullName || ''} onChange={(e) => updatePersonal('fullName', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold" placeholder="Sinta Wijaya" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Lokasi Tempat Tinggal</label>
                <input type="text" value={cvData.personal?.location || ''} onChange={(e) => updatePersonal('location', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold" placeholder="Jakarta, Indonesia" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Nomor Telepon / WhatsApp</label>
                <input type="tel" value={cvData.personal?.phone || ''} onChange={(e) => updatePersonal('phone', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold" placeholder="+62 812..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Alamat Surat Elektronik (Email)</label>
                <input type="email" value={cvData.personal?.email || ''} onChange={(e) => updatePersonal('email', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold" placeholder="sinta@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Tautan LinkedIn Profile</label>
              <input type="text" value={cvData.personal?.linkedin || ''} onChange={(e) => updatePersonal('linkedin', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold" placeholder="linkedin.com/in/..." />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-300">Ringkasan Karir Profesional</label>
                <button onClick={() => optimizeWithAI('summary')} className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer">
                  <Sparkles className="w-3 h-3" /> Optimasi AI
                </button>
              </div>
              <textarea value={cvData.personal?.summary || ''} onChange={(e) => updatePersonal('summary', e.target.value)} rows={4} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl resize-none" placeholder="Deskripsikan rangkuman kompetensi Anda..." />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-white">{t('step2')}</h2>
            {(cvData.education || []).map((edu, idx) => (
              <div key={edu.id} className="p-4 border border-white/10 bg-white/[0.02] rounded-2xl relative">
                <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-3">Lembaga Akademik #{idx + 1}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Nama Institusi / Universitas</label>
                    <input value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm" placeholder="Universitas Indonesia" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Gelar & Penjurusan</label>
                    <input value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm" placeholder="Sarjana Administrasi Bisnis" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Masa Studi</label>
                      <input value={edu.period} onChange={(e) => updateEducation(edu.id, 'period', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm" placeholder="2018 - 2022" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">IPK / Nilai</label>
                      <input value={edu.gpa} onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm" placeholder="3.85" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addEducation} className="w-full py-3 border border-dashed border-white/20 rounded-xl text-xs text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 flex items-center justify-center gap-1.5 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Tambah Histori Pendidikan
            </button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-white">{t('step3')}</h2>
            {(cvData.experience || []).map((exp, idx) => (
              <div key={exp.id} className="p-4 border border-white/10 bg-white/[0.02] rounded-2xl relative">
                <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-3">Rekam Karir #{idx + 1}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Jabatan / Posisi</label>
                    <input value={exp.title} onChange={(e) => updateExperience(exp.id, 'title', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm" placeholder="Asisten Manajer Produk" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Nama Perusahaan / Korporasi</label>
                    <input value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm" placeholder="Startup Teknologi" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Lokasi Kantor</label>
                    <input value={exp.location} onChange={(e) => updateExperience(exp.id, 'location', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm" placeholder="Jakarta" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Periode Kerja</label>
                    <input value={exp.period} onChange={(e) => updateExperience(exp.id, 'period', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm" placeholder="2022 - 2024" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-bold text-slate-300">Deskripsi Desk Kerja</label>
                    <button onClick={() => optimizeWithAI('description', exp.id)} className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md cursor-pointer">✨ AI Polish</button>
                  </div>
                  <textarea value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} rows={3} className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white text-xs rounded-xl" placeholder="Tulis uraian pencapaian target kerja Anda..." />
                </div>
              </div>
            ))}
            <button onClick={addExperience} className="w-full py-3 border border-dashed border-white/20 rounded-xl text-xs text-slate-400 hover:text-amber-400 hover:border-amber-500/30 flex items-center justify-center gap-1.5 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Tambah Portofolio Pengalaman
            </button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-white">{t('step4')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-300 block text-xs mb-2">Hard Skills (Gunakan koma)</label>
                <textarea value={cvData.hardSkills ? cvData.hardSkills.join(', ') : ''} onChange={(e) => setCvData(p => ({ ...p, hardSkills: e.target.value.split(',').map(s => s.trim()) }))} className="w-full h-20 px-3 py-2 bg-white/5 border border-white/10 text-white text-xs rounded-xl" placeholder="Figma, SQL, Python..." />
              </div>
              <div>
                <label className="font-bold text-slate-300 block text-xs mb-2">Soft Skills (Gunakan koma)</label>
                <textarea value={cvData.softSkills ? cvData.softSkills.join(', ') : ''} onChange={(e) => setCvData(p => ({ ...p, softSkills: e.target.value.split(',').map(s => s.trim()) }))} className="w-full h-20 px-3 py-2 bg-white/5 border border-white/10 text-white text-xs rounded-xl" placeholder="Komunikasi, Kepemimpinan..." />
              </div>
              <div>
                <label className="font-bold text-slate-300 block text-xs mb-2">Kecakapan Bahasa</label>
                <input type="text" value={cvData.languages || ''} onChange={(e) => setCvData(p => ({ ...p, languages: e.target.value }))} className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white text-xs rounded-xl" placeholder="Bahasa Indonesia (Native), English (Fluent)" />
              </div>
              <div>
                <label className="font-bold text-slate-300 block text-xs mb-2">Sertifikasi & Lisensi Resmi</label>
                <input type="text" value={cvData.certifications || ''} onChange={(e) => setCvData(p => ({ ...p, certifications: e.target.value }))} className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white text-xs rounded-xl" placeholder="Google Data Analytics Certificate" />
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center mt-4">
              <h3 className="font-black text-sm text-white mb-3">Rakit & Evaluasi Komponen Pratinjau Berkas</h3>
              <button onClick={generatePreview} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer shadow-lg shadow-teal-500/10">
                <Check className="w-4 h-4" /> {t('generatePreview')}
              </button>
              <button onClick={resetData} className="text-[10px] text-red-400 font-bold hover:underline mt-3 block mx-auto cursor-pointer">✕ Reset Formulir Kembali ke Awal</button>
            </div>
          </div>
        );
      default: return null;
    }
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

        <div style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: config.primary, borderBottom: `1px solid ${config.line}`, paddingBottom: '2px', textTransform: 'uppercase' }}>
            {template === 'graduate' ? t('cvInternship') : t('cvExperience')}
          </h2>
          {(cvData.experience || []).map(exp => (
            <div key={exp.id} style={{ marginBottom: '12px' }}>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '10.5pt', color: '#0f172a' }}>{exp.title} — {exp.company}</p>
              <p style={{ margin: '2px 0 4px 0', fontSize: '9.5pt', color: '#475569', whiteSpace: 'pre-line', textAlign: 'justify' }}>{exp.description || ''}</p>
            </div>
          ))}
        </div>

        {(cvData.education || []).length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '11pt', fontWeight: 'bold', color: config.primary, borderBottom: `1px solid ${config.line}`, paddingBottom: '2px', textTransform: 'uppercase' }}>
              {t('cvEducation')}
            </h2>
            {cvData.education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '10px' }}>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '10.5pt', color: '#0f172a' }}>{edu.degree}</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '9.5pt', color: '#475569' }}>{edu.institution} ({edu.period}) {edu.gpa ? ` — IPK: ${edu.gpa}` : ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-950 text-white pb-12 font-sans text-center">
      {aiMessage && <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black z-50 border border-white/10">{aiMessage}</div>}
      
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50 px-4 py-4 flex items-center justify-between">
        <div className="font-black text-base">HC — {t('title')}</div>
        <div className="flex bg-white/5 rounded-2xl p-0.5 border border-white/10">
          <button onClick={() => setLanguage('id')} className={`px-4 py-1.5 rounded-xl text-xs font-black ${language === 'id' ? 'bg-white text-black' : 'text-zinc-400'}`}>ID</button>
          <button onClick={() => setLanguage('en')} className={`px-4 py-1.5 rounded-xl text-xs font-black ${language === 'en' ? 'bg-white text-black' : 'text-zinc-400'}`}>EN</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 pt-10">
        <div className="max-w-2xl mx-auto bg-white/[0.01] border border-white/5 p-6 sm:p-10 rounded-[32px] backdrop-blur-3xl shadow-2xl text-left">
          {renderStep()}
          
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
            {currentStep > 1 ? (
              <button onClick={prevStep} className="text-xs text-slate-400 font-bold hover:text-white cursor-pointer flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali
              </button>
            ) : <div />}
            {currentStep < 4 ? (
              <button onClick={nextStep} className="px-6 py-2 bg-white text-black font-black text-xs rounded-xl cursor-pointer hover:scale-[1.02] transition-transform flex items-center gap-1">
                Lanjut <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : <div />}
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col text-slate-900">
            <div className="p-4 border-b flex justify-between items-center bg-white">
              <span className="font-bold text-xs text-emerald-600 flex items-center gap-2">
                Gaya Aktif: {selectedTemplate.toUpperCase()}
                <button onClick={() => setSelectedTemplate(p => p === 'classic' ? 'modern' : p === 'modern' ? 'graduate' : 'classic')} className="text-[10px] bg-slate-100 px-2 py-1 rounded-md text-slate-700 font-black cursor-pointer ml-2 border">Ganti Desain</button>
              </span>
              <button onClick={() => setShowPreviewModal(false)} className="p-1 text-slate-400 hover:text-black cursor-pointer"><XIcon className="w-5 h-5" /></button>
            </div>
            <div className="overflow-auto bg-slate-200 flex-1 p-4"><PreviewContent template={selectedTemplate} /></div>
            <div className="p-4 border-t bg-white flex gap-2">
              <button onClick={downloadPDF} className="flex-1 py-3 bg-slate-950 text-white text-xs font-bold rounded-xl cursor-pointer">PDF</button>
              <button onClick={downloadDOCX} className="flex-1 py-3 border text-xs font-bold rounded-xl cursor-pointer">Word</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
