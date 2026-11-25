const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const gameEntryPath = path.join(__dirname, 'm.5egytucuw.com', '74', 'index2eb4.html');

app.use('/favicon', express.static(path.join(__dirname, 'm.5egytucuw.com', 'favicon')));
app.use('/74/favicon', express.static(path.join(__dirname, 'm.5egytucuw.com', 'favicon')));

app.get(['/74/index.html', '/74', '/74/'], (req, res) => {
  return res.sendFile(gameEntryPath);
});

app.get('/m.5egytucuw.com/74/index2eb4.html', (req, res) => {
  const qIdx = req.originalUrl.indexOf('?');
  const qs = qIdx !== -1 ? req.originalUrl.slice(qIdx) : '';
  return res.redirect(302, '/74/index.html' + qs);
});

app.use(express.static(__dirname));

app.use('/__api_proxy', express.raw({ type: '*/*', limit: '2mb' }), async (req, res) => {
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
