# 🏠 Buscador de Propiedades UY - Extensión Chrome

Extensión Chrome con IA que te ayuda a buscar propiedades en Uruguay usando búsqueda conversacional con OpenAI.

## ✨ Características

- 💬 **Chat conversacional con IA** usando OpenAI GPT-3.5-turbo
- 🔍 Búsqueda en múltiples plataformas (MercadoLibre, InfoCasas, VeoCasas)
- 🎯 Sugerencias personalizadas basadas en tus preferencias
- 🔗 **Links clicables** - un click y te lleva a la propiedad en nueva pestaña
- ❤️ Guardar propiedades favoritas en wishlist
- 🎨 Interfaz moderna con diseño glassmorphism

## 🚀 Instalación Rápida

### 1. Configurar tu API Key de OpenAI

1. Visitá [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Creá una cuenta o iniciá sesión
3. Generá una nueva API key
4. Copiá la key (se muestra solo una vez)

### 2. Instalar la API Key en el código

Abrí el archivo `extension/background.ts` y en la **línea 5** reemplazá:

```typescript
const OPENAI_API_KEY = 'sk-tu-api-key-aqui';
```

### 3. Instalar dependencias y compilar

```bash
cd extension
npm install
npm run build
```

Esto genera la carpeta `dist/` con la extensión compilada.

### 4. Cargar en Chrome

1. Abrí Chrome y andá a `chrome://extensions/`
2. Activá **Modo de desarrollador** (arriba a la derecha)
3. Click en **Cargar extensión sin empaquetar**
4. Seleccioná la carpeta `extension/dist/`

## 📖 Cómo Usar

1. Click en el ícono de la extensión en Chrome (se abre en panel lateral)
2. Empezá a conversar sobre qué propiedad buscás:
   - "Busco un apartamento de 2 dormitorios en Pocitos"
   - "Quiero alquilar una casa con patio"
   - "Necesito algo de hasta 100 mil dólares en Carrasco"
3. La IA te hará preguntas para entender mejor tus necesidades
4. Te mostrará propiedades que coincidan con tus criterios
5. **Click en "Ver Propiedad Completa"** para abrir el link en una nueva pestaña
6. Podés guardar las que te gusten en tu wishlist con el botón "Guardar"

## Estructura

```
extension/
├── manifest.json           # Manifest V3
├── popup/
│   ├── popup.html         # Entry point
│   ├── popup.tsx          # Componente principal
│   ├── styles.css         # Tailwind CSS
│   └── components/
│       ├── CurrentProperty.tsx
│       └── PropertyCard.tsx
├── assets/                # Íconos (agregar)
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🛠 Tecnologías

- React + TypeScript
- OpenAI API (GPT-3.5-turbo)
- Vite (build tool)
- TailwindCSS
- Chrome Extension Manifest V3

## 💰 Costos de OpenAI

Esta extensión usa la API de OpenAI que tiene costo:
- **Modelo usado**: GPT-3.5-turbo
- **Costo aproximado**: ~$0.002 por 1,000 tokens
- **Conversación típica**: ~$0.01 - $0.05 USD

## 🔒 Seguridad

- Tu API key está embebida en el código compilado
- No se comparte con terceros
- Las conversaciones solo van entre tu navegador y OpenAI
- **⚠️ No subas tu API key a repositorios públicos** (agregá `openai.ts` al `.gitignore`)

## 🐛 Scripts de Desarrollo

```bash
npm run dev      # Modo desarrollo con hot reload
npm run build    # Build para producción
npm run icons    # Generar íconos de la extensión
```

## 🔧 Troubleshooting

### La extensión no carga
- Verificá que `npm run build` haya terminado sin errores
- Revisá la consola de `chrome://extensions/` para ver errores
- Asegurate de haber configurado tu API key correctamente

### Error "API Key inválida"
- Verificá que pegaste la API key correctamente en `background.ts` (línea 5)
- Asegurate de que la key empiece con `sk-`
- Comprobá que tengas créditos en tu cuenta de OpenAI

### Los links no se abren
- Asegurate de tener los permisos correctos en `manifest.json`
- Verificá que `chrome.tabs` tenga los permisos necesarios
- Revisá la consola del popup (click derecho en el ícono → Inspeccionar)

## 📄 Licencia

MIT

---

Hecho con ❤️ para buscar propiedades en Uruguay
