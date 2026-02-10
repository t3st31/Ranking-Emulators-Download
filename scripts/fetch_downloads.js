import fs from "fs";

const repos = [
  // GAMEHUB
  { name: "GameHub Lite (Producdevity)", repo: "Producdevity/gamehub-lite", category: "GameHub" },
  { name: "GameHub Lite (ItzDFPlayer)", repo: "ItzDFPlayer/gamehub-lite", category: "GameHub" },
  { name: "GameHub Brasil", repo: "winlatorbrasil/gamehub-brasil", category: "GameHub" },
  
  // WINLATOR
  { name: "Winlator Ludashi", repo: "StevenMXZ/Winlator-Ludashi", category: "Winlator" },
  { name: "Winlator Oficial", repo: "brunodev85/winlator", category: "Winlator" },
  { name: "Winlator Afei", repo: "afeimod/winlator-mod", category: "Winlator" },
  { name: "Winlator Xmod", repo: "deivid22srk/Winlator-Xmod", category: "Winlator" },
  { name: "Winlator Ajay", repo: "ajay9634/winlator-ajay", category: "Winlator" },
  { name: "Winlator Coffincolors", repo: "coffincolors/winlator", category: "Winlator" },
  { name: "Winlator X", repo: "JURIS-X/winlator_x", category: "Winlator" },
  { name: "Winlator Glibc", repo: "longjunyu2/winlator", category: "Winlator" },
  { name: "WB64DEV", repo: "winebox64/winlator", category: "Winlator" },
  { name: "Winlator Mali", repo: "Fcharan/WinlatorMali", category: "Winlator" },
  { name: "Star (fork)", repo: "jacojayy/star", category: "Winlator" },
  { name: "Winlator Brasil", repo: "winlatorbrasil/Winlator-Brasil", category: "Winlator" }
];

async function getReleasesData(repo) {
  try {
    console.log(`  → Buscando releases de ${repo}...`);
    
    const res = await fetch(`https://api.github.com/repos/${repo}/releases`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Emulator-Battle-Arena'
      }
    });
    
    if (!res.ok) {
      console.log(`  ⚠️  Status ${res.status} para ${repo}`);
      return { total: 0, releases: [] };
    }
    
    const releases = await res.json();
    
    if (!Array.isArray(releases) || releases.length === 0) {
      console.log(`  ℹ️  Nenhuma release encontrada para ${repo}`);
      return { total: 0, releases: [] };
    }
    
    let total = 0;
    const releasesList = [];

    for (const r of releases) {
      let releaseDownloads = 0;
      const assets = [];

      // Processar cada asset da release
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

      // Só adiciona releases que têm assets
      if (assets.length > 0) {
        releasesList.push({
          name: r.name || r.tag_name,
          tag: r.tag_name,
          date: r.published_at,
          downloads: releaseDownloads,
          body: r.body || "", // Descrição da release
          prerelease: r.prerelease || false,
          assets: assets,
          htmlUrl: r.html_url
        });
      }
    }

    console.log(`  ✅ ${releasesList.length} releases encontradas (${total} downloads totais)`);
    return { total, releases: releasesList };
    
  } catch (error) {
    console.error(`  ❌ Erro ao buscar ${repo}:`, error.message);
    return { total: 0, releases: [] };
  }
}

(async () => {
  console.log("\n🎮 EMULATOR BATTLE ARENA - Buscando dados...\n");
  
  const results = [];
  let successCount = 0;
  let errorCount = 0;
  
  for (const r of repos) {
    console.log(`\n📦 ${r.name}`);
    
    const data = await getReleasesData(r.repo);
    
    results.push({
      name: r.name,
      repo: r.repo,
      category: r.category,
      downloads: data.total,
      releases: data.releases,
      repoUrl: `https://github.com/${r.repo}`
    });
    
    if (data.total > 0) {
      successCount++;
    } else {
      errorCount++;
    }
    
    // Delay para evitar rate limit do GitHub (máximo 60 req/hora sem auth)
    await new Promise(resolve => setTimeout(resolve, 1100));
  }

  // Ordenar por downloads (decrescente)
  results.sort((a, b) => b.downloads - a.downloads);

  // Criar diretório data se não existir
  fs.mkdirSync("data", { recursive: true });
  
  // Salvar JSON
  const output = {
    updatedAt: new Date().toISOString(),
    totalProjects: results.length,
    projectsWithReleases: successCount,
    projectsWithoutReleases: errorCount,
    results: results
  };
  
  fs.writeFileSync("data/rankings.json", JSON.stringify(output, null, 2));

  console.log("\n" + "=".repeat(60));
  console.log("✅ Rankings atualizados com sucesso!");
  console.log("=".repeat(60));
  console.log(`📊 Total de projetos: ${results.length}`);
  console.log(`✅ Com releases: ${successCount}`);
  console.log(`⚠️  Sem releases: ${errorCount}`);
  console.log(`💾 Arquivo salvo em: data/rankings.json`);
  console.log("=".repeat(60) + "\n");
  
  // Mostrar top 3
  console.log("🏆 TOP 3:");
  results.slice(0, 3).forEach((item, index) => {
    const medals = ['🥇', '🥈', '🥉'];
    console.log(`${medals[index]} ${item.name}: ${item.downloads.toLocaleString('pt-BR')} downloads`);
  });
  console.log("");
  
})();
