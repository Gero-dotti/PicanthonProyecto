# ✅ Setup Complete - OpenAI + Tavily Integration

Your Chrome extension now has a fully functional AI chat assistant that speaks Spanish and searches REAL properties using Tavily!

## What's Been Set Up

### 1. **Backend API** (`/api`)
- Express server with OpenAI integration
- Chat endpoint at `POST /chat`
- Uses your OpenAI API key from `.env` file
- AI speaks in Spanish (Rioplatense) and collects property criteria

### 2. **Chrome Extension** (`/extension`)
- Beautiful white background with blue glass morphism UI
- No floating particles (removed as requested)
- Blue message bubbles with white text
- Links open in same tab (not new tabs)
- Shows one property at a time based on conversation

## How to Use

### Step 1: Start the Backend API

Open a terminal and run:

```bash
cd api
npm run dev
```

You should see:
```
🚀 API running on http://localhost:3000
📡 Chat endpoint: POST http://localhost:3000/chat
```

**Keep this terminal running!**

### Step 2: Load the Extension in Chrome

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (top right toggle)
4. Click **"Load unpacked"**
5. Select the folder: `/Users/martintrabajo/Documents/GitHub/PicanthonProyecto/extension/dist`

### Step 3: Use the Extension

1. Click the extension icon in Chrome (top right)
2. The side panel will open on the right side
3. Start chatting with the AI assistant!

## How the AI Works

The AI assistant will:

1. **Greet you** and ask what type of property you're looking for
2. **Collect information** naturally:
   - Type of property (apartment, house, etc.)
   - Transaction type (buy or rent)
   - Zone/neighborhood
   - Budget in USD (always asks in dollars)
   - Number of bedrooms
   - Number of bathrooms
   - If rent: period (annual, monthly, fortnight, season, winter)

3. **Ask conversationally** - one question at a time in Spanish
4. **Confirm criteria** when enough information is gathered
5. **Search properties** and show ONE link at a time
6. **Adjust based on feedback** - if you like/dislike a property, it learns

## Example Conversation

```
🤖 AI: ¡Hola! Soy tu asistente inmobiliario. Para ayudarte a encontrar la propiedad perfecta, necesito saber un poco más sobre lo que estás buscando.

¿Qué tipo de propiedad te interesa? Por ejemplo: apartamento, casa, terreno, oficina, etc.

👤 You: Busco un apartamento

🤖 AI: ¡Genial! ¿En qué zona te gustaría vivir?

👤 You: Pocitos

🤖 AI: Perfecto, Pocitos es una zona muy linda. ¿Cuál es tu presupuesto en dólares (USD)?

👤 You: hasta 250 mil

🤖 AI: Entiendo, hasta USD 250,000. ¿Cuántos dormitorios necesitás?

👤 You: 2 dormitorios

🤖 AI: Dale, perfecto. Voy a buscar apartamentos de 2 dormitorios en Pocitos hasta USD 250,000. Un momento...

[Shows property card]
```

## Features

✅ AI speaks in Spanish (Rioplatense - uses "vos", "che", etc.)
✅ Collects all necessary criteria conversationally
✅ White background with blue glassmorphism design
✅ Blue message bubbles with white text
✅ Links open in same tab (not new tab)
✅ Shows one property at a time
✅ Can save properties to wishlist
✅ Side panel always appears on the right

## Troubleshooting

### If chat doesn't work:
1. Make sure the API is running (`cd api && npm run dev`)
2. Check that `.env` file has `OPENAI_API_KEY`
3. Open Chrome DevTools (F12) and check console for errors

### If extension doesn't appear:
1. Reload the extension in `chrome://extensions/`
2. Make sure you selected the `dist` folder, not `extension` folder

### If you make changes:
1. Rebuild extension: `cd extension && npm run build`
2. Reload extension in Chrome
3. Restart API if you changed backend code

## What's Next?

The AI is ready to chat with you right now! Just make sure:
1. ✅ API is running (`cd api && npm run dev`)
2. ✅ Extension is loaded in Chrome
3. ✅ Click the extension icon and start chatting!

Enjoy your AI-powered property search assistant! 🏠
