# YouTube Live Comment Analyzer - Extensão Chrome

Uma extensão poderosa para Chrome que monitora lives do YouTube em tempo real e cria um ranking dos assuntos mais discutidos nos comentários.

## 🚀 Funcionalidades

### Core Features:
- **Detecção Automática de Lives**: A extensão detecta automaticamente quando você está assistindo uma live no YouTube
- **Análise em Tempo Real**: Monitora e analisa todos os comentários que aparecem durante a transmissão
- **Ranking Dinâmico**: Cria um ranking ao vivo dos top 10 assuntos mais mencionados
- **Interface Flutuante**: Widget discreto que fica fixo na tela durante a análise
- **Estatísticas Detalhadas**: Mostra número de comentários analisados e tópicos identificados
- **Multi-linguagem**: Suporta análise em português e inglês
- **Controles Intuitivos**: Popup com controles para gerenciar a extensão

### Design Elements:
- **Interface Moderna**: Design gradiente com cores vibrantes e elementos glassmorphism
- **Widget Responsivo**: Interface adaptativa que funciona em diferentes tamanhos de tela  
- **Animações Suaves**: Transições e micro-interações que tornam a experiência mais agradável
- **Feedback Visual**: Indicadores de status em tempo real com cores e animações
- **Tipografia Clara**: Fontes legíveis com hierarquia visual bem definida
- **Tema Escuro**: Interface otimizada para não cansar a vista durante longas sessões

## 📦 Instalação

### Via Chrome Web Store (em breve)
A extensão estará disponível na Chrome Web Store em breve.

### Instalação Manual para Desenvolvimento

1. **Clone ou baixe** os arquivos da extensão
2. **Abra o Chrome** e vá para `chrome://extensions/`
3. **Ative o "Modo do desenvolvedor"** no canto superior direito
4. **Clique em "Carregar sem compactação"**
5. **Selecione a pasta** contendo os arquivos da extensão
6. A extensão será instalada e aparecerá na barra de ferramentas

## 🔧 Como Usar

### Passo a Passo:

1. **Acesse uma live do YouTube**: Vá para qualquer transmissão ao vivo no YouTube
2. **Ativação Automática**: A extensão detectará automaticamente que é uma live
3. **Widget Aparece**: Um widget discreto aparecerá no canto superior direito da tela
4. **Análise Inicia**: Os comentários começarão a ser analisados automaticamente
5. **Veja o Ranking**: O top 10 dos assuntos mais discutidos será atualizado em tempo real

### Controles Disponíveis:

- **Botão ●/○**: Minimiza/maximiza o widget
- **Popup da Extensão**: Clique no ícone da extensão para ver estatísticas detalhadas
- **"Limpar Dados"**: Reset todas as estatísticas da sessão atual
- **"Mostrar Widget"**: Alterna a visibilidade do widget na página

## 🧠 Como Funciona a Análise

### Processo de Análise:
1. **Captura de Comentários**: A extensão monitora o chat da live em tempo real
2. **Normalização de Texto**: Remove caracteres especiais e normaliza o texto
3. **Filtro de Stop Words**: Remove palavras comuns que não agregam significado
4. **Extração de Tópicos**: Identifica palavras, frases e hashtags relevantes
5. **Contagem e Ranking**: Conta as ocorrências e ordena por popularidade
6. **Atualização Contínua**: O ranking é atualizado a cada segundo

### Tipos de Análise:
- **Palavras-chave**: Termos individuais mais mencionados
- **Bigramas**: Frases de duas palavras
- **Trigramas**: Frases de três palavras  
- **Hashtags**: Tags identificadas com #
- **Menções**: Usuários mencionados com @

## 🛠️ Estrutura Técnica

### Arquivos Principais:
- `manifest.json` - Configuração da extensão
- `content-script.js` - Script que roda nas páginas do YouTube
- `popup.html/js` - Interface popup da extensão
- `background.js` - Service worker para tarefas em background
- `styles.css` - Estilos do widget flutuante

### Tecnologias Utilizadas:
- **Manifest V3** - Última versão das extensões Chrome
- **Vanilla JavaScript** - Sem dependências externas
- **CSS3** - Design moderno com gradientes e animações
- **Chrome Extensions API** - Integração nativa com o browser
- **Mutation Observer** - Detecção de novos comentários em tempo real

## 🎯 Casos de Uso

### Para Criadores de Conteúdo:
- **Monitorar Engajamento**: Veja quais assuntos mais interessam sua audiência
- **Adaptar Conteúdo**: Mude o foco da live baseado nos tópicos em alta
- **Identificar Tendências**: Descubra novos temas para futuro conteúdo

### Para Espectadores:
- **Visão Geral**: Entenda rapidamente sobre o que a live está tratando
- **Participação**: Saiba quais assuntos estão sendo mais discutidos
- **Navegação**: Identifique se a live te interessa pelos tópicos principais

### Para Pesquisadores:
- **Análise de Sentimento**: Estude reações da audiência em tempo real
- **Tendências Sociais**: Identifique tópicos emergentes na comunidade
- **Comportamento Online**: Analise padrões de discussão em lives

## 🔒 Privacidade e Segurança

### Dados Locais:
- **Nenhum servidor externo**: Toda análise é feita localmente no seu browser
- **Sem coleta de dados**: Não coletamos nem armazenamos informações pessoais
- **Sem tracking**: Não rastreamos sua atividade ou dados de navegação

### Permissões Mínimas:
- **activeTab**: Apenas para acessar a aba ativa quando necessário
- **storage**: Para salvar configurações locais da extensão

## 🐛 Resolução de Problemas

### Problemas Comuns:

**A extensão não detecta a live:**
- Aguarde alguns segundos após entrar na live
- Verifique se realmente é uma transmissão ao vivo (não um vídeo)
- Recarregue a página se necessário

**Widget não aparece:**
- Clique no ícone da extensão e em "Mostrar Widget"
- Verifique se a extensão está ativa em `chrome://extensions/`

**Comentários não são analisados:**
- Algumas lives podem ter chat desabilitado
- Verifique se você consegue ver os comentários normalmente
- Recarregue a página e tente novamente

### Debug:
Para desenvolvedores, abra o DevTools (F12) e verifique o console para logs da extensão.

## 🚀 Próximas Funcionalidades

### Em Desenvolvimento:
- **Exportar Dados**: Salvar relatórios da análise em JSON/CSV
- **Filtros Avançados**: Filtrar por tipos de comentários ou usuários
- **Análise de Sentimento**: Identificar comentários positivos/negativos
- **Histórico de Sessions**: Salvar análises de lives anteriores
- **Notificações**: Alertas quando novos tópicos emergem

### Futuras Melhorias:
- **Suporte a mais idiomas**: Expandir análise para outras linguagens
- **Machine Learning**: IA para melhor categorização de tópicos
- **Integração com APIs**: Conectar com serviços de análise externa
- **Tema Claro**: Opção de interface clara além da escura

## 📄 Licença

Esta extensão é distribuída sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades  
- Contribuir com código
- Melhorar a documentação

## 📞 Suporte

Se encontrar algum problema ou tiver sugestões:
1. Abra uma issue no repositório do projeto
2. Descreva detalhadamente o problema encontrado
3. Inclua informações sobre seu sistema e versão do Chrome

---

**Desenvolvido com ❤️ para a comunidade do YouTube**

*Esta extensão não é afiliada ou endossada pelo YouTube ou Google.*