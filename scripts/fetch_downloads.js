import fs from "fs";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const REQUEST_DELAY_MS = GITHUB_TOKEN ? 150 : 1100;
const MAX_RELEASE_PAGES = 10;
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);
// Uso manual: atualiza apenas os repositórios informados e preserva os demais
// dados publicados. Ex.: ONLY_REPOS="owner/repo,owner/outro" npm run fetch
const ONLY_REPOS = new Set((process.env.ONLY_REPOS || "")
  .split(",")
  .map(repo => repo.trim())
  .filter(Boolean));

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options = {}, attempts = 3) {
  let lastResponse = null;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const response = await fetch(url, options);
      lastResponse = response;

      if (response.ok || !RETRYABLE_STATUS.has(response.status)) return response;

      const retryAfter = Number(response.headers.get("retry-after"));
      const backoff = retryAfter > 0 ? retryAfter * 1000 : 500 * (attempt + 1);
      console.log(`  ↻ Tentativa ${attempt + 1}/${attempts} após HTTP ${response.status}...`);
      await wait(backoff);
    } catch (error) {
      if (attempt === attempts - 1) throw error;
      console.log(`  ↻ Tentativa ${attempt + 1}/${attempts} após falha de rede...`);
      await wait(500 * (attempt + 1));
    }
  }

  return lastResponse;
}

function getPreviousOutput() {
  const candidates = ["docs/data/rankings.json", "data/rankings.json"];

  for (const file of candidates) {
    try {
      const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
      if (parsed && Array.isArray(parsed.results)) return parsed;
    } catch {
      // Primeiro ciclo ou arquivo ainda inexistente.
    }
  }

  return { results: [] };
}

function getPreviousHistory() {
  const candidates = ["docs/data/history.json", "data/history.json"];

  for (const file of candidates) {
    try {
      const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
      if (parsed && Array.isArray(parsed.entries)) return parsed;
    } catch {
      // Primeiro ciclo ou arquivo ainda inexistente.
    }
  }

  return { entries: [] };
}

const repos = [
  // GAMEHUB
  { name: "GameHub Lite (Producdevity)", repo: "Producdevity/gamehub-lite", category: "GameHub", logo: "gamehub.png" },
  { name: "GameHub Lite (ItzDFPlayer)", repo: "ItzDFPlayer/gamehub-lite", category: "GameHub", logo: "gamehub.png" },
  { name: "GameHub Brasil", repo: "winlatorbrasil/gamehub-brasil", category: "GameHub", logo: "gamehub-brasil.png" },
  { name: "GameHub Lite (J4MCU-builds)", repo: "J4MCU-builds/Gamehub-Lite-RedMagic", category: "GameHub", logo: "gamehub.png" },
  { name: "BannerHub (The412Banner)", repo: "The412Banner/bannerhub", category: "GameHub", logo: "bannerhub.png" },

    // DRIVERS
  { name: "K11MCH1 Turnip Drivers", repo: "K11MCH1/AdrenoToolsDrivers", category: "Drivers", driverFamily: "Adreno / Turnip", logo: "drivers.png", extensions: [".zip", ".apk"] },
  { name: "The412Banner Turnip Drivers", repo: "The412Banner/Banners-Turnip", category: "Drivers", driverFamily: "Adreno / Turnip", logo: "drivers.png", extensions: [".zip"] },
  { name: "whitebelyash AdrenoTools Drivers", repo: "whitebelyash/AdrenoToolsDrivers", category: "Drivers", driverFamily: "Adreno / Turnip", logo: "drivers.png", extensions: [".zip", ".so"] },
  { name: "Snapdragon Elite Drivers", repo: "StevenMXZ/Adrenotools-Drivers", category: "Drivers", driverFamily: "Adreno / Turnip", logo: "drivers.png", extensions: [".zip"] },
  { name: "Weab-Chan Turnip Drivers", repo: "Weab-chan/freedreno_turnip-CI", category: "Drivers", driverFamily: "Adreno / Turnip", logo: "drivers.png", extensions: [".zip"] },
  { name: "Turnip - StevenMXZ", repo: "StevenMXZ/freedreno_turnip-CI", category: "Drivers", driverFamily: "Adreno / Turnip", logo: "drivers.png", extensions: [".zip"] },
  { name: "A8XX - Turnip", repo: "whitebelyash/freedreno_turnip-CI", category: "Drivers", driverFamily: "Adreno A8XX / Turnip", logo: "drivers.png", extensions: [".zip", ".so"] },
  { name: "Xclipse Turnip", repo: "jhinzuo/upload_grave", category: "Drivers", driverFamily: "Xclipse / Turnip", logo: "drivers.png", extensions: [".zip", ".wcp"] },
  { name: "Wrappers - Mali", repo: "winlatorbrasil/wrappers", category: "Drivers", driverFamily: "Mali / Wrappers", logo: "drivers.png", extensions: [".wcp", ".zip", ".tzst"] },
  { name: "Winlator Ref4ik (Drivers/Wine)", repo: "REF4IK/winlator-ref4ik-", category: "Drivers", logo: "drivers.png", extensions: [".wcp", ".apk"] },
  { name: "StevenMXZ Contents Cmod", repo: "StevenMXZ/Contents-Cmod", category: "Drivers", logo: "drivers.png", extensions: [".wcp", ".wcp.xz"] },

  // GAMENATIVE
  { name: "GameNative", repo: "utkarshdalal/GameNative", category: "GameNative", logo: "gamenative.png" },
  { name: "GameNative Performance", repo: "maxjivi05/GameNative-Performance", category: "GameNative", logo: "gamenative.png" },

  // WINLATOR
  { name: "Winlator BrunoDev", repo: "brunodev85/winlator", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Ludashi", repo: "StevenMXZ/Winlator-Ludashi", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Afei", repo: "afeimod/winlator-mod", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Xmod", repo: "deivid22srk/Winlator-Xmod", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Ref4ik", repo: "REF4IK/winlator-ref4ik-", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Ajay", repo: "ajay9634/winlator-ajay", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Coffincolors", repo: "coffincolors/winlator", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator X", repo: "JURIS-X/winlator_x", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Bionic jhinzuo", repo: "jhinzuo/winlator", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator XR", repo: "WinlatorXR/WinlatorXR", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Bionic cjxyz", repo: "winlator/releases", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Bionic duckyduckG", repo: "duckyduckG/winlator", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Bionic Stredohiri", repo: "Stredohori/Winlator-CMOD", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Bionic Alexoqool", repo: "Alexoqool/winlator-bionic-build", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Honkon", repo: "Honkonx/winlator-honkon", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Glibc", repo: "longjunyu2/winlator", category: "Winlator", logo: "winlator.png" },
  { name: "Wb64dev", repo: "winebox64/winlator", category: "Winlator", logo: "winlator.png" },
  { name: "Winlator Mali", repo: "Fcharan/WinlatorMali", category: "Winlator", logo: "winlator.png" },
  { name: "Star (fork)", repo: "jacojayy/star", category: "Winlator", logo: "star.png" },
  { name: "Winlator Brasil", repo: "winlatorbrasil/Winlator-Brasil", category: "Winlator", logo: "winlator-brasil.png" },
  { name: "Steamlator", repo: "slaker222/Steamlator", category: "Winlator", logo: "winlator.png" },
  { name: "WinNative (fork)", repo: "WinDroidEmulation/WinNative", category: "Winlator", logo: "winnative.jpeg" },
  { name: "Bannerlator", repo: "The412Banner/Bannerlator", category: "Winlator", logo: "bannerlator.jpg", sourceKind: "fork/comunidade" },
  { name: "WinNative (WinNative-Emu)", repo: "WinNative-Emu/WinNative", category: "Winlator", logo: "winnative-emu.png", sourceKind: "fork/comunidade" },

  // PC EMULATOR
  { name: "MiceWine", repo: "KreitinnSoftware/MiceWine-Application", category: "PC Emulator", logo: "micewine.png" },
  { name: "Horizon Emu", repo: "HorizonEmuTeam/Horizon-Emu", category: "PC Emulator", logo: "horizon.png" },
  { name: "ExaGear 302", repo: "XHYN-PH/exagear-302", category: "PC Emulator", logo: "exagear.png" },
  { name: "XoDos", repo: "xodiosx/XoDos", category: "PC Emulator", logo: "xodos.png" },
  { name: "Mobox Patched", repo: "jaycore/mobox-patched", category: "PC Emulator", logo: "mobox.png", extensions: [".tar.gz"] },
  { name: "Pluvia", repo: "oxters168/Pluvia", category: "PC Emulator", logo: "pluvia.png" },

  // Wii U Emulator
  { name: "Cemu", repo: "SSimco/Cemu", category: "Wii U Emulator", logo: "cemu.png" },
  
  // XBOX
  { name: "X1 BOX", repo: "NETHERSTRIKER/x1-box-apk-1.1.4-compiled-via-izzy2lost-source-code", category: "Xbox", logo: "x1-box.png" },
  { name: "XenDroid", repo: "rfandango/XenDroid", category: "Xbox", logo: "xendroid.png", sourceKind: "fork/comunidade" },
  { name: "X360 Mobile", repo: "Ashnar2602/X360-Mobile---OFFICIAL", category: "Xbox", logo: "x360-mobile.png", sourceKind: "fork/comunidade" },

  // Nintendo Switch Emulator
  { name: "Eden Emulator", repo: "eden-emulator/Releases", category: "Nintendo Switch Emulator", logo: "eden.png" },
  { name: "Eden Emulator Nightly", repo: "Eden-CI/Nightly", category: "Nintendo Switch Emulator", logo: "eden.png" },
  { name: "Citron Emulator", repo: "Citron/Emulator", category: "Nintendo Switch Emulator", logo: "citron.png", apiType: "gitea", apiHost: "https://git.citron-emu.org" },
  { name: "Sumi Emulator", repo: "ovsky/sumi-emu", category: "Nintendo Switch Emulator", logo: "sumi.png" },
  { name: "Kenji-NX Emulator", repo: "Kenji-NX/Android-Releases", category: "Nintendo Switch Emulator", logo: "kenjinx.png" },

  // Nintendo 3DS
  { name: "Azahar", repo: "azahar-emu/azahar", category: "Nintendo 3DS", logo: "azahar.png" },
  { name: "Citra (weihuoya)", repo: "weihuoya/citra", category: "Nintendo 3DS", logo: "citra.png" },

  // Emulator PS3
  { name: "APS3e", repo: "aenu1/aps3e", category: "Emulator PS3", logo: "aps3e.png" },
  { name: "RPCSX Android", repo: "RPCSX/rpcsx-ui-android", category: "Emulator PS3", logo: "rpcsx.png" },
  { name: "ARMSX3", repo: "ARMSX2/ARMSX3", category: "Emulator PS3", logo: "armsx3.png", sourceKind: "fork/comunidade" },

  // Emulator PS2
  { name: "ARMSX2", repo: "ARMSX2/ARMSX2", category: "Emulator PS2", logo: "armsx2.png" },
  { name: "NetherSX2 Patch", repo: "Trixarian/NetherSX2-patch", category: "Emulator PS2", logo: "nethersx2.png" },
  { name: "NetherSX2 Classic", repo: "Trixarian/NetherSX2-classic", category: "Emulator PS2", logo: "nethersx2.png" },

  // Emulator PS5
  { name: "SharpEmu ARM64", repo: "edeegg/sharpemu-arm64", category: "Emulator PS5", logo: "sharpemu.png", sourceKind: "fork/comunidade" },

  // PSVITA
  { name: "Vita3K Android", repo: "Vita3K/Vita3K-Android", category: "PSVITA", logo: "vita3k.png" },

  // Nintendo GameCube / Nintendo Wii
  { name: "Dolphin MMJR2 VBI", repo: "Medard22/Dolphin-MMJR2-VBI", category: "Nintendo GameCube / Wii", logo: "dolphin.png" },

  // Emulator Sega Dreamcast
  { name: "Flycast", repo: "flyinghead/flycast", category: "Sega Dreamcast", logo: "flycast.png" },

  // Emulator ALL IN ONE
  { name: "Lemuroid", repo: "Swordfish90/Lemuroid", category: "All In One", logo: "lemuroid.png" },
  { name: "Exiled Kingdoms Multiplayer", repo: "winlatorbrasil/Exiled-Kingdoms-Multiplayer", category: "GAME", logo: "drivers.png" },
];

function inferSourceMeta(config) {
  const text = `${config.name || ''} ${config.repo || ''}`.toLowerCase();
  const channel = /nightly|ci/.test(text) ? 'nightly' : /beta/.test(text) ? 'beta' : /rc|release candidate/.test(text) ? 'rc' : 'stable/unknown';
  const sourceKind = config.sourceKind || (
    /fork|mod|cmod|patch|brasil|bionic|ludashi|ref4ik|ajay|coffin|xmod/.test(text)
      ? 'fork/comunidade'
      : config.category === 'Drivers' ? 'driver/community' : 'upstream/community'
  );
  return { sourceKind, channel };
}

// ===== GitHub API =====
async function getGitHubReleasesData(repo) {
  try {
    console.log(`  → Buscando releases de ${repo} (GitHub)...`);

    const headers = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'Emulator-Battle-Arena'
    };

    if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

    const releases = [];

    for (let page = 1; page <= MAX_RELEASE_PAGES; page++) {
      const res = await fetchWithRetry(
        `https://api.github.com/repos/${repo}/releases?per_page=100&page=${page}`,
        { headers }
      );

      if (!res.ok) {
        console.log(`  ⚠️  Status ${res.status} para ${repo}`);
        return { total: 0, releases: [], failed: true, status: res.status };
      }

      const pageReleases = await res.json();
      if (!Array.isArray(pageReleases)) {
        return { total: 0, releases: [], failed: true, status: "invalid-response" };
      }

      releases.push(...pageReleases);
      if (pageReleases.length < 100) break;
    }

    if (!Array.isArray(releases) || releases.length === 0) {
      console.log(`  ℹ️  Nenhuma release encontrada para ${repo}`);
      return { total: 0, releases: [] };
    }

    return parseReleases(releases);

  } catch (error) {
    console.error(`  ❌ Erro ao buscar ${repo}:`, error.message);
    return { total: 0, releases: [], failed: true, status: "network" };
  }
}

// ===== Gitea API (para Citron e similares) =====
async function getGiteaReleasesData(host, repo) {
  try {
    console.log(`  → Buscando releases de ${repo} (Gitea: ${host})...`);

    const res = await fetchWithRetry(`${host}/api/v1/repos/${repo}/releases`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Emulator-Battle-Arena'
      }
    });

    if (!res.ok) {
      console.log(`  ⚠️  Status ${res.status} para ${repo} (Gitea)`);
      return { total: 0, releases: [], failed: true, status: res.status };
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
    return { total: 0, releases: [], failed: true, status: "network" };
  }
}

// ===== Manifest Loader (StevenMXZ Contents) =====
async function fetchManifestDrivers() {
  try {
    console.log(`\n📂 Buscando manifest de drivers (Winlator-Contents)...`);
    const res = await fetchWithRetry("https://raw.githubusercontent.com/StevenMXZ/Winlator-Contents/main/contents.json");
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();

    // Agrupar por tipo para facilitar a exibição
    const grouped = {};
    data.forEach(item => {
      const type = item.type || "Other";
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push({
        name: item.verName,
        version: item.verCode,
        url: item.remoteUrl,
        date: new Date().toISOString() // Manifests JSON geralmente não tem data por item, usamos 'now'
      });
    });

    console.log(`  ✅ Manifest processado: ${data.length} itens encontrados.`);
    return grouped;
  } catch (error) {
    console.error(`  ❌ Erro ao buscar manifest:`, error.message);
    return {};
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
          url: isGitea ? a.browser_download_url : a.browser_download_url,
          digest: a.digest || null,
          contentType: a.content_type || null,
          createdAt: a.created_at || null,
          updatedAt: a.updated_at || null
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
  const previousOutput = getPreviousOutput();
  const previousHistory = getPreviousHistory();
  const previousByRepo = new Map(previousOutput.results.map(item => [item.repo, item]));
  const failedRepos = [];
  let successCount = 0;
  let errorCount = 0;

  for (const r of repos) {
    console.log(`\n📦 ${r.name}`);

    let data;
    const shouldFetch = ONLY_REPOS.size === 0 || ONLY_REPOS.has(r.repo);
    const previous = previousByRepo.get(r.repo);

    if (!shouldFetch) {
      data = previous
        ? { total: previous.downloads || 0, releases: previous.releases || [] }
        : { total: 0, releases: [] };
      if (!previous) console.warn(`  ⚠️  Sem dado anterior para ${r.repo}; execute uma atualização completa depois.`);
    } else if (r.apiType === "gitea") {
      data = await getGiteaReleasesData(r.apiHost, r.repo);
    } else {
      data = await getGitHubReleasesData(r.repo);
    }

    if (data.failed) {
      failedRepos.push({ repo: r.repo, status: data.status });
    }

    const repoUrl = r.apiType === "gitea"
      ? `${r.apiHost}/${r.repo}`
      : `https://github.com/${r.repo}`;
    const sourceMeta = inferSourceMeta(r);

    // Se a API bloquear a execução (rate limit, 403/429 ou falha de rede),
    // mantém o último resultado válido para não publicar um ranking zerado.
    const mergedData = data.failed && previous
      ? { total: previous.downloads || 0, releases: previous.releases || [] }
      : data;

    results.push({
      name: r.name,
      repo: r.repo,
      category: r.category,
      driverFamily: r.driverFamily || null,
      logo: r.logo || null,
      extensions: r.extensions || null,
      sourceKind: sourceMeta.sourceKind,
      channel: sourceMeta.channel,
      downloads: mergedData.total,
      releases: mergedData.releases,
      repoUrl: repoUrl
    });

    if (mergedData.total > 0) {
      successCount++;
    } else {
      errorCount++;
    }

    // Sem token, respeita o limite público. No Actions usamos GITHUB_TOKEN.
    if (shouldFetch) await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS));
  }

  // Buscar drivers do manifest
  const fetchedManifestDrivers = await fetchManifestDrivers();
  const manifestDrivers = Object.keys(fetchedManifestDrivers).length > 0
    ? fetchedManifestDrivers
    : (previousOutput.manifestDrivers || {});

  // Ordenar por downloads (decrescente)
  results.sort((a, b) => b.downloads - a.downloads);

  const previousHasData = previousOutput.results.some(item =>
    (item.downloads || 0) > 0 || (item.releases && item.releases.length > 0)
  );

  if (successCount === 0) {
    throw new Error(previousHasData
      ? "Nenhum projeto retornou dados e o último ranking válido foi preservado."
      : "Nenhum projeto retornou dados; publicação cancelada para evitar um ranking vazio.");
  }

  // Criar os diretórios de dados do coletor e da publicação estática.
  fs.mkdirSync("data", { recursive: true });
  fs.mkdirSync("docs/data", { recursive: true });

  const totalDownloads = results.reduce((sum, item) => sum + (Number(item.downloads) || 0), 0);
  const totalReleases = results.reduce((sum, item) => sum + (item.releases?.length || 0), 0);
  const totalAssets = results.reduce((sum, item) => sum + (item.releases || [])
    .reduce((releaseSum, release) => releaseSum + (release.assets?.length || 0), 0), 0);
  const today = new Date().toISOString().slice(0, 10);
  const projectSnapshot = results.map(item => ({
    repo: item.repo,
    downloads: Number(item.downloads) || 0,
    releases: item.releases?.length || 0,
    latestReleaseDate: item.releases?.[0]?.date || null
  }));
  const historyEntries = (previousHistory.entries || [])
    .filter(entry => entry.date !== today)
    .concat({
      date: today,
      totalDownloads,
      totalProjects: results.length,
      totalReleases,
      totalAssets
    })
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-365);
  const projectSnapshots = (previousHistory.projectSnapshots || [])
    .filter(entry => entry.date !== today)
    .concat({ date: today, projects: projectSnapshot })
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-365);

  // Salvar JSON
  const output = {
    updatedAt: new Date().toISOString(),
    totalProjects: results.length,
    projectsWithReleases: results.filter(item => item.releases?.length > 0).length,
    projectsWithoutReleases: results.filter(item => !item.releases?.length).length,
    projectsWithDownloads: successCount,
    failedRepos,
    dataQuality: { totalDownloads, totalReleases, totalAssets },
    results: results,
    manifestDrivers: manifestDrivers // Novos drivers categorizados do manifest
  };

  const historyOutput = {
    updatedAt: new Date().toISOString(),
    entries: historyEntries,
    projectSnapshots
  };
  const rankingsJson = JSON.stringify(output, null, 2);
  const historyJson = JSON.stringify(historyOutput, null, 2);

  // O site GitHub Pages consome docs/data; manter ambos idênticos evita que o
  // dashboard publique um ranking anterior ao que foi gerado pelo coletor.
  fs.writeFileSync("data/rankings.json", rankingsJson);
  fs.writeFileSync("data/history.json", historyJson);
  fs.writeFileSync("docs/data/rankings.json", rankingsJson);
  fs.writeFileSync("docs/data/history.json", historyJson);

  console.log("\n" + "=".repeat(60));
  console.log("✅ Rankings atualizados com sucesso!");
  console.log("=".repeat(60));
  console.log(`📊 Total de projetos: ${results.length}`);
  console.log(`✅ Com releases: ${successCount}`);
  console.log(`⚠️  Sem releases: ${errorCount}`);
  console.log(`💾 Rankings salvos em: data/rankings.json e docs/data/rankings.json`);
  console.log(`📈 Histórico salvo em: data/history.json e docs/data/history.json (${historyEntries.length} pontos)`);
  console.log("=".repeat(60) + "\n");

  // Mostrar top 5
  console.log("🏆 TOP 5:");
  results.slice(0, 5).forEach((item, index) => {
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    console.log(`${medals[index]} ${item.name}: ${item.downloads.toLocaleString('pt-BR')} downloads`);
  });
  console.log("");

})();
