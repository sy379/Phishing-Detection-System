const { scanUrl } = require("./virusTotal");
const { calculateRiskLevel } = require("../utils/riskCalculator");

function extractUrls(text) {
  const urlRegex = /(https?:\/\/[^\s"'<>]+)/gi;
  return text.match(urlRegex) || [];
}

function analyzeUrlFeatures(url) {
  let score = 0;
  const reasons = [];

  try {
    const parsed = new URL(url);

    if (parsed.protocol === "http:") {
      score += 10;
      reasons.push("Uses HTTP instead of HTTPS");
    }

    if (url.length > 75) {
      score += 10;
      reasons.push("URL is unusually long");
    }

    const suspiciousKeywords = ["login", "verify", "account", "secure", "update", "confirm", "bank", "paypal"];
    const urlLower = url.toLowerCase();
    suspiciousKeywords.forEach((kw) => {
      if (urlLower.includes(kw)) {
        score += 5;
        reasons.push(`Contains suspicious keyword: "${kw}"`);
      }
    });

    const specialChars = (url.match(/[%@!$^&*()_+=|~`{}[\]:;<>?,./\\-]/g) || []).length;
    if (specialChars > 5) {
      score += 5;
      reasons.push("Contains excessive special characters");
    }

    const digits = (url.match(/\d/g) || []).length;
    if (digits > 10) {
      score += 5;
      reasons.push("Contains excessive digits");
    }

    const dots = (url.match(/\./g) || []).length;
    if (dots > 3) {
      score += 5;
      reasons.push("Contains multiple subdomains");
    }

    if (parsed.hostname.includes("tinyurl") || parsed.hostname.includes("bit.ly") ||
        parsed.hostname.includes("shorturl") || parsed.hostname.includes("short.link")) {
      score += 15;
      reasons.push("Uses URL shortener service");
    }

    if (parsed.pathname.split("/").filter(Boolean).length > 5) {
      score += 5;
      reasons.push("Deep path structure");
    }
  } catch {
    score += 20;
    reasons.push("Invalid URL format");
  }

  return { score: Math.min(score, 60), reasons };
}

async function analyzeUrl(url) {
  const featureResult = analyzeUrlFeatures(url);
  const vtResult = await scanUrl(url);

  let vtScore = 0;
  const vtReasons = [];

  if (vtResult.error) {
    vtReasons.push(vtResult.error);
  } else if (vtResult.total > 0) {
    const ratio = vtResult.malicious + vtResult.suspicious;
    vtScore = Math.round((ratio / Math.max(vtResult.total, 1)) * 40);
    if (vtResult.malicious > 0) {
      vtReasons.push(`Flagged as malicious by ${vtResult.malicious}/${vtResult.total} security vendors`);
    }
    if (vtResult.suspicious > 0) {
      vtReasons.push(`Flagged as suspicious by ${vtResult.suspicious}/${vtResult.total} security vendors`);
    }
    if (ratio === 0) {
      vtReasons.push("No threats detected by VirusTotal");
    }
  }

  const totalScore = Math.min(featureResult.score + vtScore, 100);
  const riskLevel = calculateRiskLevel(totalScore);

  const details = {
    score: totalScore,
    riskLevel,
    reasons: [...featureResult.reasons, ...vtReasons],
    urlAnalysis: featureResult,
    virusTotal: vtResult,
    analyzedAt: new Date().toISOString(),
  };

  return { riskLevel, score: totalScore, details };
}

async function analyzeEmail(content) {
  const reasons = [];
  let score = 0;

  const urgencyPhrases = [
    "urgent", "immediately", "action required", "account suspended",
    "verify now", "click here", "limited time", "security alert",
    "unauthorized login", "suspicious activity",
  ];
  const contentLower = content.toLowerCase();
  urgencyPhrases.forEach((phrase) => {
    const regex = new RegExp(phrase, "gi");
    const matches = content.match(regex);
    if (matches) {
      score += 5 * matches.length;
      reasons.push(`Contains urgency phrase: "${phrase}" (${matches.length}x)`);
    }
  });

  const threatKeywords = [
    "password", "credit card", "social security", "bank account",
    "ssn", "atm pin", "cvv", "login credentials",
  ];
  threatKeywords.forEach((kw) => {
    const regex = new RegExp(kw, "gi");
    const matches = content.match(regex);
    if (matches) {
      score += 8;
      reasons.push(`Requests sensitive information: "${kw}"`);
    }
  });

  const urls = extractUrls(content);
  let urlScore = 0;
  const urlResults = [];

  for (const url of urls.slice(0, 5)) {
    const featureResult = analyzeUrlFeatures(url);
    urlScore += featureResult.score;
    urlResults.push({ url, reasons: featureResult.reasons, score: featureResult.score });
  }

  score += urlScore;
  if (urlResults.length > 0) {
    const totalUrlReasons = urlResults.flatMap((r) => r.reasons);
    reasons.push(`Contains ${urlResults.length} URL(s) with suspicious characteristics`);
    reasons.push(...totalUrlReasons.slice(0, 5));
  }

  const exclamationCount = (content.match(/!/g) || []).length;
  if (exclamationCount > 3) {
    score += 5;
    reasons.push("Excessive use of exclamation marks");
  }

  const capsRatio = content.replace(/[^a-zA-Z]/g, "").split("").filter((c) => c === c.toUpperCase() && c !== c.toLowerCase()).length /
    Math.max(content.replace(/[^a-zA-Z]/g, "").length, 1);
  if (capsRatio > 0.4) {
    score += 10;
    reasons.push("Excessive use of capital letters");
  }

  const totalScore = Math.min(Math.round(score), 100);
  const riskLevel = calculateRiskLevel(totalScore);

  const details = {
    score: totalScore,
    riskLevel,
    reasons,
    urgencyPhrasesFound: score > 30,
    containsSensitiveRequests: reasons.some((r) => r.includes("sensitive information")),
    urlCount: urls.length,
    urls: urlResults,
    analyzedAt: new Date().toISOString(),
  };

  return { riskLevel, score: totalScore, details };
}

module.exports = { analyzeUrl, analyzeEmail };
