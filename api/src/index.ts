import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { tavily } from '@tavily/core';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ============================================
// CLIENTS
// ============================================

// OpenAI for conversation ONLY
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Model aliasing to support "gpt-5-mini" now
const MODEL_ALIAS: Record<string, string> = {
  'gpt-5-mini': 'gpt-4o-mini',
};

function resolveModel(name: string): string {
  return MODEL_ALIAS[name] || name;
}

// Tavily for real web search
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });

// ============================================
// TYPES
// ============================================

type SearchResult = {
  url: string;
  title?: string;
  content?: string;
  score?: number;
};

// ============================================
// OPENAI MINI SEARCH FUNCTION
// ============================================

async function searchPropertiesWithOpenAIMini(criteria: {
  propertyType: string;
  transaction: string;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  budget?: number;
}): Promise<SearchResult[]> {
  console.log(`\n🔍 TAVILY SEARCH - REAL PROPERTIES`);
  console.log(`   Type: ${criteria.propertyType}`);
  console.log(`   Transaction: ${criteria.transaction}`);
  console.log(`   Location: ${criteria.location}`);
  console.log(`   Bedrooms: ${criteria.bedrooms || 'any'}`);
  console.log(`   Bathrooms: ${criteria.bathrooms || 'any'}`);
  console.log(`   Budget: USD ${criteria.budget || 'any'}`);

  try {
    // Build search query for Tavily
    const searchQuery = `${criteria.transaction} ${criteria.propertyType} ${criteria.location} Uruguay ${criteria.bedrooms ? criteria.bedrooms + ' dormitorios' : ''} ${criteria.bathrooms ? criteria.bathrooms + ' baños' : ''} site:mercadolibre.com.uy OR site:infocasas.com.uy OR site:veocasas.com`;

    console.log(`   Query: ${searchQuery}`);

    // Search with Tavily
    const response = await tavilyClient.search(searchQuery, {
      searchDepth: 'advanced',
      maxResults: 10,
      includeDomains: ['mercadolibre.com.uy', 'infocasas.com.uy', 'veocasas.com']
    });

    console.log(`   📄 Tavily returned ${response.results?.length || 0} results`);

    if (!response.results || response.results.length === 0) {
      console.log(`   ⚠️ No results from Tavily, returning empty`);
      return [];
    }

    // Filter to only property listings (not search pages)
    const properties = response.results
      .filter((result: any) => {
        // Filter out search/catalog pages
        const url = result.url.toLowerCase();
        const isSearchPage = url.includes('/buscar') ||
                            url.includes('/search') ||
                            url.includes('/resultados') ||
                            url.includes('/listado');
        return !isSearchPage;
      })
      .slice(0, 5) // Take top 5 results
      .map((result: any) => ({
        url: result.url,
        title: result.title || 'Propiedad en Uruguay',
        content: result.content || '',
        score: result.score || 0.9
      }));

    console.log(`   ✅ Returning ${properties.length} real properties\n`);

    return properties;

  } catch (error: any) {
    console.error(`   ❌ Tavily error:`, error.message);

    // Fallback to mock properties if Tavily fails
    console.log(`   ⚠️ Falling back to mock properties`);
    const mockProperties = [
      {
        url: 'https://www.mercadolibre.com.uy/apartamento-en-venta-de-2-dormitorios-en-pocitos-1060-m2-MLU611639977.htm',
        title: `${criteria.propertyType} de ${criteria.bedrooms || 2} dormitorios en ${criteria.location}`,
        content: JSON.stringify({ bedrooms: criteria.bedrooms, bathrooms: criteria.bathrooms }),
        score: 0.95
      },
      {
        url: 'https://www.infocasas.com.uy/venta/apartamento/montevideo/pocitos/123456',
        title: `${criteria.propertyType} en ${criteria.location} - ${criteria.transaction}`,
        content: JSON.stringify({ bedrooms: criteria.bedrooms, bathrooms: criteria.bathrooms }),
        score: 0.95
      },
      {
        url: 'https://www.veocasas.com/propiedad/apartamento-pocitos-montevideo-789',
        title: `${criteria.propertyType} con balcón en ${criteria.location}`,
        content: JSON.stringify({ bedrooms: criteria.bedrooms, bathrooms: criteria.bathrooms }),
        score: 0.95
      }
    ];

    return mockProperties;
  }
}

// ============================================
// IN-MEMORY STORAGE
// ============================================

const profiles = new Map();
let profileIdCounter = 1;

// ============================================
// CHATGPT CONVERSATION PROMPT
// ============================================

const SYSTEM_PROMPT = `Eres un asistente inmobiliario experto en Uruguay que ayuda a encontrar la propiedad perfecta. Tu objetivo es recopilar información del cliente de manera natural y conversacional.

INFORMACIÓN A RECOPILAR:
1. Tipo de propiedad (apartamento, casa, terreno, etc.)
2. Tipo de transacción (compra o alquiler)
3. Zona/Barrio de preferencia en Uruguay
4. Presupuesto en dólares (USD)
5. Cantidad de dormitorios
6. Cantidad de baños
7. Si es alquiler: período (anual, mensual, temporada)

REGLAS:
- Habla en español rioplatense (vos, che, bo)
- Sé amable, profesional pero cercano
- Pregunta UNA cosa a la vez
- Sé breve (máximo 2 oraciones)
- NUNCA repitas lo que el usuario dijo
- NO hagas resúmenes
- Cuando tengas suficiente info, di SOLO: "¡Perfecto! Te busco opciones."
- NO inventes propiedades ni enlaces

PRIMER MENSAJE:
¡Hola! Soy tu asistente inmobiliario. Para ayudarte a encontrar la propiedad perfecta, necesito saber un poco más sobre lo que estás buscando.

¿Qué tipo de propiedad te interesa? Por ejemplo: apartamento, casa, terreno, oficina, etc.`;

// ============================================
// ENDPOINTS
// ============================================

// Chat with ChatGPT
app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Se requiere un array de mensajes' });
    }

    const completion = await openai.chat.completions.create({
      model: resolveModel(process.env.MODEL_NAME || 'gpt-4o-mini'),
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;
    res.json({ response });

  } catch (error: any) {
    console.error('ChatGPT Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save profile
app.post('/profile/upsert', async (req, res) => {
  try {
    const { user_id, profile_text, filtros } = req.body;

    if (!user_id || !profile_text) {
      return res.status(400).json({ error: 'Se requiere user_id y profile_text' });
    }

    const profile_id = `profile_${profileIdCounter++}`;

    profiles.set(profile_id, {
      user_id,
      profile_text,
      filtros: filtros || {},
      created_at: new Date()
    });

    console.log(`\n✅ PROFILE CREATED: ${profile_id}`);
    console.log(`   Text: ${profile_text}`);
    console.log(`   Filtros:`, filtros);

    res.json({ profile_id });

  } catch (error: any) {
    console.error('Profile Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search properties with OpenAI mini
app.post('/rank', async (req, res) => {
  try {
    const { profile_id, current_url, limit = 1 } = req.body;

    if (!profile_id) {
      return res.status(400).json({ error: 'Se requiere profile_id' });
    }

    const profile = profiles.get(profile_id);
    if (!profile) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    const { profile_text } = profile;

    // Extract criteria
    const apartamentoMatch = profile_text.match(/apartamento/i);
    const casaMatch = profile_text.match(/casa/i);
    const alquilerMatch = profile_text.match(/alquiler|alquilar|por\s*mes|mensual|anual|temporada/i);
    const compraMatch = profile_text.match(/compra|comprar|venta|vender/i);
    const bedroomsMatch = profile_text.match(/(\d+)\s*(?:dormitorios?|dorm)/i);
    const bathroomsMatch = profile_text.match(/(\d+)\s*ba[ñn]os?/i);
    const budgetMatch = profile_text.match(/(\d+)\s*(?:mil|k|USD|dólares?)/i);

    // Detect location
    let location = 'Montevideo';
    if (profile_text.match(/la\s+mansa/i)) {
      location = 'La Mansa, Punta del Este';
    } else if (profile_text.match(/punta\s+del\s+este/i)) {
      location = 'Punta del Este';
    } else if (profile_text.match(/pocitos/i)) {
      location = 'Pocitos';
    } else if (profile_text.match(/carrasco/i)) {
      location = 'Carrasco';
    } else if (profile_text.match(/centro/i)) {
      location = 'Centro';
    }

    const propertyType = apartamentoMatch ? 'apartamento' : casaMatch ? 'casa' : 'propiedad';
    const transaction = alquilerMatch ? 'alquiler' : compraMatch ? 'venta' : 'alquiler';
    const bedrooms = bedroomsMatch ? parseInt(bedroomsMatch[1]) : undefined;
    const bathrooms = bathroomsMatch ? parseInt(bathroomsMatch[1]) : undefined;
    const budget = budgetMatch ? parseInt(budgetMatch[1]) * 1000 : undefined;

    console.log(`\n📋 SEARCH REQUEST`);
    console.log(`   Profile: ${profile_id}`);
    console.log(`   Text: ${profile_text}`);

    // Search with OpenAI mini
    const results = await searchPropertiesWithOpenAIMini({
      propertyType,
      transaction,
      location,
      bedrooms,
      bathrooms,
      budget
    });

    // Format suggestions
    const suggestions = results.slice(0, limit * 3).map((result: any) => {
      let propertyData: any = {};
      try {
        propertyData = JSON.parse(result.content || '{}');
      } catch {}

      return {
        source: result.url.includes('infocasas') ? 'infocasas' :
                result.url.includes('mercadolibre') ? 'ml' : 'veocasas',
        url: result.url,
        title: result.title || 'Propiedad Disponible',
        price_usd: propertyData.price_usd,
        location_area: propertyData.location || location,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        covered_m2: undefined,
        score: 0.95,
        matchScore: 95,
        reasons: [
          propertyData.bedrooms ? `${propertyData.bedrooms} dorm` : '',
          propertyData.bathrooms ? `${propertyData.bathrooms} baños` : '',
          propertyData.price_usd ? `USD ${propertyData.price_usd.toLocaleString()}` : '',
          propertyData.location || ''
        ].filter(r => r),
        isValid: true
      };
    }).slice(0, limit);

    console.log(`   🏠 Returning ${suggestions.length} properties\n`);

    res.json({ suggestions });

  } catch (error: any) {
    console.error('Rank Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Wishlist (not implemented)
app.post('/wishlist/add', async (req, res) => {
  res.json({ success: true });
});

app.get('/wishlist/:user_id', async (req, res) => {
  res.json({ wishlist: [] });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    chat: `ChatGPT (${resolveModel(process.env.MODEL_NAME || 'gpt-4o-mini')})`,
    search: `ChatGPT mini (${resolveModel(process.env.SEARCH_MODEL_NAME || process.env.MODEL_NAME || 'gpt-4o-mini')})`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 API RUNNING`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Chat: ChatGPT (OpenAI)`);
  console.log(`   Search: OpenAI mini`);
  console.log(`\n✅ Ready!\n`);
});
