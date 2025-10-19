#!/bin/bash

echo "📦 Empaquetando Extensión para Distribución"
echo "============================================"
echo ""

cd extension

echo "🔨 1. Compilando extensión..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en la compilación"
    exit 1
fi

echo "✅ Compilación exitosa"
echo ""

echo "📂 2. Creando archivo ZIP..."
cd dist
zip -r ../../buscador-propiedades-uy.zip * -x "*.DS_Store"
cd ../..

if [ $? -eq 0 ]; then
    echo "✅ Paquete creado exitosamente!"
    echo ""
    echo "📦 Archivo: buscador-propiedades-uy.zip"
    ls -lh buscador-propiedades-uy.zip
    echo ""
    echo "📋 Próximos pasos:"
    echo "   1. Subí este archivo a GitHub Releases"
    echo "   2. Los usuarios pueden descargarlo e instalarlo en Chrome"
    echo ""
else
    echo "❌ Error creando el ZIP"
    exit 1
fi
