# FLY Imob — Dashboard Financeiro 2026

Dashboard financeiro interno para os sócios, com login individual, dados em tempo real e painel de reserva de emergência.

---

## Stack
- **Next.js 14** (React) — front-end
- **Supabase** — banco de dados + autenticação
- **Vercel** — hospedagem gratuita
- **Tailwind CSS** — estilo

---

## Passo a Passo para Publicar

### 1. Criar conta no Supabase (gratuito)
1. Acesse https://supabase.com e crie uma conta
2. Clique em **New Project**, dê o nome `flyimob`
3. Escolha a região **South America (São Paulo)**
4. Aguarde o projeto criar (~1 min)

### 2. Criar o banco de dados
1. No painel do Supabase, vá em **SQL Editor → New Query**
2. Cole todo o conteúdo do arquivo `supabase_schema.sql`
3. Clique em **Run** (o banco e os dados de 2026 serão criados)

### 3. Pegar as chaves do Supabase
1. Vá em **Settings → API**
2. Copie:
   - `Project URL` → é o `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → é o `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Criar os usuários (sócios)
1. No Supabase, vá em **Authentication → Users → Add user**
2. Crie um usuário para cada sócio com e-mail e senha
3. O e-mail do admin (quem pode lançar dados) vai no `.env.local`

### 5. Configurar as variáveis de ambiente
Edite o arquivo `.env.local` com os valores do passo 3:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_ADMIN_EMAIL=seu@email.com
```

### 6. Testar localmente (opcional)
```bash
npm install
npm run dev
# Acesse http://localhost:3000
```

### 7. Publicar no Vercel (gratuito)
1. Crie conta em https://vercel.com (pode entrar com GitHub)
2. Instale o CLI: `npm i -g vercel`
3. Na pasta do projeto, rode: `vercel`
4. Quando pedir as variáveis de ambiente, adicione as 3 do `.env.local`
5. Pronto! Você terá um link tipo `https://flyimob.vercel.app`

**Ou pela interface web do Vercel:**
1. Suba o projeto para um repositório GitHub (privado)
2. No Vercel, clique em **Import Project** → selecione o repo
3. Em **Environment Variables**, adicione as 3 variáveis
4. Clique **Deploy**

---

## Como usar no dia a dia

### Você (admin)
1. Acesse o link do app e faça login com seu e-mail/senha
2. Vá na aba **✏ Lançar Dados**
3. Preencha o **Imob Líquido** do mês que fechou
4. Clique em **Salvar e publicar** — os sócios já veem na hora

### Sócios
1. Acessam o link do app
2. Fazem login com o e-mail/senha que você criou para eles
3. Só visualizam — não conseguem editar dados

---

## Estrutura dos arquivos
```
flyimob/
├── app/
│   ├── layout.tsx          # Layout raiz
│   ├── page.tsx            # Redirect login/dashboard
│   ├── globals.css         # Estilos globais
│   ├── login/page.tsx      # Página de login
│   └── dashboard/page.tsx  # Dashboard principal
├── components/
│   ├── TopBar.tsx          # Barra de navegação
│   ├── KpiCard.tsx         # Cards de indicadores
│   ├── TabVisaoGeral.tsx   # Aba visão geral + gráficos
│   ├── TabDespesas.tsx     # Aba de despesas
│   ├── TabMensal.tsx       # Aba por mês
│   ├── TabEmergencia.tsx   # Aba reserva de emergência
│   └── TabAdmin.tsx        # Aba de lançamento (admin)
├── lib/
│   ├── supabase.ts         # Client Supabase
│   └── data.ts             # Constantes e tipos
├── supabase_schema.sql     # SQL para criar o banco
├── .env.local              # Variáveis de ambiente (NÃO suba no git)
└── README.md               # Este arquivo
```

---

## Dúvidas frequentes

**Como adicionar um novo sócio?**
Supabase → Authentication → Users → Add user

**Como remover o acesso de alguém?**
Supabase → Authentication → Users → Delete user

**E se eu quiser trocar o nome "FLY Imob"?**
Edite os arquivos `app/layout.tsx` e `components/TopBar.tsx`

**O app funciona no celular?**
Sim, é totalmente responsivo.
