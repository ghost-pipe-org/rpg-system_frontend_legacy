/**
 * Retorna uma string de contexto temporal relativo para uma data.
 * Ex: "amanhã", "hoje", "em 3 dias", "há 2 dias"
 */
export function getRelativeDate(date: Date | string): string {
  const target = new Date(date);
  const now = new Date();

  // Zera horas para comparar só dias
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const diffMs = targetStart.getTime() - todayStart.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'hoje';
  if (diffDays === 1) return 'amanhã';
  if (diffDays === -1) return 'ontem';
  if (diffDays > 1 && diffDays <= 7) return `em ${diffDays} dias`;
  if (diffDays > 7 && diffDays <= 30) return `em ${Math.round(diffDays / 7)} sem.`;
  if (diffDays > 30) return `em ${Math.round(diffDays / 30)} meses`;
  if (diffDays < -1) return `há ${Math.abs(diffDays)} dias`;
  return '';
}
