# Solar's Art Gallery｜AI 開發與專案維護規範 (AGENTS.md)

## 1. 專案目的與核心定位

本專案旨在建立 **Solar's Art Gallery（個人繪畫作品集網站）**，以日系柔和粉彩（Japanese Pastel Aesthetic）風格呈現繪師 **Solar** 的原創作品、創作手記與繪畫理念。

### 主要功能：
- **首頁 (`index.html`)**：Hero 品牌形象區、作品分類入口、精選代表作（Featured Artworks）、創作自述節錄。
- **作品集 (`gallery.html`)**：完整作品瀏覽，支援「全部 All」、「手繪 Traditional」、「電繪 Digital」分類切換，以及年份篩選與升降序排列。
- **作品詳細頁 (`artwork.html?id=xxx`)**：依 URL 參數讀取單一作品資訊（作品大圖、名稱、年份、媒材規格、創作簡述），並整合點擊放大圖片檢視（Lightbox）。
- **個人介紹與理念 (`about.html`)**：藝術家自述（Artist Bio）、創作理念（Artist Statement）、常用媒材與創作歷程。
- **純靜態架構**：使用原生 HTML5、CSS3、Vanilla JavaScript (ES6+) 與 JSON，支援直接部署至 GitHub Pages，無需複雜構建工具。

---

## 2. 視覺風格與設計規範 (Japanese Pastel Art Gallery)

- **核心氛圍**：留白、溫暖、柔和、日系雜誌感。
- **色票設定 (CSS Variables)**：
  - 背景底色：`--color-bg: #FDFBF7`（溫暖奶油白）
  - 卡片與區塊底色：`--color-surface: #FFFFFF`、`--color-surface-subtle: #F7F4EE`
  - 文字主色：`--color-text-main: #2E2A27`（微暖墨黑，不使用 `#000`）
  - 次要與註釋文字：`--color-text-muted: #78726A`
  - 邊框與分隔線：`--color-border: #EFECE6`
  - 粉彩重點色：
    - 櫻花粉（粉紅強調）：`--color-pastel-pink: #F7E5E1`、`--color-pink-accent: #C87A76`
    - 抹茶/鼠尾草綠（粉綠強調）：`--color-pastel-green: #E4EBE4`、`--color-green-accent: #5F7A66`
    - 暖米黃：`--color-pastel-beige: #F4ECE1`
- **排版與雙語標籤**：
  - 繁體中文為主標，搭配小型大寫英文為副標（例如：`WORKS / 作品欣賞`、`TRADITIONAL / 手繪媒材`、`ABOUT SOLAR / 關於創作`）。
  - 字體優先採用系統繁體與日文字型：`"Noto Serif TC"`, `"Yu Mincho"`, `"Hiragino Mincho ProN"`, `-apple-system`, serif / sans-serif。
- **UI 元件細節**：
  - 圓角：卡片 `12px`、按鈕 `999px`（微膠囊圓角）或 `8px`。
  - 陰影：超輕柔和陰影 `box-shadow: 0 8px 24px rgba(60, 40, 30, 0.04)`。
  - 動畫：僅保留平滑淡入與 Hover 微浮動（`transform: translateY(-4px)`）。

---

## 3. 專案檔案結構

```text
solars-art-gallery/
├── index.html               # 首頁：精選作品、分類導引、藝術家簡介
├── gallery.html             # 作品集：手繪/電繪分類、年份篩選與排序
├── artwork.html             # 作品詳細頁：依 ?id= 參數動態渲染
├── about.html               # 關於 Solar：個人簡歷、創作理念、常駐工具
├── css/
│   ├── style.css            # 全站共用：變數、字型、重設、Nav、Footer
│   ├── gallery.css          # 作品網格、篩選按鈕列、下拉排序
│   ├── artwork.css          # 詳細頁雙欄版面、作品規格表格
│   ├── about.css            # 關於頁版面、理念引文區塊
│   └── lightbox.css         # 圖片全螢幕放大預覽模組
├── js/
│   ├── main.js              # 全域邏輯：行動版漢堡選單、當前年份更新
│   ├── gallery.js           # 讀取 JSON、分類過濾、年份排序
│   ├── artwork.js           # 讀取 URL 參數、單件作品渲染、上一件/下一件導向
│   └── lightbox.js          # Lightbox 放大模組（ESC 鍵退出、點擊遮罩關閉）
├── data/
│   └── artworks.json        # 集中管理所有作品資料
├── assets/
│   └── images/
│       ├── profile.svg      # 藝術家肖像 / 代表形象
│       └── artworks/        # 作品圖檔存放區
└── AGENTS.md                # 本規範檔案
```

---

## 4. 作品資料規格 (`data/artworks.json`)

每件作品必須包含完整的欄位結構：

```json
[
  {
    "id": "artwork-001",
    "title": "晨光與白茶花",
    "titleEn": "Morning Light & Camellias",
    "category": "traditional",
    "categoryLabel": "手繪 Traditional",
    "year": 2024,
    "medium": "透明水彩、Arches 300g 冷壓水彩紙",
    "dimensions": "260 × 380 mm",
    "image": "assets/images/artworks/artwork-001.svg",
    "featured": true,
    "description": "清晨熹微的陽光穿透薄霧，落在窗前盛開的白茶花瓣上。藉由多層薄塗水彩營造晨間清澈微涼的空氣感。"
  }
]
```

### 欄位說明：
- `id` (string, 唯一)：作為網址參數 `artwork.html?id=artwork-001`。
- `title` (string)：作品中文名稱。
- `titleEn` (string, 選填)：英文作品名稱。
- `category` (string, 枚舉)：`"traditional"` 或 `"digital"`。
- `categoryLabel` (string)：顯示在前端的分類名稱。
- `year` (number)：創作年份（用於篩選與排序）。
- `medium` (string)：使用媒材（例如：水彩、壓克力、Clip Studio Paint、Procreate 等）。
- `dimensions` (string)：原畫尺寸或電繪解析度。
- `image` (string)：圖片相對路徑（存放於 `assets/images/artworks/`）。
- `featured` (boolean)：`true` 則顯示於首頁精選作品區（建議維持 4~6 件）。
- `description` (string)：作品創作背景、繪畫理念或筆記。

---

## 5. 新增與更換真實作品 SOP

1. **準備圖檔**：
   - 檔名使用英數與連字符（例：`whisper-of-wind.jpg`）。
   - 放入 `assets/images/artworks/` 資料夾。
2. **編輯 JSON 資料**：
   - 開啟 `data/artworks.json`，在陣列中加入新作品物件。
   - 確認 `id` 未與其他作品重複。
   - `category` 填入 `traditional` 或 `digital`。
3. **驗證展示**：
   - 重新整理 `gallery.html` 確認分類、排序與卡片展示正常。
   - 點擊卡片進入 `artwork.html?id=xxx` 測試圖片放大與詳細介紹。

---

## 6. AI 開發遵守規則

1. **架構保護**：不擅自更換為 React、Vue 或引進複雜的建置工具（Webpack/Vite），維持純粹的靜態多頁面架構。
2. **最小修改原則**：修改功能時優先調整既有函式與 CSS 變數，不大幅覆寫現有結構。
3. **路徑一致性**：所有圖片與 JSON 路徑皆採用相對於 HTML 檔案的相對路徑，確保於 GitHub Pages 與本機瀏覽器皆可順暢運作。
4. **資料保護**：不得刪除使用者已存在的真實作品圖片或 JSON 欄位。
5. **風格延續**：新增頁面或元素時，必須沿用 `--color-bg`、`--color-pastel-pink`、`--color-pastel-green` 等既定色票及柔和圓角陰影。
