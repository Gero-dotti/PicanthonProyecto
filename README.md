# 🏠 Buscador de Propiedades UY - Extensión Chrome con IA

Extensión de Chrome que usa IA para buscar propiedades en Uruguay (MercadoLibre, InfoCasas, VeoCasas) a través de conversación natural.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green?logo=openai)
![Tavily](https://img.shields.io/badge/Tavily-Search-orange)

---

## ✨ Características

- 💬 **Chat con IA** - Conversá naturalmente sobre qué buscás
- 🔍 **Búsqueda Real** - Usa Tavily para encontrar propiedades reales en internet
- 🔗 **Links Clicables** - Un click y te lleva directo a la propiedad
- 🏢 **3 Portales** - Busca en MercadoLibre, InfoCasas y VeoCasas
- ❤️ **Wishlist** - Guardá tus propiedades favoritas
- 🎨 **Diseño Moderno** - Interfaz glassmorphism hermosa

---

## 📦 Descarga e Instalación

### Opción 1: Descarga Directa (Más Fácil)

1. **Descargá la extensión:**
   - Andá a [Releases](../../releases)
   - Descargá `buscador-propiedades-uy.zip`

2. **Descomprimí el archivo:**
   - Click derecho → "Extraer aquí"

3. **Instalá en Chrome:**
   - Abrí Chrome y andá a `chrome://extensions/`
   - Activá "Modo de desarrollador" (arriba a la derecha)
   - Click en "Cargar extensión sin empaquetar"
   - Seleccioná la carpeta que descomprimiste
   - ¡Listo! ✅

4. **Configurá tu API Key:**
   - Abrí el archivo `background.js` (dentro de la carpeta de la extensión)
   - En la línea 5, reemplazá `'YOUR_OPENAI_API_KEY_HERE'` con tu API key de OpenAI
   - Guardá el archivo
   - Volvé a `chrome://extensions/` y recargá la extensión (botón ⟳)

### Opción 2: Compilar desde el Código Fuente

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/tu-repo.git
cd PicanthonProyecto

# 2. Instalar dependencias
cd extension
npm install

# 3. Configurar API Key
# Editá extension/background.ts línea 5 con tu API key

# 4. Compilar
npm run build

# 5. Cargar en Chrome
# Andá a chrome://extensions/
# Activá "Modo de desarrollador"
# "Cargar extensión sin empaquetar" → seleccioná extension/dist/
```

---

## 🔑 Conseguir API Keys (GRATIS)

### OpenAI API Key (Necesaria)

1. Andá a [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Creá una cuenta (te dan $5 de crédito gratis)
3. Click en "Create new secret key"
4. Copiá la key (comienza con `sk-...`)

**Costo**: ~$0.01-0.05 USD por conversación (muy barato)

### Tavily API Key (Opcional - para búsquedas reales)

1. Andá a [https://tavily.com](https://tavily.com)
2. Registrate (es gratis)
3. Te dan 1,000 búsquedas gratis por mes
4. Copiá tu API key

Si no configurás Tavily, la extensión igual funciona pero muestra propiedades de ejemplo.

---

## 🚀 Cómo Usar

1. **Abrí la extensión:**
   - Click en el ícono de la extensión en Chrome
   - Se abre un panel lateral con el chat

2. **Conversá sobre lo que buscás:**
   ```
   Tú: Hola
   IA: ¡Hola! ¿Qué tipo de propiedad buscás?

   Tú: Apartamento 2 dormitorios Pocitos
   IA: ¿Tenés presupuesto en mente?

   Tú: Hasta 200 mil dólares
   IA: ¡Perfecto! Voy a buscar opciones...
   ```

3. **Ve las propiedades:**
   - La IA te muestra tarjetas con propiedades reales
   - Click en "Ver Propiedad Completa" → se abre el link
   - Podés guardarlas en favoritos con "Guardar"

4. **Pedí más opciones:**
   ```
   Tú: Mostrame otra
   IA: ¡Claro! Acá va otra opción...
   ```

---

## 🛠 Instalación Completa con API Local (Opcional - Para Desarrolladores)

Si querés correr el backend localmente para tener más control:

### 1. Configurar el Backend

```bash
# En la raíz del proyecto
cd api

# Instalar dependencias
npm install

# Crear archivo .env
cp ../.env.example .env

# Editar .env y agregar tus API keys:
# OPENAI_API_KEY=sk-...
# TAVILY_API_KEY=tvly-...

# Compilar y correr
npm run build
npm start
```

La API debería estar corriendo en `http://localhost:3000`

### 2. Configurar la Extensión

```bash
cd extension

# Instalar dependencias
npm install

# Configurar API key en background.ts (línea 5)

# Compilar
npm run build

# Cargar extension/dist/ en Chrome
```

### 3. Verificar que todo funcione

```bash
# Test del backend
curl http://localhost:3000/health
# Debería responder: {"status":"ok",...}
```

---

## 📝 Estructura del Proyecto

```
PicanthonProyecto/
├── api/                    # Backend API (opcional)
│   ├── src/
│   │   └── index.ts       # Servidor Express con Tavily
│   └── package.json
│
├── extension/             # Extensión de Chrome
│   ├── popup/
│   │   ├── popup.tsx      # UI principal (React)
│   │   ├── components/    # Componentes React
│   │   └── services/      # Servicios (OpenAI)
│   ├── background.ts      # Service Worker (maneja OpenAI)
│   ├── manifest.json      # Configuración de la extensión
│   ├── dist/              # Carpeta compilada (esto se carga en Chrome)
│   └── package.json
│
└── README.md              # Este archivo
```

---

## 💡 Ejemplos de Búsquedas

- "Busco casa 3 dormitorios Carrasco hasta 300 mil"
- "Apartamento 2 dorms Pocitos con garage"
- "Alquiler temporada Punta del Este"
- "Casa con patio y parrillero Malvín"
- "Penthouse vista al mar La Mansa"

---

## 🔧 Solución de Problemas

### Error: "API Key inválida"
- ✅ Verificá que pegaste bien la API key en `background.js` línea 5
- ✅ Asegurate que la key empiece con `sk-`
- ✅ Verificá que tengas créditos en OpenAI

### No muestra propiedades
- ✅ Configurá Tavily API key en el backend (opcional)
- ✅ Probá con diferentes búsquedas
- ✅ Verificá que la API local esté corriendo (si la usás)

### La extensión no carga
- ✅ Asegurate de activar "Modo de desarrollador" en Chrome
- ✅ Verificá que la carpeta tenga `manifest.json`
- ✅ Revisá errores en `chrome://extensions/`

### Links no abren
- ✅ Permitile a Chrome abrir popups
- ✅ Probá con click derecho → "Abrir en nueva pestaña"

---

## 💰 Costos

| Servicio | Costo | Incluido Gratis |
|----------|-------|-----------------|
| OpenAI GPT-4o-mini | $0.002/1K tokens | $5 USD al registrarte |
| Tavily Search | $0 | 1,000 búsquedas/mes |
| **Total por usuario** | **~$0.02-0.08** | Primeros meses gratis |

---

## 🔒 Privacidad y Seguridad

- ✅ Tu API key se guarda localmente en tu navegador
- ✅ Las conversaciones van directamente de tu navegador a OpenAI
- ✅ No compartimos información con terceros
- ✅ El código es open source - podés revisar todo

---

## 🤝 Contribuir

¡Pull requests son bienvenidos! Para cambios grandes, abrí un issue primero.

```bash
# 1. Fork del proyecto
# 2. Crear rama
git checkout -b feature/mi-mejora

# 3. Commit
git commit -m "Agregué feature X"

# 4. Push
git push origin feature/mi-mejora

# 5. Abrir Pull Request
```

---

## 📄 Licencia

MIT License - Usá el código como quieras.

---

## 🆘 Soporte

¿Problemas? ¿Preguntas?
- 📧 Abrí un [Issue en GitHub](../../issues)
- 💬 Revisá la sección de [Troubleshooting](#-solución-de-problemas)

---

## 🎯 Roadmap

- [ ] Soporte para más portales inmobiliarios
- [ ] Filtros avanzados (amenities, metros cuadrados, etc.)
- [ ] Comparador de propiedades
- [ ] Notificaciones de nuevas propiedades
- [ ] Modo offline con caché
- [ ] Exportar wishlist a PDF

---

**Hecho con ❤️ en Uruguay 🇺🇾**

⭐ Si te gustó, dale una estrella al repo!
