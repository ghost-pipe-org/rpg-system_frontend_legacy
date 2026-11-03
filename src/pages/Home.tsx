import { useState } from "react";
import { RootLayout } from "../components/layout";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { EventBanner } from "@/components/custom/EventBanner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { ROUTES } from "@/routes/routes";
import { ChevronRight, Flame } from "lucide-react";
import { EVENT_THEME } from "@/config/eventTheme";

const Home = () => {
  useDocumentTitle();
  const [selectedEventDate, setSelectedEventDate] = useState<string>("2026-11-05");

  const isSemex = selectedEventDate === "2026-11-05";

  return (
    <RootLayout>
      <div className="w-full max-w-4xl mx-auto px-4 pb-12 flex flex-col items-center">

        {/* Carrossel de Eventos com filtro por data */}
        <EventBanner onSelectDate={setSelectedEventDate} />

        {/* Sinopse acompanhando o evento selecionado */}
        <div className="w-full max-w-3xl mt-2 mb-10">
          {isSemex ? (
            <div className="relative p-6 sm:p-8 rounded-2xl overflow-hidden bg-[#0a1128]/50 border border-cyan-500/20 shadow-[0_0_30px_rgba(0,255,255,0.05)] backdrop-blur-sm transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-transparent" />

              <p className="text-white/80 text-lg leading-relaxed mb-4 font-medium">
                Entre 4 e 6 de novembro acontece o{" "}
                <strong className="text-cyan-400">IX SEMEX - Seminário de Extensão da UEPB</strong>,
                evento integrado de extensão, pesquisa e ensino a distância, com o tema
                “Diálogos: Universidade e Sociedade em Transform(ação)”.
              </p>
              <p className="text-white/70 leading-relaxed mb-6">
                A programação reúne rodas de conversa, palestras, extensão mostra, voz da
                comunidade, apresentação de resultados e comunicações orais. No dia{" "}
                <strong className="text-cyan-400">5 de novembro, das 8h às 12h</strong>, o
                Tópicos Especiais em Aventuras participa com mesas de RPG do nosso sistema{" "}
                <strong className="text-cyan-400">Caos em Nova Patos</strong>. Juntos somos mais!
              </p>

              <div className="flex items-center justify-center gap-2 text-cyan-500/60 font-mono text-sm tracking-widest uppercase">
                <Flame size={14} />
                <span>05 de novembro · 8h às 12h · UEPB Campus VII</span>
              </div>
            </div>
          ) : (
            <div
              className="relative p-6 sm:p-8 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300"
              style={{
                background: "rgba(20, 4, 5, 0.7)",
                border: "1px solid rgba(232, 96, 76, 0.3)",
                boxShadow: "0 0 30px rgba(180, 30, 20, 0.12)",
              }}
            >
              {/* Elemento decorativo */}
              <div
                className="absolute top-0 left-0 w-1 h-full"
                style={{ background: `linear-gradient(to bottom, ${EVENT_THEME.coral}, transparent)` }}
              />

              <p className="text-lg leading-relaxed mb-6 font-medium" style={{ color: "rgba(246,236,224,0.85)" }}>
                Chegou a edição especial do{" "}
                <strong style={{ color: EVENT_THEME.coral }}>
                  Tópicos Especiais em Aventuras - Dia de los Muertos
                </strong>
                . Entre velas, flores e memórias, mesas de RPG de mistério e horror vão
                guiar você por histórias onde o véu entre os mundos fica mais fino.
                Nunca jogou RPG antes? Nunca é tarde para começar: entre nesta
                aventura com a gente.
              </p>

              <div
                className="p-4 rounded-xl mb-6"
                style={{
                  background: "rgba(74, 10, 10, 0.35)",
                  border: "1px solid rgba(232, 96, 76, 0.25)",
                }}
              >
                <p className="text-md leading-relaxed italic text-center" style={{ color: EVENT_THEME.cream }}>
                  “Entre velas, memórias e segredos, algumas almas ainda não
                  descansaram!”
                </p>
              </div>

              <div
                className="flex items-center justify-center gap-2 text-sm tracking-widest uppercase"
                style={{ color: "rgba(232,96,76,0.8)" }}
              >
                <Flame size={14} />
                <span>
                  <s style={{ opacity: 0.5 }}>31 de outubro</s> · adiado para{" "}
                  <strong>7 de novembro</strong> · 13h30 às 18h · UEPB Campus VII
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg">
          <Link to={`${ROUTES.SESSIONS}?date=${selectedEventDate}`} className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto uppercase font-bold px-8 py-6 text-sm rounded-xl gap-2 transition-all hover:scale-105 cursor-pointer"
              style={
                isSemex
                  ? {
                      background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                      boxShadow: "0 4px 20px rgba(6, 182, 212, 0.35)",
                      border: "none",
                      color: "#ffffff",
                    }
                  : {
                      background: "linear-gradient(135deg, #e8604c, #a31f1f)",
                      boxShadow: "0 4px 20px rgba(232, 96, 76, 0.35)",
                      border: "none",
                      color: EVENT_THEME.cream,
                    }
              }
            >
              Inscreva-se nas mesas <ChevronRight size={18} />
            </Button>
          </Link>
        </div>

      </div>
    </RootLayout>
  );
};

export default Home;
