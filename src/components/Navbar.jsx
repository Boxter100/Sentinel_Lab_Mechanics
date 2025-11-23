import React, { useEffect, useRef, useState } from "react";

export default function Navbar({
  sections = [
    { id: "hero", label: "Inicio" },
    { id: "galeria", label: "Galeria" },
    { id: "comprar", label: "Comprar" },  
    { id: "modelo", label: "Modelo 3D" },
  ],  
  offset = 0,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const itemRefs = useRef([]);
  const listRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const idx = sections.findIndex((s) => s.id === visible[0].target.id);
          if (idx !== -1) setActiveIndex(idx);
        }
      },
      {
        root: null,
        rootMargin: `${-offset}px 0px -40% 0px`,
        threshold: [0.2, 0.4, 0.6, 0.8],
      }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections, offset]);

  useEffect(() => {
    const updateIndicator = () => {
      const el = itemRefs.current[activeIndex];
      const container = listRef.current;
      const indicator = indicatorRef.current;
      if (!el || !container || !indicator) return;
      const cr = container.getBoundingClientRect();
      const ir = el.getBoundingClientRect();
      const top = ir.top - cr.top + ir.height / 2 - 4;
      indicator.style.transform = `translateY(${top}px)`;
    };

    updateIndicator();
    const onResize = () => requestAnimationFrame(updateIndicator);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex]);

  const handleClick = (id, idx) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveIndex(idx);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", `#${id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(activeIndex + 1, sections.length - 1);
      handleClick(sections[next].id, next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(activeIndex - 1, 0);
      handleClick(sections[prev].id, prev);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(sections[activeIndex].id, activeIndex);
    }
  };

  // Determinar si debe mostrar las etiquetas
  const showLabels = !hasScrolled || isHovered;

  return (
    <nav
      className={`hidden md:block fixed left-6 top-1/2 -translate-y-1/2 z-50 select-none`}
      aria-label="Navegación lateral"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={listRef}
        className={`relative flex flex-col gap-4 pl-5 opacity-0 -translate-x-2 transition-all duration-500 ${
          mounted ? "opacity-100 translate-x-0" : ""
        }`}
        role="menubar"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <span className="absolute left-0 top-0 h-full w-px bg-black" />
        <span
          ref={indicatorRef}
          className="absolute -left-[5px] w-2 h-2 rounded-full bg-black shadow-[0_0_10px_rgba(100,100,100,0.6)] transition-transform duration-300"
          aria-hidden="true"
        />
        {sections.map((s, idx) => {
          const active = idx === activeIndex;
          return (
            <button
              key={s.id}
              ref={(el) => (itemRefs.current[idx] = el)}
              onClick={() => handleClick(s.id, idx)}
              className={`text-sm tracking-wide uppercase transition-all duration-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 rounded-sm overflow-hidden whitespace-nowrap`}
              role="menuitem"
              aria-current={active ? "true" : "false"}
            >
              <span
                className={`inline-block px-3 py-1.5 rounded-md backdrop-blur-sm transition-all duration-300 ${
                  active ? "translate-x-0 text-white bg-black/60" : "translate-x-[0.5px] text-white/60 bg-black/40"
                } ${
                  showLabels ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
                }`}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}