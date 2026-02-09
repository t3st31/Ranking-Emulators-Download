import fs from "fs";

const data = JSON.parse(fs.readFileSync("data/rankings.json"));

let md = `## 🏆 Ranking de Downloads – Emuladores Android (GitHub)

> Atualizado automaticamente via GitHub Actions

| # | Projeto | Downloads | Última Release |
|---|--------|----------|---------------|
`;

data.forEach((p, i) => {
  const medal =
    i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1;

  md += `| ${medal} | **${p.name}** | ![](https://img.shields.io/github/downloads/${p.repo}/total?style=flat-square) | ![](https://img.shields.io/github/v/release/${p.repo}?style=flat-square) |\n`;
});

fs.writeFileSync("README.md", md);
