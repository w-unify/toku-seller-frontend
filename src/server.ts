import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

/**
 * Puedes definir endpoints de API aquí si lo necesitas
 * Ejemplo:
 * app.get('/api/**', (req, res) => { ... });
 */

/**
 * Sirve archivos estáticos desde /browser antes de cualquier otro manejo
 * Esto asegura que favicon.ico, imágenes, css, js, etc. se sirvan correctamente
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
  })
);

/**
 * Renderiza la aplicación Angular para cualquier otra ruta
 */
app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

/**
 * Inicia el servidor
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`✅ Node Express server listening on http://localhost:${port}`);
  });
}

export default app;
