"use client";

import React from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight, Menu, X } from "lucide-react";

// ---------- Cinematic Background Canvas (glowing particles + mouse light) ----------
function CinematicBackground() {
  const canvasRef = React.useRef(null);
  const mouseRef = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      // regenerate particles on resize
      particles = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1.2,
        opacity: Math.random() * 0.4 + 0.15,
        speed: Math.random() * 0.4 + 0.1,
      }));
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Mouse light glow (warmer)
      if (mouseRef.current.x && mouseRef.current.y) {
        const grad = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y + window.scrollY,
          0,
          mouseRef.current.x,
          mouseRef.current.y + window.scrollY,
          500
        );
        grad.addColorStop(0, "rgba(255, 210, 120, 0.12)");
        grad.addColorStop(0.5, "rgba(255, 160, 70, 0.06)");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // floating particles
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 120, ${p.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return React.createElement("canvas", {
    ref: canvasRef,
    className: "fixed inset-0 pointer-events-none",
    style: { zIndex: 0 },
  });
}

// Volumetric ambient lights (more premium visible beams)
function AmbientLight() {
  return React.createElement(
    "div",
    {
      className: "fixed inset-0 pointer-events-none overflow-hidden",
      style: { zIndex: 0 },
    },
    [
      React.createElement("div", {
        key: "top",
        className: "absolute -top-32 left-1/2 -translate-x-1/2 w-[1200px] h-[800px]",
        style: {
          background:
            "radial-gradient(ellipse at center, rgba(255, 200, 100, 0.2) 0%, rgba(255, 150, 50, 0.1) 30%, transparent 70%)",
        },
      }),
      React.createElement("div", {
        key: "right",
        className: "absolute top-1/4 -right-32 w-[600px] h-[600px]",
        style: {
          background:
            "radial-gradient(circle, rgba(255, 180, 80, 0.18) 0%, rgba(255, 120, 40, 0.08) 40%, transparent 70%)",
        },
      }),
      React.createElement("div", {
        key: "bottom",
        className: "absolute -bottom-32 left-1/3 w-[800px] h-[400px]",
        style: {
          background:
            "radial-gradient(ellipse at center, rgba(255, 190, 100, 0.14) 0%, rgba(255, 140, 60, 0.07) 40%, transparent 70%)",
        },
      }),
      React.createElement("div", {
        key: "center",
        className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]",
        style: {
          background:
            "radial-gradient(circle, rgba(255, 220, 150, 0.12) 0%, rgba(255, 160, 70, 0.06) 50%, transparent 80%)",
        },
      }),
    ]
  );
}

// Navigation with transparency & logo text (premium)
function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  return React.createElement(
    motion.header,
    {
      initial: { y: -100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
      className: `fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-[#1D1D1D]/80 backdrop-blur-xl py-4"
          : "py-6"
      }`,
    },
    React.createElement(
      "nav",
      { className: "max-w-6xl mx-auto px-8 flex items-center justify-between" },
      React.createElement(
        "a",
        { href: "#hero", className: "flex items-center" },
        React.createElement(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 1 },
          },
          React.createElement(
            "div",
            { className: "text-2xl font-light tracking-tight text-[#F7F6F4]" },
            React.createElement(
              "span",
              { className: "font-semibold tracking-wide" },
              "TRINITY"
            ),
            React.createElement(
              "span",
              { className: "text-[#E5B87B] ml-1" },
              "3D"
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "hidden lg:flex items-center gap-10" },
        navItems.map((item) =>
          React.createElement(
            "a",
            {
              key: item.label,
              href: item.href,
              className:
                "text-[#D7D8D8] hover:text-[#F7F6F4] transition-colors duration-300 text-sm tracking-wide",
            },
            item.label
          )
        )
      ),
      React.createElement(
        "button",
        {
          className: "lg:hidden text-[#F7F6F4] p-2",
          onClick: () => setIsOpen(!isOpen),
          "aria-label": isOpen ? "Cerrar menu" : "Abrir menu",
        },
        isOpen
          ? React.createElement(X, { size: 24 })
          : React.createElement(Menu, { size: 24 })
      )
    ),
    isOpen &&
      React.createElement(
        motion.div,
        {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          className:
            "lg:hidden bg-[#1D1D1D]/95 backdrop-blur-md border-t border-[#4D4749]/30",
        },
        React.createElement(
          "div",
          {
            className:
              "max-w-6xl mx-auto px-8 py-8 flex flex-col gap-6",
          },
          navItems.map((item) =>
            React.createElement(
              "a",
              {
                key: item.label,
                href: item.href,
                className:
                  "text-[#D7D8D8] hover:text-[#F7F6F4] transition-colors text-lg",
                onClick: () => setIsOpen(false),
              },
              item.label
            )
          )
        )
      )
  );
}

// Hero Section with video background + parallax + enhanced premium typography
function HeroSection() {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return React.createElement(
    "section",
    {
      id: "hero",
      className:
        "relative min-h-screen flex items-center justify-center overflow-hidden",
    },
    React.createElement(
      motion.div,
      { style: { y: yBg }, className: "absolute inset-0 z-0 overflow-hidden" },
      React.createElement(
        "video",
        {
          autoPlay: true,
          loop: true,
          muted: true,
          playsInline: true,
          className: "w-full h-full object-cover opacity-70",
        },
        React.createElement("source", { src: "/hero.mp4", type: "video/mp4" })
      )
    ),
    React.createElement("div", {
      className:
        "absolute inset-0 z-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90",
    }),
    React.createElement("div", {
      className:
        "absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,210,130,0.08)_0%,transparent_70%)]",
    }),
    React.createElement(
      "div",
      { className: "absolute inset-0 z-0 pointer-events-none" },
      React.createElement("div", {
        className:
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px]",
        style: {
          background:
            "radial-gradient(ellipse at center, rgba(255, 200, 100, 0.25) 0%, rgba(255, 150, 50, 0.12) 30%, transparent 70%)",
        },
      }),
      React.createElement("div", {
        className:
          "absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]",
        style: {
          background:
            "linear-gradient(180deg, rgba(255, 200, 100, 0.2) 0%, rgba(255, 150, 50, 0.08) 50%, transparent 100%)",
        },
      })
    ),
    React.createElement(
      motion.div,
      {
        style: { y: yText, opacity },
        className: "relative z-10 max-w-5xl mx-auto px-8 text-center",
      },
      React.createElement(
        motion.h1,
        {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
          className:
            "text-6xl md:text-8xl font-light tracking-tight leading-[0.9] text-[#F7F6F4] mb-10",
        },
        "TRINITY 3D"
      ),
      React.createElement(
        motion.p,
        {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] },
          className:
            "text-xl md:text-2xl text-[#e0e0e0] max-w-3xl mx-auto mb-14 leading-relaxed font-light tracking-wide",
        },
        "Immersive Digital Engineering"
      ),
      React.createElement(
        motion.p,
        {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.2, delay: 0.7 },
          className:
            "text-md md:text-lg text-[#C0C0C0] max-w-2xl mx-auto mb-12 leading-relaxed font-light",
        },
        "Trinity 3D is a technological ecosystem that transforms the way industries design, visualize and interact with their projects by integrating high-fidelity 3D modeling, artificial intelligence and extended reality technologies."
      ),
      React.createElement(
        motion.div,
        {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.2, delay: 0.9 },
        },
        React.createElement(
          "a",
          {
            href: "#contact",
            className:
              "inline-flex items-center gap-3 text-[#F7F6F4] border border-[#4D4749] hover:border-[#E5B87B] hover:bg-[#F7F6F4]/5 px-8 py-4 rounded-full transition-all duration-500 group",
          },
          React.createElement(
            "span",
            { className: "text-sm tracking-wide" },
            "Get Started"
          ),
          React.createElement(ArrowRight, {
            className: "w-4 h-4 group-hover:translate-x-1 transition-transform duration-300",
          })
        )
      )
    ),
    React.createElement(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 1.4 },
        className: "absolute bottom-12 left-1/2 -translate-x-1/2 z-10",
      },
      React.createElement("div", {
        className: "w-px h-16 bg-gradient-to-b from-[#E5B87B] to-transparent",
      })
    )
  );
}

// Section Divider (elegant)
function SectionDivider() {
  return React.createElement(
    "div",
    { className: "relative h-px max-w-3xl mx-auto my-8" },
    React.createElement("div", {
      className: "absolute inset-0",
      style: {
        background:
          "linear-gradient(90deg, transparent 0%, rgba(229,184,123,0.7) 50%, transparent 100%)",
      },
    })
  );
}

function ContentSection({ id, label, title, children, align = "left" }) {
  return React.createElement(
    "section",
    { id, className: "relative py-32 md:py-40" },
    React.createElement(
      motion.div,
      {
        initial: { opacity: 0, y: 60 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
        className: `max-w-4xl mx-auto px-8 ${
          align === "center" ? "text-center" : ""
        }`,
      },
      label &&
        React.createElement(
          "span",
          {
            className:
              "text-[#B87C4F] text-xs tracking-[0.3em] uppercase mb-6 block",
          },
          label
        ),
      title &&
        React.createElement(
          "h2",
          {
            className:
              "text-3xl md:text-4xl lg:text-5xl font-light text-[#F7F6F4] mb-12 leading-tight tracking-tight",
          },
          title
        ),
      React.createElement(
        "div",
        {
          className:
            "text-[#D7D8D8] text-lg md:text-xl leading-relaxed font-light space-y-8",
        },
        children
      )
    )
  );
}

function ProjectsSection() {
  const { scrollYProgress } = useScroll();
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const projects = [
    {
      title: "Virtual Real Estate",
      description:
        "Immersive property experiences that allow potential buyers and investors to walk through spaces before construction begins. Our virtual tours combine photorealistic rendering with interactive navigation, creating compelling presentations that accelerate decision-making and transform the sales process.",
      image: "/img1.png",
      alt: "Virtual real estate visualization",
    },
    {
      title: "Industrial Simulation",
      description:
        "Digital twin technology for manufacturing and industrial processes. We create precise virtual replicas of physical systems that enable predictive maintenance, process optimization, and risk-free experimentation with operational changes, reducing costs and improving efficiency across the production cycle.",
      image: "/img2.png",
      alt: "Industrial simulation digital twin",
    },
    {
      title: "Augmented Reality",
      description:
        "Solutions that overlay digital information onto the physical world, allowing customers to visualize products in their real environments. From furniture placement to complex machinery visualization, our AR experiences bridge the gap between digital catalogs and tangible reality.",
      image: "/img3.png",
      alt: "Augmented reality experience",
    },
  ];

  return React.createElement(
    "section",
    { id: "projects", className: "relative py-32 md:py-40" },
    React.createElement(
      motion.div,
      {
        initial: { opacity: 0, y: 60 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        className: "max-w-6xl mx-auto px-8",
      },
      React.createElement(
        "span",
        {
          className:
            "text-[#B87C4F] text-xs tracking-[0.3em] uppercase mb-6 block",
        },
        "Projects"
      ),
      React.createElement(
        "h2",
        {
          className:
            "text-3xl md:text-4xl lg:text-5xl font-light text-[#F7F6F4] mb-20 leading-tight tracking-tight max-w-2xl",
        },
        "Transforming Ideas Into Immersive Experiences"
      ),
      React.createElement(
        "div",
        { className: "space-y-24" },
        projects.map((project, idx) =>
          React.createElement(
            motion.div,
            {
              key: project.title,
              initial: { opacity: 0, y: 80 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-50px" },
              transition: {
                duration: 0.9,
                delay: idx * 0.12,
                ease: [0.16, 1, 0.3, 1],
              },
              className: "grid md:grid-cols-2 gap-12 items-center",
            },
            React.createElement(
              motion.div,
              {
                style: { y: yImage },
                className: `relative aspect-[4/3] rounded-2xl overflow-hidden ${
                  idx % 2 === 1 ? "md:order-2" : ""
                }`,
              },
              React.createElement("img", {
                src: project.image,
                alt: project.alt,
                className:
                  "w-full h-full object-cover transition-transform duration-700 hover:scale-105",
                loading: "lazy",
              }),
              React.createElement("div", {
                className:
                  "absolute inset-0 bg-gradient-to-t from-[#1D1D1D]/50 via-transparent to-transparent",
              })
            ),
            React.createElement(
              "div",
              { className: idx % 2 === 1 ? "md:order-1" : "" },
              React.createElement(
                "h3",
                {
                  className:
                    "text-2xl md:text-3xl font-light text-[#F7F6F4] mb-6 tracking-tight",
                },
                project.title
              ),
              React.createElement(
                "p",
                {
                  className:
                    "text-[#D7D8D8] text-lg leading-relaxed font-light",
                },
                project.description
              )
            )
          )
        )
      )
    )
  );
}

function TechnologiesSection() {
  const techs = [
    {
      name: "Unreal Engine",
      image: "/img4.png",
      description: "Real-time rendering engine for photorealistic experiences",
    },
    {
      name: "Unity",
      image: "/img5.png",
      description:
        "Cross-platform development for interactive applications",
    },
  ];
  return React.createElement(
    "section",
    { className: "relative py-32 md:py-40" },
    React.createElement(
      motion.div,
      {
        initial: { opacity: 0, y: 60 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        className: "max-w-6xl mx-auto px-8",
      },
      React.createElement(
        "span",
        {
          className:
            "text-[#B87C4F] text-xs tracking-[0.3em] uppercase mb-6 block",
        },
        "Technology"
      ),
      React.createElement(
        "h2",
        {
          className:
            "text-3xl md:text-4xl lg:text-5xl font-light text-[#F7F6F4] mb-12 leading-tight",
        },
        "Our Foundation"
      ),
      React.createElement(
        "div",
        { className: "grid md:grid-cols-2 gap-12 mb-16" },
        techs.map((tech, idx) =>
          React.createElement(
            motion.div,
            {
              key: tech.name,
              initial: { opacity: 0, y: 40 },
              whileInView: { opacity: 1, y: 0 },
              transition: { delay: idx * 0.2 },
              className: "group",
            },
            React.createElement(
              "div",
              {
                className:
                  "relative aspect-[16/9] rounded-2xl overflow-hidden mb-6",
              },
              React.createElement("img", {
                src: tech.image,
                alt: tech.name,
                className:
                  "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
                loading: "lazy",
              }),
              React.createElement("div", {
                className:
                  "absolute inset-0 bg-gradient-to-t from-[#1D1D1D]/60 via-transparent to-transparent",
              })
            ),
            React.createElement(
              "h3",
              {
                className:
                  "text-2xl font-light text-[#F7F6F4] mb-3",
              },
              tech.name
            ),
            React.createElement(
              "p",
              {
                className:
                  "text-[#D7D8D8] text-lg leading-relaxed",
              },
              tech.description
            )
          )
        )
      ),
      React.createElement(
        "div",
        {
          className:
            "text-[#D7D8D8] text-lg leading-relaxed space-y-8 font-light",
        },
        React.createElement(
          "p",
          null,
          "Our technological stack is built on industry-leading real-time rendering engines including Unreal Engine and Unity, enabling us to create experiences that respond instantly to user input while maintaining exceptional visual quality."
        ),
        React.createElement(
          "p",
          null,
          "We integrate artificial intelligence pipelines for content generation, automation, and intelligent interaction. Our digital twin systems create precise virtual replicas of physical environments that can be monitored, analyzed, and optimized in real time, providing unprecedented insight into complex systems."
        )
      )
    )
  );
}

function Footer() {
  const [formState, setFormState] = React.useState({
    name: "",
    email: "",
    message: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formState);
    alert("Thank you! We will contact you soon.");
  };
  return React.createElement(
    "footer",
    { id: "contact", className: "relative py-32 md:py-40" },
    React.createElement("div", {
      className:
        "absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px",
      style: {
        background:
          "linear-gradient(90deg, transparent 0%, rgba(229,184,123,0.7) 50%, transparent 100%)",
      },
    }),
    React.createElement(
      "div",
      { className: "max-w-4xl mx-auto px-8" },
      React.createElement(
        motion.div,
        {
          initial: { opacity: 0, y: 60 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.9 },
        },
        React.createElement(
          "span",
          {
            className:
              "text-[#B87C4F] text-xs tracking-[0.3em] uppercase mb-6 block",
          },
          "Contact"
        ),
        React.createElement(
          "h2",
          {
            className:
              "text-3xl md:text-4xl lg:text-5xl font-light text-[#F7F6F4] mb-8 tracking-tight",
          },
          "Let’s Create Together"
        ),
        React.createElement(
          "p",
          {
            className:
              "text-[#D7D8D8] text-lg leading-relaxed mb-16 max-w-2xl",
          },
          "Ready to transform your vision into an immersive digital experience? Reach out and let’s discuss how we can bring your project to life."
        ),
        React.createElement(
          "form",
          { onSubmit: handleSubmit, className: "space-y-8 mb-20" },
          React.createElement(
            "div",
            { className: "grid md:grid-cols-2 gap-8" },
            React.createElement("input", {
              type: "text",
              placeholder: "Name",
              value: formState.name,
              onChange: (e) =>
                setFormState({ ...formState, name: e.target.value }),
              className:
                "w-full bg-transparent border-b border-[#4D4749] focus:border-[#E5B87B] py-4 text-[#F7F6F4] placeholder-[#6B5A4E] outline-none transition-colors text-lg font-light",
              required: true,
            }),
            React.createElement("input", {
              type: "email",
              placeholder: "Email",
              value: formState.email,
              onChange: (e) =>
                setFormState({ ...formState, email: e.target.value }),
              className:
                "w-full bg-transparent border-b border-[#4D4749] focus:border-[#E5B87B] py-4 text-[#F7F6F4] placeholder-[#6B5A4E] outline-none text-lg font-light",
              required: true,
            })
          ),
          React.createElement("textarea", {
            rows: 4,
            placeholder: "Tell us about your project...",
            value: formState.message,
            onChange: (e) =>
              setFormState({ ...formState, message: e.target.value }),
            className:
              "w-full bg-transparent border-b border-[#4D4749] focus:border-[#E5B87B] py-4 text-[#F7F6F4] placeholder-[#6B5A4E] outline-none resize-none text-lg font-light",
            required: true,
          }),
          React.createElement(
            "button",
            {
              type: "submit",
              className:
                "inline-flex items-center gap-3 text-[#F7F6F4] border border-[#4D4749] hover:border-[#E5B87B] hover:bg-[#F7F6F4]/5 px-8 py-4 rounded-full transition-all duration-500 group",
            },
            React.createElement(
              "span",
              { className: "text-sm tracking-wide" },
              "Send Message"
            ),
            React.createElement(ArrowRight, {
              className: "w-4 h-4 group-hover:translate-x-1 transition-transform",
            })
          )
        ),
        React.createElement(
          "div",
          {
            className:
              "grid md:grid-cols-3 gap-12 pt-12 border-t border-[#4D4749]/30",
          },
          React.createElement(
            "a",
            {
              href: "mailto:annya@trinity3d.online",
              className:
                "flex items-center gap-4 text-[#D7D8D8] hover:text-[#F7F6F4] transition group",
            },
            React.createElement(Mail, { className: "w-5 h-5 text-[#B87C4F]" }),
            React.createElement(
              "span",
              { className: "text-sm font-light" },
              "annya@trinity3d.online"
            )
          ),
          React.createElement(
            "a",
            {
              href: "tel:+573045658688",
              className:
                "flex items-center gap-4 text-[#D7D8D8] hover:text-[#F7F6F4] transition group",
            },
            React.createElement(Phone, { className: "w-5 h-5 text-[#B87C4F]" }),
            React.createElement(
              "span",
              { className: "text-sm font-light" },
              "+57 304 565 8688"
            )
          ),
          React.createElement(
            "div",
            { className: "flex items-center gap-4 text-[#D7D8D8]" },
            React.createElement(MapPin, { className: "w-5 h-5 text-[#B87C4F]" }),
            React.createElement(
              "span",
              { className: "text-sm font-light" },
              "Medellin, Colombia"
            )
          )
        ),
        React.createElement(
          "div",
          {
            className:
              "mt-20 pt-8 border-t border-[#4D4749]/20 flex flex-col md:flex-row justify-between items-center gap-4",
          },
          React.createElement(
            "span",
            { className: "text-[#6B5A4E] text-sm font-light" },
            "2024 Trinity 3D. All rights reserved."
          ),
          React.createElement(
            "a",
            {
              href: "https://trinity3d.online",
              className:
                "text-[#6B5A4E] hover:text-[#E5B87B] text-sm font-light transition-colors",
            },
            "trinity3d.online"
          )
        )
      )
    )
  );
}

// Main App
function App() {
  return React.createElement(
    "main",
    {
      className:
        "relative min-h-screen bg-[#1D1D1D] overflow-x-hidden",
    },
    React.createElement(CinematicBackground, null),
    React.createElement(AmbientLight, null),
    React.createElement(Navigation, null),
    React.createElement(HeroSection, null),
    React.createElement(SectionDivider, null),
    React.createElement(
      ContentSection,
      {
        id: "about",
        label: "Who We Are",
        title: "A Technological Ecosystem",
      },
      React.createElement(
        "p",
        null,
        "Trinity 3D enables companies to simulate and visualize projects before execution, reducing risks, optimizing resources, and improving strategic decision-making. We are not simply a design studio; we are architects of digital experiences that bridge the gap between imagination and reality."
      ),
      React.createElement(
        "p",
        null,
        "Our company operates across architecture, real estate, industry, and digital development, delivering intelligent and immersive technological solutions that transform how businesses approach visualization, planning, and customer engagement."
      )
    ),
    React.createElement(SectionDivider, null),
    React.createElement(
      ContentSection,
      {
        id: "services",
        label: "Services",
        title: "What We Create",
      },
      React.createElement(
        "p",
        null,
        "Trinity 3D develops high-fidelity 3D models that replicate real environments with precision and photorealistic quality. Our visualization technology allows clients to explore architectural projects, products, and spaces with cinematic detail before they exist in physical form."
      ),
      React.createElement(
        "p",
        null,
        "Our extended reality technologies—virtual reality, augmented reality, and mixed reality—allow users to interact with digital environments in real time. These immersive experiences transform how people visualize concepts, train for complex procedures, and make purchasing decisions."
      ),
      React.createElement(
        "p",
        null,
        "Artificial intelligence enhances everything we create. We leverage AI to automate content generation, optimize workflows, and create intelligent systems that respond dynamically to user interactions. Our solutions learn and adapt, becoming more sophisticated and valuable over time."
      )
    ),
    React.createElement(SectionDivider, null),
    React.createElement(ProjectsSection, null),
    React.createElement(SectionDivider, null),
    React.createElement(
      ContentSection,
      {
        label: "Industries",
        title: "Sectors We Transform",
      },
      React.createElement(
        "p",
        null,
        "Trinity 3D operates across multiple industries including architecture, real estate, video games, medicine, and education. Each sector benefits uniquely from our capabilities in immersive visualization, simulation, and digital interaction."
      ),
      React.createElement(
        "p",
        null,
        "In real estate and architecture, we enable clients to experience spaces before they are built. In healthcare, we create training simulations that improve outcomes without risk. In education, we transform abstract concepts into interactive, memorable experiences. In gaming and entertainment, we push the boundaries of what is visually and experientially possible."
      )
    ),
    React.createElement(SectionDivider, null),
    React.createElement(TechnologiesSection, null),
    React.createElement(Footer, null)
  );
}

// Add global styles
const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    background-color: #1D1D1D;
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, sans-serif;
    scroll-behavior: smooth;
  }
  /* Smooth scroll offset for anchor links */
  html {
    scroll-padding-top: 100px;
  }
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #2a2a2a;
  }
  ::-webkit-scrollbar-thumb {
    background: #b87c4f;
    border-radius: 10px;
  }
  /* Better text rendering */
  .font-light {
    font-weight: 300;
  }
  .tracking-tighter {
    letter-spacing: -0.02em;
  }
  /* Hide video controls overlay on mobile but keep seamless */
  video::-webkit-media-controls {
    display: none;
  }
  /* subtle grain texture overlay to elevate premium look */
  .grain-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
    opacity: 0.08;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat: repeat;
  }
`;

// Add style element for global styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = globalStyles;
  document.head.appendChild(style);
}

export default function Page() {
  return React.createElement(React.StrictMode, null, React.createElement(App, null));
}