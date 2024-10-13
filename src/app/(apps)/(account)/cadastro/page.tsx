"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"  // Importando o toast

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usuarioCadastroSchema, UserFormData } from "./_schemas/usuario-cadastro-schema"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export default function UserRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()  // hook para redirecionar

  const form = useForm<UserFormData>({
    resolver: zodResolver(usuarioCadastroSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    },
  })

  async function onSubmit(data: UserFormData) {
    setIsLoading(true)
  
    try {
      const res = await fetch("/api/cadastro-usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          senha: data.senha,
        }),
      })

      if (res.ok) {
        const result = await res.json()
        toast.success("Usuário registrado com sucesso!")  // Exibe o toast de sucesso
        router.push("/login")  // Redireciona para a página de login
      } else if (res.status === 400) { // Verificando se o erro é 400 (Bad Request)
        const errorData = await res.json();
        if (errorData.message === "Email already in use") { // Checando mensagem específica
          toast.error("O email já está em uso. Tente outro.")  // Exibe o toast de erro
        } else {
          toast.error("Erro ao registrar usuário.")  // Exibe o toast de erro genérico
        }
      } else {
        toast.error("Erro ao registrar usuário.")  // Exibe o toast de erro genérico
      }
    } catch (error) {
      console.error("Erro ao salvar usuário:", error)
      toast.error("Erro ao registrar usuário.")  // Exibe o toast de erro genérico
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-6 bg-card rounded-lg shadow-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Crie sua conta</h1>
        <p className="text-muted-foreground">Entre com suas informações básicas</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="johndoe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="senha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmarSenha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
                   
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrar"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
