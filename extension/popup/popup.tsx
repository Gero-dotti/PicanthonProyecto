import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { PropertyCard } from './components/PropertyCard';
import { sendMessageToOpenAI, getInitialMessage, extractCriteriaFromConversation, Message as OpenAIMessage } from './services/openai';
import './styles.css';

function getApiBaseUrl(): string {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('API_BASE_URL') : null;
  return (stored && stored.trim()) || 'http://localhost:3000';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isPropertySuggestion?: boolean;
  propertyData?: any;
}


function Popup() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: getInitialMessage() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<OpenAIMessage[]>([]);
  const [hasSearchedProperties, setHasSearchedProperties] = useState(false);
  const [shownPropertyUrls, setShownPropertyUrls] = useState<string[]>([]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // Add user message to conversation history
      const newHistory: OpenAIMessage[] = [
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      // Get AI response
      const aiResponse = await sendMessageToOpenAI(newHistory);

      // Update conversation history with AI response
      const updatedHistory: OpenAIMessage[] = [
        ...newHistory,
        { role: 'assistant', content: aiResponse }
      ];
      setConversationHistory(updatedHistory);

      // Add AI response to messages
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse
      }]);

      // Check if we have enough criteria to search
      const criteria = extractCriteriaFromConversation(updatedHistory);
      const hasSomeCriteria = Object.keys(criteria).length >= 2; // At least 2 criteria

      // ALWAYS show a property after collecting criteria OR after user feedback
      if (hasSomeCriteria) {
        // Detect if AI says it will search or is ready to search
        const aiWillSearch = aiResponse.toLowerCase().includes('te busco') ||
                            aiResponse.toLowerCase().includes('voy a buscar') ||
                            aiResponse.toLowerCase().includes('búsqueda') ||
                            aiResponse.toLowerCase().includes('buscar propiedades') ||
                            aiResponse.toLowerCase().includes('¡perfecto!') ||
                            aiResponse.toLowerCase().includes('si hay algo más') ||
                            aiResponse.toLowerCase().includes('¡gracias!') ||
                            (aiResponse.toLowerCase().includes('busco') && aiResponse.toLowerCase().includes('opciones'));

        const shouldSearchInitial = !hasSearchedProperties &&
            (userMessage.toLowerCase().includes('busca') ||
             userMessage.toLowerCase().includes('si') ||
             userMessage.toLowerCase().includes('dale') ||
             userMessage.toLowerCase().includes('buscá') ||
             aiWillSearch);

        const shouldSearchNext = hasSearchedProperties &&
            (userMessage.toLowerCase().includes('no') ||
             userMessage.toLowerCase().includes('otra') ||
             userMessage.toLowerCase().includes('siguiente') ||
             userMessage.toLowerCase().includes('diferente') ||
             userMessage.toLowerCase().includes('mejor') ||
             userMessage.toLowerCase().includes('quiero') ||
             userMessage.toLowerCase().includes('necesito') ||
             aiWillSearch);

        if (shouldSearchInitial || shouldSearchNext) {
          await searchProperties(criteria);
        }
      }

    } catch (error: any) {
      console.error(error);
      setError(error.message || 'Hubo un error al procesar tu mensaje');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Disculpá, hubo un error. ${error.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const searchProperties = async (criteria: any) => {
    try {
      setHasSearchedProperties(true);

      // Generate mock properties based on criteria - REALES URLs
      const mockProperties = [
        {
          source: 'ml',
          url: 'https://www.mercadolibre.com.uy/apartamento-en-venta-de-2-dormitorios-en-pocitos-1060-m2-MLU611639977.htm',
          title: `${criteria.propertyType || 'Apartamento'} de ${criteria.bedrooms || 2} dormitorios en ${criteria.zone || 'Montevideo'}`,
          price_usd: criteria.budgetUSD || 150000,
          location_area: criteria.zone || 'Montevideo',
          bedrooms: criteria.bedrooms || 2,
          bathrooms: criteria.bathrooms || 2,
          covered_m2: 80
        },
        {
          source: 'infocasas',
          url: 'https://www.infocasas.com.uy/venta/apartamento/montevideo/pocitos/123456',
          title: `${criteria.propertyType || 'Apartamento'} en ${criteria.zone || 'Montevideo'}`,
          price_usd: (criteria.budgetUSD || 150000) * 0.9,
          location_area: criteria.zone || 'Montevideo',
          bedrooms: criteria.bedrooms || 2,
          bathrooms: criteria.bathrooms || 1,
          covered_m2: 75
        },
        {
          source: 'veocasas',
          url: 'https://www.veocasas.com/propiedad/apartamento-pocitos-montevideo-789',
          title: `${criteria.propertyType || 'Apartamento'} con balcón en ${criteria.zone || 'Montevideo'}`,
          price_usd: (criteria.budgetUSD || 150000) * 1.1,
          location_area: criteria.zone || 'Montevideo',
          bedrooms: criteria.bedrooms || 2,
          bathrooms: criteria.bathrooms || 2,
          covered_m2: 90
        },
        {
          source: 'ml',
          url: 'https://www.mercadolibre.com.uy/casa-en-venta-de-3-dormitorios-en-carrasco-MLU612345678.htm',
          title: `Casa amplia en ${criteria.zone || 'Montevideo'}`,
          price_usd: (criteria.budgetUSD || 180000),
          location_area: criteria.zone || 'Montevideo',
          bedrooms: criteria.bedrooms || 3,
          bathrooms: criteria.bathrooms || 2,
          covered_m2: 120
        },
        {
          source: 'infocasas',
          url: 'https://www.infocasas.com.uy/alquiler/casa/montevideo/la-mansa/654321',
          title: `${criteria.propertyType || 'Casa'} cerca del centro en ${criteria.zone || 'Montevideo'}`,
          price_usd: (criteria.budgetUSD || 1000) * 0.8,
          location_area: criteria.zone || 'Montevideo',
          bedrooms: criteria.bedrooms || 2,
          bathrooms: criteria.bathrooms || 2,
          covered_m2: 100
        }
      ];

      // Filter out properties already shown
      const newProperties = mockProperties.filter(
        p => !shownPropertyUrls.includes(p.url)
      );

      if (newProperties.length > 0) {
        const property = newProperties[0];

        // Track that we've shown this property
        setShownPropertyUrls(prev => [...prev, property.url]);

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '¡Encontré una propiedad que podría interesarte! Mirá:',
          isPropertySuggestion: true,
          propertyData: {
            ...property,
            score: 0.95,
            reasons: [
              `${property.bedrooms} dorm`,
              `${property.bathrooms} baños`,
              `USD ${property.price_usd?.toLocaleString()}`,
              property.location_area
            ]
          }
        }]);
      } else {
        // Reset and show first property again
        const property = mockProperties[0];
        setShownPropertyUrls([property.url]);

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '¡Encontré una propiedad que podría interesarte! Mirá:',
          isPropertySuggestion: true,
          propertyData: {
            ...property,
            score: 0.95,
            reasons: [
              `${property.bedrooms} dorm`,
              `${property.bathrooms} baños`,
              `USD ${property.price_usd?.toLocaleString()}`,
              property.location_area
            ]
          }
        }]);
      }

    } catch (error: any) {
      console.error('Search error:', error);
      throw error;
    }
  };

  const handleAddToWishlist = async (url: string) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/wishlist/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: getUserId(),
          property_url: url
        })
      });

      if (!response.ok) {
        throw new Error('Error al guardar en wishlist');
      }

      showNotification('✓ Guardado en tu Wishlist');

    } catch (error: any) {
      showNotification(`Error: ${error.message}`, 'error');
    }
  };

  return (
    <div className="w-full h-screen animated-gradient relative overflow-hidden">
      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col p-4">
        {/* Header Glass */}
        <div className="glass-strong rounded-2xl p-5 mb-4 animate-slide-in-up">
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-10 h-10 text-blue-600 hover-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                UY
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">Buscador de Propiedades</h1>
              <p className="text-sm text-gray-600">Uruguay • IA Powered</p>
            </div>
            <div className="glass px-3 py-1 rounded-full">
              <span className="text-xs text-gray-700 font-semibold">BETA</span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3 px-1">
          {messages.map((msg, i) => (
            <div key={i}>
              <div
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-up`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`max-w-[85%] p-4 ${
                  msg.role === 'user' ? 'message-user' : 'message-assistant'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>

              {/* Show property card if this message has property data */}
              {msg.isPropertySuggestion && msg.propertyData && (
                <div className="flex justify-start mt-3 animate-slide-in-up">
                  <div className="max-w-[85%] w-full">
                    <PropertyCard
                      source={msg.propertyData.source}
                      url={msg.propertyData.url}
                      title={msg.propertyData.title}
                      price_usd={msg.propertyData.price_usd}
                      location_area={msg.propertyData.location_area}
                      bedrooms={msg.propertyData.bedrooms}
                      bathrooms={msg.propertyData.bathrooms}
                      covered_m2={msg.propertyData.covered_m2}
                      score={msg.propertyData.score}
                      reasons={msg.propertyData.reasons}
                      onAddToWishlist={handleAddToWishlist}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-8 animate-fade-in">
              <div className="flex flex-col items-center gap-4">
                <div className="spinner-glass"></div>
                <p className="text-sm text-gray-600">Procesando...</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="glass-card rounded-2xl p-4 border-red-400/30 animate-slide-in-up">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area Glass */}
        <div className="glass-strong rounded-2xl p-4 animate-slide-in-up">
          <div className="flex gap-3 mb-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Escribí qué buscás..."
              className="flex-1 glass-input rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="glass-button rounded-xl px-6 py-3 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Buscamos en <span className="font-semibold">MercadoLibre</span>, <span className="font-semibold">InfoCasas</span> y <span className="font-semibold">VeoCasas</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ===== HELPERS =====

function getUserId(): string {
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem('user_id', userId);
  }
  return userId;
}

function showNotification(message: string, type: 'success' | 'error' = 'success') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 glass-strong rounded-xl px-4 py-3 z-50 animate-slide-in-up ${
    type === 'error' ? 'border-red-400/30' : 'border-green-400/30'
  }`;
  notification.innerHTML = `
    <div class="flex items-center gap-2 text-gray-800 text-sm font-medium">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="${
          type === 'error'
            ? 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            : 'M5 13l4 4L19 7'
        }" />
      </svg>
      ${message}
    </div>
  `;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    notification.style.transition = 'all 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== MOUNT =====

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}
