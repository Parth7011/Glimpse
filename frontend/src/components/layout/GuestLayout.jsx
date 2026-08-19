import React from 'react';
import { Outlet } from 'react-router-dom';

export function GuestLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <Outlet />
    </div>
  );
}
