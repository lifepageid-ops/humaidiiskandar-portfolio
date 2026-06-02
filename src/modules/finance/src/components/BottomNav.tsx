import React from 'react';
import { Home, PlusCircle, Wallet, Target, Bot, Sparkles } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[78px] bg-[#111827]/95 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2 z-40 safe-bottom shrink-0">
      
      {/* Home Tab */}
      <button 
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
          activeTab === 'home' ? 'text-emerald-300 bg-emerald-500/10' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1">Home</span>
      </button>

      {/* Wallets Tab */}
      <button 
        onClick={() => setActiveTab('wallets')}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
          activeTab === 'wallets' ? 'text-emerald-300 bg-emerald-500/10' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Wallet className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1">Dompet</span>
      </button>

      {/* Primary Floating Action Button: Smart Expense Input */}
      <button 
        onClick={() => setActiveTab('track')}
        className="flex flex-col items-center justify-center -mt-5 group relative"
      >
        <div className="w-13 h-13 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-105 group-hover:bg-emerald-300 transition-all">
          <PlusCircle className="w-7 h-7 text-[#0F172A]" />
        </div>
        <span className="text-[10px] font-semibold text-emerald-400 mt-1.5">Catat</span>
      </button>

      {/* Goals / Anti-Impulsive Tab */}
      <button 
        onClick={() => setActiveTab('grow')}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
          activeTab === 'grow' ? 'text-emerald-300 bg-emerald-500/10' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Target className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1">Growth</span>
      </button>

      {/* AI Financial Assistant Tab */}
      <button 
        onClick={() => setActiveTab('ai')}
        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all relative ${
          activeTab === 'ai' ? 'text-emerald-300 bg-emerald-500/10' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <div className="relative">
          <Bot className="w-5 h-5" />
          <Sparkles className="w-2.5 h-2.5 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <span className="text-[10px] font-medium mt-1">AI Chat</span>
      </button>

    </div>
  );
};
