import React from 'react';
import { Routes, Route, Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/utils';
import { DashboardLayout, GuestLayout } from '@/components/layout';

// Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import CreateEventPage from '../pages/CreateEventPage';
import EventWorkspacePage from '../pages/EventWorkspacePage';
import UploadPage from '../pages/UploadPage';
import SharePage from '../pages/SharePage';
import GuestEventPage from '../pages/GuestEventPage';
import SelfiePage from '../pages/SelfiePage';
import ResultsPage from '../pages/ResultsPage';
import HowItWorksPage from '../pages/HowItWorksPage';
import ForPhotographersPage from '../pages/ForPhotographersPage';



export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/for-photographers" element={<ForPhotographersPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/events/new" element={<CreateEventPage />} />
        <Route path="/events/:eventId" element={<EventWorkspacePage />} />
        <Route path="/events/:eventId/upload" element={<UploadPage />} />
        <Route path="/events/:eventId/share" element={<SharePage />} />
      </Route>

      <Route element={<GuestLayout />}>
        <Route path="/e/:eventSlug" element={<GuestEventPage />} />
        <Route path="/e/:eventSlug/selfie" element={<SelfiePage />} />
        <Route path="/e/:eventSlug/results" element={<ResultsPage />} />
      </Route>
    </Routes>
  );
}
