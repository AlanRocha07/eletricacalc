# ElétricaCalc

Calculadora de dimensionamento elétrico conforme NBR 5410, NBR 5444 e NBR 14136.

## Funcionalidades

- Dimensionamento de circuitos: corrente, bitola, disjuntor e queda de tensão
- Cálculo de pontos por ambiente conforme NBR 5410
- Referência rápida com tabelas normativas
- Funciona como PWA (instalável no celular sem app store)

---

## Instalação local (desenvolvimento)

Você precisa ter o Node.js instalado (versão 18 ou superior).

```bash
# 1. Instalar as dependências
npm install

# 2. Rodar em modo de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no navegador.

---

## Build para produção

```bash
npm run build
```

Os arquivos prontos para deploy ficam na pasta `dist/`.

---

## Deploy no GitHub Pages (gratuito)

### Passo 1 — Criar o repositório

Crie um repositório no GitHub com o nome `eletricacalc` (ou o nome que preferir).

### Passo 2 — Ajustar o vite.config.js

Se o repositório não for o repositório raiz (ex: `seuusuario.github.io/eletricacalc`),
adicione a propriedade `base` no `vite.config.js`:

```js
export default defineConfig({
  base: '/eletricacalc/', // nome do seu repositório
  plugins: [react()],
  // ...
})
```

### Passo 3 — Fazer o build e o push

```bash
npm run build
git init
git add .
git commit -m "primeiro deploy"
git remote add origin https://github.com/SEU_USUARIO/eletricacalc.git
git push -u origin main
```

### Passo 4 — Ativar o GitHub Pages

No GitHub, vá em **Settings → Pages → Source** e selecione **GitHub Actions**.
Crie o arquivo `.github/workflows/deploy.yml` com o conteúdo abaixo:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

A cada push na branch `main`, o deploy é feito automaticamente.
O app ficará disponível em `https://seuusuario.github.io/eletricacalc/`.

---

## Adicionar autenticação (Supabase)

Quando quiser controlar o acesso por assinatura, o ponto de entrada é o `src/App.jsx`.
O comentário no arquivo já indica onde adicionar a verificação de login.

Instale o cliente do Supabase:

```bash
npm install @supabase/supabase-js
```

Crie o arquivo `src/lib/supabase.js`:

```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'SUA_SUPABASE_URL',
  'SUA_SUPABASE_ANON_KEY'
)
```

E no `App.jsx`, proteja a rota:

```jsx
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) return null
  return user ? <Home /> : <LoginPage />
}
```

---

## PWA — Ícones

Para o app ser instalável, coloque os arquivos na pasta `public/icons/`:
- `icon-192.png` — 192×192 pixels
- `icon-512.png` — 512×512 pixels

---

## Normas de referência

- ABNT NBR 5410:2004 — Instalações elétricas de baixa tensão
- ABNT NBR 5444:1989 — Símbolos gráficos para instalações prediais
- ABNT NBR 14136:2012 — Plugues e tomadas para uso doméstico e análogo
- ABNT NBR 5419:2015 — Proteção contra descargas atmosféricas (SPDA)
