# TODO IMPROVEMENTS

> Last updated: 2026-09-12

## Pending Changes

### Confirmar que o fallback do `#chatframe` cobre a ausência de `all_frames`

- **Category:** Bug
- **What:** `manifest.json` não declara `"all_frames": true` no `content_scripts`, então `content-script.js` nunca roda dentro do iframe `#chatframe` — o branch `isChatFrameContext` em `findChatMessagesContainer()` (linha ~666) é hoje inalcançável. O único caminho realmente usado é o acesso cross-frame via `iframe.contentDocument`, que funciona por serem mesma origem (`www.youtube.com`), mas não foi validado nesta sessão contra todas as variações de layout do chat (pop-out, chat replay, etc).
- **Where:** `manifest.json` (`content_scripts[0]`), `content-script.js` → `findChatMessagesContainer()`.
- **Why:** Se o acesso cross-frame falhar em algum cenário (ex.: mudança do YouTube em COOP/sandboxing do iframe), a extensão para de capturar comentários silenciosamente (só loga um `console.warn`). Adicionar `all_frames: true` ativaria o branch dedicado, mas também faz o script inteiro (`YouTubeLiveAnalyzer`, widget, etc.) instanciar dentro do iframe do chat — precisa de um guard extra pra não duplicar o widget nessa segunda instância. Por isso não é mudança "segura" de aplicar sem entender o impacto.
- **Risk:** Mudança de manifest + necessidade de guard adicional para não rodar a lógica de UI dentro do iframe. Requer teste manual numa live real.
- **Effort:** Medium

### `commentHistory` (Set) cresce sem limite durante a sessão

- **Category:** Bug
- **What:** `this.commentHistory` (um `Set` de strings) só é limpo em `clearData()` (clique manual em "Limpar dados"). Em uma live longa com chat de alto volume, isso acumula todo texto único de comentário na memória da aba pelo tempo inteiro da análise.
- **Where:** `content-script.js` → `processNewComment()` / `commentHistory`.
- **Why:** Vazamento de memória lento em lives de várias horas; pode degradar a aba do Chrome. Corrigir exige decidir uma política (TTL, limite de tamanho com FIFO, etc.), o que é uma decisão de produto/design, não só um guard óbvio.
- **Risk:** Baixo tecnicamente, mas a política de expiração certa depende de como o dedup de comentários deve se comportar (evitar reanalisar o mesmo comentário se ele reaparecer após X minutos?).
- **Effort:** Low/Medium

### Remover scaffold morto React/Vite/Tailwind

- **Category:** Refactor
- **What:** `manifest.json` só carrega `content-script.js`, `popup.js`, `background.js` (JS puro). `src/App.tsx` é o placeholder padrão do Bolt/StackBlitz ("Start prompting (or editing) to see magic happen :)"), nunca editado. `index.html`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.app.json`/`tsconfig.node.json` e as deps `react`, `react-dom`, `lucide-react`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer`, `vite` no `package.json` não têm nenhuma ligação com a extensão publicada. O próprio README já descreve a stack como "Vanilla JavaScript - Sem dependências externas", contradizendo esse scaffold.
- **Where:** `src/`, `index.html`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.app.json`, `tsconfig.node.json`, `package.json` (deps + scripts `dev`/`build`/`preview`), `.github/workflows/ci.yml` (step `npm run build`).
- **Why:** Codebase duplo confunde qualquer dev novo ("por que tem React numa extensão vanilla JS?"), infla `node_modules`/CI, e o build gera 142 KB de JS que nunca é usado por ninguém. `npm run typecheck` já falha hoje nesse scaffold (`src/App.tsx(1,1): 'React' is declared but its value is never read`) — evidência de que ninguém mantém esse código.
- **Risk:** Remover scripts/CI exige decidir o que substitui o step de build no CI (talvez empacotar a extensão em .zip, ou simplesmente remover o step). Se havia planos reais de migrar a UI pra React (popup/widget), essa decisão muda tudo — por isso fica pra você decidir, não é só "apagar arquivo".
- **Effort:** Medium

### Adicionar testes automatizados pro core de análise

- **Category:** Test
- **What:** Instalar um runner (ex.: `vitest`, já que o projeto usa Vite) e escrever testes para `analyzeComment`, `extractCommentText` e `incrementTopic` em `content-script.js` — a lógica que decide o que vira "tópico" no ranking. Hoje não existe nenhum teste automatizado no projeto.
- **Where:** novo `content-script.test.js` (ou extrair a classe `YouTubeLiveAnalyzer` pra um módulo importável, já que hoje ela só roda via `<script>` direto no browser).
- **Why:** É a lógica de negócio central da extensão e mudou várias vezes (inclusive nesta sessão, ao remover métodos duplicados). Sem teste, uma regressão silenciosa como a dos métodos duplicados (ver commit desta sessão) pode voltar sem ninguém notar.
- **Risk:** Adiciona devDependency nova (`vitest`) e provavelmente exige refatorar `content-script.js` pra exportar a classe (hoje é um script solto, sem `export`), o que é uma mudança estrutural — por isso fica de fora do "safe change".
- **Effort:** Medium

### Revisar `npm audit` (20 vulnerabilidades: 3 low, 5 moderate, 12 high)

- **Category:** Dependency
- **What:** `npm install` reportou 20 vulnerabilidades nas deps atuais (a maioria provavelmente na cadeia de `vite`/`eslint`/`react` — ligado ao item do scaffold morto acima). Rodar `npm audit` pra ver detalhes e decidir entre `npm audit fix` ou upgrades manuais.
- **Where:** `package.json` / `package-lock.json`.
- **Why:** Nível "high" merece triagem, mesmo em devDependencies (superfície de ataque em build/CI).
- **Risk:** `npm audit fix --force` pode subir major version de algo (ex.: eslint 9→10, como o npx já tentou instalar) e quebrar configs — precisa de teste manual depois.
- **Effort:** Low (triagem) / Medium (se precisar de upgrade major)

### Sincronizar versão entre `package.json` e `manifest.json`

- **Category:** Refactor
- **What:** `package.json` está em `"version": "0.0.0"`, `manifest.json` em `"version": "1.0"`. Não há processo de release visível ligando os dois.
- **Where:** `package.json`, `manifest.json`.
- **Why:** Evita confusão em release/changelog futuro (qual número é a fonte da verdade?).
- **Risk:** Baixo, mas decisão de processo (semver? versão só na store?) é do time.
- **Effort:** Low

### Extração de tópicos: normalizar plural/singular e conjugações (stemming leve)

- **Category:** Feature
- **What:** `analyzeComment` conta "jogo" e "jogos", "ganhou" e "ganhar" como tópicos separados, diluindo o ranking. Um stemmer leve em PT/EN (ou uma normalização simples de sufixos comuns) juntaria essas variações.
- **Where:** `content-script.js` → `analyzeComment`.
- **Why:** Melhora bastante a qualidade do "Top 10" sem mudar a UI.
- **Risk:** Qualidade de stemming é subjetiva (pode juntar palavras que não deveriam), e adicionar uma lib de stemming é uma dependência nova — decisão de produto, não só bug fix.
- **Effort:** Medium

### Funcionalidades do roadmap do próprio README (ainda não implementadas)

- **Category:** Feature
- **What:** README promete "Exportar Dados (JSON/CSV)", "Análise de Sentimento", "Histórico de Sessions", "Tema Claro" — nenhuma existe no código hoje.
- **Where:** novo código em `content-script.js`/`popup.js`/`popup.html` conforme a feature.
- **Why:** São promessas públicas do README que criam expectativa não entregue.
- **Risk:** Cada uma é um escopo de feature própria (UI nova, storage novo, etc.) — precisa priorização, não é mudança segura de aplicar sozinha.
- **Effort:** High (por feature)
