# 🚀 Quickstart - Ver el Frontend

## 1. Instalar dependencias

```bash
cd extension
npm install
```

## 2. Build de la extensión

```bash
npm run build
```

Esto genera la carpeta `extension/dist/` con la extensión compilada.

## 3. Cargar en Chrome

### Paso a paso:

1. Abrí Chrome
2. Andá a: `chrome://extensions/`
3. Activá **"Modo de desarrollador"** (toggle arriba a la derecha)
4. Click en **"Cargar extensión sin empaquetar"**
5. Navegá a: `/Users/martintrabajo/Documents/GitHub/PicanthonProyecto/extension/dist`
6. Click **"Seleccionar"**

✅ Ya tenés la extensión instalada!

## 4. Ver el popup

### Opción A: Desde cualquier página
1. Click en el ícono de la extensión (arriba a la derecha en Chrome)
2. Si no lo ves, click en el ícono de puzzle 🧩 y "pin" la extensión

### Opción B: Desde una página de propiedades
1. Navegá a alguna de estas páginas:
   - https://www.mercadolibre.com.uy/inmuebles/
   - https://www.infocasas.com.uy/
   - https://www.veocasas.com/
2. Click en el ícono de la extensión

## 5. Ver cambios en vivo (Desarrollo)

Si querés hacer cambios y ver resultados al instante:

```bash
# En una terminal, dejá corriendo:
npm run dev
```

Luego, cada vez que hagas un cambio:
1. Guardá el archivo
2. En `chrome://extensions/`, click en el ícono de **refresh** ⟳ de tu extensión
3. Cerrá y abrí el popup

---

## 🎨 Vista previa del diseño

El popup se ve así:

```
┌─────────────────────────────────────┐
│  🏠 Buscador de Propiedades         │ ← Header azul
│     Uruguay                         │
├─────────────────────────────────────┤
│                                     │
│  💬 ¡Hola! ¿Qué tipo de propiedad   │ ← Chat
│     estás buscando?                 │
│                                     │
│              Busco apto 2 dorms...  │ ← Usuario
│                                     │
├─────────────────────────────────────┤
│  [Escribí qué buscás...]       [→]  │ ← Input
│  Buscamos en ML, IC y VC            │
└─────────────────────────────────────┘
```

Cuando haces una búsqueda (necesita API corriendo):

```
┌─────────────────────────────────────┐
│  🏠 Buscador de Propiedades         │
│     Uruguay                         │
├─────────────────────────────────────┤
│  💬 Encontré 8 propiedades...       │
│                                     │
│  ┌──────────────────────────────┐  │ ← Propiedad actual
│  │ 🏠 Propiedad actual   [87%]  │  │   (si estás en ML/IC/VC)
│  │ ✓ Precio dentro de rango     │  │
│  │ ✓ Barrio coincide: Pocitos   │  │
│  └──────────────────────────────┘  │
│                                     │
│  ✨ Sugerencias para vos            │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ ML | 📍 Pocitos      [91%]   │  │ ← Card de sugerencia
│  │ Apto 2 dorms con garaje      │  │
│  │ 🛏️ 2 dorms · 🚿 2 baños       │  │
│  │ 📐 70 m²                      │  │
│  │ USD 220.000                   │  │
│  │ ─────────────────────         │  │
│  │ ✓ Precio dentro de rango     │  │
│  │ ✓ Incluye garaje             │  │
│  │ ♡ Guardar en Wishlist        │  │
│  └──────────────────────────────┘  │
│                                     │
│  [más cards...]                     │
│                                     │
├─────────────────────────────────────┤
│  [Escribí qué buscás...]       [→]  │
│  Buscamos en ML, IC y VC            │
└─────────────────────────────────────┘
```

---

## ⚠️ Nota importante

**El frontend ya funciona**, pero para ver resultados reales necesitás:

1. ✅ OpenAI API Key (ya lo tenés)
2. ✅ Tavily API Key (ya lo tenés)
3. ❌ Supabase configurado (falta)
4. ❌ Mini-API corriendo en `http://localhost:3000` (falta)

Por ahora, al hacer una búsqueda vas a ver un error porque la API no está corriendo. Pero podés ver el **diseño del popup** perfectamente.

---

## 🐛 Troubleshooting

### No se carga la extensión
- Verificá que `npm run build` haya terminado sin errores
- Revisá la consola de `chrome://extensions/` para errores

### El popup no se abre
- Click derecho en el ícono de la extensión → "Inspeccionar popup"
- Mirá la consola para ver errores

### Cambios no se reflejan
- Hacé click en ⟳ (refresh) en `chrome://extensions/`
- Cerrá y abrí el popup

---

## 📸 Screenshots

Podés hacer screenshots del popup:
1. Abrí el popup
2. Click derecho → "Inspeccionar"
3. En DevTools, click en el ícono de teléfono 📱 (responsive mode)
4. Ajustá tamaño a 384x600
5. Tomá screenshot
