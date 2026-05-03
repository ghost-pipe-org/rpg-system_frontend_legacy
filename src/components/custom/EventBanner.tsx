import { Calendar, MapPin, Zap, Rocket, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import astronautImg from "@/assets/images/image-6.webp";

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

function SemanaZeroGrid() {
  return (
    <div 
      className="absolute inset-0 pointer-events-none opacity-20" 
      style={{
        backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}
    />
  );
}

function SemanaZeroBanner() {
  return (
    <div
      className="absolute inset-0 w-full h-full flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #3b0764 0%, #6b21a8 50%, #9333ea 100%)",
        border: "1px solid rgba(167,139,250,0.3)",
      }}
    >
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) rotate(-2deg); }
            50% { transform: translateY(-15px) rotate(2deg); }
            100% { transform: translateY(0px) rotate(-2deg); }
          }
        `}
      </style>
      <SemanaZeroGrid />

      {/* Astro / Content Layout */}
      <div className="relative z-10 w-full h-full flex items-center justify-between px-6 sm:px-16 py-8">
         <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4 w-full sm:max-w-lg z-20">
            {/* Title */}
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-white/90 font-mono tracking-[0.4em] uppercase text-sm sm:text-base flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                IX
                <span className="w-1.5 h-1.5 rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </span>
              <h2 
                className="text-6xl sm:text-8xl font-black leading-none text-white tracking-tighter mt-2"
                style={{ textShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
              >
                SEMANA<br/>
                <span className="text-4xl sm:text-6xl tracking-[0.1em] sm:tracking-[0.2em] text-purple-200">zero</span>
              </h2>
            </div>
            
            <div className="mt-2 text-purple-100 font-medium text-sm sm:text-base bg-white/10 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
              Amostra de Projetos de Extensão
            </div>

            {/* Info */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
                <Calendar size={16} className="text-purple-300" />
                <span className="text-white font-semibold text-sm">06 de Maio de 2026</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
                <MapPin size={16} className="text-purple-300" />
                <span className="text-white font-semibold text-sm">UEPB – Campus VII</span>
              </div>
            </div>
         </div>

         {/* Astronaut Image right side */}
         <div 
           className="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2 h-[90%] pointer-events-none z-10"
           style={{ animation: 'float 6s ease-in-out infinite' }}
         >
            <img 
              src={astronautImg} 
              alt="Astronauta" 
              className="h-full w-auto object-contain drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
            />
         </div>
      </div>
    </div>
  );
}

function EncontroRpgBanner() {
  return (
    <div
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 60% 0%, rgba(180,30,120,0.35) 0%, transparent 60%), radial-gradient(ellipse at 10% 80%, rgba(80,30,180,0.3) 0%, transparent 55%), #080810",
        border: "1px solid rgba(220,60,160,0.35)",
      }}
    >
      <StarField />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(220,60,160,0.8), transparent)" }}
      />
      <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 flex flex-col items-center text-center gap-5 w-full">
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{
            background: "rgba(220,60,160,0.05)",
            border: "1px solid rgba(220,60,160,0.2)",
            color: "#f472b6",
            opacity: 0.8
          }}
        >
          <Zap size={11} className="shrink-0" />
          Inscrições Encerradas
          <Zap size={11} className="shrink-0" />
        </div>
        <div className="space-y-1">
          <p className="text-white/40 text-sm font-mono tracking-[0.2em] uppercase">
            II Encontro de
          </p>
          <h2
            className="font-pixelsans text-4xl sm:text-6xl font-black leading-none opacity-80"
            style={{
              background: "linear-gradient(135deg, #f9a8d4 0%, #ec4899 35%, #a855f7 65%, #7c3aed 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            RPG
          </h2>
          <p className="text-white/80 font-bold text-lg sm:text-xl tracking-wide">
            O Despertar da Força Narrativa
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 opacity-70">
          <div
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(236,72,153,0.15)" }}
          >
            <Calendar size={16} style={{ color: "#f472b6" }} />
            <span className="text-white font-semibold text-sm">04 de Maio de 2026</span>
          </div>
          <div
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(168,85,247,0.15)" }}
          >
            <MapPin size={16} style={{ color: "#c084fc" }} />
            <span className="text-white font-semibold text-sm">UEPB – Campus VII</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EventBannerProps {
  onSelectDate?: (date: string) => void;
}

const BANNERS = [
  {
    id: "semana-zero",
    dateFilter: "2026-05-06",
    render: () => <SemanaZeroBanner />
  },
  {
    id: "encontro-rpg",
    dateFilter: "2026-05-04",
    render: () => <EncontroRpgBanner />
  }
];

export function EventBanner({ onSelectDate }: EventBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <div className="relative w-full rounded-2xl overflow-hidden mb-8 group shadow-2xl transition-all duration-500">
      <div className="w-full relative h-[480px] sm:h-[440px]">
        {BANNERS.map((banner, idx) => (
           <div 
             key={banner.id}
             className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out"
             style={{ 
               opacity: currentIndex === idx ? 1 : 0, 
               pointerEvents: currentIndex === idx ? 'auto' : 'none' 
             }}
           >
             {banner.render()}
           </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <button 
        onClick={prevBanner}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white/60 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 hover:scale-110 hover:text-white z-30 backdrop-blur-sm"
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        onClick={nextBanner}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white/60 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 hover:scale-110 hover:text-white z-30 backdrop-blur-sm"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {BANNERS.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === i ? 'bg-white/90 w-6' : 'bg-white/40 w-2 hover:bg-white/60'}`} 
          />
        ))}
      </div>
    </div>
  );
}
