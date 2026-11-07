// =====================================================
//  ⚙️ CONFIG — sirf ye 2 line change karo
// =====================================================
const GITHUB_OWNER = "YOUR_USERNAME";       // GitHub username
const GITHUB_REPO  = "mystore-releases";    // releases repo ka naam
// =====================================================

const ASSET_NAME = "app-release.apk";
const API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;

const versionBadge = document.getElementById("versionBadge");
const downloadBtn  = document.getElementById("downloadBtn");
const btnText      = document.getElementById("btnText");
const btnSpinner   = document.getElementById("btnSpinner");
const errorMsg     = document.getElementById("errorMsg");
const meta         = document.getElementById("meta");

async function loadLatestRelease() {
  try {
    const res = await fetch(API_URL, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!res.ok) {
      throw new Error("Could not fetch release. Please try again later.");
    }

    const release = await res.json();
    const apkAsset = release.assets.find((a) => a.name === ASSET_NAME);

    if (!apkAsset) {
      throw new Error(`"${ASSET_NAME}" not found in the latest release.`);
    }

    // ---- Update UI ----
    const tag = release.tag_name || "latest";
    versionBadge.innerHTML = `<span class="dot"></span> Latest: ${tag}`;

    downloadBtn.href = apkAsset.browser_download_url;
    downloadBtn.setAttribute("aria-disabled", "false");

    btnSpinner.style.display = "none";
    btnText.textContent = "⬇  Download APK";

    const sizeMB = (apkAsset.size / (1024 * 1024)).toFixed(1);
    const published = new Date(release.published_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    meta.textContent = `Size: ${sizeMB} MB · Published: ${published}`;
  } catch (err) {
    console.error(err);
    versionBadge.innerHTML = `<span class="dot" style="background:#e53935;"></span> Version unavailable`;
    btnSpinner.style.display = "none";
    btnText.textContent = "Download unavailable";
    errorMsg.textContent = err.message + " — Please check back later.";
    errorMsg.style.display = "block";
  }
}

loadLatestRelease();
