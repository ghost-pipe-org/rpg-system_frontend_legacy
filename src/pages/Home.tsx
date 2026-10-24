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

  return (
    <RootLayout>
      <div className="w-full max-w-4xl mx-auto px-4 pb-12 flex flex-col items-center">

        {/* Banner do Evento Dia de los Muertos */}
        <EventBanner />

        {/* Sinopse do Evento */}
        <div className="w-full max-w-3xl mt-4 mb-10">
          <div
            className="relative p-6 sm:p-8 rounded-2xl overflow-hidden backdrop-blur-sm"
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
              <span>31 de outubro · 13h30 às 18h · UEPB Campus VII</span>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg">
          <Link to={ROUTES.SESSIONS} className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto uppercase font-bold px-8 py-6 text-sm rounded-xl gap-2 transition-transform hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #e8604c, #a31f1f)",
                boxShadow: "0 4px 20px rgba(232, 96, 76, 0.35)",
                border: "none",
                color: EVENT_THEME.cream,
              }}
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
