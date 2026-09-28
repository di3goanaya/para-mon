# Para ti, Mon ❤️

Web romántica para el aniversario mensual. Estática, sin backend, sin base de datos.

## Estructura

```
/
├── index.html
├── style.css
├── script.js
└── assets/
    └── fotos/        (las 15 fotos originales, sin renombrar)
```

## Cómo probarla en tu computadora

No es necesario, pero si quieres verla antes de subirla:

1. Abre una terminal en esta carpeta.
2. Ejecuta: `python3 -m http.server 8000`
3. Abre en el navegador: `http://localhost:8000`

(También puedes abrir `index.html` directamente con doble clic en la mayoría de los casos, pero un servidor local es más confiable.)

## Cómo subirla a GitHub Pages

1. Crea un repositorio nuevo en GitHub (puede ser privado).
2. Sube **todo el contenido de esta carpeta** tal cual está (`index.html`, `style.css`, `script.js` y la carpeta `assets/` completa) a la raíz del repositorio.
3. En el repositorio: **Settings → Pages**.
4. En "Source" elige la rama principal (`main`) y la carpeta `/ (root)`.
5. Guarda. GitHub te dará un enlace como:
   `https://tu-usuario.github.io/nombre-del-repositorio/`
6. Ese es el enlace que puedes convertir en código QR.

**Importante:** sube la carpeta `assets/fotos/` completa, con los nombres de archivo exactamente como están (algunos tienen mayúsculas específicas y uno tiene un espacio antes de la extensión). No los renombres, o las fotos no se verán.

## Qué hace la página

- **Antes del 7 de octubre de 2026 (00:00, hora de Ciudad de México):** se muestra una cuenta regresiva con un mensaje romántico distinto cada día, del 27 de septiembre al 6 de octubre.
- **El 7 de octubre:** al entrar, la cuenta regresiva desaparece automáticamente y aparece la animación de desbloqueo con el botón "Abrir mi sorpresa ❤️".
- **Después de abrir la sorpresa:** introducción, galería de fotos extra, línea del tiempo de la relación, canciones con enlaces a Spotify, una carta con animación de sobre, y el mensaje final.

La fecha se calcula con la hora de Ciudad de México (México ya no cambia de horario desde 2022, así que se usa un desfase fijo de UTC-6). No depende de que el celular de quien la abre tenga configurada esa zona horaria.

## Notas técnicas

- Sin dependencias externas salvo las tipografías de Google Fonts (Cormorant Garamond y Karla), que se cargan por enlace `<link>` estándar.
- Mobile-first: pensada primero para pantallas de 375–430px de ancho.
- Si quieres cambiar algún texto o mensaje, están todos como texto plano dentro de `index.html` (secciones) y `script.js` (mensajes de la cuenta regresiva).
