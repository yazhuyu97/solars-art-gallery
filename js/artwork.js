/**
 * Solar's Art Gallery - Artwork Detail (artwork.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  initArtworkDetail();
});

async function initArtworkDetail() {
  const container = document.getElementById("artwork-detail-root");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const artworkId = urlParams.get("id");

  if (!artworkId) {
    renderNotFound(container, "未指定作品 ID");
    return;
  }

  try {
    const response = await fetch("data/artworks.json");
    if (!response.ok) throw new Error("無法讀取作品資料");
    const artworks = await response.json();

    const currentIndex = artworks.findIndex(item => item.id === artworkId);

    if (currentIndex === -1) {
      renderNotFound(container, "找不到此件作品，可能已被移動或移除。");
      return;
    }

    const artwork = artworks[currentIndex];
    const prevArtwork = artworks[(currentIndex - 1 + artworks.length) % artworks.length];
    const nextArtwork = artworks[(currentIndex + 1) % artworks.length];

    // Update Page Title
    document.title = `${artwork.title}｜Solar's Art Gallery`;

    renderArtwork(container, artwork, prevArtwork, nextArtwork);

  } catch (err) {
    console.error("Error loading artwork detail:", err);
    renderNotFound(container, "載入作品內容時發生錯誤。");
  }
}

function renderArtwork(container, art, prev, next) {
  container.innerHTML = `
    <!-- Breadcrumb -->
    <nav class="artwork-breadcrumb" aria-label="路徑導覽">
      <a href="index.html">首頁</a>
      <span class="breadcrumb-separator">/</span>
      <a href="gallery.html">作品集</a>
      <span class="breadcrumb-separator">/</span>
      <a href="gallery.html?category=${art.category}">${art.categoryLabel}</a>
      <span class="breadcrumb-separator">/</span>
      <span style="color: var(--color-text-main);">${art.title}</span>
    </nav>

    <div class="artwork-detail-container">
      <!-- Left: Artwork Image Presentation -->
      <div class="artwork-image-container">
        <div class="artwork-image-wrapper" id="artwork-lightbox-trigger" title="點擊放大檢視原圖">
          <img src="${art.image}" alt="${art.title}" id="artwork-main-img" />
        </div>
        <div class="image-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          點擊圖片放大檢視細節 (Zoom in)
        </div>
      </div>

      <!-- Right: Artwork Info Panel -->
      <div class="artwork-info-panel">
        <div class="artwork-header-meta">
          <span class="category-badge ${art.category}">${art.categoryLabel}</span>
          <span class="artwork-year">${art.year} 年創作</span>
        </div>

        <h1 class="artwork-title-main">${art.title}</h1>
        ${art.titleEn ? `<div class="artwork-title-sub">${art.titleEn}</div>` : ""}

        <!-- Specs Table -->
        <div class="artwork-specs-list">
          <div class="spec-item">
            <span class="spec-label">媒材規格</span>
            <span class="spec-value">${art.medium}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">尺寸解析</span>
            <span class="spec-value">${art.dimensions}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">作品分類</span>
            <span class="spec-value">${art.category === "traditional" ? "手繪原畫 (Traditional)" : "數位繪畫 (Digital)"}</span>
          </div>
        </div>

        <!-- Description -->
        <div class="artwork-description-box">
          <h2 class="desc-title">作品自述 / Note</h2>
          <p class="desc-content">${art.description}</p>
        </div>

        <!-- Pagination -->
        <div class="artwork-pagination">
          <a href="artwork.html?id=${encodeURIComponent(prev.id)}" class="nav-art-btn prev">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            上一件：${prev.title}
          </a>
          <a href="artwork.html?id=${encodeURIComponent(next.id)}" class="nav-art-btn next">
            下一件：${next.title}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `;

  // Bind Lightbox trigger
  const trigger = document.getElementById("artwork-lightbox-trigger");
  if (trigger && window.artworkLightbox) {
    trigger.addEventListener("click", () => {
      window.artworkLightbox.open(art.image, `${art.title} (${art.year})`);
    });
  }
}

function renderNotFound(container, message) {
  container.innerHTML = `
    <div style="text-align: center; padding: 100px 20px;">
      <h2 style="font-family: 'Noto Serif TC', serif; margin-bottom: 12px; color: var(--color-text-main);">作品未找到</h2>
      <p style="color: var(--color-text-muted); margin-bottom: 32px;">${message}</p>
      <a href="gallery.html" class="btn btn-primary">返回作品集 (Back to Gallery)</a>
    </div>
  `;
}
