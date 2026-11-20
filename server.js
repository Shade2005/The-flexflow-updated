const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  // Serve plain text and XML manifests (robots.txt, llms.txt, IndexNow key, sitemap.xml) accurately
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // Normalize and parse URL path
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Strip trailing slash except for root
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // Serverless API routing
  if (pathname === '/api/ai-scan' || pathname === '/api/ai-scan.js') {
    try {
      const scanHandler = require('./api/ai-scan.js');
      return scanHandler(req, res);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Server error handling scan: ' + err.message }));
      return;
    }
  }

  // Default to index.html for root
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  let filePath = path.join(ROOT, pathname);

  // Check if direct file exists
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      return serveFile(filePath, ext, res);
    }

    // Check if it's a directory with index.html
    const dirIndex = path.join(filePath, 'index.html');
    fs.stat(dirIndex, (dirErr, dirStats) => {
      if (!dirErr && dirStats.isFile()) {
        return serveFile(dirIndex, '.html', res);
      }

      // Try appending .html for clean routes (e.g. /services -> /services.html, /blog -> /blog.html)
      const htmlPath = filePath + '.html';
      fs.stat(htmlPath, (htmlErr, htmlStats) => {
        if (!htmlErr && htmlStats.isFile()) {
          return serveFile(htmlPath, '.html', res);
        }

        // 404 Not Found
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
      });
    });
  });
});

function serveFile(filePath, ext, res) {
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('500 Server Error');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    res.end(content);
  });
}

server.listen(PORT, () => {
  console.log(`\n🚀 The FlexFlow local server running at:`);
  console.log(`   > Homepage:  http://localhost:${PORT}/`);
  console.log(`   > Services:  http://localhost:${PORT}/services\n`);
});
