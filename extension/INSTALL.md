# 🚀 Instalación Rápida

## ✅ Todo está listo!

Ya tenés:
- ✅ Dependencias instaladas
- ✅ Íconos generados (16x16, 32x32, 48x48, 128x128)
- ✅ Build compilado en `dist/`

## 📦 Cargar en Chrome

### Pasos:

1. **Abrí Chrome**

2. **Andá a extensiones:**
   ```
   chrome://extensions/
   ```
   O: Menú (⋮) → Más herramientas → Extensiones

3. **Activá "Modo de desarrollador"**
   - Toggle arriba a la derecha

4. **Click en "Cargar extensión sin empaquetar"**

5. **Seleccioná la carpeta:**
   ```
   /Users/martintrabajo/Documents/GitHub/PicanthonProyecto/extension/dist
   ```

6. **¡Listo!** La extensión aparecerá en tu barra de herramientas.

---

## 🎨 Cómo se ve:

### Ícono en la barra:
- Casa azul con badge "UY" amarillo
- Si no lo ves, click en el puzzle 🧩 y "pin" la extensión

### Popup:
- **384px × 600px**
- Header azul degradado
- Chat conversacional
- Input con ícono de envío

---

## 🧪 Probar el frontend:

### 1. Click en el ícono de la extensión

Vas a ver:
```
┌─────────────────────────────┐
│ 🏠 Buscador de Propiedades  │
│    Uruguay                  │
├─────────────────────────────┤
│ 💬 ¡Hola! ¿Qué tipo de      │
│    propiedad estás buscando?│
├─────────────────────────────┤
│ [Escribí qué buscás...] →   │
│ Buscamos en ML, IC y VC     │
└─────────────────────────────┘
```

### 2. Escribí algo:
Ejemplo: `Busco apto 2 dorms Pocitos hasta 250k`

### 3. Verás un error (esperado):
```
❌ Hubo un error: Failed to fetch
   Intentá de nuevo.
```

**Esto es normal!** La API todavía no está corriendo.

---

## 🔍 Inspeccionar el popup:

1. Click derecho en el ícono de la extensión
2. **"Inspeccionar popup"**
3. Se abre DevTools

En la consola verás algo como:
```
Error: fetch failed
  at handleSend (popup.js:42)
```

Esto confirma que el frontend funciona, solo falta el backend.

---

## 🎯 Próximos pasos:

Para que funcione completamente necesitás:

1. ✅ **OpenAI API Key** (ya lo tenés en `.env`)
2. ✅ **Tavily API Key** (ya lo tenés en `.env`)
3. ❌ **Supabase** (falta configurar)
4. ❌ **Mini-API** corriendo en `http://localhost:3000` (falta implementar)

---

## 🐛 Troubleshooting:

### La extensión no aparece en chrome://extensions/
- Verificá que seleccionaste la carpeta `dist/` (no `extension/`)
- Revisá que no haya errores en la carga

### El popup no se abre
- Click derecho → "Inspeccionar popup" para ver errores
- Verificá que `manifest.json` esté en `dist/`

### Los íconos no se ven
- Verificá que `dist/assets/` contenga los 4 PNG
- Refrescá la extensión (ícono ⟳ en chrome://extensions/)

---

## 🔧 Desarrollo:

### Ver cambios en vivo:

```bash
# En una terminal:
npm run dev
```

Luego:
1. Hacé cambios en `popup/`
2. Guardá
3. En chrome://extensions/, click ⟳ (refresh)
4. Cerrá y abrí el popup

### Rebuild completo:

```bash
npm run build
```

Esto regenera:
- Íconos (desde SVG)
- TypeScript compilado
- Bundled con Vite

---

## 📸 Screenshots:

Para tomar screenshots del diseño:
1. Abrí el popup
2. Click derecho → "Inspeccionar"
3. En DevTools: ícono 📱 (responsive mode)
4. Ajustá: 384 × 600
5. Capturá pantalla

---

**¡Disfruta el MVP!** 🎉
