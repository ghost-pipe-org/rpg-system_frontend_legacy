import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, "Nome completo deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo")
    .optional()
    .or(z.literal('')),
  phoneNumber: z
    .string()
    .min(11, "Telefone deve ter 11 dígitos (com DDD)")
    .max(15, "Número muito longo")
    .optional()
    .or(z.literal('')),
}).refine(data => {
  return (data.name && data.name.trim() !== '') || (data.phoneNumber && data.phoneNumber.trim() !== '');
}, "Pelo menos um dado (nome ou telefone) deve ser informado para atualização.");

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const updateSecurityPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "A senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .max(50, "Senha não pode ter mais de 50 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número")
      .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial"),
    confirmNewPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Senhas não coincidem",
    path: ["confirmNewPassword"],
  });

export const updateSecurityEmailSchema = z.object({
  currentPassword: z.string().min(1, "A senha atual é obrigatória"),
  newEmail: z
    .string()
    .email("Por favor, insira um email válido")
    .min(2, "Email deve ter mais de 2 caracteres")
    .max(100, "Email não pode ter mais de 100 caracteres"),
});

export type UpdateSecurityPasswordFormData = z.infer<typeof updateSecurityPasswordSchema>;
export type UpdateSecurityEmailFormData = z.infer<typeof updateSecurityEmailSchema>;

