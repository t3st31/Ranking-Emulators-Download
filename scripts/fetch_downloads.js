import fs from "fs";

const repos = [
  { name: "GameHub Lite (Producdevity)", repo: "Producdevity/gamehub-lite" },
  { name: "GameHub Lite (ItzDFPlayer)", repo: "ItzDFPlayer/gamehub-lite" },

  { name: "Winlator Ludashi", repo: "StevenMXZ/Winlator-Ludashi" },
  { name: "Winlator Original", repo: "brunodev85/winlator" },
  { name: "Winlator Mod", repo: "afeimod/winlator-mod" },
  { name: "Winlator Xmod", repo: "deivid22srk/Winlator-Xmod" },
  { name: "Winlator Coffin", repo: "coffincolors/winlator" },
  { name: "Winlator Juris-X", repo: "JURIS-X/winlator_x" },
  { name: "Winlator Longjunyu", repo: "longjunyu2/winlator" },
  { name: "Winebox64", repo: "winebox64/winlator" },
  { name: "Winlator Mali", repo: "Fcharan/WinlatorMali" },
  { name: "Star", repo: "jacojayy/star" }
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
