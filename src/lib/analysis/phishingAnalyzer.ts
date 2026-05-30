export interface PhishingAnalysisResult {
  score: number;
  risk: string;
  color: string;
  reasons: string[];
}

const safeDomains = [
  'google.com', 'facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com',
  'youtube.com', 'amazon.com', 'microsoft.com', 'apple.com', 'netflix.com',
  'github.com', 'stackoverflow.com', 'reddit.com', 'wikipedia.org', 'yahoo.com',
  'outlook.com', 'live.com', 'office.com', 'dropbox.com', 'spotify.com',
  'twitch.tv', 'paypal.com', 'ebay.com', 'walmart.com', 'target.com',
  'bestbuy.com', 'adobe.com', 'salesforce.com', 'zoom.us', 'slack.com',
  'vercel.com', 'notion.so', 'figma.com', 'canva.com', 'trello.com',
];

const suspiciousKeywords = [
  'login', 'signin', 'sign-in', 'account', 'verify', 'verification', 'update',
  'secure', 'security', 'bank', 'banco', 'banking', 'password', 'credential',
  'suspend', 'suspended', 'locked', 'unlock', 'confirm', 'confirmation',
  'urgent', 'alert', 'warning', 'winner', 'prize', 'reward', 'free', 'gift',
  'click', 'support', 'soporte', 'help', 'helpdesk', 'service', 'customer',
  'wallet', 'crypto', 'bitcoin', 'payment', 'pago', 'invoice', 'factura',
  'actualizar', 'verificar', 'seguridad', 'contraseña', 'cuenta',
];

const suspiciousExtensions = [
  '.xyz', '.top', '.club', '.info', '.online', '.site', '.website', '.tk',
  '.ml', '.ga', '.cf', '.gq', '.pw', '.cc', '.ws', '.buzz', '.work',
];

/** Motor heurístico de detección de phishing (misma lógica que App.tsx). */
export function analyzeUrlForPhishing(inputUrl: string): PhishingAnalysisResult {
  const reasons: string[] = [];
  let dangerScore = 0;

  let normalizedUrl = inputUrl.toLowerCase().trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  let hostname = '';
  let pathname = '';
  try {
    const urlObj = new URL(normalizedUrl);
    hostname = urlObj.hostname;
    pathname = urlObj.pathname + urlObj.search;
  } catch {
    reasons.push('URL con formato invalido o sospechoso');
    dangerScore += 30;
    hostname = normalizedUrl;
  }

  const isSafeDomain = safeDomains.some((safe) => {
    return hostname === safe || hostname === 'www.' + safe || hostname.endsWith('.' + safe);
  });

  if (isSafeDomain) {
    return {
      score: 95,
      risk: 'Seguro',
      color: 'emerald',
      reasons: ['Dominio verificado y confiable'],
    };
  }

  const subdomainCount = (hostname.match(/\./g) || []).length;
  if (subdomainCount > 2) {
    reasons.push('Multiples subdominios sospechosos detectados');
    dangerScore += 25;
  }

  const fullUrl = hostname + pathname;
  const foundKeywords: string[] = [];
  suspiciousKeywords.forEach((keyword) => {
    if (fullUrl.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  });

  if (foundKeywords.length > 0) {
    reasons.push(`Palabras clave sospechosas: ${foundKeywords.slice(0, 3).join(', ')}`);
    dangerScore += Math.min(foundKeywords.length * 10, 40);
  }

  const hasSuspiciousExtension = suspiciousExtensions.some((ext) => hostname.endsWith(ext));
  if (hasSuspiciousExtension) {
    reasons.push('Extension de dominio de alto riesgo');
    dangerScore += 20;
  }

  const typosquattingPatterns = [
    { pattern: /g[o0]{2}gle|go+gle|googl[e3]/i, brand: 'Google' },
    { pattern: /faceb[o0]{2}k|fac[e3]book|faceb00k/i, brand: 'Facebook' },
    { pattern: /amaz[o0]n|amazon[0-9]/i, brand: 'Amazon' },
    { pattern: /micr[o0]s[o0]ft|microsoft[0-9]/i, brand: 'Microsoft' },
    { pattern: /app[l1]e|apple[0-9]/i, brand: 'Apple' },
    { pattern: /netfl[i1]x|netflix[0-9]/i, brand: 'Netflix' },
    { pattern: /paypa[l1]|paypal[0-9]/i, brand: 'PayPal' },
    { pattern: /bank[o0]f|[a-z]+bank/i, brand: 'Banco' },
  ];

  for (const { pattern, brand } of typosquattingPatterns) {
    if (pattern.test(hostname) && !safeDomains.some((safe) => hostname.includes(safe))) {
      reasons.push(`Posible imitacion de ${brand} (typosquatting)`);
      dangerScore += 35;
      break;
    }
  }

  const nonAsciiPattern = /[^\x00-\x7F]/;
  const strippedHostname = hostname.replace(/[a-zA-Z0-9.-]/g, '');
  if (nonAsciiPattern.test(strippedHostname)) {
    reasons.push('Caracteres unicode sospechosos detectados');
    dangerScore += 30;
  }

  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}/;
  if (ipPattern.test(hostname)) {
    reasons.push('Uso de direccion IP en lugar de dominio');
    dangerScore += 25;
  }

  if (hostname.length > 30) {
    reasons.push('Dominio inusualmente largo');
    dangerScore += 15;
  }

  if ((hostname.match(/-/g) || []).length > 2) {
    reasons.push('Multiples guiones en el dominio');
    dangerScore += 15;
  }

  if (/\d{4,}/.test(hostname)) {
    reasons.push('Secuencia de numeros sospechosa en dominio');
    dangerScore += 20;
  }

  const securityScore = Math.max(0, Math.min(100, 100 - dangerScore));

  let risk: string;
  let color: string;

  if (securityScore >= 80) {
    risk = 'Bajo';
    color = 'emerald';
    if (reasons.length === 0) {
      reasons.push('No se detectaron patrones de phishing');
    }
  } else if (securityScore >= 50) {
    risk = 'Medio';
    color = 'yellow';
  } else if (securityScore >= 20) {
    risk = 'Alto';
    color = 'red';
  } else {
    risk = 'Critico';
    color = 'red';
  }

  return { score: securityScore, risk, color, reasons };
}
