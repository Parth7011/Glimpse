import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Camera, CreditCard, Upload } from 'lucide-react';
import { Button, CursorGlow } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/authService';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

export default function PhotographerSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => authService.getMe(),
  });

  const user = data?.user || { name: '', email: '' };

  const tabs = [
    { id: 'profile', label: 'Studio Profile', icon: User },
    { id: 'branding', label: 'Branding', icon: Camera },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-12 relative z-10"
    >
      <CursorGlow />
      <motion.div variants={itemVariants} className="pb-6 border-b border-white/5">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#D7E2EA] uppercase drop-shadow-lg">Settings</h1>
        <p className="text-[#D7E2EA]/50 mt-2 text-sm font-bold uppercase tracking-widest">Manage your studio profile, brand aesthetics, and subscription.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-10">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 whitespace-nowrap border ${
                  activeTab === tab.id
                    ? 'bg-[#D7E2EA] text-[#0C0C0C] border-transparent shadow-[0_0_20px_rgba(215,226,234,0.3)]'
                    : 'bg-[#1A1A1A] text-[#D7E2EA]/50 border-white/10 hover:bg-white/5 hover:border-[#D7E2EA]/30 hover:text-[#D7E2EA]'
                }`}
              >
                <tab.icon className={`w-4 h-4 transition-colors ${activeTab === tab.id ? 'text-[#0C0C0C]' : 'text-[#D7E2EA]/40'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 bg-[#111111]/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-[#D7E2EA] uppercase tracking-wide mb-1">Studio Information</h3>
                <p className="text-xs font-bold text-[#D7E2EA]/50 uppercase tracking-widest mb-8">Update your studio's contact details and public name.</p>
                
                {isLoading ? (
                  <div className="text-[#D7E2EA]/50">Loading profile...</div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid gap-2 relative group/input">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/60 ml-1">Studio Name</label>
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-[#D7E2EA]/20 to-transparent rounded-2xl blur opacity-0 group-focus-within/input:opacity-100 transition duration-500 pointer-events-none translate-y-3" />
                      <input type="text" defaultValue={user.name} className="relative w-full p-4 bg-[#1A1A1A] border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#D7E2EA]/50 transition-all shadow-inner text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 font-light" />
                    </div>
                    <div className="grid gap-2 relative group/input">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/60 ml-1">Contact Email</label>
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-[#D7E2EA]/20 to-transparent rounded-2xl blur opacity-0 group-focus-within/input:opacity-100 transition duration-500 pointer-events-none translate-y-3" />
                      <input type="email" defaultValue={user.email} disabled className="relative w-full p-4 bg-[#1A1A1A] border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#D7E2EA]/50 transition-all shadow-inner text-[#D7E2EA]/50 placeholder:text-[#D7E2EA]/30 font-light opacity-60 cursor-not-allowed" />
                    </div>
                  </div>
                )}
              </div>
              <div className="pt-6 mt-6 flex justify-end border-t border-white/5 relative z-10">
                <Button variant="primary"><Save className="w-4 h-4"/> Save Changes</Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'branding' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 bg-[#111111]/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-[#D7E2EA] uppercase tracking-wide mb-1">Brand Assets</h3>
                <p className="text-xs font-bold text-[#D7E2EA]/50 uppercase tracking-widest mb-8">Customize how guests see your event galleries.</p>
                
                <div className="space-y-10">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/60 mb-4 ml-1">Studio Logo</label>
                    <div className="flex items-center gap-8 bg-[#1A1A1A] p-6 rounded-3xl border border-white/5">
                      <div className="w-24 h-24 rounded-full bg-[#111111] border border-white/10 flex items-center justify-center text-[#D7E2EA]/30 shadow-inner">
                        <Camera className="w-8 h-8 opacity-50" />
                      </div>
                      <div className="space-y-3">
                        <Button variant="secondary"><Upload className="w-4 h-4"/> Upload Logo</Button>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#D7E2EA]/40">Recommended size: 256x256px (PNG, JPG)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/60 mb-4 ml-1">Brand Color</label>
                    <div className="flex items-center gap-5 bg-[#1A1A1A] p-6 rounded-3xl border border-white/5">
                      <div className="w-12 h-12 rounded-full shadow-[0_0_20px_rgba(215,226,234,0.4)] bg-[#D7E2EA] ring-2 ring-offset-4 ring-offset-[#1A1A1A] ring-[#D7E2EA] cursor-pointer" />
                      <div className="w-12 h-12 rounded-full shadow-inner bg-[#4338CA] opacity-30 hover:opacity-100 hover:shadow-[0_0_20px_rgba(67,56,202,0.4)] cursor-pointer transition-all hover:scale-110" />
                      <div className="w-12 h-12 rounded-full shadow-inner bg-[#10B981] opacity-30 hover:opacity-100 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer transition-all hover:scale-110" />
                      <div className="w-12 h-12 rounded-full shadow-inner bg-[#EC4899] opacity-30 hover:opacity-100 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] cursor-pointer transition-all hover:scale-110" />
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#D7E2EA]/40 mt-4 ml-1">This color will be used for buttons and accents on your guest galleries.</p>
                  </div>
                </div>
              </div>
              <div className="pt-6 mt-6 flex justify-end border-t border-white/5 relative z-10">
                <Button variant="primary"><Save className="w-4 h-4"/> Save Branding</Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 bg-[#111111]/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-[#D7E2EA] uppercase tracking-wide mb-1">Current Plan</h3>
                <p className="text-xs font-bold text-[#D7E2EA]/50 uppercase tracking-widest mb-8">Manage your subscription and billing details.</p>
                
                <div className="bg-[#1A1A1A] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-black text-[#D7E2EA] uppercase tracking-tight">Free Plan</span>
                      <span className="bg-[#D7E2EA] text-[#0C0C0C] text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-full shadow-[0_0_10px_rgba(215,226,234,0.3)]">Current</span>
                    </div>
                    <p className="text-[10px] font-bold text-[#D7E2EA]/50 uppercase tracking-widest">Up to 3 events per month. 500 photos per event.</p>
                  </div>
                  <Button variant="primary" className="relative z-10">Upgrade to Pro</Button>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </motion.div>
    </motion.div>
  );
}
