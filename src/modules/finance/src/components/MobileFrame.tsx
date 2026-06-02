import React, { useRef, useState } from 'react';
import { Battery, Wifi, Signal, Flame, Settings, Camera, Check, Pencil, X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ 
  children, 
  setActiveTab
}) => {
  const { gamification, user, updateUserProfile } = useFinance();
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran foto maksimal 3 MB agar aplikasi tetap ringan.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateUserProfile({ avatar: reader.result as string });
    };
    reader.onerror = () => alert('Gagal membaca file foto. Coba pilih gambar lain.');
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleSaveName = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanedName = nameInput.trim();
    if (!cleanedName) return;
    updateUserProfile({ name: cleanedName });
    setIsEditingName(false);
  };

  return (
    <div className="relative mx-auto w-full mobile-app-height bg-[#111827] flex flex-col justify-between overflow-hidden lg:w-[390px] lg:h-[800px] lg:rounded-[46px] lg:p-3 lg:shadow-2xl lg:ring-1 lg:ring-white/10 lg:shadow-slate-950/30">
      
      {/* Physical phone bezel and ambient edge reflection */}
      <div className="hidden lg:block absolute inset-0 rounded-[46px] border-[6px] border-[#253044] pointer-events-none z-50"></div>
      
      {/* Inner Screen Container */}
      <div className="relative w-full h-full mobile-app-height bg-[#111827] flex flex-col overflow-hidden lg:min-h-0 lg:rounded-[36px]">
        
        {/* Status Bar */}
        <div className="hidden lg:flex h-11 w-full bg-[#111827] pt-2 px-6 items-center justify-between text-xs text-gray-400 select-none z-40 shrink-0">
          <span className="font-semibold text-gray-200">09:41</span>
          
          {/* Smartphone Notch / Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full flex items-center justify-between px-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1A1D26]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/20"></div>
          </div>

          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-medium">100%</span>
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* App Header Bar (Dynamic) */}
        <div className="safe-top px-4 py-3 flex items-center justify-between bg-[#111827]/95 backdrop-blur-xl shrink-0 z-30 border-b border-white/10 lg:px-5 lg:py-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => profilePhotoInputRef.current?.click()}
              className="relative group"
              title="Ganti foto profil dari galeri"
            >
              <input
                ref={profilePhotoInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="hidden"
              />
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/35 group-hover:ring-emerald-300 transition-all lg:w-8 lg:h-8"
              />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-gray-950 ring-2 ring-[#111827]">
                <Camera className="w-2.5 h-2.5" />
              </div>
            </button>
            <div className="flex flex-col min-w-0">
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-1">
                  <input
                    value={nameInput}
                    onChange={(event) => setNameInput(event.target.value)}
                    className="w-28 rounded-lg border border-white/10 bg-[#151C2B] px-2 py-1 text-xs font-bold text-gray-100 outline-none focus:border-emerald-500/50"
                    autoFocus
                  />
                  <button type="submit" className="text-emerald-300" title="Simpan nama">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNameInput(user.name);
                      setIsEditingName(false);
                    }}
                    className="text-gray-500 hover:text-gray-300"
                    title="Batal"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setNameInput(user.name);
                    setIsEditingName(true);
                  }}
                  className="group flex items-center gap-1 text-left"
                  title="Ubah nama"
                >
                  <span className="text-xs font-bold text-gray-100 line-clamp-1">{user.name.split(' ')[0]}</span>
                  <Pencil className="w-2.5 h-2.5 text-gray-600 group-hover:text-emerald-300" />
                </button>
              )}
              <span className="text-[10px] text-gray-400 flex items-center gap-1 leading-tight mt-0.5">
                Agent humed bantu itungin ya
                <span className="inline-flex w-4 h-4 rounded-full bg-sky-500/10 border border-sky-400/25 items-center justify-center shrink-0">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" fill="#FBBF24" opacity="0.95" />
                    <path d="M5.5 9.4H10.2C10.8 9.4 11.3 9.9 11.3 10.5V11.4C11.3 12.5 10.4 13.4 9.3 13.4H7.2C6.1 13.4 5.2 12.5 5.2 11.4V9.7C5.2 9.5 5.3 9.4 5.5 9.4Z" fill="#111827" />
                    <path d="M13.8 9.4H18.5C18.7 9.4 18.8 9.5 18.8 9.7V11.4C18.8 12.5 17.9 13.4 16.8 13.4H14.7C13.6 13.4 12.7 12.5 12.7 11.4V10.5C12.7 9.9 13.2 9.4 13.8 9.4Z" fill="#111827" />
                    <path d="M11.3 10.3C11.8 10 12.2 10 12.7 10.3" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M8.4 16.2C10.1 17.4 13.9 17.4 15.6 16.2" stroke="#7C2D12" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Gamification Streak Pill */}
            <button 
              onClick={() => setActiveTab('gamification')}
              className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/15 px-2 py-1 rounded-full border border-amber-500/20 transition-all"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-amber-400">{gamification.savingStreakDays}d</span>
            </button>

            {/* Notifications / Privacy Settings */}
            <button 
              onClick={() => setActiveTab('privacy')}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 transition-all lg:w-7 lg:h-7"
              title="Privacy & Data Control"
            >
              <Settings className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Scrollable Main Screen Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative pb-36 bg-[#111827]">
          {children}
        </div>

      </div>

    </div>
  );
};
