export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function sendMessageToOpenAI(
  messages: Message[]
): Promise<string> {
  try {
    // Send message to background script to handle OpenAI API call
    const response = await chrome.runtime.sendMessage({
      type: 'OPENAI_CHAT',
      messages: messages
    });

    if (!response.success) {
      throw new Error(response.error || 'Error al comunicarse con OpenAI');
    }

    return response.response;
  } catch (error: any) {
    console.error('OpenAI Error:', error);
    throw new Error(error.message || 'No se pudo conectar con OpenAI');
  }
}

export function getInitialMessage(): string {
  return '¡Hola! Soy tu asistente inmobiliario. Para poder ayudarte a encontrar la propiedad perfecta, necesito conocer un poco más sobre lo que estás buscando.\n\n¿Qué tipo de propiedad te interesa? Por ejemplo: apartamento, casa, terreno, oficina, etc.';
}

export function extractCriteriaFromConversation(messages: Message[]): {
  propertyType?: string;
  transactionType?: string;
  zone?: string;
  budgetUSD?: number;
  bedrooms?: number;
  bathrooms?: number;
  rentalPeriod?: string;
} {
  // This is a simple extraction - in a real app, you might want to use OpenAI's function calling
  const conversationText = messages
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join(' ')
    .toLowerCase();

  const criteria: any = {};

  // Property type
  if (conversationText.match(/apartamento|apto/i)) criteria.propertyType = 'apartamento';
  if (conversationText.match(/casa/i)) criteria.propertyType = 'casa';
  if (conversationText.match(/terreno/i)) criteria.propertyType = 'terreno';

  // Transaction type
  if (conversationText.match(/alquil|rent/i)) criteria.transactionType = 'alquiler';
  if (conversationText.match(/compr|venta|buy/i)) criteria.transactionType = 'venta';

  // Budget
  const budgetMatch = conversationText.match(/(\d+)\s*(?:mil|k|usd|dol[oa]res?)/i);
  if (budgetMatch) {
    let amount = parseInt(budgetMatch[1]);
    if (conversationText.match(/mil|k/i)) amount *= 1000;
    criteria.budgetUSD = amount;
  }

  // Bedrooms
  const bedroomMatch = conversationText.match(/(\d+)\s*(?:dormitorio|habitaci[oó]n|cuarto)/i);
  if (bedroomMatch) criteria.bedrooms = parseInt(bedroomMatch[1]);

  // Bathrooms
  const bathroomMatch = conversationText.match(/(\d+)\s*ba[ñn]o/i);
  if (bathroomMatch) criteria.bathrooms = parseInt(bathroomMatch[1]);

  // Zone/Location
  const zonePatterns = [
    /(?:en|zona|barrio)\s+([a-záéíóúñ\s]+?)(?:\s+|,|\.|\?|$)/i,
    /la\s+mansa/i,
    /punta\s+del\s+este/i,
    /pocitos|carrasco|centro|ciudad\s+vieja|parque\s+rod[oó]/i
  ];

  for (const pattern of zonePatterns) {
    const match = conversationText.match(pattern);
    if (match) {
      criteria.zone = match[1]?.trim() || match[0].trim();
      break;
    }
  }

  // Rental period
  if (conversationText.match(/anual/i)) criteria.rentalPeriod = 'anual';
  if (conversationText.match(/mensual|mes/i)) criteria.rentalPeriod = 'mensual';
  if (conversationText.match(/quincenal/i)) criteria.rentalPeriod = 'quincenal';
  if (conversationText.match(/temporada/i)) criteria.rentalPeriod = 'temporada';
  if (conversationText.match(/invierno/i)) criteria.rentalPeriod = 'invierno';

  return criteria;
}
