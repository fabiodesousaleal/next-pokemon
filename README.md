# INTRODUÇÃO

## INSTALANDO PRISMA criando modelo User
    npm install prisma --save-dev
    npm install @prisma/client
    npx prisma init
    npx prisma generate
    npx prisma migrate dev --name init

### lib para criptografia do passwords (verificar uma lib mais forte)
    npm install bcrypt

## toast 
npm install sonner

## documentação codeblock
npm install prismjs

# Autenticação - session - token
## Passo a Passo
    1 - Criar arquivo route.ts "/apps/api/auth/[...nextauth]/route.ts"
    npm install next-auth
    ## Criar .env
    ## adicionar variaveis: NEXTAUTH_URL e NEXTAUTH_SECRET

    openssl rand -base64 32


## GIT INSTRUCTIONS 
    - git flow feature start "text"
    - git flow feature finish "text"
    - git flow release start 1.0.0
    - git flow release finish 1.0.0
    - git flow hotfix start corrige-bug-login


