// Configuration
const GITHUB_OWNER = "adityasaini404";
const GITHUB_REPO = "mystore-releases";
const API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;

// DOM Elements
const versionBadge = document.getElementById("versionBadge");
const downloadBtn = document.getElementById("downloadBtn");
const btnText = document.getElementById("btnText");
const btnSpinner = document.getElementById("btnSpinner");
const metaInfo = document.getElementById("metaInfo");
const errorMsg = document.getElementById("errorMsg");
const changelogBox = document.getElementById("changelog");

async function loadLatestRelease() {
  try {
    const response = await fetch(API_URL, {
      headers: { Accept: "application/vnd.github+json" }
    });

    if (!response.ok) throw new Error("Could not fetch latest release.");
    
    const release = await response.json();
    
    // APK dhundho (jo bhi .apk file ho, pehli utha lo)
    const apkAsset = release.assets.find(asset => asset.name.endsWith(".apk"));
    
    if (!apkAsset) throw new Error("No APK file found in the latest release.");

    // ---- UI Update ----
    
    // 1. Version Badge
    versionBadge.innerHTML = `<span class="pulse-dot"></span> Latest Version: ${release.tag_name}`;
    
    // 2. Download Button
    downloadBtn.href = apkAsset.browser_download_url;
    downloadBtn.classList.remove("disabled");
    downloadBtn.setAttribute("aria-disabled", "false");
    btnSpinner.style.display = "none";
    btnText.textContent = "⬇ Download APK";
    
    // 3. Meta Info (Size & Date)
    const sizeMB = (apkAsset.size / (1024 * 1024)).toFixed(1);
    const date = new Date(release.published_at).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    metaInfo.innerHTML = `<b>Size:</b> ${sizeMB} MB &nbsp;|&nbsp; <b>Updated:</b> ${date}`;

    // 4. Changelog (Release Notes)
    if (release.body && release.body.trim() !== "") {
      // Markdown ko HTML me convert karo
      changelogBox.innerHTML = marked.parse(release.body);
    } else {
      changelogBox.innerHTML = "<p>Bug fixes and performance improvements.</p>";
    }

  } catch (error) {
    console.error("Update Check Failed:", error);
    
    // UI error states
    versionBadge.innerHTML = `<span class="pulse-dot" style="background:#ef4444; box-shadow:0 0 10px #ef4444;"></span> Version unavailable`;
    btnSpinner.style.display = "none";
    btnText.textContent = "Download Unavailable";
    errorMsg.textContent = "Website could not connect to GitHub. Please try again later.";
    errorMsg.style.display = "block";
    changelogBox.innerHTML = "<p>Could not load release notes.</p>";
  }
}

// Run
loadLatestRelease();
