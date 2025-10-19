// Background service worker para manejar el side panel y llamadas a OpenAI
/// <reference types="chrome"/>

// OpenAI API Key configured
const OPENAI_API_KEY = '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';

chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Abrir side panel automáticamente en páginas de propiedades
chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const isPropertyPage =
      tab.url.includes('mercadolibre.com.uy/inmuebles') ||
      tab.url.includes('infocasas.com.uy') ||
      tab.url.includes('veocasas.com');

    if (isPropertyPage) {
      chrome.sidePanel.setOptions({
        tabId,
        path: 'popup/popup.html',
        enabled: true
      });
    }
  }
});

// Handle OpenAI API calls from popup
chrome.runtime.onMessage.addListener((request: any, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  if (request.type === 'OPENAI_CHAT') {
    handleOpenAIChat(request.messages)
      .then(response => sendResponse({ success: true, response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Will respond asynchronously
  }
});

async function handleOpenAIChat(messages: any[]): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('Por favor, configura tu API Key de OpenAI en background.ts');
  }

  // Add system message if not present
  const messagesWithSystem = messages[0]?.role === 'system'
    ? messages
    : [
        {
          role: 'system',
          content: 'Eres un asistente inmobiliario especializado en propiedades en Uruguay. Tu objetivo es ayudar a los usuarios a encontrar la propiedad perfecta haciendo preguntas relevantes sobre sus necesidades: tipo de propiedad, presupuesto, ubicación, número de habitaciones, baños, y cualquier otra preferencia importante. Sé amigable, conversacional y conciso en tus respuestas. Usa un tono informal y cercano (vos/tu).'
        },
        ...messages
      ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messagesWithSystem,
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 401) {
      throw new Error('API Key inválida. Por favor verifica tu configuración en background.ts');
    }
    throw new Error(error.error?.message || 'Error al comunicarse con OpenAI');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
