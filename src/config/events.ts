import { EVENT_THEME } from "./eventTheme";

// Eventos simultâneos do site. As mesas são associadas a um evento pela data
// aprovada (approvedDate), então não é preciso mexer no banco.
// Para adicionar/trocar um evento: inclua um item em EVENTS (em ordem de data).

export type EventId = "semex" | "muertos";

export interface EventPalette {
  accent: string;
  text: string;
  panel: string;
  line: string;
  background: string;
  boxShadow: string;
  button: string;
  titleFont?: string;
}

export interface EventInfo {
  id: EventId;
  name: string;
  /** Data do evento no formato AAAA-MM-DD */
  date: string;
  palette: EventPalette;
  modalLabel: string;
  modalMessage: string;
  modalTip: string;
}

export const EVENTS: EventInfo[] = [
  {
    id: "semex",
    name: "IX SEMEX - Mesas de RPG",
    date: "2026-11-05",
    palette: {
      accent: "#22d3ee",
      text: "#e6f7ff",
      panel: "rgba(10, 25, 49, 0.6)",
      line: "rgba(34, 211, 238, 0.35)",
      background: "linear-gradient(180deg, #050a15 0%, #0a1128 100%)",
      boxShadow: "0 0 40px rgba(0, 200, 255, 0.25)",
      button: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    },
    modalLabel: "IX SEMEX · 05 Nov",
    modalMessage: "Sua vaga foi reservada. Boa aventura em Nova Patos!",
    modalTip:
      "Chegue com antecedência no local. Você pode acompanhar ou cancelar suas inscrições no seu perfil.",
  },
  {
    id: "muertos",
    name: "Dia de los Muertos",
    date: "2026-11-07",
    palette: {
      accent: EVENT_THEME.coral,
      text: EVENT_THEME.cream,
      panel: "rgba(74, 10, 10, 0.35)",
      line: "rgba(232, 96, 76, 0.35)",
      background: `linear-gradient(160deg, ${EVENT_THEME.black} 0%, #1a0505 55%, ${EVENT_THEME.wine} 100%)`,
      boxShadow: "0 0 40px rgba(180, 30, 20, 0.35)",
      button: "linear-gradient(135deg, #e8604c, #a31f1f)",
      titleFont: EVENT_THEME.titleFont,
    },
    modalLabel: "Dia de los Muertos · 07 Nov (adiado)",
    modalMessage:
      "Sua vaga foi reservada. Prepare-se: algumas almas ainda não descansaram...",
    modalTip:
      "🕯️ Chegue com antecedência no local. Você pode acompanhar ou cancelar suas inscrições no seu perfil.",
  },
];

/** Descobre a qual evento uma mesa pertence, pela data aprovada. */
export function getEventForDate(
  approvedDate?: string | null
): EventInfo | undefined {
  if (!approvedDate) return undefined;
  const day = approvedDate.slice(0, 10);
  return EVENTS.find((e) => e.date === day);
}

