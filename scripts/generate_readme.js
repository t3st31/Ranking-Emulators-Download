import fs from "fs";

const output = JSON.parse(fs.readFileSync("data/rankings.json", "utf8"));
const data = Array.isArray(output) ? output : output.results || [];

function badgeDownloads(repo) {
  return `![](https://img.shields.io/github/downloads/${repo}/total?style=for-the-badge&logo=github)`;
}

function badgeRelease(repo) {
  return `![](https://img.shields.io/github/v/release/${repo}?style=flat-square)`;
}

let md = `
<p align="center">
  <img src="https://img.shields.io/badge/🎮-EMULATOR%20RANKINGS-red?style=for-the-badge">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Auto--Updated-GitHub%20Actions-brightgreen?style=flat-square">
</p>

---

## 🏆 RANKING GLOBAL (DOWNLOADS)

| Rank | Projeto | Downloads | Última Release |
|-----:|--------|----------|---------------|
`;

data.forEach((p, i) => {
  const rank =
    i === 0 ? "🥇" :
    i === 1 ? "🥈" :
    i === 2 ? "🥉" : i + 1;

  md += `| ${rank} | **${p.name}** | ${badgeDownloads(p.repo)} | ${badgeRelease(p.repo)} |\n`;
});

function section(title, category) {
  md += `
---

## ${title}

| Projeto | Downloads | Última Release |
|--------|----------|---------------|
`;

  data
    .filter(p => p.category === category)
    .forEach(p => {
      md += `| **${p.name}** | ${badgeDownloads(p.repo)} | ${badgeRelease(p.repo)} |\n`;
    });
}

section("🎮 GAMEHUB ZONE", "GAMEHUB");
section("⚔️ WINLATOR ARENA", "WINLATOR");

md += `
---

## ℹ️ METODOLOGIA
- Downloads = soma de assets das releases
- Ranking automático
- Atualizado via GitHub Actions
`;

fs.writeFileSync("README.md", md.trim());
