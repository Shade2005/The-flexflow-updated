/**
 * IndexNow Instant URL Submission Script (Bing, ChatGPT Search / Copilot, Yandex, Seznam)
 *
 * Reads all <loc> URLs from sitemap.xml and submits them in a single batch POST
 * to https://api.indexnow.org/indexnow so search engines re-crawl updated pages
 * immediately after deployment.
 *
 * Usage:
 *   npm run indexnow
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Core site configuration and verification key (must match /<INDEXNOW_KEY>.txt at site root)
const SITE_HOST = 'theflexflow.in';
const INDEXNOW_KEY = 'f7a9c2e4b8104d6f9e3a1c5b7d2084e1';
const KEY_LOCATION = `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`;
const SITEMAP_PATH = path.join(__dirname, '..', 'sitemap.xml');

/**
 * Extracts every <loc> URL from sitemap.xml using a simple regex
 * to avoid external XML parser dependencies.
 * @returns {string[]} Array of absolute URLs
 */
function extractSitemapUrls() {
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map((m) => m[1].trim()).filter(Boolean);
}

/**
 * Submits the URL list to the IndexNow API endpoint.
 * @param {string[]} urlList
 */
function submitToIndexNow(urlList) {
  const payload = JSON.stringify({
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList
  });

  const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  console.log(`Submitting ${urlList.length} URLs to IndexNow for ${SITE_HOST}...`);

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      // HTTP 200 (OK) or 202 (Accepted) indicates successful ingestion
      if (res.statusCode === 200 || res.statusCode === 202) {
        console.log(`IndexNow submission succeeded (HTTP ${res.statusCode}).`);
      } else {
        console.error(`IndexNow submission returned HTTP ${res.statusCode}: ${body}`);
        process.exitCode = 1;
      }
    });
  });

  req.on('error', (err) => {
    console.error('IndexNow network error:', err.message);
    process.exitCode = 1;
  });

  req.write(payload);
  req.end();
}

const urls = extractSitemapUrls();
if (urls.length === 0) {
  console.error('No URLs found in sitemap.xml. Aborting IndexNow submission.');
  process.exit(1);
}

submitToIndexNow(urls);
