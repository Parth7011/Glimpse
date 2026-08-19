import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Camera, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/utils';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('photographer'); // 'photographer' or 'guest'
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate auth success
    if (userType === 'guest') {
      navigate(ROUTES.GUEST_DASHBOARD);
    } else {
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F2EF] flex items-center justify-center p-4 md:p-8 font-sans text-[#171717]">
      <div className="w-full max-w-[1300px] h-[90vh] min-h-[550px] max-h-[900px] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Side: Form */}
        <div className="w-full lg:w-[45%] bg-[#FDF9F2] h-full flex flex-col p-4 md:p-6 relative overflow-y-auto">
          {/* Logo */}
          <Link to="/" className="flex flex-col mb-4 w-fit group">
            <div className="flex items-center gap-2 mb-1">
              <Camera className="w-7 h-7 text-[#171717]" />
              <span className="text-2xl font-bold tracking-tight">Glimpse</span>
            </div>
            <span className="text-[10px] font-semibold text-[#6B6B67] uppercase tracking-wide group-hover:text-[var(--accent)] transition-colors">
              Every moment. <span className="text-[var(--accent)]">Find yours.</span>
            </span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-[400px] w-full mx-auto">
            <div className="mb-4">
              <h1 className="text-3xl font-bold tracking-tight mb-1">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h1>
              <p className="text-sm text-[#6B6B67]">
                {isLogin ? 'Sign in to continue to your account' : 'Sign up to start sharing your memories'}
              </p>
            </div>

            {/* Role Toggle */}
            <div className="flex items-center gap-6 mb-4 text-sm font-medium">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                  userType === 'photographer' ? "border-[var(--accent)]" : "border-[#D1D1CC]"
                )}>
                  {userType === 'photographer' && <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />}
                </div>
                <input 
                  type="radio" 
                  className="hidden" 
                  checked={userType === 'photographer'} 
                  onChange={() => setUserType('photographer')} 
                />
                I'm a Photographer
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[#6B6B67]">
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                  userType === 'guest' ? "border-[var(--accent)]" : "border-[#D1D1CC]"
                )}>
                  {userType === 'guest' && <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />}
                </div>
                <input 
                  type="radio" 
                  className="hidden" 
                  checked={userType === 'guest'} 
                  onChange={() => setUserType('guest')} 
                />
                I'm a Guest
              </label>
            </div>

            {/* Social Logins */}
            <div className="space-y-2 mb-4">
              <button className="w-full bg-white border border-[#E5E5E0] rounded-xl py-2.5 px-4 flex items-center justify-center gap-3 text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
              <button className="w-full bg-white border border-[#E5E5E0] rounded-xl py-2.5 px-4 flex items-center justify-center gap-3 text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.09 2.31-.86 3.5-.8 1.49.03 2.65.65 3.35 1.7-2.93 1.76-2.42 5.71.49 6.9-1.04 2.83-2.58 3.5-2.42 4.37zm-2.9-14.88c.61-1.89-.5-3.56-2.2-4.1-1.39 2.12.92 4.41 2.2 4.1z" />
                </svg>
                Continue with Apple
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] flex-1 bg-[#E5E5E0]" />
              <span className="text-[10px] uppercase font-bold text-[#9C9C97] tracking-widest">OR</span>
              <div className="h-[1px] flex-1 bg-[#E5E5E0]" />
            </div>

            {/* Custom Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#171717]">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <div className="w-4 h-4 text-[#9C9C97] border-2 border-current rounded-full" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Enter your name" 
                      required 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all shadow-sm"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#171717]">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-[#9C9C97]" />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    defaultValue="demo@glimpse.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all shadow-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-[#171717]">Password</label>
                  {isLogin && (
                    <a href="#" className="text-xs font-semibold text-[var(--accent)] hover:underline">Forgot password?</a>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-[#9C9C97]" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    required 
                    defaultValue="password"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E5E5E0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all shadow-sm"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9C9C97] hover:text-[#171717] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold py-3 rounded-xl shadow-[0_4px_14px_rgba(217,154,50,0.4)] transition-transform hover:scale-[1.02]"
              >
                {isLogin ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <p className="text-center text-sm text-[#6B6B67] mt-4">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-[var(--accent)] font-bold hover:underline">
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Right Side: Visuals */}
        <div className="hidden lg:flex w-[55%] bg-white h-full relative p-16 flex-col">
          {/* Subtle dotted background pattern */}
          <div className="absolute top-8 right-8 grid grid-cols-4 gap-2 opacity-20">
            {Array.from({length: 16}).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#D1D1CC]" />)}
          </div>
          <div className="absolute bottom-8 left-8 grid grid-cols-4 gap-2 opacity-20">
            {Array.from({length: 16}).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#D1D1CC]" />)}
          </div>

          <div className="relative z-10 max-w-lg mb-12">
            <div className="text-[var(--accent)] text-6xl font-serif leading-none h-8 mb-2">“</div>
            <h2 className="text-4xl font-bold tracking-tight leading-[1.15] mb-6">
              Bringing people closer to their memories through the power of AI.
            </h2>
            <div className="flex items-end gap-2 text-xl text-[#6B6B67] font-medium">
              One selfie. Every moment you're in.
              <span className="text-[var(--accent)] text-5xl font-serif leading-none h-6 translate-y-2">”</span>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#F1F1EE] border border-[#E5E5E0]">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80" alt="Rohan Mehta" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-bold text-sm">Rohan Mehta</div>
              <div className="text-xs text-[#9C9C97] font-medium">Wedding Photographer</div>
            </div>
          </div>

          {/* Photos Collage */}
          <div className="absolute bottom-10 right-10 w-[500px] h-[400px]">
            {/* Swirl graphic */}
            <svg className="absolute inset-0 w-full h-full text-[var(--accent)]/30 scale-125 -translate-y-10" viewBox="0 0 200 200" fill="none">
              <path d="M 0,100 C 50,50 100,150 200,50" stroke="currentColor" strokeWidth="1" />
            </svg>
            
            {/* Floating Camera Graphic */}
            <div className="absolute top-20 right-10 w-16 h-16 border-2 border-[var(--accent)]/40 rounded-lg flex items-center justify-center rotate-12 bg-white shadow-sm">
              <div className="w-6 h-6 border-2 border-[var(--accent)]/40 rounded-full" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[var(--accent)]/40 rounded-full" />
            </div>

            {/* Photo 1 (Back left) */}
            <div className="absolute bottom-20 left-10 w-[200px] h-[240px] bg-white p-3 pb-12 shadow-[0_15px_30px_rgba(0,0,0,0.15)] rounded-sm -rotate-6 transition-transform hover:rotate-0 hover:z-20 hover:scale-105 duration-300">
              <div className="w-full h-full bg-gray-100 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" alt="Wedding 1" />
              </div>
            </div>

            {/* Photo 2 (Center prominent) */}
            <div className="absolute bottom-32 left-32 w-[220px] h-[260px] bg-white p-3 pb-14 shadow-[0_20px_40px_rgba(0,0,0,0.2)] rounded-sm rotate-3 z-10 transition-transform hover:rotate-0 hover:z-20 hover:scale-105 duration-300">
              <div className="w-full h-full bg-gray-100 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80" className="w-full h-full object-cover" alt="Wedding 2" />
              </div>
            </div>

            {/* Photo 3 (Bottom Right) */}
            <div className="absolute bottom-10 right-20 w-[180px] h-[220px] bg-white p-2.5 pb-10 shadow-[0_10px_25px_rgba(0,0,0,0.15)] rounded-sm -rotate-3 z-0 transition-transform hover:rotate-0 hover:z-20 hover:scale-105 duration-300">
              <div className="w-full h-full bg-gray-100 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" alt="Concert" />
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}