const express = require('express');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

app.use('/favicon', express.static(path.join(__dirname, 'm.5egytucuw.com', 'favicon')));
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
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Static server listening at http://${HOST}:${PORT}`);
});
