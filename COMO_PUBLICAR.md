# 📤 Cómo Publicar la Extensión en GitHub

Guía paso a paso para crear un Release en GitHub y permitir que la gente descargue tu extensión.

## 🚀 Paso 1: Crear el Paquete

```bash
# Desde la raíz del proyecto, ejecutá:
./package-extension.sh
```

Esto va a:
1. Compilar la extensión
2. Crear `buscador-propiedades-uy.zip` (117 KB)

## 📤 Paso 2: Subir a GitHub

### 2.1 Commitear tus cambios

```bash
git add .
git commit -m "Release v1.0.0 - Extensión lista para distribución"
git push origin main
```

### 2.2 Crear un Release en GitHub

1. **Andá a tu repositorio en GitHub**
   - https://github.com/TU-USUARIO/PicanthonProyecto

2. **Click en "Releases"** (en la barra lateral derecha)

3. **Click en "Draft a new release"** (botón verde)

4. **Completá la información:**
   
   **Tag version**: `v1.0.0`
   - Click en "Create new tag: v1.0.0 on publish"
   
   **Release title**: `v1.0.0 - Buscador de Propiedades UY`
   
   **Description**: Copiá y pegá esto:
   ```markdown
   ## 🏠 Buscador de Propiedades UY - Chrome Extension
   
   Extensión de Chrome con IA para buscar propiedades en Uruguay.
   
   ### ✨ Características
   - 💬 Chat conversacional con IA (GPT-4o-mini)
   - 🔍 Búsqueda real con Tavily
   - 🔗 Links clicables a propiedades
   - 🏢 MercadoLibre, InfoCasas, VeoCasas
   - ❤️ Wishlist de favoritos
   
   ### 📦 Instalación
   
   1. **Descargá** `buscador-propiedades-uy.zip`
   2. **Descomprimí** el archivo
   3. **Instalá en Chrome:**
      - Abrí `chrome://extensions/`
      - Activá "Modo de desarrollador"
      - Click en "Cargar extensión sin empaquetar"
      - Seleccioná la carpeta descomprimida
   4. **Configurá tu API Key de OpenAI** (ver README.md)
   
   ### 🔑 API Keys Necesarias
   
   - **OpenAI**: https://platform.openai.com/api-keys (gratis con $5 de crédito)
   - **Tavily** (opcional): https://tavily.com (1,000 búsquedas gratis/mes)
   
   ### 📖 Documentación
   
   Ver [README.md](https://github.com/TU-USUARIO/PicanthonProyecto/blob/main/README.md) para instrucciones completas.
   
   ### 💰 Costos
   
   ~$0.02-0.08 USD por usuario (primeros meses gratis con créditos de OpenAI)
   
   ### 🐛 Reportar Bugs
   
   [Abrí un Issue](https://github.com/TU-USUARIO/PicanthonProyecto/issues)
   ```

5. **Adjuntar el archivo ZIP:**
   - En la sección "Attach binaries"
   - Arrastrá o seleccioná `buscador-propiedades-uy.zip`
   - Esperá a que se suba (117 KB - rápido)

6. **Publicar:**
   - Click en "Publish release" (botón verde)

## ✅ ¡Listo!

Ahora tu extensión está disponible públicamente en:
```
https://github.com/TU-USUARIO/PicanthonProyecto/releases
```

## 📢 Compartir con Usuarios

Podés compartir estos links:

**Link directo al release:**
```
https://github.com/TU-USUARIO/PicanthonProyecto/releases/tag/v1.0.0
```

**Link directo al ZIP:**
```
https://github.com/TU-USUARIO/PicanthonProyecto/releases/download/v1.0.0/buscador-propiedades-uy.zip
```

## 🔄 Actualizar la Extensión (Futuros Releases)

Cuando hagas cambios y quieras publicar una nueva versión:

1. **Actualizá la versión en `extension/manifest.json`:**
   ```json
   "version": "1.1.0"
   ```

2. **Creá el nuevo paquete:**
   ```bash
   ./package-extension.sh
   ```

3. **Creá un nuevo Release:**
   - Tag: `v1.1.0`
   - Title: `v1.1.0 - Descripción de cambios`
   - Subí el nuevo `buscador-propiedades-uy.zip`

4. **Notas de la versión:**
   ```markdown
   ## ¿Qué hay de nuevo?
   - ✨ Nueva feature X
   - 🐛 Bug fixes
   - 🚀 Mejoras de performance
   ```

## 📊 Ver Estadísticas

GitHub te muestra:
- Cuántas veces se descargó el ZIP
- Vistas de la página del release
- Clones del repositorio

## 💡 Tips

- ✅ Usá [Semantic Versioning](https://semver.org/): v1.0.0, v1.1.0, v2.0.0
- ✅ Escribí notas de release claras
- ✅ Incluí screenshots en la descripción
- ✅ Actualizá el README con cada release
- ✅ Respondé a issues de usuarios rápido

---

**¿Dudas?** Abrí un Issue en el repo y te ayudamos! 🚀
