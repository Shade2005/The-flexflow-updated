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
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  // Normalize and parse URL path
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Default to index.html for root
  if (pathname === '/') {
    pathname = '/index.html';
  }

  let filePath = path.join(ROOT, pathname);

  // Check if direct file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Try appending .html for clean routes (e.g. /services -> /services.html)
      const htmlPath = filePath + '.html';
      fs.stat(htmlPath, (htmlErr, htmlStats) => {
        if (!htmlErr && htmlStats.isFile()) {
          serveFile(htmlPath, '.html', res);
        } else {
          // Fallback to index.html
          const fallback = path.join(ROOT, 'index.html');
          fs.stat(fallback, (fbErr, fbStats) => {
            if (!fbErr && fbStats.isFile()) {
              serveFile(fallback, '.html', res);
            } else {
              res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
              res.end('404 Not Found');
            }
          });
        }
      });
    } else {
      const ext = path.extname(filePath).toLowerCase();
      serveFile(filePath, ext, res);
    }
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
