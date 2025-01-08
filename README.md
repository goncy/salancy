# Salancy

Promedio de salarios en IT, administrado via Google Sheets.

🚨 ** Esta es la versión 2024, para la versión actualizada mirá la rama [main](https://github.com/goncy/salancy/tree/main) **

## Como la uso?

1. Crea una copia de [esta planilla de calculo](https://docs.google.com/spreadsheets/d/1T4bKoTOQQecslHno4R_8zIXCnjGjiStnh0VkBl9eMa0/edit?usp=sharing).
2. Una vez copiada, toca en `Archivo > Publicar en la web`, selecciona `Valores separados por comas (.csv)` del desplegable y clickea en `publicar`.
3. Asegurate que en vez de `Pagina web` diga `Valores separados por comas (.tsv)` y copia el enlace.
4. Pega el enlace en un archivo `.env` en la variable `NEXT_PUBLIC_SHEET_URL`.
5. Publica el sitio en [algun hosting que soporte NextJS](https://vercel.com)

## Como colaborar

Si pensas que podes agregar una funcionalidad que le sirva al resto, mandame un PR. Sino, podes mandarme un [cafecito](https://cafecito.app/goncy)

## Proximas funcionalidades

- [ ] Agregar un botón para descargar todos los datos en formato CSV.
- [ ] Simplificar la tabla mostrando los datos en un formato más compacto.

---

Si te gusta mi contenido, seguime en [Twitter](https://twitter.gonzalopozzo.com), en [Twitch](https://twitch.gonzalopozzo.com), en [YouTube](https://youtube.gonzalopozzo.com), doname un [Cafecito](https://cafecito.gonzalopozzo.com) o volvete [sponsor en github](https://github.com/sponsors/goncy) ✨
