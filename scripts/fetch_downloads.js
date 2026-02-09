import fs from "fs";

const repos = [
  // 🎮 GAMEHUB
  { name: "GameHub Lite (Producdevity)", repo: "Producdevity/gamehub-lite", category: "GAMEHUB" },
  { name: "GameHub Lite (ItzDFPlayer)", repo: "ItzDFPlayer/gamehub-lite", category: "GAMEHUB" },
  { name: "GameHub Brasil", repo: "winlatorbrasil/gamehub-brasil", category: "GAMEHUB" },

  // ⚔️ WINLATOR
  { name: "Winlator Original", repo: "brunodev85/winlator", category: "WINLATOR" },
  { name: "Winlator Ludashi", repo: "StevenMXZ/Winlator-Ludashi", category: "WINLATOR" },
  { name: "Winlator Mod", repo: "afeimod/winlator-mod", category: "WINLATOR" },
  { name: "Winlator Xmod", repo: "deivid22srk/Winlator-Xmod", category: "WINLATOR" },
  { name: "Winlator Coffin", repo: "coffincolors/winlator", category: "WINLATOR" },
  { name: "Winlator Juris-X", repo: "JURIS-X/winlator_x", category: "WINLATOR" },
  { name: "Winlator Longjunyu", repo: "longjunyu2/winlator", category: "WINLATOR" },
  { name: "Winebox64", repo: "winebox64/winlator", category: "WINLATOR" },
  { name: "Winlator Mali", repo: "Fcharan/WinlatorMali", category: "WINLATOR" },
  { name: "Winlator Brasil", repo: "winlatorbrasil/Winlator-Brasil", category: "WINLATOR" }
];


async function run() {
  const results = [];

  for (const r of repos) {
    const res = await fetch(`https://api.github.com/repos/${r.repo}/releases`);
    const releases = await res.json();

    let total = 0;
    let latest = releases[0]?.tag_name || "N/A";

    releases.forEach(rel =>
      rel.assets?.forEach(a => total += a.download_count)
    );

    results.push({ ...r, total, latest });
  }

  results.sort((a, b) => b.total - a.total);

  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync("data/rankings.json", JSON.stringify(results, null, 2));
}

run();
