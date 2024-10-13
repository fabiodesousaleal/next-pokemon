import { z } from "zod";

// Definindo o schema de validação com Zod
export const usuarioCadastroSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("Insira um email válido"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmarSenha: z.string().min(6, "Confirmação de senha é obrigatória"),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

// Exportando o tipo inferido do schema para ser reutilizado
export type UserFormData = z.infer<typeof usuarioCadastroSchema>;
