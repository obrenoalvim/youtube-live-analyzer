class PopupController {
  constructor() {
    this.startTime = Date.now();
    this.updateInterval = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateStatus();
    this.startPeriodicUpdates();
  }

  setupEventListeners() {
    document.getElementById('toggle-widget').addEventListener('click', () => {
      this.toggleWidget();
    });

    document.getElementById('clear-data').addEventListener('click', () => {
      this.clearData();
    });
  }

  async toggleWidget() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      await chrome.tabs.sendMessage(tab.id, { action: 'toggleWidget' });

      // Feedback visual
      const btn = document.getElementById('toggle-widget');
      const originalText = btn.textContent;
      btn.textContent = 'Widget alternado!';
      btn.style.background = '#4CAF50';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 1000);
    } catch (error) {
      console.error('Erro ao alternar widget:', error);
      this.showError('Erro ao comunicar com a aba');
    }
  }

  async clearData() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      await chrome.tabs.sendMessage(tab.id, { action: 'clearData' });

      // Reset local stats
      document.getElementById('total-comments').textContent = '0';
      document.getElementById('total-topics').textContent = '0';
      const topicsList = document.getElementById('top-topics-list');
      topicsList.textContent = '';
      const clearedEl = document.createElement('div');
      clearedEl.className = 'no-topics';
      clearedEl.textContent = 'Dados limpos!';
      topicsList.appendChild(clearedEl);

      // Feedback visual
      const btn = document.getElementById('clear-data');
      const originalText = btn.textContent;
      btn.textContent = 'Dados limpos!';
      btn.style.background = '#4CAF50';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 1000);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      this.showError('Erro ao limpar dados');
    }
  }

  async updateStatus() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab.url.includes('youtube.com')) {
        this.setStatus('inactive', 'Não está no YouTube');
        return;
      }

      // Tenta comunicar com o content script
      try {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'getStatus' });

        if (response) {
          this.updateUI(response);
        } else {
          this.setStatus('inactive', 'Extension não carregada');
        }
      } catch {
        this.setStatus('loading', 'Carregando extensão...');
      }
    } catch {
      this.setStatus('error', 'Erro de comunicação');
    }
  }

  updateUI(data) {
    if (data.isLive && data.isAnalyzing) {
      this.setStatus('analyzing', 'Analisando live ao vivo');
    } else if (data.isLive) {
      this.setStatus('live', 'Live detectada');
    } else {
      this.setStatus('inactive', 'Aguardando live');
    }

    document.getElementById('total-comments').textContent = data.commentCount || 0;
    document.getElementById('total-topics').textContent = data.topicCount || 0;

    this.updateTopTopics(data.topTopics || []);
  }

  updateTopTopics(topics) {
    const container = document.getElementById('top-topics-list');
    container.textContent = '';

    if (topics.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'no-topics';
      empty.textContent = 'Nenhum tópico ainda...';
      container.appendChild(empty);
      return;
    }

    topics.slice(0, 5).forEach(([label, count], index) => {
      const item = document.createElement('div');
      item.className = 'topic-item';

      const rank = document.createElement('span');
      rank.className = 'topic-rank';
      rank.textContent = `#${index + 1}`;

      const name = document.createElement('span');
      name.className = 'topic-name';
      name.textContent = label;

      const countEl = document.createElement('span');
      countEl.className = 'topic-count';
      countEl.textContent = String(count);

      item.append(rank, name, countEl);
      container.appendChild(item);
    });
  }

  setStatus(type, text) {
    const indicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    const statusDot = indicator.querySelector('.status-dot');

    // Remove classes anteriores
    statusDot.classList.remove('live', 'analyzing');

    switch (type) {
      case 'analyzing':
        statusDot.classList.add('analyzing');
        break;
      case 'live':
        statusDot.classList.add('live');
        break;
      case 'loading':
      case 'inactive':
      case 'error':
      default:
        break;
    }

    statusText.textContent = text;
  }

  startPeriodicUpdates() {
    // Atualiza status a cada 2 segundos
    this.updateInterval = setInterval(() => {
      this.updateStatus();
      this.updateTimer();
    }, 2000);
  }

  updateTimer() {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    document.getElementById('analysis-time').textContent = `${elapsed}s`;
  }

  showError(message) {
    const container = document.getElementById('top-topics-list');
    container.textContent = '';
    const errEl = document.createElement('div');
    errEl.className = 'no-topics';
    errEl.style.color = '#ff6666';
    errEl.textContent = message;
    container.appendChild(errEl);
  }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});

// Adiciona listeners para mensagens do content script
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'updatePopup') {
    // Atualiza o popup com novos dados
    console.log('Popup atualizado:', request.data);
  }
});
