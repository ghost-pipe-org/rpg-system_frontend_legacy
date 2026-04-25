/**
 * 🚀 BANNER TEMPORÁRIO — II ENCONTRO DE RPG: O DESPERTAR DA FORÇA NARRATIVA
 *
 * Para remover após o evento:
 * 1. Delete este arquivo
 * 2. Remova o import e o <EventBanner /> de Sessions.tsx
 */

import { Calendar, MapPin, Zap, Rocket } from "lucide-react";
import { useEffect, useRef } from "react";

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars: { x: number; y: number; r: number; o: number; speed: number }[] = [];
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        o: Math.random(),
        speed: Math.random() * 0.4 + 0.1,
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

export function EventBanner() {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden mb-8"
      style={{
        background:
          "radial-gradient(ellipse at 60% 0%, rgba(180,30,120,0.35) 0%, transparent 60%), radial-gradient(ellipse at 10% 80%, rgba(80,30,180,0.3) 0%, transparent 55%), #080810",
        border: "1px solid rgba(220,60,160,0.35)",
        boxShadow:
          "0 0 0 1px rgba(220,60,160,0.15), 0 8px 40px rgba(180,30,120,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <StarField />

      {/* Glow de topo */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(220,60,160,0.8), transparent)" }}
      />

      <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 flex flex-col items-center text-center gap-6">

        {/* Badge topo */}
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{
            background: "rgba(220,60,160,0.15)",
            border: "1px solid rgba(220,60,160,0.4)",
            color: "#f472b6",
          }}
        >
          <Zap size={11} className="shrink-0" />
          Inscrições abertas
          <Zap size={11} className="shrink-0" />
        </div>

        {/* Título */}
        <div className="space-y-1">
          <p className="text-white/60 text-sm font-mono tracking-[0.2em] uppercase">
            II Encontro de
          </p>
          <h2
            className="font-pixelsans text-5xl sm:text-7xl font-black leading-none"
            style={{
              background: "linear-gradient(135deg, #f9a8d4 0%, #ec4899 35%, #a855f7 65%, #7c3aed 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 20px rgba(236,72,153,0.5))",
            }}
          >
            RPG
          </h2>
          <p
            className="text-white font-bold text-xl sm:text-2xl tracking-wide"
            style={{ textShadow: "0 0 20px rgba(168,85,247,0.5)" }}
          >
            O Despertar da Força Narrativa
          </p>
        </div>

        {/* Divisor */}
        <div
          className="w-32 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(236,72,153,0.6), transparent)" }}
        />

        {/* Info cards */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(236,72,153,0.3)",
            }}
          >
            <Calendar size={16} style={{ color: "#f472b6" }} />
            <span className="text-white font-semibold text-sm">
              04 de Maio de 2026
              <span className="text-white/50 font-normal ml-1">(segunda-feira)</span>
            </span>
          </div>
          <div
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(168,85,247,0.3)",
            }}
          >
            <MapPin size={16} style={{ color: "#c084fc" }} />
            <span className="text-white font-semibold text-sm">
              UEPB – Campus VII, Patos
            </span>
          </div>
        </div>

        {/* Atividades */}
        <div className="flex flex-wrap justify-center gap-3 text-xs font-semibold">
          {[
            { emoji: "🎲", label: "Mesas de RPG" },
            { emoji: "🛠️", label: "Oficinas" },
            { emoji: "🔬", label: "Mostra Acadêmica" },
          ].map(({ emoji, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white/80"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span>{emoji}</span> {label}
            </span>
          ))}
        </div>

        {/* Rodapé */}
        <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
          <Rocket size={12} />
          <span>Evento gratuito · Aberto ao público · Manhã, Tarde e Noite</span>
          <Rocket size={12} />
        </div>
      </div>

      {/* Glow de fundo */}
      <div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-1/2 h-16 blur-2xl pointer-events-none"
        style={{ background: "rgba(168,85,247,0.2)" }}
      />
    </div>
  );
}
