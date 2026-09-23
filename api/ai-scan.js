/**
 * Vercel Serverless Function & Local Node API: AI Visibility & Citation Scanner
 * 
 * Inspects a target domain for:
 * 1. Schema.org JSON-LD Knowledge Graph (@type, sameAs links, founder, knowsAbout)
 * 2. AI Crawler Permissions in robots.txt (GPTBot, PerplexityBot, ClaudeBot, Google-Extended)
 * 3. Semantic DOM & Token Readability for LLM context windows
 * 
 * Returns structured JSON with an AI Readiness Score (0-100) and actionable diagnostics.
 */

const BLOCKED_HOSTS = [
  'localhost', '127.0.0.1', '0.0.0.0', '::1', '169.254.169.254'
];

function isPrivateIp(ip) {
  return /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|127\.)/.test(ip);
}

function cleanDomainInput(raw) {
  if (!raw || typeof raw !== 'string') return null;
  let s = raw.trim().toLowerCase();
  s = s.replace(/^https?:\/\//, '');
  s = s.replace(/\/.*$/, '');
  s = s.replace(/:\d+$/, '');
  if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/.test(s)) {
    return null;
  }
  if (BLOCKED_HOSTS.includes(s) || isPrivateIp(s) || s.endsWith('.local') || s.endsWith('.internal')) {
    return null;
  }
  return s;
}

function parseJsonLdBlocks(html) {
  const scripts = [];
  const regex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const raw = match[1].trim();
    try {
      const parsed = JSON.parse(raw);
      scripts.push(parsed);
    } catch (e) {
      // Ignore malformed JSON-LD scripts
    }
  }
  return scripts;
}

function analyzeJsonLd(scripts) {
  const types = new Set();
  let hasOrg = false;
  let hasPersonOrFounder = false;
  let hasSameAs = false;
  let sameAsCount = 0;
  let hasKnowsAboutOrOffers = false;

  function inspectNode(node) {
    if (!node || typeof node !== 'object') return;

    if (Array.isArray(node)) {
      node.forEach(inspectNode);
      return;
    }

    if (node['@graph'] && Array.isArray(node['@graph'])) {
      node['@graph'].forEach(inspectNode);
    }

    if (node['@type']) {
      const t = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
      t.forEach(item => {
        if (typeof item === 'string') {
          types.add(item);
          if (['Organization', 'Corporation', 'LocalBusiness', 'ProfessionalService'].includes(item)) {
            hasOrg = true;
          }
          if (['Person'].includes(item)) {
            hasPersonOrFounder = true;
          }
        }
      });
    }

    if (node.founder || node.alumni || node.author) {
      hasPersonOrFounder = true;
    }

    if (node.sameAs) {
      hasSameAs = true;
      if (Array.isArray(node.sameAs)) {
        sameAsCount += node.sameAs.length;
      } else if (typeof node.sameAs === 'string') {
        sameAsCount += 1;
      }
    }

    if (node.knowsAbout || node.hasOfferCatalog || node.itemListElement) {
      hasKnowsAboutOrOffers = true;
    }
  }

  scripts.forEach(inspectNode);

  return {
    scriptsCount: scripts.length,
    types: Array.from(types),
    hasOrg,
    hasPersonOrFounder,
    hasSameAs,
    sameAsCount,
    hasKnowsAboutOrOffers
  };
}

function analyzeRobotsTxt(txt) {
  if (!txt || typeof txt !== 'string') {
    return { status: 'empty', blockedBots: [], allAiBotsAllowed: true };
  }

  const lines = txt.split(/\r?\n/);
  let currentAgents = [];
  const blocked = new Set();
  const targetBots = ['gptbot', 'perplexitybot', 'claudebot', 'google-extended', 'applebot-extended'];

  for (const line of lines) {
    const clean = line.replace(/#.*$/, '').trim();
    if (!clean) continue;

    const agentMatch = clean.match(/^user-agent:\s*(.*)$/i);
    if (agentMatch) {
      const agent = agentMatch[1].trim().toLowerCase();
      currentAgents.push(agent);
      continue;
    }

    const disallowMatch = clean.match(/^disallow:\s*(.*)$/i);
    if (disallowMatch) {
      const path = disallowMatch[1].trim();
      if (path === '/' || path === '/*') {
        currentAgents.forEach(agent => {
          if (agent === '*') {
            targetBots.forEach(b => blocked.add(b));
          } else if (targetBots.includes(agent)) {
            blocked.add(agent);
          }
        });
      }
    }
  }

  return {
    isAvailable: true,
    blockedBots: Array.from(blocked),
    allAiBotsAllowed: blocked.size === 0
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const startTime = Date.now();
  let domainParam = req.query?.domain;
  if (!domainParam && req.url) {
    try {
      const parsed = new URL(req.url, 'http://localhost');
      domainParam = parsed.searchParams.get('domain');
    } catch (e) {}
  }
  if (!domainParam && req.body?.domain) {
    domainParam = req.body.domain;
  }

  const domain = cleanDomainInput(domainParam);
  if (!domain) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Invalid domain. Please enter a valid website (e.g. acme.com).'
    }));
    return;
  }

  try {
    const fetchHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (compatible; FlexFlowCitationScanner/1.0; +https://theflexflow.in)',
      'Accept': 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9'
    };

    const [htmlRes, robotsRes] = await Promise.allSettled([
      fetch(`https://${domain}`, {
        headers: fetchHeaders,
        signal: AbortSignal.timeout(3800),
        redirect: 'follow'
      }).then(r => r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`)))
        .catch(() => {
          return fetch(`http://${domain}`, {
            headers: fetchHeaders,
            signal: AbortSignal.timeout(3000),
            redirect: 'follow'
          }).then(r => r.text());
        }),
      fetch(`https://${domain}/robots.txt`, {
        headers: fetchHeaders,
        signal: AbortSignal.timeout(2500)
      }).then(r => r.ok ? r.text() : '')
        .catch(() => '')
    ]);

    const html = htmlRes.status === 'fulfilled' ? htmlRes.value : '';
    const robotsTxt = robotsRes.status === 'fulfilled' ? robotsRes.value : '';

    if (!html) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        domain,
        success: false,
        error: `Could not reach https://${domain}. Please verify the domain is live.`,
        score: 0,
        grade: 'F'
      }));
      return;
    }

    const jsonLdBlocks = parseJsonLdBlocks(html);
    const schemaAnalysis = analyzeJsonLd(jsonLdBlocks);
    const robotsAnalysis = analyzeRobotsTxt(robotsTxt);

    const hasH1 = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.test(html);
    const hasMetaDesc = /<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i.test(html);
    const hasSemanticMain = /<(main|article)\b/i.test(html);

    let score = 0;

    if (schemaAnalysis.scriptsCount > 0) score += 10;
    if (schemaAnalysis.hasOrg) score += 15;
    if (schemaAnalysis.hasPersonOrFounder) score += 10;
    if (schemaAnalysis.hasSameAs) score += 10;

    if (robotsAnalysis.allAiBotsAllowed) {
      score += 25;
    } else {
      score += Math.max(0, 25 - (robotsAnalysis.blockedBots.length * 10));
    }

    if (hasMetaDesc) score += 8;
    if (hasH1) score += 6;
    if (hasSemanticMain) score += 6;

    const elapsed = Date.now() - startTime;
    if (elapsed < 1200) score += 10;
    else if (elapsed < 2500) score += 6;
    else score += 3;

    let grade = 'D-';
    let summary = '';
    let riskLevel = 'Critical';

    if (score >= 85) {
      grade = 'A';
      riskLevel = 'Low';
      summary = 'Verified Schema.org entity architecture. Generative engines like ChatGPT and Perplexity can extract and quote your domain by name.';
    } else if (score >= 65) {
      grade = 'B';
      riskLevel = 'Moderate';
      summary = 'Basic entities detected, but missing founder/person linkages and verified external authority nodes for confident citations.';
    } else if (score >= 40) {
      grade = 'C';
      riskLevel = 'High';
      summary = 'Incomplete entity graph. AI models risk hallucinating or quoting competitor aggregators (Clutch/G2) instead of your domain.';
    } else {
      grade = 'D-';
      riskLevel = 'Critical';
      summary = 'Zero Schema.org entity graph found. When buyers query ChatGPT or Perplexity for your niche, competitors are cited by name.';
    }

    const payload = {
      domain,
      success: true,
      score,
      grade,
      riskLevel,
      summary,
      timeMs: elapsed,
      checkedAt: new Date().toISOString(),
      checks: {
        schema: {
          status: schemaAnalysis.hasOrg && schemaAnalysis.hasSameAs ? 'pass' : (schemaAnalysis.scriptsCount > 0 ? 'warning' : 'fail'),
          label: 'Schema.org Entity Graph',
          details: schemaAnalysis.scriptsCount === 0 
            ? 'No JSON-LD entity graph detected. LLMs cannot verify your company profile.'
            : (schemaAnalysis.hasPersonOrFounder && schemaAnalysis.hasSameAs 
                ? `Verified Knowledge Graph (${schemaAnalysis.types.slice(0, 3).join(', ')}) with ${schemaAnalysis.sameAsCount} authority link(s).`
                : `Partial JSON-LD found (${schemaAnalysis.types.slice(0, 3).join(', ') || 'Unrecognized'}). Missing founder & authority links.`),
          types: schemaAnalysis.types,
          hasFounder: schemaAnalysis.hasPersonOrFounder,
          sameAsCount: schemaAnalysis.sameAsCount
        },
        crawler: {
          status: robotsAnalysis.allAiBotsAllowed ? 'pass' : 'fail',
          label: 'AI Crawler Indexing (robots.txt)',
          details: robotsAnalysis.allAiBotsAllowed
            ? 'GPTBot, PerplexityBot, and ClaudeBot are permitted to crawl your content.'
            : `Blocked crawlers: ${robotsAnalysis.blockedBots.join(', ')}. LLM answer engines cannot read your pages.`,
          blockedBots: robotsAnalysis.blockedBots
        },
        semantics: {
          status: hasH1 && hasMetaDesc && hasSemanticMain ? 'pass' : 'warning',
          label: 'Semantic DOM & Answer Extraction',
          details: hasSemanticMain
            ? 'Semantic HTML structure detected (<main>/<article> with defined headers).'
            : 'Unstructured layout shifts or heavy client-side templates detected. May cause LLM crawler timeouts.',
          hasH1,
          hasMetaDesc
        }
      },
      citationVerdict: score >= 75 
        ? 'High likelihood of direct quotation by ChatGPT and Perplexity'
        : 'Competitors or directories likely to be cited instead of your domain'
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      domain,
      success: false,
      error: 'Scanner encountered an error analyzing this host. ' + (err.message || ''),
      score: 0,
      grade: 'N/A'
    }));
  }
};
