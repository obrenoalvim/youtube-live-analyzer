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
      document.getElementById('top-topics-list').innerHTML = 
        '<div class="no-topics">Dados limpos!</div>';
      
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
      } catch (error) {
        this.setStatus('loading', 'Carregando extensão...');
      }
      
    } catch (error) {
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
    
    if (topics.length === 0) {
      container.innerHTML = '<div class="no-topics">Nenhum tópico ainda...</div>';
      return;
    }
    
    container.innerHTML = topics.slice(0, 5).map((topic, index) => `
      <div class="topic-item">
        <span class="topic-rank">#${index + 1}</span>
        <span class="topic-name">${topic[0]}</span>
        <span class="topic-count">${topic[1]}</span>
      </div>
    `).join('');
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
    container.innerHTML = `<div class="no-topics" style="color: #ff6666;">${message}</div>`;
  }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});

// Adiciona listeners para mensagens do content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updatePopup') {
    // Atualiza o popup com novos dados
    console.log('Popup atualizado:', request.data);
  }
});