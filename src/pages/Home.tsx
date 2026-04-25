import { RootLayout } from "../components/layout";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useEffect, useRef } from "react";
import { Calendar, MapPin, Rocket, Zap, Dice6, Wrench, FlaskConical, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { ROUTES } from "@/routes/routes";

/* =========================================================
 * 🚀 CONTEÚDO TEMPORÁRIO DO EVENTO — II ENCONTRO DE RPG
 * Para remover após o evento:
 * 1. Delete este arquivo e restaure a Home original
 *    (ou limpe o conteúdo abaixo de <RootLayout>)
 * ========================================================= */

function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Idêntico ao EventBanner — resize imediato com offsetWidth/Height
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Posições em pixels absolutos (igual EventBanner)
    const stars: { x: number; y: number; r: number; o: number; speed: number }[] = [];
    for (let i = 0; i < 180; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.3,
        o: Math.random(),
        speed: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.o += s.speed * 0.02;
        if (s.o > 1) s.o = 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.abs(Math.sin(s.o)) * 0.7})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}


const activities = [
  { icon: Dice6, label: "Mesas de RPG", desc: "Sistemas variados e narrativas do cósmico ao desconhecido", color: "#ec4899" },
  { icon: Wrench, label: "Oficinas", desc: "Criação, desenvolvimento e aprofundamento no universo do RPG", color: "#a855f7" },
  { icon: FlaskConical, label: "Mostra Acadêmica", desc: "Produções que expandem os limites entre ficção e ciência", color: "#6366f1" },
];

const periods = [
  { time: "Manhã", emoji: "🌅", desc: "Primeira missão do dia" },
  { time: "Tarde", emoji: "☀️", desc: "O universo se expande" },
  { time: "Noite", emoji: "🌙", desc: "A força narrativa desperta" },
];

const Home = () => {
  useDocumentTitle();

  return (
    <RootLayout>
      <div className="w-full max-w-4xl mx-auto px-4">

        {/* ── HERO ── */}
        <div
          className="relative w-full rounded-3xl overflow-hidden mb-10"
          style={{
            background: "radial-gradient(ellipse at 65% -10%, rgba(200,30,130,0.45) 0%, transparent 55%), radial-gradient(ellipse at 5% 90%, rgba(90,30,200,0.35) 0%, transparent 50%), #06060f",
            border: "1px solid rgba(220,60,160,0.3)",
            boxShadow: "0 0 0 1px rgba(220,60,160,0.1), 0 12px 60px rgba(180,30,120,0.3)",
          }}
        >
          <StarCanvas />

          {/* Top glow line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(236,72,153,0.9), transparent)" }} />

          <div className="relative z-10 flex flex-col items-center text-center gap-6 px-6 py-14 sm:px-14 sm:py-16">

            {/* Badge */}
            <div
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse"
              style={{ background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.4)", color: "#f472b6" }}
            >
              <Zap size={11} /> Inscrições abertas <Zap size={11} />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <p className="text-white/50 text-xs font-mono tracking-[0.25em] uppercase">II Encontro de</p>
              {/* Wrapper do glow — gradiente via SVG para ser independente de font rendering */}
              <div style={{ filter: "drop-shadow(0 0 28px rgba(244, 114, 182, 0.8))" }}>
                <svg
                  viewBox="0 0 300 90"
                  width="100%"
                  style={{ maxWidth: "clamp(220px, 40vw, 500px)", overflow: "visible", display: "block", margin: "0 auto" }}
                  aria-label="RPG"
                >
                  <defs>
                    <linearGradient id="rpg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f9a8d4" />
                      <stop offset="35%" stopColor="#ec4899" />
                      <stop offset="65%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                  <text
                    x="50%"
                    y="80"
                    textAnchor="middle"
                    fill="url(#rpg-grad)"
                    fontFamily="var(--font-pixelsans, monospace)"
                    fontWeight="900"
                    fontSize="88"
                  >
                    RPG
                  </text>
                </svg>
              </div>
              <p className="text-white font-bold text-xl sm:text-3xl tracking-wide" style={{ textShadow: "0 0 25px rgba(168,85,247,0.5)" }}>
                O Despertar da Força Narrativa
              </p>
            </div>

            {/* Tagline */}
            <p className="text-white/60 text-sm sm:text-base max-w-md leading-relaxed">
              Uma experiência imersiva que conecta imaginação, ciência e narrativa em um mesmo universo. Inspirado na estética sci-fi.
            </p>

            {/* Divider */}
            <div className="w-40 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(236,72,153,0.6), transparent)" }} />

            {/* Info cards */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(236,72,153,0.3)" }}>
                <Calendar size={16} style={{ color: "#f472b6" }} />
                <span className="text-white font-semibold text-sm">
                  04 de Maio de 2026 <span className="text-white/40 font-normal">(seg.)</span>
                </span>
              </div>
              <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(168,85,247,0.3)" }}>
                <MapPin size={16} style={{ color: "#c084fc" }} />
                <span className="text-white font-semibold text-sm">UEPB – Campus VII, Patos</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
              <Link to={ROUTES.SESSIONS}>
                <Button
                  className="uppercase font-bold px-8 py-3 text-sm rounded-xl gap-2"
                  style={{
                    background: "linear-gradient(135deg, #ec4899, #a855f7)",
                    boxShadow: "0 4px 20px rgba(236,72,153,0.4)",
                    border: "none",
                    color: "white",
                  }}
                >
                  Ver Eventos <ChevronRight size={16} />
                </Button>
              </Link>
              <span className="text-white/30 text-xs font-mono flex items-center gap-1">
                <Rocket size={12} /> Evento gratuito · Aberto ao público
              </span>
            </div>
          </div>

          {/* Bottom glow */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-1/2 h-16 blur-3xl pointer-events-none" style={{ background: "rgba(168,85,247,0.25)" }} />
        </div>

        {/* ── ATIVIDADES ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {activities.map(({ icon: Icon, label, desc, color }) => (
            <div
              key={label}
              className="relative rounded-2xl p-5 flex flex-col gap-3 overflow-hidden group"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${color}30`,
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `${color}60`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px ${color}20`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `${color}30`;
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{label}</p>
                <p className="text-white/50 text-xs mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── TURNOS ── */}
        <div
          className="rounded-2xl px-6 py-5 mb-10"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock size={15} style={{ color: "#a855f7" }} />
            <p className="text-white/60 text-xs font-mono uppercase tracking-widest">Turnos do dia</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {periods.map(({ time, emoji, desc }) => (
              <div key={time} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="text-2xl">{emoji}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{time}</p>
                  <p className="text-white/40 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER DO EVENTO ── */}
        <div className="text-center pb-4">
          <p className="text-white/25 text-xs font-mono">
            Prepare sua ficha · Ajuste seus dados · Vamos sair do espaço acadêmico para o espaço sideral 🌙🚀
          </p>
        </div>

      </div>
    </RootLayout>
  );
};

export default Home;
