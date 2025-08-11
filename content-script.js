class YouTubeLiveAnalyzer {
  constructor() {
    this.isLive = false;
    this.commentHistory = new Set();
    this.topicCounts = new Map();
    this.observer = null;
    this.updateInterval = null;
    this.isAnalyzing = false;
    this.startTime = Date.now();
    
    const baseStopWords = [
      'a', 'e', 'o', 'de', 'do', 'da', 'em', 'um', 'uma', 'com', 'não', 'nao', 'para', 'por', 'se', 'no', 'na', 'mais', 'que', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua', 'ou', 'ser', 'quando', 'muito', 'há', 'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso', 'ela', 'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'suas', 'numa', 'pelos', 'pelas', 'esse', 'esses', 'essa', 'essas', 'meu', 'minha', 'meus', 'minhas', 'teu', 'tua', 'teus', 'tuas', 'nosso', 'nossa', 'nossos', 'nossas', 'dele', 'dela', 'deles', 'delas', 'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses', 'essas', 'aquele', 'aquela', 'aqueles', 'aquelas', 'vai', 'vou', 'vc', 'você', 'voce', 'kkkk', 'rsrs', 'haha', 'kkkkk', 'pra',
      'the', 'and', 'to', 'of', 'a', 'in', 'is', 'it', 'you', 'that', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'i', 'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'word', 'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said', 'there', 'each', 'which', 'she', 'do', 'how', 'their', 'if', 'will', 'up', 'other', 'about', 'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'into', 'him', 'has', 'two', 'more', 'go', 'no', 'way', 'could', 'my', 'than', 'first', 'been', 'call', 'who', 'its', 'now', 'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part', 'haha', 'lol', 'lmao', 'kk', 'kkk', 'kkkk', 'kkkkkk', 'rs', 'rsrs', 'rsrsrs', 'hahaha', 'ahaha', 'hehe', 'hehehe', 'lolol', 'rofl',
      'oi', 'olá', 'ola', 'hey', 'hi', 'hello', 'yo', 'opa', 'eae', 'iae', 'salve',
      'obg', 'obrigado', 'obrigada', 'valeu', 'vlw', 'pf', 'pfv', 'porfavor', 'por favor', 'pls', 'please', 'thx', 'thanks', 'thank',
      'ok', 'okay', 'okey', 'sim', 'nao', 'não', 'yeah', 'yep', 'yup', 'nope', 'no',
      'mano', 'man', 'cara', 'bro', 'bruh', 'dude', 'véi', 'vei', 'tmj', 'tamo', 'junto', 'juntos', 'bora', 'partiu',
      'galera', 'pessoal', 'gente', 'amigos', 'amigo', 'amiga',
      'bom', 'boa', 'dia', 'tarde', 'noite',
      'manda', 'like', 'inscrito', 'inscreve', 'inscrevam', 'canal', 'vídeo', 'video', 'stream', 'live',
      'aff', 'uau', 'wow', 'omg', 'eita', 'vish', 'mds', 'meu deus', 'meudeus', 'caramba', 'pqp',
      'tipo', 'coisa', 'coisas', 'negocio', 'negócio', 'bagulho', 'parada'
    ];

    this.stopWords = new Set(this._buildStopWords(baseStopWords));
  
    this.init();
  }


  _stripAccents(str) {
    try {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    } catch {
      return str;
    }
  }

  _buildStopWords(...lists) {
    const collected = new Set();
    lists.flat().forEach((w) => {
      if (!w) return;
      const lw = String(w).toLowerCase().trim();
      if (!lw) return;
      collected.add(lw);
      const noAcc = this._stripAccents(lw);
      if (noAcc && noAcc !== lw) collected.add(noAcc);
    });
    return Array.from(collected);
  }
  
  init() {
    console.log('🚀 YouTube Live Analyzer iniciando...');
    this.checkIfLive();
    this.createAnalyzerUI();
    
    let currentUrl = window.location.href;
    const urlObserver = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        console.log('📍 URL mudou para:', currentUrl);
        setTimeout(() => this.checkIfLive(), 1000);
      }
    });
    
    urlObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'getStatus') {
        sendResponse({
          isLive: this.isLive,
          isAnalyzing: this.isAnalyzing,
          commentCount: this.commentHistory.size,
          topicCount: this.topicCounts.size,
          topTopics: Array.from(this.topicCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
        });
      } else if (request.action === 'toggleWidget') {
        this.toggleWidget();
        sendResponse({ success: true });
      } else if (request.action === 'clearData') {
        this.clearData();
        sendResponse({ success: true });
      }
    });
  }
  
  checkIfLive() {
    const isWatchPage = window.location.pathname === '/watch';
    
    if (isWatchPage) {
      console.log('📺 Página de vídeo detectada, verificando se é live...');
      
      setTimeout(() => {
        const liveIndicators = [
          document.querySelector('.ytp-live-badge, .ytp-live'),
          document.querySelector('[aria-label*="AO VIVO"], [aria-label*="LIVE"], [title*="AO VIVO"], [title*="LIVE"]'),
          document.querySelector('#chatframe, yt-live-chat-app, #chat'),
          document.querySelector('yt-live-chat-renderer'),
          ...Array.from(document.querySelectorAll('*')).filter(el => 
            el.textContent && (el.textContent.includes('AO VIVO') || el.textContent.includes('LIVE'))
          )
        ];
        
        const isLive = liveIndicators.some(indicator => indicator !== null);
        
        console.log('🔍 Indicadores encontrados:', liveIndicators.filter(i => i).length);
        
        if (isLive) {
          console.log('✅ Live detectada!');
          this.isLive = true;
          this.startAnalyzing();
        } else {
          console.log('❌ Não é uma live');
          this.isLive = false;
          this.stopAnalyzing();
        }
        
        this.updateAnalyzerUI();
      }, 3000);
    } else {
      this.isLive = false;
      this.stopAnalyzing();
      this.updateAnalyzerUI();
    }
  }
  
  createAnalyzerUI() {
    if (document.getElementById('live-analyzer-widget')) return;
    
    const widget = document.createElement('div');
    widget.id = 'live-analyzer-widget';
    widget.innerHTML = `
      <div class="analyzer-header">
        <h3>🔴 Live Analyzer</h3>
        <button id="toggle-analyzer">●</button>
      </div>
      <div class="analyzer-content">
        <div class="status">Aguardando live...</div>
        <div class="stats">
          <div class="stat">
            <span class="label">Comentários:</span>
            <span class="value" id="comment-count">0</span>
          </div>
          <div class="stat">
            <span class="label">Tópicos:</span>
            <span class="value" id="topic-count">0</span>
          </div>
        </div>
        <div class="ranking">
          <h4>Top 10 Assuntos</h4>
          <div id="ranking-list"></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(widget);
    
    const toggleBtn = document.getElementById('toggle-analyzer');
    const content = widget.querySelector('.analyzer-content');
    
    toggleBtn.addEventListener('click', () => {
      const isVisible = content.style.display !== 'none';
      content.style.display = isVisible ? 'none' : 'block';
      toggleBtn.textContent = isVisible ? '○' : '●';
    });
  }
  
  toggleWidget() {
    const widget = document.getElementById('live-analyzer-widget');
    if (widget) {
      widget.style.display = widget.style.display === 'none' ? 'block' : 'none';
    }
  }
  
  clearData() {
    this.commentHistory.clear();
    this.topicCounts.clear();
    this.updateAnalyzerUI();
  }
  
  updateAnalyzerUI() {
    const widget = document.getElementById('live-analyzer-widget');
    if (!widget) return;
    
    const status = widget.querySelector('.status');
    const commentCount = widget.querySelector('#comment-count');
    const topicCount = widget.querySelector('#topic-count');
    const rankingList = widget.querySelector('#ranking-list');
    
    if (this.isLive && this.isAnalyzing) {
      status.textContent = '🔴 Analisando live...';
      status.style.color = '#ff4444';
    } else if (this.isLive) {
      status.textContent = '⏸️ Live detectada (pausada)';
      status.style.color = '#ffaa44';
    } else {
      status.textContent = '⚫ Não é uma live';
      status.style.color = '#888';
    }
    
    commentCount.textContent = this.commentHistory.size;
    topicCount.textContent = this.topicCounts.size;
    
    const sortedTopics = Array.from(this.topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    rankingList.innerHTML = sortedTopics.length === 0 
      ? '<div class="no-data">Nenhum tópico ainda...</div>'
      : sortedTopics.map((topic, index) => `
          <div class="ranking-item">
            <span class="rank">#${index + 1}</span>
            <span class="topic">${topic[0]}</span>
            <span class="count">${topic[1]}</span>
          </div>
        `).join('');

    chrome.runtime.sendMessage({
      action: 'updateBadge',
      count: this.commentHistory.size,
      isLive: this.isLive && this.isAnalyzing
    });
  }
  
  startAnalyzing() {
    if (this.isAnalyzing) return;
    
    this.isAnalyzing = true;
    this.commentHistory.clear();
    this.topicCounts.clear();
    this.startTime = Date.now();
    
    this.observeComments();
    
    this.updateInterval = setInterval(() => {
      this.updateAnalyzerUI();
    }, 2000);
    
    console.log('🔴 Iniciando análise da live...');
  }
  
  stopAnalyzing() {
    this.isAnalyzing = false;
    
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    console.log('⏹️ Análise parada.');
  }

  observeComments() {
    const trySetup = () => {
      const container = this.findChatMessagesContainer();
      if (!container) {
        console.log('❌ Contêiner de mensagens não encontrado ainda, tentando novamente em 2s...');
        setTimeout(trySetup, 2000);
        return;
      }

      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }

      this.observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType !== Node.ELEMENT_NODE) return;

            const candidates = this.collectMessageElements(node);
            if (candidates.length === 0 && this.isCommentElement(node)) {
              this.processNewComment(node);
            } else {
              candidates.forEach((el) => this.processNewComment(el));
            }
          });
        });
      });

      this.observer.observe(container, { childList: true, subtree: false });
      console.log('👀 Observer configurado no container de mensagens:', container);

      this.processExistingComments(container);
    };

    trySetup();
  }

  findChatMessagesContainer() {
    const path = window.location.pathname || '';
    const isChatFrameContext = path.startsWith('/live_chat');

    const resolveItemsFromDoc = (doc) => {
      if (!doc) return null;

      const itemList = doc.querySelector('yt-live-chat-item-list-renderer');
      if (!itemList) return null;

      let items = itemList.querySelector('#items');
      if (items) return items;

      const sr = itemList.shadowRoot;
      if (sr) {
        items = sr.querySelector('#items');
        if (items) return items;
      }

      items = doc.querySelector('[role="log"]');
      return items || null;
    };

    if (isChatFrameContext) {
      return resolveItemsFromDoc(document);
    }

    const iframe = document.querySelector('#chatframe');
    if (!iframe) return null;

    try {
      const frameDoc = iframe.contentDocument || iframe.contentWindow?.document;
      return resolveItemsFromDoc(frameDoc);
    } catch (e) {
      console.warn('⚠️ Não foi possível acessar o documento do chatframe. Verifique o manifest (all_frames e matches).', e);
      return null;
    }
  }

  collectMessageElements(root) {
    if (!root.querySelectorAll) return [];
    const selector = [
      'yt-live-chat-text-message-renderer',
      'yt-live-chat-paid-message-renderer',
      'yt-live-chat-paid-sticker-renderer',
      'yt-live-chat-membership-item-renderer',
      'yt-live-chat-viewer-engagement-message-renderer'
    ].join(', ');

    return Array.from(root.querySelectorAll(selector));
  }

  isCommentElement(element) {
    const t = element.tagName || '';
    return t === 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER' ||
           t === 'YT-LIVE-CHAT-PAID-MESSAGE-RENDERER' ||
           t === 'YT-LIVE-CHAT-PAID-STICKER-RENDERER' ||
           t === 'YT-LIVE-CHAT-MEMBERSHIP-ITEM-RENDERER' ||
           t === 'YT-LIVE-CHAT-VIEWER-ENGAGEMENT-MESSAGE-RENDERER' ||
           element.classList?.contains('yt-live-chat-text-message-renderer') ||
           element.id?.includes('message');
  }

  processExistingComments(container) {
    const selector = [
      'yt-live-chat-text-message-renderer',
      'yt-live-chat-paid-message-renderer',
      'yt-live-chat-paid-sticker-renderer',
      'yt-live-chat-membership-item-renderer',
      'yt-live-chat-viewer-engagement-message-renderer'
    ].join(', ');

    const messages = container.querySelectorAll(selector);
    console.log(`📝 Processando ${messages.length} comentários existentes no container`);
    messages.forEach((message) => this.processNewComment(message));
  }

  extractCommentText(element) {
    const aria = element.getAttribute && element.getAttribute('aria-label');
    if (aria && aria.trim()) {
      const idx = aria.indexOf(':');
      const candidate = idx >= 0 ? aria.slice(idx + 1) : aria;
      const text = candidate.trim();
      if (text && text.length > 0) {
        const clean = text
          .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
          .replace(/\s+/g, ' ')
          .trim();
        if (clean.length > 1) return clean;
      }
    }

    const strategies = [
      () => element.querySelector?.('#message')?.textContent,
      () => element.querySelector?.('yt-formatted-string#message')?.textContent,
      () => element.querySelector?.('span[dir="auto"]')?.textContent,
      () => {
        const sr = element.shadowRoot;
        if (!sr) return null;
        return sr.querySelector('#message')?.textContent || sr.querySelector('yt-formatted-string#message')?.textContent || null;
      },
      () => {
        const text = element.textContent?.trim();
        return text && text.length > 5 ? text : null;
      }
    ];

    for (const strategy of strategies) {
      try {
        const text = strategy();
        if (text && text.trim()) {
          const cleanText = text.trim()
            .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
            .replace(/\s+/g, ' ')
            .trim();
          if (cleanText.length > 2) {
            return cleanText;
          }
        }
      } catch (e) {
        continue;
      }
    }

    return null;
  }

  isCommentElement(element) {
    return element.tagName === 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER' ||
           element.classList?.contains('yt-live-chat-text-message-renderer') ||
           element.id?.includes('message');
  }
  
  processExistingComments(container) {
    const messageSelectors = [
      'yt-live-chat-text-message-renderer',
      '.yt-live-chat-text-message-renderer',
      '[id*="message"]'
    ];
    
    messageSelectors.forEach(selector => {
      const messages = container.querySelectorAll(selector);
      console.log(`📝 Processando ${messages.length} comentários existentes (${selector})`);
      messages.forEach(message => this.processNewComment(message));
    });
  }
  
  processNewComment(element) {
    const textContent = this.extractCommentText(element);
    if (textContent && !this.commentHistory.has(textContent) && textContent.length > 1) {
      this.commentHistory.add(textContent);
      this.analyzeComment(textContent);
      console.log('💬 Novo comentário:', textContent.substring(0, 50) + '...');
      
      chrome.runtime.sendMessage({
        action: 'logAnalysis',
        data: {
          comment: textContent,
          totalComments: this.commentHistory.size,
          totalTopics: this.topicCounts.size
        }
      });
    }
  }
  
  extractCommentText(element) {
    const strategies = [
      () => element.querySelector('#message')?.textContent,
      () => element.querySelector('span[dir="auto"]')?.textContent,
      () => {
        const spans = element.querySelectorAll('span');
        for (const span of spans) {
          const text = span.textContent?.trim();
          if (text && text.length > 5 && !text.includes(':') && !text.includes('AM') && !text.includes('PM')) {
            return text;
          }
        }
        return null;
      },
      () => {
        const text = element.textContent?.trim();
        return text && text.length > 5 ? text : null;
      }
    ];
    
    for (const strategy of strategies) {
      try {
        const text = strategy();
        if (text && text.trim()) {
          const cleanText = text.trim()
            .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
            .replace(/\s+/g, ' ')
            .trim();
          
          if (cleanText.length > 2) {
            return cleanText;
          }
        }
      } catch (e) {
        continue;
      }
    }
    
    return null;
  }
  
  analyzeComment(text) {
    const normalized = text.toLowerCase()
      .replace(/[^\w\sáàâãéêíóôõúçñüß]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    const words = normalized.split(' ')
      .filter(word => word.length > 2 && !this.stopWords.has(word));
    
    words.forEach(word => {
      if (word.length > 2) {
        this.incrementTopic(word);
      }
    });
    
    for (let i = 0; i < words.length - 1; i++) {
      const bigram = `${words[i]} ${words[i + 1]}`;
      if (bigram.length > 5) {
        this.incrementTopic(bigram);
      }
    }
    
    for (let i = 0; i < words.length - 2; i++) {
      const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      if (trigram.length > 8) {
        this.incrementTopic(trigram);
      }
    }
    
    const hashtags = text.match(/#\w+/g);
    if (hashtags) {
      hashtags.forEach(tag => this.incrementTopic(tag.toLowerCase()));
    }
    
    const mentions = text.match(/@\w+/g);
    if (mentions) {
      mentions.forEach(mention => this.incrementTopic(mention.toLowerCase()));
    }
  }
  
  incrementTopic(topic) {
    if (topic && topic.length > 1) {
      const current = this.topicCounts.get(topic) || 0;
      this.topicCounts.set(topic, current + 1);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📚 DOM carregado, iniciando YouTube Live Analyzer...');
    new YouTubeLiveAnalyzer();
  });
} else {
  console.log('📚 DOM já carregado, iniciando YouTube Live Analyzer...');
  new YouTubeLiveAnalyzer();
}