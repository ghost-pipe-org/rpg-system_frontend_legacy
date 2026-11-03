import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dice6,
  Flame,
  Info,
  MapPin,
  Skull,
  TriangleAlert,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EVENT_THEME as MUERTOS } from "@/config/eventTheme";
import { SemexBanner } from "@/components/custom/SemexBanner";

const MUERTOS_TITLE_FONT = MUERTOS.titleFont;

type Particle = {
  x: number;
  y: number;
  r: number;
  o: number;
  speed: number;
  drift: number;
  petal: boolean;
};

/** Brasas e pétalas de cempasúchil subindo lentamente */
function EmberField() {
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

    const create = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.6,
      o: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.35 + 0.1,
      drift: (Math.random() - 0.5) * 0.3,
      petal: Math.random() < 0.3,
    });
    const particles: Particle[] = Array.from({ length: 70 }, create);

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.o += 0.02;
        p.y -= p.speed;
        p.x += p.drift + Math.sin(p.o) * 0.15;
        if (p.y < -5) {
          p.y = canvas.height + 5;
          p.x = Math.random() * canvas.width;
        }
        const alpha = 0.25 + Math.abs(Math.sin(p.o)) * 0.55;
        ctx.beginPath();
        if (p.petal) {
          ctx.ellipse(p.x, p.y, p.r * 1.8, p.r, p.o, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(232,96,76,${alpha})`;
        } else {
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,170,110,${alpha})`;
        }
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

/** Textura sutil de pontilhado (referência às caveiras mexicanas) */
function DotTexture() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-20"
      style={{
        backgroundImage:
          "radial-gradient(rgba(232,96,76,0.45) 1px, transparent 1.5px)",
        backgroundSize: "22px 22px",
        maskImage:
          "radial-gradient(ellipse at center, black 15%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 15%, transparent 75%)",
      }}
    />
  );
}

function MuertosBanner() {
  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden flex flex-col justify-center"
      style={{
        background: `linear-gradient(160deg, ${MUERTOS.black} 0%, #1a0505 45%, ${MUERTOS.wine} 100%)`,
        border: "1px solid rgba(232, 96, 76, 0.35)",
        boxShadow:
          "0 0 40px rgba(180, 30, 20, 0.25), inset 0 0 30px rgba(232, 96, 76, 0.06)",
      }}
    >
      <EmberField />
      <DotTexture />

      {/* Brilho central (luz de vela) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] blur-[100px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(200,50,35,0.22) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 px-6 pt-10 pb-12 sm:px-12 sm:pt-14 sm:pb-14 flex flex-col items-center text-center gap-8">
        {/* Aviso de adiamento */}
        <div
          className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold tracking-wider uppercase"
          style={{
            background: "rgba(232, 96, 76, 0.15)",
            border: "1px solid rgba(232, 96, 76, 0.6)",
            color: MUERTOS.cream,
          }}
        >
          <TriangleAlert size={16} style={{ color: MUERTOS.coral }} />
          <span>
            Evento adiado! Nova data:{" "}
            <strong style={{ color: MUERTOS.coral }}>07 de novembro</strong>
          </span>
        </div>

        {/* Top Header */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex items-center gap-3 font-semibold text-xs sm:text-sm tracking-[0.25em] uppercase"
            style={{ color: MUERTOS.cream }}
          >
            <Skull size={14} style={{ color: MUERTOS.coral }} />
            <span>Tópicos Especiais em Aventuras</span>
            <Skull size={14} style={{ color: MUERTOS.coral }} />
          </div>
          <span
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: MUERTOS.coral }}
          >
            Dia dos Mortos
          </span>
        </div>

        {/* Main Title Group */}
        <div className="flex flex-col items-center relative px-4">
          {/* Cantoneiras decorativas */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 opacity-60 -ml-2 -mt-2" style={{ borderColor: MUERTOS.coral }} />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 opacity-60 -mr-2 -mt-2" style={{ borderColor: MUERTOS.coral }} />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 opacity-60 -ml-2 -mb-2" style={{ borderColor: MUERTOS.coral }} />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 opacity-60 -mr-2 -mb-2" style={{ borderColor: MUERTOS.coral }} />

          <h1
            className="flex flex-col items-center leading-[0.95] uppercase tracking-wide font-normal"
            style={{
              fontFamily: MUERTOS_TITLE_FONT,
              color: MUERTOS.cream,
              textShadow:
                "0 0 24px rgba(232, 96, 76, 0.45), 0 2px 0 rgba(0,0,0,0.6)",
            }}
          >
            <span className="text-4xl sm:text-6xl">Dia de los</span>
            <span className="text-6xl sm:text-8xl -mt-1">Muertos</span>
          </h1>

          <div className="flex items-center gap-4 mt-4">
            <div
              className="h-px w-10 sm:w-20"
              style={{ background: `linear-gradient(to right, transparent, ${MUERTOS.coral})` }}
            />
            <Flame size={16} style={{ color: MUERTOS.coral }} />
            <div
              className="h-px w-10 sm:w-20"
              style={{ background: `linear-gradient(to left, transparent, ${MUERTOS.coral})` }}
            />
          </div>
        </div>

        {/* Frase */}
        <p
          className="max-w-md text-sm sm:text-base italic leading-relaxed"
          style={{ color: "rgba(246,236,224,0.85)" }}
        >
          “Entre velas, memórias e segredos, algumas almas ainda não
          descansaram!”
        </p>

        {/* Data / Hora / Local */}
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-0">
          <div className="flex flex-col items-center sm:pr-6">
            <div className="flex items-center gap-2">
              <span
                className="text-5xl sm:text-6xl font-black leading-none"
                style={{ color: MUERTOS.cream }}
              >
                07
              </span>
              <span
                className="text-lg font-bold tracking-widest uppercase"
                style={{ color: MUERTOS.cream }}
              >
                Nov
              </span>
            </div>
            <span
              className="text-[11px] tracking-widest uppercase mt-1"
              style={{ color: "rgba(246,236,224,0.5)" }}
            >
              <s>31 Out</s> · adiado
            </span>
          </div>

          <div
            className="hidden sm:block w-px h-14"
            style={{ background: "rgba(246,236,224,0.6)" }}
          />

          <div className="flex flex-col items-center sm:px-6">
            <span
              className="flex items-center gap-1.5 text-2xl sm:text-3xl font-black tracking-wider"
              style={{ color: MUERTOS.coralSoft }}
            >
              <Clock size={18} /> 13H30
            </span>
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: MUERTOS.cream }}
            >
              Até 18h
            </span>
          </div>

          <div
            className="hidden sm:block w-px h-14"
            style={{ background: "rgba(246,236,224,0.6)" }}
          />

          <div className="flex flex-col items-center sm:pl-6">
            <span
              className="text-3xl sm:text-4xl font-black tracking-wider"
              style={{ color: MUERTOS.cream }}
            >
              UEPB
            </span>
            <span
              className="flex items-center gap-1 text-xs font-bold tracking-widest uppercase"
              style={{ color: MUERTOS.coralSoft }}
            >
              <MapPin size={12} /> Campus VII
            </span>
          </div>
        </div>

        {/* Atividades */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-1">
          <div
            className="flex items-center gap-3 px-6 py-3 rounded-lg"
            style={{
              background: "rgba(40, 6, 6, 0.8)",
              border: "1px solid rgba(232, 96, 76, 0.4)",
              boxShadow: "0 0 15px rgba(232, 96, 76, 0.12)",
            }}
          >
            <Dice6 size={20} style={{ color: MUERTOS.coral }} />
            <span className="font-bold tracking-wider text-sm" style={{ color: MUERTOS.cream }}>
              MESAS DE RPG
            </span>
          </div>
        </div>

        {/* Rodapé */}
        <div
          className="flex flex-col items-center gap-1.5 text-xs mt-2"
          style={{ color: "rgba(246,236,224,0.6)" }}
        >
          <div className="flex items-center gap-2">
            <Info size={12} style={{ color: MUERTOS.coral }} />
            <span>Nunca jogou RPG antes? Nunca é tarde para começar!</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={12} style={{ color: MUERTOS.coral }} />
            <span>Evento gratuito | Inscrições para o público geral</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EventBannerProps {
  onSelectDate?: (date: string) => void;
  initialDate?: string;
}

const BANNERS = [
  {
    id: "semex",
    label: "05/11 · IX SEMEX",
    accent: "#22d3ee",
    activeBg: "rgba(6, 182, 212, 0.16)",
    activeBorder: "rgba(34, 211, 238, 0.55)",
    dateFilter: "2026-11-05",
    render: () => <SemexBanner />,
  },
  {
    id: "muertos",
    label: "07/11 · Dia de los Muertos",
    accent: MUERTOS.coral,
    activeBg: "rgba(232, 96, 76, 0.16)",
    activeBorder: "rgba(232, 96, 76, 0.6)",
    dateFilter: "2026-11-07",
    render: () => <MuertosBanner />,
  },
];

export function EventBanner({ onSelectDate, initialDate }: EventBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!initialDate) return 0;
    const found = BANNERS.findIndex((b) => b.dateFilter === initialDate);
    return found >= 0 ? found : 0;
  });

  useEffect(() => {
    if (onSelectDate) {
      onSelectDate(BANNERS[currentIndex].dateFilter);
    }
  }, [currentIndex, onSelectDate]);

  const nextBanner = () => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  };

  const prevBanner = () => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  return (
    <div className="w-full mb-8">
      {/* Filtro rápido de datas */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4">
        {BANNERS.map((banner, idx) => {
          const active = currentIndex === idx;
          return (
            <button
              key={banner.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer"
              style={{
                background: active ? banner.activeBg : "rgba(255, 255, 255, 0.04)",
                border: `1px solid ${active ? banner.activeBorder : "rgba(255, 255, 255, 0.12)"}`,
                color: active ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
                boxShadow: active ? `0 0 20px ${banner.activeBg}` : "none",
              }}
            >
              <Calendar
                size={14}
                style={{ color: active ? banner.accent : "rgba(255, 255, 255, 0.45)" }}
              />
              <span>{banner.label}</span>
            </button>
          );
        })}
      </div>

      {/* Carrossel dos banners */}
      <div className="relative w-full rounded-2xl overflow-hidden group shadow-2xl transition-all duration-500">
        <div className="w-full grid grid-cols-1">
          {BANNERS.map((banner, idx) => (
            <div
              key={banner.id}
              className="col-start-1 row-start-1 w-full h-full transition-opacity duration-500 ease-in-out"
              style={{
                opacity: currentIndex === idx ? 1 : 0,
                pointerEvents: currentIndex === idx ? "auto" : "none",
              }}
            >
              {banner.render()}
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <button
          type="button"
          aria-label="Evento anterior"
          onClick={prevBanner}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white/70 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:bg-black/60 hover:scale-110 hover:text-white z-30 backdrop-blur-sm cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          type="button"
          aria-label="Próximo evento"
          onClick={nextBanner}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white/70 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:bg-black/60 hover:scale-110 hover:text-white z-30 backdrop-blur-sm cursor-pointer"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {BANNERS.map((banner, i) => (
            <button
              key={banner.id}
              type="button"
              aria-label={`Selecionar ${banner.label}`}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === i
                  ? "bg-white/90 w-6"
                  : "bg-white/40 w-2 hover:bg-white/60"
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
