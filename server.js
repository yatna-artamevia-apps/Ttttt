const express = require('express');
const fs = require('fs');
const path = require('path');
const { handleMockApi } = require('./mockPgApi');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const USE_UPSTREAM_PROXY = process.env.USE_UPSTREAM_PROXY === '1';

const gameEntryPath = path.join(__dirname, 'm.5egytucuw.com', '74', 'index2eb4.html');
const faviconDir = path.join(__dirname, 'm.5egytucuw.com', 'favicon');
const sharedCacheDir = path.join(__dirname, 'static_cache');

const MIME_BY_EXT = {
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.wasm': 'application/wasm',
  '.bin': 'application/octet-stream',
  '.cconb': 'application/octet-stream',
  '.plist': 'application/xml; charset=utf-8',
  '.fnt': 'text/plain; charset=utf-8',
  '.atlas': 'text/plain; charset=utf-8'
};

function resolveSafeCachePath(reqPath) {
  let rel = (reqPath || '/').split('?')[0];
  if (rel.endsWith('/')) rel += 'index.html';
  rel = rel.replace(/^\/+/, '');
  if (!rel) return null;
  const resolved = path.resolve(sharedCacheDir, rel);
  if (resolved !== sharedCacheDir && !resolved.startsWith(sharedCacheDir + path.sep)) {
    return null;
  }
  return resolved;
}

app.get(['/favicon.ico', '/favicon/favicon.ico', '/74/favicon/favicon.ico'], (req, res) => {
  return res.sendFile(path.join(faviconDir, 'favicon-48.png'));
});

app.use('/favicon', express.static(faviconDir));
app.use('/74/favicon', express.static(faviconDir));

app.all('/__noop_analytics', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  return res.status(200).send('');
});

app.get(['/74/index.html', '/74', '/74/'], (req, res) => {
  return res.sendFile(gameEntryPath);
});

app.get('/m.5egytucuw.com/74/index2eb4.html', (req, res) => {
  const qIdx = req.originalUrl.indexOf('?');
  const qs = qIdx !== -1 ? req.originalUrl.slice(qIdx) : '';
  return res.redirect(302, '/74/index.html' + qs);
});

app.use(express.static(__dirname));

app.use('/__shared_proxy', express.raw({ type: '*/*', limit: '10mb' }), async (req, res) => {
  try {
    const cacheFile = resolveSafeCachePath(req.path);
    if (cacheFile && fs.existsSync(cacheFile) && fs.statSync(cacheFile).isFile()) {
      const metaFile = cacheFile + '.meta.json';
      let contentType = MIME_BY_EXT[path.extname(cacheFile).toLowerCase()];
      if (fs.existsSync(metaFile)) {
        try {
          const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
          if (meta && meta.contentType) contentType = meta.contentType;
        } catch {}
      }
      if (contentType) res.setHeader('Content-Type', contentType);
      return res.sendFile(cacheFile);
    }

    const targetUrl = 'https://static.5egytucuw.com' + req.url;
    const upstream = await fetch(targetUrl);
    const contentType = upstream.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);
    const buf = Buffer.from(await upstream.arrayBuffer());

    if (upstream.status === 200 && cacheFile && req.method === 'GET') {
      try {
        fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
        fs.writeFileSync(cacheFile, buf);
        if (contentType) {
          fs.writeFileSync(cacheFile + '.meta.json', JSON.stringify({ contentType }));
        }
      } catch {}
    }

    res.status(upstream.status).send(buf);
  } catch (err) {
    res.status(502).json({ error: 'Shared proxy error' });
  }
});

app.use('/__api_proxy', express.raw({ type: '*/*', limit: '2mb' }), async (req, res) => {
  if (!USE_UPSTREAM_PROXY) {
    return handleMockApi(req, res);
  }
  try {
    const targetUrl = 'https://api.u45owu68o.com' + req.url;
    const forwardHeaders = {
      origin: 'https://m.5egytucuw.com',
      referer: 'https://m.5egytucuw.com/'
    };
    const passHeaders = ['content-type', 'accept', 'authorization', 'x-client-trace-id', 'x-app-trace-id', 'x-app-deployment'];
    for (const h of passHeaders) {
      if (req.headers[h]) forwardHeaders[h] = req.headers[h];
    }
    const hasBody = req.method !== 'GET' && req.method !== 'HEAD' && req.body && req.body.length > 0;
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body: hasBody ? req.body : undefined
    });
    const contentType = upstream.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.status(upstream.status).send(buf);
  } catch (err) {
    res.status(502).json({ error: 'Upstream proxy error' });
  }
});

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.sendFile(gameEntryPath);
});

app.listen(PORT, HOST, () => {
  console.log(`Static server listening at http://${HOST}:${PORT}`);
});
