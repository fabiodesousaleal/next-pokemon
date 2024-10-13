// src/middleware.ts
import { NextResponse } from 'next/server';

export async function middleware(req: Request) {
  const referer = req.headers.get('referer') || '';

  // Verifica se a requisição vem do seu próprio domínio (localhost neste caso)
  if (!referer.startsWith('http://localhost:3000')) {
    // Não retornar nada para esconder a rota
    return new Response(null, { status: 404 });
  }

  // Aqui você pode descomentar para adicionar verificação de token no futuro
  /*
  const token = await getToken({ req });
  if (!token) {
    return new Response(null, { status: 401 });
  }
  */

  return NextResponse.next();  // Libera a requisição se a origem for válida
}

// Define que o middleware deve aplicar a todas as rotas de API
export const config = {
  matcher: '/api/:path*',  // Protege todas as rotas da API
};
