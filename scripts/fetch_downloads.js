import fs from "fs";

const repos = [
  // GAMEHUB
  { name: "GameHub Lite (Producdevity)", repo: "Producdevity/gamehub-lite", category: "GameHub" },
  { name: "GameHub Lite (ItzDFPlayer)", repo: "ItzDFPlayer/gamehub-lite", category: "GameHub" },
  { name: "GameHub Brasil", repo: "winlatorbrasil/gamehub-brasil", category: "GameHub" },

  // WINLATOR
  { name: "Winlator Ludashi", repo: "StevenMXZ/Winlator-Ludashi", category: "Winlator" },
  { name: "Winlator Oficial", repo: "brunodev85/winlator", category: "Winlator" },
  { name: "Winlator MOD", repo: "afeimod/winlator-mod", category: "Winlator" },
  { name: "Winlator XMOD", repo: "deivid22srk/Winlator-Xmod", category: "Winlator" },
  { name: "Winlator Coffin", repo: "coffincolors/winlator", category: "Winlator" },
  { name: "Winlator JurisX", repo: "JURIS-X/winlator_x", category: "Winlator" },
  { name: "Winlator LongJunYu", repo: "longjunyu2/winlator", category: "Winlator" },
  { name: "Winebox64", repo: "winebox64/winlator", category: "Winlator" },
  { name: "Winlator Mali", repo: "Fcharan/WinlatorMali", category: "Winlator" },
  { name: "Star (fork)", repo: "jacojayy/star", category: "Winlator" }
];

async function getDownloads(repo) {
  const res = await fetch(`https://api.github.com/repos/${repo}/releases`);
  if (!res.ok) return 0;

  const releases = await res.json();
  let total = 0;

  for (const r of releases) {
    for (const a of r.assets || []) {
      total += a.download_count || 0;
    }
  }
  return total;
}

(async () => {
  const results = [];

  for (const r of repos) {
    const downloads = await getDownloads(r.repo);
    results.push({
      name: r.name,
      repo: r.repo,
      category: r.category,
      downloads
    });
  }

  results.sort((a, b) => b.downloads - a.downloads);

  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync("data/rankings.json", JSON.stringify({
    updatedAt: new Date().toISOString(),
    results
  }, null, 2));

  console.log("Rankings updated");
})();
