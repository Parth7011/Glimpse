import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Camera, CreditCard, Upload } from 'lucide-react';
import { Button } from '@/components/ui';

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
      className="max-w-4xl mx-auto space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1.5">Manage your studio profile, brand aesthetics, and subscription.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-[var(--radius-md)] transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[var(--surface-soft)] text-[var(--text-primary)] font-semibold shadow-sm border border-[var(--border)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Studio Information</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">Update your studio's contact details and public name.</p>
                
                <div className="space-y-5">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-[var(--text-primary)]">Studio Name</label>
                    <input type="text" defaultValue="Arjun Kapoor Photography" className="w-full p-3 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-[var(--text-primary)]">Contact Email</label>
                    <input type="email" defaultValue="demo@glimpse.com" className="w-full p-3 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-[var(--text-primary)]">Phone Number</label>
                    <input type="tel" defaultValue="+91 98765 43210" className="w-full p-3 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-[var(--accent)] transition-colors" />
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button variant="primary" className="gap-2"><Save className="w-4 h-4"/> Save Changes</Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'branding' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Brand Assets</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">Customize how guests see your event galleries.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">Studio Logo</label>
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-[var(--background)] border-2 border-dashed border-[var(--border)] flex items-center justify-center text-[var(--text-muted)]">
                        <Camera className="w-8 h-8 opacity-50" />
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" className="gap-2"><Upload className="w-4 h-4"/> Upload Logo</Button>
                        <p className="text-xs text-[var(--text-secondary)]">Recommended size: 256x256px (PNG, JPG)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">Brand Color</label>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full shadow-inner bg-[var(--accent)] ring-2 ring-offset-2 ring-[var(--accent)] cursor-pointer" />
                      <div className="w-10 h-10 rounded-full shadow-inner bg-[#4338CA] opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
                      <div className="w-10 h-10 rounded-full shadow-inner bg-[#10B981] opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
                      <div className="w-10 h-10 rounded-full shadow-inner bg-[#EC4899] opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-3">This color will be used for buttons and accents on your guest galleries.</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button variant="primary" className="gap-2"><Save className="w-4 h-4"/> Save Branding</Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Current Plan</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">Manage your subscription and billing details.</p>
                
                <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-md)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-[var(--text-primary)]">Free Plan</span>
                      <span className="bg-gray-200 text-gray-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Current</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">Up to 3 events per month. 500 photos per event.</p>
                  </div>
                  <Button variant="primary" className="whitespace-nowrap shadow-md">Upgrade to Pro</Button>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </motion.div>
    </motion.div>
  );
}
