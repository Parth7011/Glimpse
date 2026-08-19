import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Shield, Bell, AlertTriangle } from 'lucide-react';
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
      className="max-w-4xl mx-auto space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1.5">Manage your account, privacy, and notifications.</p>
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
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Account Details</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">Update your personal information.</p>
                
                <div className="space-y-5">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-[var(--text-primary)]">Full Name</label>
                    <input type="text" defaultValue="Guest User" className="w-full p-3 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-[#7C6EF6] transition-colors" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-[var(--text-primary)]">Email Address</label>
                    <input type="email" defaultValue="guest@glimpse.com" className="w-full p-3 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-[#7C6EF6] transition-colors" />
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button variant="primary" style={{ backgroundColor: '#7C6EF6' }} className="gap-2 hover:bg-[#5A4ED1] text-white"><Save className="w-4 h-4"/> Save Changes</Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Privacy & Facial Data</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">Control how Glimpse uses your selfie to match photos.</p>
                
                <div className="bg-[#F9FAFB] border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Your facial data is private</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Glimpse only uses your selfie to find you in galleries you explicitly join. We do not sell your biometric data or share your selfie with anyone else.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--border)]">
                <h3 className="text-lg font-bold text-red-600 mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Danger Zone
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">These actions are permanent and cannot be undone.</p>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-red-100 bg-red-50/50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Delete Facial Data</h4>
                      <p className="text-xs text-gray-600 mt-1">Remove your selfie and all associated facial encodings from our servers immediately.</p>
                    </div>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 whitespace-nowrap">Delete My Data</Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-red-100 bg-red-50/50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Delete Account</h4>
                      <p className="text-xs text-gray-600 mt-1">Permanently delete your account and lose access to all your past galleries.</p>
                    </div>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 whitespace-nowrap">Delete Account</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Email Preferences</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">Manage what updates you receive from Glimpse.</p>
                
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-[#7C6EF6] focus:ring-[#7C6EF6] border-gray-300 rounded" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">New Photo Matches</div>
                      <div className="text-xs text-gray-500 mt-0.5">Get notified when a photographer uploads a new photo you are in.</div>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-[#7C6EF6] focus:ring-[#7C6EF6] border-gray-300 rounded" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Event Updates</div>
                      <div className="text-xs text-gray-500 mt-0.5">Get notified when an event you joined is fully published or modified.</div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button variant="primary" style={{ backgroundColor: '#7C6EF6' }} className="gap-2 hover:bg-[#5A4ED1] text-white"><Save className="w-4 h-4"/> Save Preferences</Button>
              </div>
            </motion.div>
          )}

        </div>
      </motion.div>
    </motion.div>
  );
}
