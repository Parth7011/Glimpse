import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Navbar, Footer } from '@/components/layout';
import { Magnet, FadeIn, AnimatedText, GradientButton } from '@/components/ui';
import Lenis from 'lenis';

// Data from prompt
const MARQUEE_IMAGES = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80",
  "https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=800&q=80",
  "https://images.unsplash.com/photo-1532712938736-59c727eb113e?w=800&q=80",
  "https://images.unsplash.com/photo-1470229722913-7c092fb12d8a?w=800&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
  "https://images.unsplash.com/photo-1530103862676-de3c9de59f9e?w=800&q=80",
  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
  "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
  "https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=800&q=80",
  "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80"
];

const PROJECTS = [
  {
    id: '01', category: 'Wedding Photography', name: 'Aarav & Meera',
    img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
    img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
    img3: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85'
  },
  {
    id: '02', category: 'Corporate Events', name: 'Tech Summit 2026',
    img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
    img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
    img3: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85'
  },
  {
    id: '03', category: 'Parties & Galas', name: 'Annual Charity Gala',
    img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
    img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
    img3: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85'
  }
];

// Helper components
const LiveProjectButton = () => (
  <button className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 transition-colors">
    Live Project
  </button>
);

export default function LandingPage() {
  const [scrollOffset, setScrollOffset] = useState(0);
  const marqueeRef = useRef(null);
  
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const handleScroll = () => {
      if (marqueeRef.current) {
        const rect = marqueeRef.current.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        setScrollOffset((window.scrollY - top + window.innerHeight) * 0.3);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Row 1 & 2 for marquee
  const row1 = [...MARQUEE_IMAGES.slice(0, 11), ...MARQUEE_IMAGES.slice(0, 11), ...MARQUEE_IMAGES.slice(0, 11)];
  const row2 = [...MARQUEE_IMAGES.slice(11), ...MARQUEE_IMAGES.slice(11), ...MARQUEE_IMAGES.slice(11)];

  return (
    <div className="bg-[#0C0C0C] min-h-screen text-[#D7E2EA] font-kanit overflow-x-clip selection:bg-[#D7E2EA] selection:text-[#0C0C0C]">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[100dvh] flex flex-col overflow-x-clip pt-24 md:pt-18 pb-8">
        {/* Simple Navbar override */}
        <Navbar theme="dark" activePage="home" />

        {/* Hero Heading */}
        <div className="flex-1 flex flex-col justify-center items-center w-full relative z-10 overflow-hidden">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="hero-heading font-black uppercase tracking-tight leading-[0.85] w-full text-center text-[12vw] sm:text-[13vw] md:text-[14vw] lg:text-[14vw]"
          >
            every moment.<br />find yours.
          </motion.h1>
        </div>

        {/* Hero Portrait with Magnet */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0"
        >
          <Magnet padding={150} strength={3}>
            <div className="w-[200px] sm:w-[260px] md:w-[320px] lg:w-[380px]">
              <img 
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" 
                alt="Event photographer"
                className="w-full h-auto object-cover rounded-[40px] border-4 border-[#0C0C0C] shadow-2xl"
                style={{ filter: 'grayscale(100%) contrast(1.2)' }}
              />
            </div>
          </Magnet>
        </motion.div>

        {/* Bottom Bar */}
        <div className="px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 flex justify-between items-end z-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            an ai-powered platform driven by face recognition to help guests find their photos with a single selfie.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Link to={ROUTES.LOGIN}>
              <GradientButton>START FREE</GradientButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. MARQUEE SECTION */}
      <section ref={marqueeRef} className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-3">
        <div 
          className="flex gap-3 whitespace-nowrap will-change-transform w-max"
          style={{ transform: `translate3d(${scrollOffset - 200}px, 0, 0)` }}
        >
          {row1.map((src, i) => (
            <img key={`r1-${i}`} src={src} alt="Event mock" loading="lazy" className="w-[420px] h-[270px] rounded-2xl object-cover shrink-0" />
          ))}
        </div>
        <div 
          className="flex gap-3 whitespace-nowrap will-change-transform w-max"
          style={{ transform: `translate3d(${-(scrollOffset - 200)}px, 0, 0)` }}
        >
          {row2.map((src, i) => (
            <img key={`r2-${i}`} src={src} alt="Event mock" loading="lazy" className="w-[420px] h-[270px] rounded-2xl object-cover shrink-0" />
          ))}
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section id="about" className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden bg-[#0C0C0C]">
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%]">
          <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" className="w-[120px] sm:w-[160px] md:w-[210px] drop-shadow-xl" alt="moon" />
        </FadeIn>
        
        <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]">
          <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png" className="w-[100px] sm:w-[140px] md:w-[180px] drop-shadow-xl" alt="3d object" />
        </FadeIn>

        <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%]">
          <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" className="w-[120px] sm:w-[160px] md:w-[210px] drop-shadow-xl" alt="lego" />
        </FadeIn>

        <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]">
          <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png" className="w-[130px] sm:w-[170px] md:w-[220px] drop-shadow-xl" alt="3d group" />
        </FadeIn>

        <FadeIn delay={0} y={40} className="w-full flex flex-col items-center gap-10 sm:gap-14 md:gap-16 relative z-10">
          <h2 
            className="hero-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            About Glimpse
          </h2>
          
          <div className="max-w-[560px] mx-auto text-center font-medium leading-relaxed" style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}>
            <AnimatedText text="Instead of manually sorting photos or sending generic cloud links where guests have to scroll through hundreds of images, photographers use Glimpse. Guests simply open a link, take a selfie, and instantly see every photo they appear in. Let's deliver memories instantly!" />
          </div>

          <div className="mt-16 sm:mt-20 md:mt-24">
            <Link to={ROUTES.LOGIN}>
              <GradientButton>Start Free</GradientButton>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* 4. SERVICES SECTION */}
      <section id="features" className="bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-20 shadow-2xl">
        <h2 
          className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Features
        </h2>

        <div className="max-w-5xl mx-auto flex flex-col">
          {[
            { id: "01", name: "Instant Matching", desc: "Guests take a selfie, give consent, and instantly find all matching photos (solo and group)." },
            { id: "02", name: "Photographer Dashboard", desc: "Create events and upload event photos in bulk with easy organization." },
            { id: "03", name: "Frictionless Access", desc: "A frictionless experience for guests. No app installation or account creation required." },
            { id: "04", name: "Secure Delivery", desc: "Shareable links and QR codes that keep your studio visible and photos secure." },
            { id: "05", name: "Bulk Downloads", desc: "Guests can download individual photos or a bulk ZIP of all their matches instantly." }
          ].map((item, i) => (
            <FadeIn key={item.id} delay={i * 0.1} y={20}>
              <div className="flex flex-col md:flex-row border-b border-[#0C0C0C]/15 py-8 sm:py-10 md:py-12 group hover:bg-[#0C0C0C]/5 transition-colors px-4 rounded-xl">
                <div 
                  className="font-black md:w-[35%] tracking-tight"
                  style={{ fontSize: 'clamp(3rem, 10vw, 140px)', lineHeight: 0.8 }}
                >
                  {item.id}
                </div>
                <div className="flex flex-col justify-center md:w-[65%] mt-4 md:mt-0">
                  <h3 className="font-medium uppercase mb-2" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
                    {item.name}
                  </h3>
                  <p className="font-light leading-relaxed max-w-2xl opacity-60" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 5. PROJECTS SECTION */}
      <section id="usecases" className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-30 pt-20 sm:pt-24 md:pt-32 pb-40">
        <h2 
          className="hero-heading font-black uppercase text-center mb-16 sm:mb-20 md:mb-28 px-5"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Use Cases
        </h2>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10 flex flex-col items-center">
          {PROJECTS.map((project, index) => {
            const cardRef = useRef(null);
            const { scrollYProgress } = useScroll({
              target: cardRef,
              offset: ["start end", "end start"]
            });
            const totalCards = PROJECTS.length;
            const targetScale = 1 - (totalCards - 1 - index) * 0.03;
            // A simple scale mapping. As you scroll past this card, it scales down slightly.
            const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
            
            return (
              <motion.div
                key={project.id}
                ref={cardRef}
                style={{
                  top: `calc(6rem + ${index * 28}px)`, // top-24 md:top-32 approx
                  scale
                }}
                className="sticky overflow-hidden w-full border-2 border-[#D7E2EA] bg-[#0C0C0C] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] p-4 sm:p-6 md:p-8 mb-16 md:mb-24 shadow-2xl"
              >
                {/* Top Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12">
                  <div className="flex items-end gap-6 mb-6 md:mb-0">
                    <span className="font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>{project.id}</span>
                    <div className="pb-2 md:pb-4">
                      <p className="text-[#D7E2EA]/60 uppercase tracking-widest text-sm mb-1">{project.category}</p>
                      <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold">{project.name}</h3>
                    </div>
                  </div>
                  <LiveProjectButton />
                </div>

                {/* Bottom Row Images */}
                <div className="flex flex-col md:flex-row gap-4 h-[auto] md:h-[60vh] max-h-[800px]">
                  {/* Left Column */}
                  <div className="flex flex-col gap-4 w-full md:w-[40%]">
                    <div 
                      className="w-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden bg-[#1A1A1A]"
                      style={{ height: 'clamp(130px, 16vw, 230px)' }}
                    >
                      <img src={project.img1} alt="Project preview 1" className="w-full h-full object-cover" />
                    </div>
                    <div 
                      className="w-full flex-1 rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden bg-[#1A1A1A]"
                      style={{ height: 'clamp(160px, 22vw, 340px)' }}
                    >
                      <img src={project.img2} alt="Project preview 2" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="w-full md:w-[60%] h-[300px] md:h-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden bg-[#1A1A1A]">
                    <img 
                      src={project.img3} 
                      alt="Project preview 3" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer from Layout */}
      <Footer />
    </div>
  );
}
