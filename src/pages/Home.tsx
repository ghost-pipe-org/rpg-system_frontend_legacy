import { RootLayout } from "../components/layout";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { Calendar, MapPin, Rocket, Zap, Dice6, Wrench, FlaskConical, Clock, ChevronRight, Sunrise, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { ROUTES } from "@/routes/routes";
import { EventBanner } from "@/components/custom/EventBanner";

const activities = [
  { icon: Dice6, label: "Mesas de RPG", desc: "Sistemas variados e narrativas do cósmico ao desconhecido", color: "#ec4899" },
  { icon: Wrench, label: "Oficinas", desc: "Criação, desenvolvimento e aprofundamento no universo do RPG", color: "#a855f7" },
  { icon: FlaskConical, label: "Mostra Acadêmica", desc: "Produções que expandem os limites entre ficção e ciência", color: "#6366f1" },
];

const periods = [
  { time: "Manhã", icon: Sunrise, desc: "Primeira missão do dia" },
  { time: "Tarde", icon: Sun, desc: "O universo se expande" },
  { time: "Noite", icon: Moon, desc: "A força narrativa desperta" },
];

const Home = () => {
  useDocumentTitle();

  return (
    <RootLayout>
      <div className="w-full max-w-4xl mx-auto px-4">

        {/* ── HERO ── */}
        <div className="mb-10 flex flex-col items-center">
          <EventBanner />
          
          <div className="flex flex-col items-center gap-3 -mt-4 mb-4">
            <Link to={ROUTES.SESSIONS}>
              <Button
                className="uppercase font-bold px-8 py-6 text-sm rounded-xl gap-2 transition-transform hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #ec4899, #a855f7)",
                  boxShadow: "0 4px 20px rgba(236,72,153,0.4)",
                  border: "none",
                  color: "white",
                }}
              >
                Explorar Eventos <ChevronRight size={18} />
              </Button>
            </Link>
            <span className="text-white/40 text-xs font-mono flex items-center gap-1.5 mt-2">
              <Rocket size={14} className="text-purple-400" /> Eventos gratuitos · Abertos ao público
            </span>
          </div>
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
            {periods.map(({ time, icon: Icon, desc }) => (
              <div key={time} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="p-2 rounded-lg bg-white/5">
                  <Icon size={20} className="text-purple-300" />
                </div>
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
