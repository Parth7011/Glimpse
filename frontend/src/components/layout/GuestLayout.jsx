import React from 'react';
import { Outlet } from 'react-router-dom';
import { CursorGlow } from '@/components/ui';

export function GuestLayout() {
  return (
    <div className="min-h-screen bg-[#0C0C0C] flex flex-col font-kanit selection:bg-[#D7E2EA] selection:text-[#0C0C0C]">
      <CursorGlow />
      <Outlet />
    </div>
  );
}
