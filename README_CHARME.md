# Academia CHARME — sitio web completo

Proyecto responsive preparado para computadora, tablet y celular.

## Ejecutar localmente

### Forma fácil en Windows

Hacé doble clic en `INICIAR_EN_WINDOWS.bat`. La primera vez instalará las
dependencias y luego iniciará la web.

### Desde CMD o la terminal de VS Code

```bash
npm install
npm run dev
```

En Windows, ejecutá ambos comandos dentro de la carpeta descomprimida. La
terminal mostrará la dirección local, normalmente `http://localhost:5173`.

## Generar archivos para publicar

```bash
npm run build
```

## Archivos principales

- `app/page.tsx`: estructura, contenidos e interacciones de la Home.
- `app/globals.css`: diseño desktop, tablet y mobile.
- `app/layout.tsx`: metadatos del sitio.
- `public/images/`: logo y todas las imágenes usadas en la página.

## Importante

El modal de inicio de sesión es una demostración visual. Para un acceso real y seguro debe conectarse con Supabase Auth y con las tablas de cursos, alumnos, inscripciones, lecciones y progreso.

Los precios visibles corresponden al listado proporcionado: pago en efectivo; débito con 5% de recargo y crédito con 10% de recargo.
