/**
 * Solar's Art Gallery - Lightbox Module (lightbox.js)
 */

class Lightbox {
  constructor() {
    this.modal = null;
    this.imgEl = null;
    this.captionEl = null;
    this.init();
  }

  init() {
    // Create DOM structure if not present
    let modal = document.querySelector(".lightbox-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "lightbox-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-hidden", "true");

      modal.innerHTML = `
        <button class="lightbox-close-btn" aria-label="關閉圖片檢視 (Close)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="lightbox-container">
          <img class="lightbox-img" src="" alt="" />
          <div class="lightbox-caption"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    this.modal = modal;
    this.imgEl = modal.querySelector(".lightbox-img");
    this.captionEl = modal.querySelector(".lightbox-caption");
    const closeBtn = modal.querySelector(".lightbox-close-btn");

    // Close events
    closeBtn.addEventListener("click", () => this.close());
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal || e.target.classList.contains("lightbox-container")) {
        this.close();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });
  }

  open(src, caption = "") {
    if (!this.modal || !this.imgEl) return;
    this.imgEl.src = src;
    this.imgEl.alt = caption;
    this.captionEl.textContent = caption;
    this.modal.classList.add("active");
    this.modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Prevent background scroll
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove("active");
    this.modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => {
      if (!this.isOpen() && this.imgEl) {
        this.imgEl.src = "";
      }
    }, 300);
  }

  isOpen() {
    return this.modal && this.modal.classList.contains("active");
  }
}

// Global instance
window.artworkLightbox = new Lightbox();
