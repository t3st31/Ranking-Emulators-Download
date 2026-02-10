import fs from "fs";

const repos = [
  // GAMEHUB
  { name: "GameHub Lite (Producdevity)", repo: "Producdevity/gamehub-lite", category: "GameHub", logo: "gamehub.png" },
  { name: "GameHub Lite (ItzDFPlayer)", repo: "ItzDFPlayer/gamehub-lite", category: "GameHub", logo: "gamehub.png" },
  { name: "GameHub Brasil", repo: "winlatorbrasil/gamehub-brasil", category: "GameHub", logo: "gamehub-brasil.jpg" },

  // GAMENATIVE
  { name: "GameNative", repo: "utkarshdalal/GameNative", category: "GameNative", logo: "gamenative.png" },

  // WINLATOR
  { name: "Winlator Oficial", repo: "brunodev85/winlator", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Ludashi", repo: "StevenMXZ/Winlator-Ludashi", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Afei", repo: "afeimod/winlator-mod", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Xmod", repo: "deivid22srk/Winlator-Xmod", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Ajay", repo: "ajay9634/winlator-ajay", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Coffincolors", repo: "coffincolors/winlator", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator X", repo: "JURIS-X/winlator_x", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Glibc", repo: "longjunyu2/winlator", category: "Winlator", logo: "winlator.png" },
  { name: "Wb64dev", repo: "winebox64/winlator", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Mali", repo: "Fcharan/WinlatorMali", category: "Winlator", logo: "winlator.png" },
  { name: "Star (fork)", repo: "jacojayy/star", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Brasil", repo: "winlatorbrasil/Winlator-Brasil", category: "Winlator", logo: "winlator-brasil.png" },
  { name: "Steamlator", repo: "slaker222/Steamlator", category: "Winlator", logo: "winlator.png" },

  // PC EMULATOR
  { name: "MiceWine", repo: "KreitinnSoftware/MiceWine-Application", category: "PC Emulator", logo: "micewine.png" },
  { name: "Horizon Emu", repo: "HorizonEmuTeam/Horizon-Emu", category: "PC Emulator", logo: "horizon.png" },
  { name: "ExaGear 302", repo: "XHYN-PH/exagear-302", category: "PC Emulator", logo: "exagear.png" },
  { name: "Mobox Patched", repo: "jaycore/mobox-patched", category: "PC Emulator", logo: "mobox.png", extensions: [".tar.gz"] },
  { name: "Pluvia", repo: "oxters168/Pluvia", category: "PC Emulator", logo: "pluvia.png" },

  // Wii U Emulator
  { name: "Cemu", repo: "SSimco/Cemu", category: "Wii U Emulator", logo: "cemu.png" },

  // Nintendo Switch Emulator
  { name: "Eden Emulator", repo: "eden-emulator/Releases", category: "Nintendo Switch Emulator", logo: "eden.png" },
  { name: "Citron Emulator", repo: "Citron/Emulator", category: "Nintendo Switch Emulator", logo: "citron.png", apiType: "gitea", apiHost: "https://git.citron-emu.org" },
  { name: "Sumi Emulator", repo: "ovsky/sumi-emu", category: "Nintendo Switch Emulator", logo: "sumi.png" },

  // Nintendo 3DS
  { name: "Azahar", repo: "azahar-emu/azahar", category: "Nintendo 3DS", logo: "azahar.png" },
  { name: "Citra (weihuoya)", repo: "weihuoya/citra", category: "Nintendo 3DS", logo: "citra.png" },

  // Emulator PS3
  { name: "APS3e", repo: "aenu1/aps3e", category: "Emulator PS3", logo: "aps3e.png" },

  // Emulator PS4
  { name: "RPCSX Android", repo: "RPCSX/rpcsx-ui-android", category: "Emulator PS4", logo: "rpcsx.png" },

  // Emulator PS2
  { name: "ARMSX2", repo: "ARMSX2/ARMSX2", category: "Emulator PS2", logo: "armsx2.png" },
  { name: "NetherSX2 Patch", repo: "Trixarian/NetherSX2-patch", category: "Emulator PS2", logo: "nethersx2.png" },
  { name: "NetherSX2 Classic", repo: "Trixarian/NetherSX2-classic", category: "Emulator PS2", logo: "nethersx2.png" },

  // PSVITA
  { name: "Vita3K Android", repo: "Vita3K/Vita3K-Android", category: "PSVITA", logo: "vita3k.png" },

  // Nintendo GameCube / Nintendo Wii
  { name: "Dolphin MMJR2 VBI", repo: "Medard22/Dolphin-MMJR2-VBI", category: "Nintendo GameCube / Wii", logo: "dolphin.png" },

  // Emulator Sega Dreamcast
  { name: "Flycast", repo: "flyinghead/flycast", category: "Sega Dreamcast", logo: "flycast.png" },

  // Emulator ALL IN ONE
  { name: "Lemuroid", repo: "Swordfish90/Lemuroid", category: "All In One", logo: "lemuroid.png" },
];

// ===== GitHub API =====
async function getGitHubReleasesData(repo) {
  try {
    console.log(`  → Buscando releases de ${repo} (GitHub)...`);

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

    return parseReleases(releases);

  } catch (error) {
    console.error(`  ❌ Erro ao buscar ${repo}:`, error.message);
    return { total: 0, releases: [] };
  }
}

// ===== Gitea API (para Citron e similares) =====
async function getGiteaReleasesData(host, repo) {
  try {
    console.log(`  → Buscando releases de ${repo} (Gitea: ${host})...`);

    const res = await fetch(`${host}/api/v1/repos/${repo}/releases`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Emulator-Battle-Arena'
      }
    });

    if (!res.ok) {
      console.log(`  ⚠️  Status ${res.status} para ${repo} (Gitea)`);
      return { total: 0, releases: [] };
    }

    const releases = await res.json();

    if (!Array.isArray(releases) || releases.length === 0) {
      console.log(`  ℹ️  Nenhuma release encontrada para ${repo} (Gitea)`);
      return { total: 0, releases: [] };
    }

    // Gitea tem a mesma estrutura de resposta do GitHub para releases
    return parseReleases(releases, true);

  } catch (error) {
    console.error(`  ❌ Erro ao buscar ${repo} (Gitea):`, error.message);
    return { total: 0, releases: [] };
  }
}

// ===== Parser comum para ambas as APIs =====
function parseReleases(releases, isGitea = false) {
  let total = 0;
  const releasesList = [];

  for (const r of releases) {
    let releaseDownloads = 0;
    const assets = [];

    for (const a of r.assets || []) {
      const count = isGitea ? (a.download_count || 0) : (a.download_count || 0);
      total += count;
      releaseDownloads += count;

      assets.push({
        name: a.name,
        size: a.size,
        downloads: count,
        url: isGitea ? a.browser_download_url : a.browser_download_url
      });
    }

    if (assets.length > 0) {
      releasesList.push({
        name: r.name || r.tag_name,
        tag: r.tag_name,
        date: r.published_at || r.created_at,
        downloads: releaseDownloads,
        body: r.body || "",
        prerelease: r.prerelease || false,
        assets: assets,
        htmlUrl: r.html_url
      });
    }
  }

  console.log(`  ✅ ${releasesList.length} releases encontradas (${total} downloads totais)`);
  return { total, releases: releasesList };
}

(async () => {
  console.log("\n🎮 EMULATOR BATTLE ARENA - Buscando dados...\n");

  const results = [];
  let successCount = 0;
  let errorCount = 0;

  for (const r of repos) {
    console.log(`\n📦 ${r.name}`);

    let data;
    if (r.apiType === "gitea") {
      data = await getGiteaReleasesData(r.apiHost, r.repo);
    } else {
      data = await getGitHubReleasesData(r.repo);
    }

    const repoUrl = r.apiType === "gitea"
      ? `${r.apiHost}/${r.repo}`
      : `https://github.com/${r.repo}`;

    results.push({
      name: r.name,
      repo: r.repo,
      category: r.category,
      logo: r.logo || null,
      extensions: r.extensions || null,
      downloads: data.total,
      releases: data.releases,
      repoUrl: repoUrl
    });

    if (data.total > 0) {
      successCount++;
    } else {
      errorCount++;
    }

    // Delay para evitar rate limit (máximo 60 req/hora sem auth)
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

  // Mostrar top 5
  console.log("🏆 TOP 5:");
  results.slice(0, 5).forEach((item, index) => {
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    console.log(`${medals[index]} ${item.name}: ${item.downloads.toLocaleString('pt-BR')} downloads`);
  });
  console.log("");

})();
