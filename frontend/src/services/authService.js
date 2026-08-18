/* ============================================
   Auth Service — mock implementation
   Later: Supabase Auth
   ============================================ */

import { MOCK_PHOTOGRAPHER } from '../data/mockData';
import { sleep } from '@/utils/utils';
let _currentUser = null;
export const authService = {
  /** Login with email and password */
  async login(req) {
    await sleep(800);
    // Mock: accept any credentials
    _currentUser = {
      id: MOCK_PHOTOGRAPHER.id,
      email: req.email || MOCK_PHOTOGRAPHER.email,
      name: MOCK_PHOTOGRAPHER.name
    };
    return _currentUser;
  },
  /** Logout */
  async logout() {
    await sleep(300);
    _currentUser = null;
  },
  /** Get current authenticated user */
  async getUser() {
    await sleep(200);
    return _currentUser;
  },
  /** Check if user is authenticated */
  isAuthenticated() {
    return _currentUser !== null;
  }
};