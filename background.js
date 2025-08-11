// Service Worker para a extensão
chrome.runtime.onInstalled.addListener(() => {
  console.log('🚀 YouTube Live Analyzer instalado!');
});

// Monitora mudanças de aba
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('youtube.com')) {
    console.log('📺 Página do YouTube carregada:', tab.url);
  }
});

// Manipula mensagens entre content script e popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateBadge') {
    // Atualiza o badge da extensão com contadores
    chrome.action.setBadgeText({
      tabId: sender.tab.id,
      text: request.count ? request.count.toString() : ''
    });
    
    chrome.action.setBadgeBackgroundColor({
      color: request.isLive ? '#ff4444' : '#666666'
    });
  }
  
  if (request.action === 'logAnalysis') {
    console.log('📊 Análise:', request.data);
  }
  
  sendResponse({ success: true });
});

// Limpa dados quando a aba é fechada
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  chrome.action.setBadgeText({ tabId: tabId, text: '' });
});