import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Shield, Bell, AlertTriangle } from 'lucide-react';
import { Button, CursorGlow } from '@/components/ui';

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

export default function GuestSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'My Account', icon: User },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-12 font-kanit relative z-10"
    >
      <CursorGlow />
      <motion.div variants={itemVariants} className="pt-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#D7E2EA] uppercase drop-shadow-lg">Settings</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/50 mt-2">Manage your account, privacy, and notifications.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-10">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-72 shrink-0">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 px-5 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#111111]/80 backdrop-blur-md text-[#D7E2EA] shadow-[0_0_20px_rgba(215,226,234,0.1)] border border-white/10'
                    : 'text-[#D7E2EA]/50 hover:bg-white/5 hover:text-[#D7E2EA]'
                }`}
              >
                <tab.icon className={`w-4 h-4 transition-colors ${activeTab === tab.id ? 'text-[#D7E2EA]' : 'text-[#D7E2EA]/40'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 bg-[#111111]/80 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tight text-[#D7E2EA] mb-2 drop-shadow-md">Account Details</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/50 mb-8">Update your personal information.</p>
                
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/70 ml-1">Full Name</label>
                    <input type="text" defaultValue="Guest User" className="w-full p-4 bg-[#1A1A1A] border border-white/10 rounded-2xl text-sm font-medium text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]/50 focus:shadow-[0_0_15px_rgba(215,226,234,0.1)] transition-all" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/70 ml-1">Email Address</label>
                    <input type="email" defaultValue="guest@glimpse.com" className="w-full p-4 bg-[#1A1A1A] border border-white/10 rounded-2xl text-sm font-medium text-[#D7E2EA] focus:outline-none focus:border-[#D7E2EA]/50 focus:shadow-[0_0_15px_rgba(215,226,234,0.1)] transition-all" />
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10 flex justify-end relative z-10 mt-8">
                <Button variant="primary" className="h-12 px-8"><Save className="w-4 h-4 mr-2"/> Save Changes</Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 bg-[#111111]/80 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tight text-[#D7E2EA] mb-2 drop-shadow-md">Privacy & Facial Data</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/50 mb-8">Control how Glimpse uses your selfie to match photos.</p>
                
                <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 shadow-inner">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="bg-[#D7E2EA]/10 border border-[#D7E2EA]/20 p-4 rounded-full text-[#D7E2EA] shrink-0 shadow-[0_0_15px_rgba(215,226,234,0.1)]">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wide text-[#D7E2EA] mb-2">Your facial data is private</h4>
                      <p className="text-xs text-[#D7E2EA]/60 leading-relaxed">
                        Glimpse only uses your selfie to find you in galleries you explicitly join. We do not sell your biometric data or share your selfie with anyone else.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 relative z-10">
                <h3 className="text-lg font-black uppercase tracking-wide text-red-400 mb-2 flex items-center gap-3 drop-shadow-md">
                  <AlertTriangle className="w-5 h-5" /> Danger Zone
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-400/50 mb-8">These actions are permanent and cannot be undone.</p>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 border border-red-500/20 bg-red-500/5 rounded-2xl">
                    <div>
                      <h4 className="font-black uppercase tracking-wide text-[#D7E2EA] text-sm">Delete Facial Data</h4>
                      <p className="text-xs text-[#D7E2EA]/50 mt-2">Remove your selfie and all associated facial encodings from our servers immediately.</p>
                    </div>
                    <Button variant="outline" className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 whitespace-nowrap h-12">Delete My Data</Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 border border-red-500/20 bg-red-500/5 rounded-2xl">
                    <div>
                      <h4 className="font-black uppercase tracking-wide text-[#D7E2EA] text-sm">Delete Account</h4>
                      <p className="text-xs text-[#D7E2EA]/50 mt-2">Permanently delete your account and lose access to all your past galleries.</p>
                    </div>
                    <Button variant="outline" className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 whitespace-nowrap h-12">Delete Account</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 bg-[#111111]/80 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tight text-[#D7E2EA] mb-2 drop-shadow-md">Email Preferences</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#D7E2EA]/50 mb-8">Manage what updates you receive from Glimpse.</p>
                
                <div className="space-y-6">
                  <label className="flex items-start gap-4 cursor-pointer p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group">
                    <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 text-[#D7E2EA] bg-[#1A1A1A] border-white/20 rounded focus:ring-offset-0 focus:ring-0 focus:ring-[#D7E2EA]/20" />
                    <div>
                      <div className="text-sm font-black uppercase tracking-wide text-[#D7E2EA] group-hover:text-white transition-colors">New Photo Matches</div>
                      <div className="text-xs text-[#D7E2EA]/50 mt-1">Get notified when a photographer uploads a new photo you are in.</div>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-4 cursor-pointer p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group">
                    <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 text-[#D7E2EA] bg-[#1A1A1A] border-white/20 rounded focus:ring-offset-0 focus:ring-0 focus:ring-[#D7E2EA]/20" />
                    <div>
                      <div className="text-sm font-black uppercase tracking-wide text-[#D7E2EA] group-hover:text-white transition-colors">Event Updates</div>
                      <div className="text-xs text-[#D7E2EA]/50 mt-1">Get notified when an event you joined is fully published or modified.</div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10 flex justify-end relative z-10 mt-8">
                <Button variant="primary" className="h-12 px-8"><Save className="w-4 h-4 mr-2"/> Save Preferences</Button>
              </div>
            </motion.div>
          )}

        </div>
      </motion.div>
    </motion.div>
  );
}
