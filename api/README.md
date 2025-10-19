# Property Finder API

Backend API for the Chrome Extension that handles OpenAI chat conversations.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure your `.env` file in the project root has the OpenAI API key and model name:
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
OPENAI_MODEL=GPT-5-mini

Notes
- If `OPENAI_MODEL` is not set, the API will default to `GPT-5-mini`.
- Ensure your account has access to the specified model. If not, set `OPENAI_MODEL` to a supported alternative (e.g., `gpt-4o-mini`).
```

## Run the API

```bash
npm run dev
```

The API will start on `http://localhost:3000`

## Endpoints

### POST /chat
Handles conversation with the AI assistant

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Busco un apartamento en Pocitos" }
  ]
}
```

**Response:**
```json
{
  "response": "¡Perfecto! ¿Y cuál es tu presupuesto en dólares (USD)?"
}
```

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "message": "API is running"
}
```
