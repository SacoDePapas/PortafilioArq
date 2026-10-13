import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const app = express();
const port = Number(process.env.PORT || 3001);
const dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json());

const profile = {
  name: 'Nube García',
  headline: 'Estudiante de Arquitectura | Diseño arquitectónico y urbano | Rehabilitación urbana y arquitectura sostenible',
  location: 'Tijuana, Baja California, México',
  email: 'arq.nubeg@gmail.com',
  linkedin: 'https://linkedin.com/in/nubeg',
};
const counts = { likes: 24, reposts: 8, comments: 3 };

app.get('/api/profile', (_req, res) => res.json(profile));
app.get('/api/interactions', (_req, res) => res.json(counts));
app.post('/api/interactions/:kind', (req, res) => {
  const { kind } = req.params;
  if (!Object.hasOwn(counts, kind)) return res.status(404).json({ error: 'Interacción no encontrada.' });
  const amount = req.body?.amount === -1 ? -1 : 1;
  counts[kind] = Math.max(0, counts[kind] + amount);
  res.json({ kind, count: counts[kind] });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(dirname, 'dist')));
  app.get('*', (_req, res) => res.sendFile(path.join(dirname, 'dist', 'index.html')));
}

app.listen(port, () => console.log(`Portfolio API listening on http://localhost:${port}`));
