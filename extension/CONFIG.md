# Configuración de la Extensión

## API Key de OpenAI

Esta extensión usa la API de OpenAI para el chat conversacional.

### Pasos para configurar:

1. **Obtener tu API Key de OpenAI:**
   - Visitá [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Creá una cuenta o iniciá sesión
   - Generá una nueva API key
   - Copiá la key (solo se muestra una vez)

2. **Configurar la API Key en el código:**
   - Abrí el archivo `extension/background.ts`
   - En la línea 5, reemplazá `'YOUR_OPENAI_API_KEY_HERE'` con tu API key real
   - Ejemplo:
   ```typescript
   const OPENAI_API_KEY = 'sk-proj-abc123def456...';
   ```

3. **Compilar la extensión:**
   ```bash
   cd extension
   npm install
   npm run build
   ```

4. **Cargar la extensión en Chrome:**
   - Abrí Chrome y andá a `chrome://extensions/`
   - Activá "Modo de desarrollador"
   - Click en "Cargar extensión sin empaquetar"
   - Seleccioná la carpeta `extension/dist`

## Notas de Seguridad

⚠️ **IMPORTANTE**:
- No compartas tu API key con nadie
- No la subas a repositorios públicos (agregá `background.ts` al `.gitignore` si querés)
- OpenAI cobra por uso de la API según tu plan
- Esta extensión usa GPT-3.5-turbo que es económico (~$0.002 por 1K tokens)
