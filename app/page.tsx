"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

// Dynamic import for Spline to avoid SSR issues
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
    </div>
  ),
});

// ============================================
// INTERACTIVE BACKGROUND COMPONENT - WITH PARALLAX
// ============================================
function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const scrollRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const scrollVelocityRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Particle configuration - enhanced visibility
    const PARTICLE_COUNT = 45;
    const MAX_SPEED = 0.08;
    const INFLUENCE_RADIUS = 180;
    const INFLUENCE_STRENGTH = 0.35;

    // Initialize particles with organic positions and parallax depth layers
    const initParticles = () => {
      const particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * MAX_SPEED * 0.5,
          vy: (Math.random() - 0.5) * MAX_SPEED * 0.5,
          size: 1.8 + Math.random() * 2.2,
          opacity: 0.25 + Math.random() * 0.25,
          baseX: x,
          baseY: y,
          depth: 0.3 + Math.random() * 0.7,
          parallaxOffset: 0,
          influence: 0,
        });
      }
      return particles;
    };

    particlesRef.current = initParticles();

    // Handle mouse movement with lerp smoothing
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;
    let currentMouseX = width / 2;
    let currentMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      targetMouseX = width / 2;
      targetMouseY = height / 2;
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollYRef.current;
      scrollVelocityRef.current = delta * 0.3;
      scrollRef.current = currentScroll;
      lastScrollYRef.current = currentScroll;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll);

    // Resize handler with particle repositioning
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      particlesRef.current.forEach((particle: any) => {
        if (particle.baseX > width) {
          particle.baseX = Math.random() * width;
          particle.x = particle.baseX;
        }
        if (particle.baseY > height) {
          particle.baseY = Math.random() * height;
          particle.y = particle.baseY;
        }
        particle.x = Math.min(width, Math.max(0, particle.x));
        particle.y = Math.min(height, Math.max(0, particle.y));
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Animation loop with lerp smoothing and parallax
    const animate = () => {
      if (!ctx || !canvas) return;

      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;

      scrollVelocityRef.current *= 0.95;
      
      const scrollFactor = scrollRef.current * 0.0008;
      const velocityFactor = scrollVelocityRef.current * 0.002;
      timeRef.current += 0.003;

      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((particle: any) => {
        let influenceX = 0;
        let influenceY = 0;

        if (mouseRef.current.active) {
          const dx = particle.x - currentMouseX;
          const dy = particle.y - currentMouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < INFLUENCE_RADIUS) {
            const strength = (1 - distance / INFLUENCE_RADIUS) * INFLUENCE_STRENGTH;
            const angle = Math.atan2(dy, dx);
            influenceX = Math.cos(angle) * strength;
            influenceY = Math.sin(angle) * strength;
          }
        }

        const driftX = Math.sin(timeRef.current * 0.3 + particle.baseX * 0.002) * 0.06;
        const driftY = Math.cos(timeRef.current * 0.4 + particle.baseY * 0.002) * 0.06;

        particle.vx += (driftX - particle.vx) * 0.02;
        particle.vy += (driftY - particle.vy) * 0.02;

        particle.vx += (influenceX - particle.vx) * 0.05;
        particle.vy += (influenceY - particle.vy) * 0.05;

        particle.x += particle.vx;
        particle.y += particle.vy;

        const parallaxStrength = particle.depth * 12;
        const scrollParallax = scrollFactor * parallaxStrength;
        const velocityParallax = velocityFactor * parallaxStrength;
        
        const targetX = particle.baseX + scrollParallax + velocityParallax;
        const targetY = particle.baseY + (scrollParallax * 0.3) + (velocityParallax * 0.3);

        const returnStrength = 0.003;
        particle.vx += (targetX - particle.x) * returnStrength;
        particle.vy += (targetY - particle.y) * returnStrength;

        const breathIntensity = 0.3 + particle.depth * 0.5;
        const breathX = Math.sin(timeRef.current * 0.8 * particle.depth) * 0.03 * breathIntensity;
        const breathY = Math.cos(timeRef.current * 0.7 * particle.depth) * 0.03 * breathIntensity;
        particle.vx += breathX;
        particle.vy += breathY;

        if (particle.x < 0) {
          particle.x = 0;
          particle.vx *= -0.2;
        }
        if (particle.x > width) {
          particle.x = width;
          particle.vx *= -0.2;
        }
        if (particle.y < 0) {
          particle.y = 0;
          particle.vy *= -0.2;
        }
        if (particle.y > height) {
          particle.y = height;
          particle.vy *= -0.2;
        }

        const opacity = particle.opacity * (0.7 + Math.sin(timeRef.current * 0.5 + particle.x * 0.01) * 0.15);
        
        ctx.beginPath();
        
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 1.5
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity * 0.4})`);
        
        ctx.fillStyle = gradient;
        ctx.arc(particle.x, particle.y, particle.size * 0.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.7})`;
        ctx.arc(particle.x, particle.y, particle.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none" // ✅ Modificado: pointer-events-none
      style={{
        width: "100%",
        height: "100%",
        opacity: 1,
        willChange: "transform",
      }}
    />
  );
}

// ============================================
// MOUSE LIGHT COMPONENT - ENHANCED INTENSITY
// ============================================
function MouseLight() {
  const ref = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMove);

    const animate = () => {
      current.current.x += (mouse.current.x - current.current.x) * 0.08;
      current.current.y += (mouse.current.y - current.current.y) * 0.08;

      if (ref.current) {
        ref.current.style.background = `
          radial-gradient(
            900px at ${current.current.x}px ${current.current.y}px,
            rgba(255,255,255,0.18),
            rgba(255,255,255,0.08) 35%,
            transparent 65%
          )
        `;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return <div className="fixed inset-0 z-50 pointer-events-none" ref={ref} />; // ✅ Modificado: pointer-events-none
}

// ============================================
// NAVIGATION COMPONENT
// ============================================
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Studio", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Work", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <a href="#hero" className="relative z-10 pointer-events-auto"> {/* ✅ Modificado: pointer-events-auto */}
            <Image
              src="/logo.png"
              alt="Trinity 3D"
              width={160}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </a>

          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-light text-white/70 hover:text-white transition-colors duration-200 tracking-wide pointer-events-auto" // ✅ Modificado: pointer-events-auto
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 pointer-events-auto" // ✅ Modificado: pointer-events-auto
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="flex flex-col space-y-6 px-6 py-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white text-lg font-light transition-colors pointer-events-auto" // ✅ Modificado: pointer-events-auto
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

// ============================================
// HERO SECTION WITH INTERACTIVE SPLINE MODEL
// ============================================
function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const splineRef = useRef<any>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.98]);

  // ✅ Montaje en cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Spline 3D Background - Interactive */}
      <motion.div 
        style={{ y, scale }} 
        className="absolute inset-0 z-0"
      >
        {/* ✅ Spline solo se renderiza en cliente con archivo local */}
        {mounted && (
          <Spline
            ref={splineRef}
            scene="/scene.splinecode"
            className="w-full h-full object-cover"
            style={{
              width: "100%",
              height: "100%",
              opacity: 0.75,
            }}
          />
        )}
        {/* Dark overlay - MUST be pointer-events-none */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 pointer-events-none" /> {/* ✅ Modificado: pointer-events-none */}
      </motion.div>

      {/* Content - All interactive elements need pointer-events-auto */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center pointer-events-none" // ✅ Modificado: contenedor principal no captura eventos
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="pointer-events-none" // ✅ Modificado: el contenido no captura eventos
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-6xl md:text-7xl lg:text-8xl font-light text-white mb-6 tracking-tight"
          >
            Digital Engineering
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-xl md:text-2xl text-white/70 mb-8 max-w-2xl mx-auto font-light"
          >
            High-fidelity 3D visualization, AI-driven simulations, and immersive experiences
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-base md:text-lg text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Trinity 3D transforms the way industries design, visualize, and interact with projects
            through advanced 3D modeling, artificial intelligence, and extended reality technologies.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-medium transition-all duration-300 group pointer-events-auto" // ✅ Modificado: el botón SÍ captura eventos
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              Start a Project
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - No debe capturar eventos */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none" // ✅ Modificado: pointer-events-none
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-px h-16 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ============================================
// SECTION CONTAINER
// ============================================
function SectionContainer({
  id,
  children,
  className = "",
  dark = false,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id={id}
      ref={ref}
      className={`py-24 md:py-32 ${dark ? "bg-black" : "bg-[#0A0A0A]"} ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-[1200px] mx-auto px-6 md:px-12"
      >
        {children}
      </motion.div>
    </section>
  );
}

// ============================================
// SECTION HEADER
// ============================================
function SectionHeader({
  label,
  title,
  description,
  centered = true,
}: {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className={`mb-16 ${centered ? "text-center" : "text-left"}`}>
      {label && (
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xs font-light tracking-[0.2em] text-white/40 uppercase mb-4 block"
        >
          {label}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6 leading-tight tracking-tight"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`text-lg text-white/60 leading-relaxed max-w-2xl ${centered ? "mx-auto" : ""}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

// ============================================
// ABOUT SECTION
// ============================================
function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <SectionContainer id="about" dark={false}>
      <div className="max-w-3xl mx-auto text-center">
        <SectionHeader
          label="WHO WE ARE"
          title="A Technological Ecosystem"
          description="Trinity 3D enables companies to simulate and visualize projects before execution, reducing risks, optimizing resources, and improving strategic decision-making."
        />
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6 text-white/60 text-lg leading-relaxed"
        >
          <p>
            We are architects of digital experiences that bridge the gap between imagination and reality.
            Our expertise spans architecture, real estate, industry, and digital development, delivering
            intelligent and immersive technological solutions.
          </p>
          <p>
            By combining high-fidelity visualization with advanced simulation capabilities, we help
            businesses transform how they approach planning, design, and customer engagement.
          </p>
        </motion.div>
      </div>
    </SectionContainer>
  );
}

// ============================================
// SERVICES SECTION
// ============================================
function ServicesSection() {
  const services = [
    {
      title: "3D Visualization",
      description:
        "Photorealistic renderings, virtual tours, and interactive presentations that bring unbuilt environments to life with cinematic detail.",
    },
    {
      title: "Digital Twins",
      description:
        "Real-time synchronized replicas for monitoring, simulation, and predictive maintenance across industrial and architectural systems.",
    },
    {
      title: "Extended Reality",
      description:
        "VR, AR, and MR solutions that merge digital and physical worlds, enabling immersive training, visualization, and remote collaboration.",
    },
    {
      title: "AI Integration",
      description:
        "Generative workflows, automation, and intelligent analytics embedded into your 3D ecosystem for enhanced efficiency and insights.",
    },
  ];

  return (
    <SectionContainer id="services" dark={true}>
      <SectionHeader
        label="WHAT WE CREATE"
        title="Core Capabilities"
        description="Specialized services that transform complex ideas into immersive digital experiences"
      />
      <div className="grid md:grid-cols-2 gap-12 mt-12">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group"
          >
            <div className="border-t border-white/10 pt-8">
              <h3 className="text-2xl font-light text-white mb-4 tracking-tight">
                {service.title}
              </h3>
              <p className="text-white/60 leading-relaxed">{service.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}

// ============================================
// PROJECTS SECTION
// ============================================
function ProjectsSection() {
  const { scrollYProgress } = useScroll();
  
  const projects = [
    {
      title: "Virtual Real Estate",
      description:
        "Pre-construction walkthroughs and interactive sales tools that reduce time-to-close and increase buyer confidence through immersive property experiences.",
      image: "/img1.png",
      alt: "Virtual real estate visualization",
    },
    {
      title: "Industrial Simulation",
      description:
        "Digital twin ecosystems for manufacturing lines, enabling real-time analytics, predictive maintenance, and scenario testing without operational downtime.",
      image: "/img2.png",
      alt: "Industrial simulation digital twin",
    },
    {
      title: "Augmented Reality",
      description:
        "On-site overlays for maintenance, remote assistance, and product visualization that blend digital context seamlessly with physical reality.",
      image: "/img3.png",
      alt: "Augmented reality experience",
    },
  ];

  return (
    <SectionContainer id="projects" dark={false}>
      <SectionHeader
        label="SELECTED WORK"
        title="Immersive Solutions in Practice"
        description="Real-world applications that demonstrate our commitment to precision and innovation"
      />
      <div className="space-y-24">
        {projects.map((project, index) => {
          const imageParallax = useTransform(scrollYProgress, [0, 1], [0, index % 2 === 0 ? -30 : 30]);
          
          return (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className={`grid md:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <motion.div
                style={{ y: imageParallax }}
                className={`relative ${index % 2 === 1 ? "md:order-2" : ""}`}
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/5">
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </motion.div>
              <div className={index % 2 === 1 ? "md:order-1" : ""}>
                <h3 className="text-2xl md:text-3xl font-light text-white mb-6 tracking-tight">
                  {project.title}
                </h3>
                <p className="text-white/60 text-lg leading-relaxed">{project.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionContainer>
  );
}

// ============================================
// INDUSTRIES SECTION
// ============================================
function IndustriesSection() {
  const industries = [
    "Architecture & Real Estate",
    "Manufacturing & Industry",
    "Healthcare & Medicine",
    "Education & Training",
    "Gaming & Entertainment",
    "Retail & E-commerce",
  ];

  return (
    <SectionContainer id="industries" dark={true}>
      <SectionHeader
        label="SECTORS WE TRANSFORM"
        title="Industries We Serve"
        description="Across diverse sectors, our technology delivers measurable impact and innovation"
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-12">
        {industries.map((industry, index) => (
          <motion.div
            key={industry}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="border border-white/10 rounded-xl p-6 text-center hover:border-white/30 transition-all duration-300"
          >
            <p className="text-white/80 font-light">{industry}</p>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}

// ============================================
// TECHNOLOGY SECTION
// ============================================
function TechnologySection() {
  const technologies = [
    {
      name: "Unreal Engine",
      image: "/img4.png",
      description: "Real-time rendering engine for photorealistic experiences",
    },
    {
      name: "Unity",
      image: "/img5.png",
      description: "Cross-platform development for interactive applications",
    },
  ];

  return (
    <SectionContainer id="technology" dark={false}>
      <SectionHeader
        label="TECHNOLOGY STACK"
        title="Our Foundation"
        description="Built on industry-leading platforms and cutting-edge tools"
      />
      <div className="grid md:grid-cols-2 gap-12 mt-12">
        {technologies.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group"
          >
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-white/5 mb-6">
              <Image
                src={tech.image}
                alt={tech.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <h3 className="text-2xl font-light text-white mb-3">{tech.name}</h3>
            <p className="text-white/60 leading-relaxed">{tech.description}</p>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-12 max-w-3xl mx-auto text-center"
      >
        <p className="text-white/60 text-lg leading-relaxed">
          Our workflow integrates AI-driven automation and high-fidelity pipelines to deliver
          consistent, scalable results across industries. We combine real-time rendering engines
          with intelligent systems to create experiences that respond instantly while maintaining
          exceptional visual quality.
        </p>
      </motion.div>
    </SectionContainer>
  );
}

// ============================================
// CONTACT SECTION
// ============================================
function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message. We'll be in touch soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  const formRef = useRef(null);
  const isFormInView = useInView(formRef, { once: true, amount: 0.3 });

  return (
    <SectionContainer id="contact" dark={true}>
      <div ref={formRef} className="max-w-4xl mx-auto">
        <SectionHeader
          label="GET IN TOUCH"
          title="Let's Create Together"
          description="Ready to transform your vision into an immersive digital experience?"
        />
        <div className="grid md:grid-cols-2 gap-16 mt-12">
          <motion.form
            initial={{ opacity: 0, x: -30 }}
            animate={isFormInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <div>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent border-b border-white/20 focus:border-white/60 py-3 text-white placeholder-white/40 outline-none transition-colors"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-transparent border-b border-white/20 focus:border-white/60 py-3 text-white placeholder-white/40 outline-none transition-colors"
                required
              />
            </div>
            <div>
              <textarea
                rows={4}
                placeholder="Tell us about your project"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-transparent border-b border-white/20 focus:border-white/60 py-3 text-white placeholder-white/40 outline-none transition-colors resize-none"
                required
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-white/90 transition-all duration-300 group"
            >
              Send Message
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isFormInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-white text-xl font-light mb-4">Contact Information</h3>
              <motion.a
                href="mailto:annya@trinity3d.online"
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 text-white/60 hover:text-white transition-colors group"
              >
                <Mail className="w-5 h-5" />
                <span className="font-light">annya@trinity3d.online</span>
              </motion.a>
              <motion.a
                href="tel:+573045658688"
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 text-white/60 hover:text-white transition-colors group"
              >
                <Phone className="w-5 h-5" />
                <span className="font-light">+57 304 565 8688</span>
              </motion.a>
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 text-white/60"
              >
                <MapPin className="w-5 h-5" />
                <span className="font-light">Medellín, Colombia</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionContainer>
  );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-black border-t border-white/5 py-12"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Image
              src="/logo.png"
              alt="Trinity 3D"
              width={140}
              height={42}
              className="h-10 w-auto object-contain mb-4"
            />
            <p className="text-white/40 text-sm">
              Digital engineering studio
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-white/40 text-sm">
              © 2024 Trinity 3D. All rights reserved.
            </p>
            <a
              href="https://trinity3d.online"
              className="text-white/40 hover:text-white/60 text-sm transition-colors"
            >
              trinity3d.online
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function HomePage() {
  return (
    <main className="bg-black text-white overflow-x-hidden relative">
      <InteractiveBackground />
      <MouseLight />
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <IndustriesSection />
      <TechnologySection />
      <ContactSection />
      <Footer />
    </main>
  );
}