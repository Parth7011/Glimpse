import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout, GuestLayout, GuestDashboardLayout } from '@/components/layout';

// Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import PhotographerSettingsPage from '../pages/PhotographerSettingsPage';
import GuestDashboardPage from '../pages/GuestDashboardPage';
import GuestSettingsPage from '../pages/GuestSettingsPage';
import FindEventPage from '../pages/FindEventPage';
import CreateEventPage from '../pages/CreateEventPage';
import EventWorkspacePage from '../pages/EventWorkspacePage';
import UploadPage from '../pages/UploadPage';
import SharePage from '../pages/SharePage';
import GuestEventPage from '../pages/GuestEventPage';
import SelfiePage from '../pages/SelfiePage';
import ResultsPage from '../pages/ResultsPage';
import HowItWorksPage from '../pages/HowItWorksPage';
import ForPhotographersPage from '../pages/ForPhotographersPage';
import AboutPage from '../pages/AboutPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/for-photographers" element={<ForPhotographersPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/settings" element={<PhotographerSettingsPage />} />
        <Route path="/events/new" element={<CreateEventPage />} />
        <Route path="/events/:eventId" element={<EventWorkspacePage />} />
        <Route path="/events/:eventId/upload" element={<UploadPage />} />
        <Route path="/events/:eventId/share" element={<SharePage />} />
      </Route>

      <Route element={<GuestDashboardLayout />}>
        <Route path="/guest-dashboard" element={<GuestDashboardPage />} />
        <Route path="/guest-dashboard/find" element={<FindEventPage />} />
        <Route path="/guest-dashboard/settings" element={<GuestSettingsPage />} />
      </Route>

      <Route element={<GuestLayout />}>
        <Route path="/e/:eventSlug" element={<GuestEventPage />} />
        <Route path="/e/:eventSlug/selfie" element={<SelfiePage />} />
        <Route path="/e/:eventSlug/results" element={<ResultsPage />} />
      </Route>
    </Routes>
  );
}
