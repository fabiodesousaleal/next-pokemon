// src/app/api/cadastro-user/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Ajuste conforme a estrutura do seu projeto
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const { nome, email, senha } = await req.json();

  try {
    // Verifica se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 });
    }

    // Gera o hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10); // 10 é o número de rounds de salting

    // Cria o novo usuário com a senha hash
    const newUser = await prisma.user.create({
      data: {
        nome: nome,
        email: email,
        senha: hashedPassword, // Use a senha criptografada aqui
        confirmarSenha: hashedPassword,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Error creating user" }, { status: 500 });
  }
}
