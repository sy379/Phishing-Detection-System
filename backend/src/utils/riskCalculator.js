function calculateRiskLevel(score) {
  if (score <= 20) return "SAFE";
  if (score <= 40) return "LOW";
  if (score <= 60) return "MEDIUM";
  if (score <= 80) return "HIGH";
  return "CRITICAL";
}

function getRiskColor(level) {
  const colors = {
    SAFE: "green",
    LOW: "yellow",
    MEDIUM: "orange",
    HIGH: "red",
    CRITICAL: "darkred",
  };
  return colors[level] || "gray";
}

module.exports = { calculateRiskLevel, getRiskColor };
