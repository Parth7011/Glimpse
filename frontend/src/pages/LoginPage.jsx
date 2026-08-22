import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Camera, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/utils/utils';
import { authService } from '../services/authService';
import { CursorGlow } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';

const CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000",
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('photographer'); // 'photographer' or 'guest'
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Carousel State
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await authService.login({ email, password });
      } else {
        await authService.register({ name, email, password });
      }
      // Route based on selected user type
      navigate(userType === 'guest' ? ROUTES.GUEST_DASHBOARD : ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center p-4 md:p-8 font-kanit text-[#D7E2EA] selection:bg-[#D7E2EA] selection:text-[#0C0C0C] relative overflow-hidden">
      
      <CursorGlow />

      {/* Animated Background Nebulas */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#D7E2EA]/10 rounded-full blur-[150px] pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05], x: [0, 100, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-0 w-[1000px] h-[1000px] bg-[#D7E2EA]/5 rounded-full blur-[150px] pointer-events-none"
      />

      {/* Outer container with animated gradient border */}
      <div className="w-full max-w-[1300px] h-[90vh] min-h-[550px] max-h-[900px] p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/5 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10 group">
        <div className={cn("w-full h-full bg-[#0C0C0C] rounded-[40px] overflow-hidden flex flex-col relative", isLogin ? "lg:flex-row" : "lg:flex-row-reverse")}>
        
        {/* Abstract subtle glow behind the whole card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D7E2EA]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Left Side: Form */}
        <motion.div 
          layout 
          transition={{ type: "spring", damping: 25, stiffness: 200 }} 
          className={cn(
            "w-full lg:w-[45%] bg-[#111111]/80 backdrop-blur-xl h-full flex flex-col p-6 md:p-10 relative overflow-y-auto z-10 shadow-2xl",
            isLogin ? "border-r border-white/5" : "border-l border-white/5"
          )}
        >
          
          {/* Logo */}
          <Link to="/" className="flex flex-col mb-8 w-fit group">
            <div className="flex items-center gap-2 mb-1">
              <Camera className="w-7 h-7 text-[#D7E2EA]" />
              <span className="text-2xl font-black uppercase tracking-tight text-[#D7E2EA]">Glimpse</span>
            </div>
            <span className="text-[9px] font-black text-[#D7E2EA]/40 uppercase tracking-widest group-hover:text-[#D7E2EA] transition-colors">
              Every moment. Find yours.
            </span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-[400px] w-full mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-black uppercase tracking-tight mb-2 text-[#D7E2EA]">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h1>
              <p className="text-sm font-light text-[#D7E2EA]/50 uppercase tracking-wider">
                {isLogin ? 'Sign in to continue to your account' : 'Sign up to start sharing your memories'}
              </p>
            </div>

            {/* Role Toggle */}
            <div className="flex items-center gap-6 mb-8 text-xs font-bold uppercase tracking-widest">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  userType === 'photographer' ? "border-[#D7E2EA]" : "border-white/20 group-hover:border-white/40"
                )}>
                  {userType === 'photographer' && <div className="w-2.5 h-2.5 rounded-full bg-[#D7E2EA] shadow-[0_0_10px_rgba(215,226,234,0.5)]" />}
                </div>
                <input 
                  type="radio" 
                  className="hidden" 
                  checked={userType === 'photographer'} 
                  onChange={() => setUserType('photographer')} 
                />
                <span className={cn("transition-colors", userType === 'photographer' ? "text-[#D7E2EA]" : "text-[#D7E2EA]/40 group-hover:text-[#D7E2EA]/60")}>
                  Photographer
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  userType === 'guest' ? "border-[#D7E2EA]" : "border-white/20 group-hover:border-white/40"
                )}>
                  {userType === 'guest' && <div className="w-2.5 h-2.5 rounded-full bg-[#D7E2EA] shadow-[0_0_10px_rgba(215,226,234,0.5)]" />}
                </div>
                <input 
                  type="radio" 
                  className="hidden" 
                  checked={userType === 'guest'} 
                  onChange={() => setUserType('guest')} 
                />
                <span className={cn("transition-colors", userType === 'guest' ? "text-[#D7E2EA]" : "text-[#D7E2EA]/40 group-hover:text-[#D7E2EA]/60")}>
                  Guest
                </span>
              </label>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl text-xs font-bold uppercase tracking-wider text-center">
                {error}
              </div>
            )}

            {/* Custom Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/60 ml-1">Full Name</label>
                  <div className="relative group/input">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-[#D7E2EA]/20 to-transparent rounded-2xl blur opacity-0 group-focus-within/input:opacity-100 transition duration-500" />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <div className="w-4 h-4 text-[#D7E2EA]/40 border-2 border-current rounded-full" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Enter your name" 
                      required={!isLogin}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="relative w-full pl-12 pr-4 py-3.5 bg-[#1A1A1A] border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#D7E2EA]/50 transition-all shadow-inner text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 font-light z-0"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/60 ml-1">Email address</label>
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-[#D7E2EA]/20 to-transparent rounded-2xl blur opacity-0 group-focus-within/input:opacity-100 transition duration-500" />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Mail className="w-4 h-4 text-[#D7E2EA]/40" />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="relative w-full pl-12 pr-4 py-3.5 bg-[#1A1A1A] border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#D7E2EA]/50 transition-all shadow-inner text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 font-light z-0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1 mr-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#D7E2EA]/60">Password</label>
                  {isLogin && (
                    <a href="#" className="text-[10px] font-bold uppercase tracking-wider text-[#D7E2EA] hover:text-white transition-colors">Forgot?</a>
                  )}
                </div>
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-[#D7E2EA]/20 to-transparent rounded-2xl blur opacity-0 group-focus-within/input:opacity-100 transition duration-500" />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Lock className="w-4 h-4 text-[#D7E2EA]/40" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="relative w-full pl-12 pr-12 py-3.5 bg-[#1A1A1A] border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#D7E2EA]/50 transition-all shadow-inner text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 font-light z-0"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#D7E2EA]/40 hover:text-[#D7E2EA] transition-colors z-10"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="group relative w-full h-14 bg-[#D7E2EA] hover:bg-white text-[#0C0C0C] font-black uppercase tracking-widest rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100 shadow-[0_0_30px_rgba(215,226,234,0.15)]"
                >
                  {/* Internal animated gradient for the button */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign in' : 'Create account')}
                  </span>
                </button>
              </div>
            </form>

            <p className="text-center text-xs text-[#D7E2EA]/40 mt-8 font-light uppercase tracking-widest">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }} 
                className="text-[#D7E2EA] font-black ml-1 hover:text-white transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </motion.div>

        {/* Right Side: Visuals */}
        <motion.div 
          layout 
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="hidden lg:flex w-[55%] bg-[#0C0C0C] h-full relative p-16 flex-col overflow-hidden z-0"
        >
          
          {/* Full-bleed Carousel Background */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={CAROUSEL_IMAGES[currentImage]}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Event Photography"
              />
            </AnimatePresence>
            {/* Dark gradient overlays for text legibility */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r",
              isLogin ? "from-[#0C0C0C] via-[#0C0C0C]/50 to-transparent" : "from-transparent via-[#0C0C0C]/50 to-[#0C0C0C]"
            )} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0C]/80 via-transparent to-[#0C0C0C]/90" />
          </div>
          
          <motion.div layout transition={{ type: "spring", damping: 25, stiffness: 200 }} className="relative z-10 max-w-lg mb-8 mt-0">
            <h2 className="hero-heading font-black uppercase tracking-tight leading-[0.9] mb-6 text-4xl xl:text-5xl drop-shadow-2xl">
              Bringing people closer to their memories through the power of AI.
            </h2>
            <div className="flex items-center gap-4 text-[#D7E2EA] font-semibold text-lg uppercase tracking-widest drop-shadow-lg">
              <div className="w-8 h-[1px] bg-white/40" />
              One selfie. Every moment you're in.
            </div>
          </motion.div>

          {/* Photographer Profile */}
          <div className="flex items-center gap-4 relative z-10 mt-auto mb-10 bg-black/40 backdrop-blur-md p-4 rounded-3xl border border-white/10 w-fit">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-[#111111] border border-white/20 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80" alt="Rohan Mehta" className="w-full h-full object-cover grayscale" />
            </div>
            <div>
              <div className="font-black uppercase tracking-widest text-[#D7E2EA] text-sm">Rohan Mehta</div>
              <div className="text-[10px] text-[#D7E2EA]/70 font-bold uppercase tracking-widest">Wedding Photographer</div>
            </div>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
}