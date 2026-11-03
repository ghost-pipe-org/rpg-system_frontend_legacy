import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(2, {
    message: "Email tem que ter mais de 2 caracteres.",
  }),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(50, "Senha muito longa"),
});

export const registerSchema = z
  .object({
    fullname: z
      .string()
      .min(3, "Nome completo deve ter pelo menos 3 caracteres")
      .max(100, "Nome muito longo"),
    email: z
      .email("Por favor, insira um email válido")
      .min(2, "Email deve ter mais de 2 caracteres")
      .max(100, "Email não pode ter mais de 100 caracteres"),
    masterConfirm: z.boolean(),
    registrationNumber: z
      .string()
      .optional(),
    phone: z
      .string()
      .min(11, "Telefone deve ter 11 dígitos (com DDD)")
      .max(15, "Número muito longo"),
    password: z
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .max(50, "Senha não pode ter mais de 50 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número")
      .regex(
        /[^A-Za-z0-9]/,
        "Senha deve conter pelo menos um caractere especial"
      ),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  })
  .superRefine((data, ctx) => {
    if (data.masterConfirm) {
      if (!data.registrationNumber || data.registrationNumber.trim() === "") {
        ctx.addIssue({
          code: "custom",
          path: ["registrationNumber"],
          message: "Número de matrícula é obrigatório para mestres",
        });
      } else if (!/^\d{9}$/.test(data.registrationNumber)) {
        ctx.addIssue({
          code: "custom",
          path: ["registrationNumber"],
          message: "Matrícula deve ter exatamente 9 dígitos numéricos",
        });
      }
    }
  });

export const forgotPasswordSchema = z.object({
  email: z
    .email("Por favor, insira um email válido")
    .min(2, "Email deve ter mais de 2 caracteres")
    .max(100, "Email não pode ter mais de 100 caracteres"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .max(50, "Senha não pode ter mais de 50 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número")
      .regex(
        /[^A-Za-z0-9]/,
        "Senha deve conter pelo menos um caractere especial"
      ),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
