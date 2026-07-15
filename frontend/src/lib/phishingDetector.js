import { calculateRiskLevel } from "./riskCalculator";

function extractUrls(text) {
  const urlRegex = /(https?:\/\/[^\s"'<>]+)/gi;
  return text.match(urlRegex) || [];
}

function analyzeUrlFeatures(url) {
  let score = 0;
  const reasons = [];
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:") { score += 10; reasons.push("Uses HTTP instead of HTTPS"); }
    if (url.length > 75) { score += 10; reasons.push("URL is unusually long"); }
    const suspiciousKeywords = ["login", "verify", "account", "secure", "update", "confirm", "bank", "paypal"];
    const urlLower = url.toLowerCase();
    suspiciousKeywords.forEach((kw) => {
      if (urlLower.includes(kw)) { score += 5; reasons.push(`Contains suspicious keyword: "${kw}"`); }
    });
    const specialChars = (url.match(/[%@!$^&*()_+=|~`{}[\]:;<>?,./\\-]/g) || []).length;
    if (specialChars > 5) { score += 5; reasons.push("Contains excessive special characters"); }
    const digits = (url.match(/\d/g) || []).length;
    if (digits > 10) { score += 5; reasons.push("Contains excessive digits"); }
    const dots = (url.match(/\./g) || []).length;
    if (dots > 3) { score += 5; reasons.push("Contains multiple subdomains"); }
    if (parsed.hostname.includes("tinyurl") || parsed.hostname.includes("bit.ly") || parsed.hostname.includes("shorturl")) {
      score += 15; reasons.push("Uses URL shortener service");
    }
  } catch { score += 20; reasons.push("Invalid URL format"); }
  return { score: Math.min(score, 60), reasons };
}

export async function analyzeUrl(url) {
  const featureResult = analyzeUrlFeatures(url);
  let vtScore = 0;
  const vtReasons = [];
  const API_KEY = process.env.VIRUSTOTAL_API_KEY;
  if (API_KEY) {
    try {
      const axios = require("axios");
      const submitRes = await axios.post("https://www.virustotal.com/api/v3/urls",
        new URLSearchParams({ url }),
        { headers: { "x-apikey": API_KEY, "Content-Type": "application/x-www-form-urlencoded" } }
      );
      const analysisId = submitRes.data.data.id;
      await new Promise((r) => setTimeout(r, 3000));
      const analysisRes = await axios.get(`https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        { headers: { "x-apikey": API_KEY } }
      );
      const stats = analysisRes.data.data.attributes.stats;
      const total = stats.malicious + stats.suspicious + stats.harmless + stats.undetected;
      const ratio = stats.malicious + stats.suspicious;
      vtScore = Math.round((ratio / Math.max(total, 1)) * 40);
      if (stats.malicious > 0) vtReasons.push(`Flagged as malicious by ${stats.malicious}/${total} security vendors`);
      if (stats.suspicious > 0) vtReasons.push(`Flagged as suspicious by ${stats.suspicious}/${total} security vendors`);
      if (ratio === 0) vtReasons.push("No threats detected by VirusTotal");
    } catch (e) { vtReasons.push("VirusTotal scan unavailable"); }
  }
  const totalScore = Math.min(featureResult.score + vtScore, 100);
  const riskLevel = calculateRiskLevel(totalScore);
  return { riskLevel, score: totalScore, details: { score: totalScore, riskLevel, reasons: [...featureResult.reasons, ...vtReasons], analyzedAt: new Date().toISOString() } };
}

export async function analyzeEmail(content) {
  const reasons = [];
  let score = 0;
  const urgencyPhrases = ["urgent","immediately","action required","account suspended","verify now","click here","limited time","security alert","unauthorized login","suspicious activity"];
  urgencyPhrases.forEach((phrase) => {
    const regex = new RegExp(phrase, "gi");
    const matches = content.match(regex);
    if (matches) { score += 5 * matches.length; reasons.push(`Contains urgency phrase: "${phrase}" (${matches.length}x)`); }
  });
  const threatKeywords = ["password","credit card","social security","bank account","ssn","atm pin","cvv","login credentials"];
  threatKeywords.forEach((kw) => {
    if (content.toLowerCase().includes(kw)) { score += 8; reasons.push(`Requests sensitive information: "${kw}"`); }
  });
  const urls = extractUrls(content);
  let urlScore = 0;
  const urlResults = [];
  for (const url of urls.slice(0, 5)) {
    const r = analyzeUrlFeatures(url);
    urlScore += r.score; urlResults.push({ url, reasons: r.reasons });
  }
  score += urlScore;
  if (urlResults.length > 0) reasons.push(`Contains ${urlResults.length} URL(s) with suspicious characteristics`);
  const exclamationCount = (content.match(/!/g) || []).length;
  if (exclamationCount > 3) { score += 5; reasons.push("Excessive use of exclamation marks"); }
  const totalScore = Math.min(Math.round(score), 100);
  const riskLevel = calculateRiskLevel(totalScore);
  return { riskLevel, score: totalScore, details: { score: totalScore, riskLevel, reasons, urgencyPhrasesFound: score > 30, containsSensitiveRequests: reasons.some((r) => r.includes("sensitive")), urlCount: urls.length, urls: urlResults, analyzedAt: new Date().toISOString() } };
}
