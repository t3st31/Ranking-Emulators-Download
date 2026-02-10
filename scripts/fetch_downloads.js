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
  { name: "Winlator Brasil", repo: "winlatorbrasil/Winlator-Brasil", category: "Winlator" },
  { name: "Star (fork)", repo: "jacojayy/star", category: "Winlator" }
];

async function getReleasesData(repo) {
  const res = await fetch(`https://api.github.com/repos/${repo}/releases`);
  if (!res.ok) return { total: 0, releases: [] };
  
  const releases = await res.json();
  let total = 0;
  const releasesList = [];

  for (const r of releases) {
    let releaseDownloads = 0;
    const assets = [];

    for (const a of r.assets || []) {
      const count = a.download_count || 0;
      total += count;
      releaseDownloads += count;
      
      assets.push({
        name: a.name,
        size: a.size,
        downloads: count,
        url: a.browser_download_url
      });
    }

    if (assets.length > 0) {
      releasesList.push({
        name: r.name,
        tag: r.tag_name,
        date: r.published_at,
        downloads: releaseDownloads,
        assets: assets,
        htmlUrl: r.html_url
      });
    }
  }

  return { total, releases: releasesList };
}

(async () => {
  const results = [];
  
  for (const r of repos) {
    console.log(`Fetching ${r.name}...`);
    const data = await getReleasesData(r.repo);
    
    results.push({
      name: r.name,
      repo: r.repo,
      category: r.category,
      downloads: data.total,
      releases: data.releases,
      repoUrl: `https://github.com/${r.repo}`
    });
    
    // Delay para evitar rate limit
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  results.sort((a, b) => b.downloads - a.downloads);

  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync("data/rankings.json", JSON.stringify({
    updatedAt: new Date().toISOString(),
    results
  }, null, 2));

  console.log("✅ Rankings updated with releases data!");
})();
