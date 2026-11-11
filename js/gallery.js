/**
 * Solar's Art Gallery - Gallery Logic (gallery.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  initGallery();
});

let allArtworks = [];
let currentCategory = "all";
let currentYear = "all";
let currentSortOrder = "desc"; // desc = newest first, asc = oldest first

async function initGallery() {
  const gridEl = document.getElementById("gallery-grid");
  const countEl = document.getElementById("artwork-count");
  const yearSelect = document.getElementById("year-select");
  const sortBtn = document.getElementById("sort-btn");
  const sortText = document.getElementById("sort-order-text");
  const filterBtns = document.querySelectorAll(".filter-btn");

  if (!gridEl) return;

  try {
    const response = await fetch("data/artworks.json");
    if (!response.ok) throw new Error("無法讀取作品資料");
    allArtworks = await response.json();

    // Check URL parameters (e.g. gallery.html?category=traditional)
    const urlParams = new URLSearchParams(window.location.search);
    const paramCat = urlParams.get("category");
    if (paramCat && ["traditional", "digital"].includes(paramCat)) {
      currentCategory = paramCat;
      filterBtns.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.category === paramCat);
      });
    }

    // Populate Year options
    populateYearFilter(yearSelect);

    // Event: Category Tabs
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.dataset.category || "all";
        renderGallery();
      });
    });

    // Event: Year Filter
    if (yearSelect) {
      yearSelect.addEventListener("change", (e) => {
        currentYear = e.target.value;
        renderGallery();
      });
    }

    // Event: Sort Order Toggle
    if (sortBtn) {
      sortBtn.addEventListener("click", () => {
        currentSortOrder = currentSortOrder === "desc" ? "asc" : "desc";
        if (sortText) {
          sortText.textContent = currentSortOrder === "desc" ? "由新至舊" : "由舊至新";
        }
        renderGallery();
      });
    }

    // Initial render
    renderGallery();

  } catch (err) {
    console.error("Gallery initialization error:", err);
    gridEl.innerHTML = `
      <div class="empty-gallery">
        <p>載入作品資料時發生錯誤，請稍後再試。</p>
      </div>
    `;
  }
}

function populateYearFilter(selectEl) {
  if (!selectEl) return;
  const years = Array.from(new Set(allArtworks.map(art => art.year))).sort((a, b) => b - a);

  selectEl.innerHTML = `<option value="all">所有年份 (All Years)</option>`;
  years.forEach(year => {
    const opt = document.createElement("option");
    opt.value = year;
    opt.textContent = `${year} 年`;
    selectEl.appendChild(opt);
  });
}

function renderGallery() {
  const gridEl = document.getElementById("gallery-grid");
  const countEl = document.getElementById("artwork-count");
  if (!gridEl) return;

  // Filter
  let filtered = allArtworks.filter(art => {
    const matchCat = currentCategory === "all" || art.category === currentCategory;
    const matchYear = currentYear === "all" || art.year.toString() === currentYear;
    return matchCat && matchYear;
  });

  // Sort
  filtered.sort((a, b) => {
    if (currentSortOrder === "desc") {
      return b.year - a.year;
    } else {
      return a.year - b.year;
    }
  });

  // Update counter
  if (countEl) {
    countEl.textContent = `共 ${filtered.length} 件作品`;
  }

  // Render cards
  if (filtered.length === 0) {
    gridEl.innerHTML = `
      <div class="empty-gallery">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <p>查無符合條件的作品。</p>
      </div>
    `;
    return;
  }

  gridEl.innerHTML = filtered.map(art => createArtworkCard(art)).join("");
}

function createArtworkCard(art) {
  return `
    <article class="artwork-card">
      <a href="artwork.html?id=${encodeURIComponent(art.id)}" class="card-image-wrap" aria-label="檢視作品：${art.title}">
        <img src="${art.image}" alt="${art.title}" loading="lazy" />
      </a>
      <div class="card-content">
        <div class="card-meta">
          <span class="category-badge ${art.category}">${art.categoryLabel}</span>
          <span class="card-year">${art.year}</span>
        </div>
        <h3 class="card-title">
          <a href="artwork.html?id=${encodeURIComponent(art.id)}">${art.title}</a>
        </h3>
        ${art.titleEn ? `<div class="card-title-en">${art.titleEn}</div>` : ""}
        <div class="card-medium">${art.medium}</div>
      </div>
    </article>
  `;
}
