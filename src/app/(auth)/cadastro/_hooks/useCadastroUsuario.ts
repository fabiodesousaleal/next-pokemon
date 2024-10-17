import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserFormData } from "../_schemas/usuario-cadastro-schema";

export function useCadastroUsuario() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCadastroUsuario = async (data:UserFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cadastro-usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Usuário registrado com sucesso!");
        router.push("/login");
      } else {
        handleApiErrors(res.status, result.message);
      }
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      toast.error("Ocorreu um erro inesperado. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiErrors = (status: number, message: string) => {
    if (status === 400 && message === "Email already in use") {
      toast.error("O email já está em uso. Tente outro.");
    } else {
      toast.error("Erro ao registrar usuário. Verifique os dados e tente novamente.");
    }
  };

  return { handleCadastroUsuario, isLoading };
}
