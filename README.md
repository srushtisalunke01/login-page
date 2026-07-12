# 🌌 NEXUS — Elite Futuristic E-Commerce & Bento Dashboard

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r166-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)

**NEXUS** is an ultra-premium, highly-immersive futuristic storefront and interactive dashboard interface. Built for next-generation clients, it integrates cinematic loading sequences, real-time 3D product previews, modular bento-box analytics, and a powerful user workspace.

---

## ✨ Primary Features

### 1. 💫 Immersive 3D Login & Intro Experience
* **Cinematic Loader:** A custom [LoadingScreen](file:///c:/Users/Server/OneDrive/Desktop/intern%20project/login%20page/src/components/ui/LoadingScreen.tsx) matching ambient system initialization stages with a progressive status indicator.
* **Interactive 3D Portal:** Features a fully rotating and reactive 3D logo rendered in Three.js through [NexusLogo3D](file:///c:/Users/Server/OneDrive/Desktop/intern%20project/login%20page/src/components/NexusLogo3D.tsx) that reacts to active theme colors.
* **Portal Camera Zoom:** Initiates a smooth camera transition and portal zoom energy flash upon successful authentication.

### 2. 🎛️ 8 Luxurious Active Themes
Includes a [ThemeSwitcher](file:///c:/Users/Server/OneDrive/Desktop/intern%20project/login%20page/src/components/ui/ThemeSwitcher.tsx) dashboard widget allowing users to change the style and look instantly:
* **Luxury White Gold (`luxury-white-gold`):** Platinum surfaces with rich golden highlights.
* **Midnight Luxury (`midnight-luxury`):** Sleek stealth titanium tones.
* **Ocean Sapphire (`ocean-sapphire`):** Deep oceanic dark blues and azure glimmers.
* **Sakura Premium (`sakura-premium`):** High-end cherry blossom pink & copper accents.
* **Royal Purple (`royal-purple`):** Regal purple and velvet violet sparkles.
* **Emerald Elite (`emerald-elite`):** Deep cybernetic forest greens.
* **Sunset Elite (`sunset-elite`):** Warm amber, obsidian, and copper glows.
* **White Crystal (`white-crystal`):** Ultra-bright crisp quartz aesthetics.

### 3. 🍱 Bento Grid Layout Dashboard
An adaptive bento grid interface ([DashboardPage](file:///c:/Users/Server/OneDrive/Desktop/intern%20project/login%20page/src/pages/Dashboard/DashboardPage.tsx)) organizing modular widgets:
* **E-Commerce Catalog:** Filter items dynamically using [BrowseFilters](file:///c:/Users/Server/OneDrive/Desktop/intern%20project/login%20page/src/components/home/BrowseFilters.tsx) or browse by categories.
* **Administrative Interface:** Complete [AdminDashboard](file:///c:/Users/Server/OneDrive/Desktop/intern%20project/login%20page/src/components/admin/AdminDashboard.tsx) for CRUD management of products and order lifecycle tracking.
* **AI Virtual Assistant:** Intelligent floating chatbot window ([AiAssistant](file:///c:/Users/Server/OneDrive/Desktop/intern%20project/login%20page/src/components/ai/AiAssistant.tsx)) providing contextual e-commerce support.
* **Comparison Matrix:** Compare item specs side-by-side inside [CompareMatrix](file:///c:/Users/Server/OneDrive/Desktop/intern%20project/login%20page/src/components/products/CompareMatrix.tsx).
* **Shopping Cart & Checkout:** Floating cart sidebar ([CartDrawer](file:///c:/Users/Server/OneDrive/Desktop/intern%20project/login%20page/src/components/cart/CartDrawer.tsx)) linked with a full multi-step checkout form ([CheckoutFlow](file:///c:/Users/Server/OneDrive/Desktop/intern%20project/login%20page/src/components/checkout/CheckoutFlow.tsx)).

### 4. 👟 Procedural 3D Product Previews
Real-time floating interactive models ([ProductModels](file:///c:/Users/Server/OneDrive/Desktop/intern%20project/login%20page/src/components/3D/ProductModels.tsx)) built procedurally (with zero external asset loading delay):
* **Cyber Shoe:** Kinetic trainer with glowing sole plates.
* **Cyber Drone:** Quadcopter with independently spinning rotors.
* **Cyber Headphones:** Sleek over-ear headgear with metallic glow rings.
* **Quantum Core:** Rotating double-ring containment chamber.

### 5. 🔊 Native Web Audio Engine
A web-synthesized custom sound effects engine ([sounds.ts](file:///c:/Users/Server/OneDrive/Desktop/intern%20project/login%20page/src/utils/sounds.ts)) creating high-fidelity feedback (no MP3/WAV assets required):
* **Interface Hover:** High-pitch sci-fi hover feedback.
* **Click Confirmation:** Clean electronic select response.
* **Action Success:** Multi-frequency harmonic success chime.
* **State Transition:** Deep electronic filter whoosh.

---

## 📂 Project Architecture

```yaml
src/
├── components/
│   ├── 3D/                   # Procedural 3D Three.js product meshes
│   │   └── ProductModels.tsx
│   ├── admin/                # Administrator panel, products inventory CRUD
│   │   └── AdminDashboard.tsx
│   ├── ai/                   # AI support chatbot simulator
│   │   └── AiAssistant.tsx
│   ├── cart/                 # Shopping Cart drawer & sidebars
│   │   └── CartDrawer.tsx
│   ├── checkout/             # Checkout multi-step flow forms
│   │   └── CheckoutFlow.tsx
│   ├── home/                 # Promo slide carousels & filter systems
│   │   ├── BrowseFilters.tsx
│   │   ├── CategoryBar.tsx
│   │   └── PromoCarousel.tsx
│   ├── products/             # Inventory database, details overlay, comparison card
│   │   ├── CompareMatrix.tsx
│   │   ├── ProductCard3D.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── ProductGrid.tsx
│   │   └── productsData.ts
│   ├── ui/                   # Global UI screens, custom cursor, loaders, theme panel
│   │   ├── CelebrationScreen.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── PetalsRain.tsx
│   │   ├── PopupWelcome.tsx
│   │   ├── PremiumWelcomeModal.tsx
│   │   └── ThemeSwitcher.tsx
│   ├── LoginCard.tsx         # Premium Glassmorphism Login Card
│   └── NexusLogo3D.tsx       # Three.js 3D rotating login page canvas
├── pages/
│   └── Dashboard/
│       └── DashboardPage.tsx # Master Bento Grid layout system
├── store/
│   └── nexusStore.ts         # Zustand state management engine with localStorage persistence
├── utils/
│   └── sounds.ts             # Web Audio API synthesiser engine
├── App.tsx                   # Central router & mount deck
├── index.css                 # Master Tailwind styles & variables setup
└── main.tsx                  # App entrypoint
```

---

## 🛠️ Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Step 1: Install Dependencies
Clone the repository, navigate to the project directory, and install the modules:
```bash
npm install
```

### Step 2: Start Development Server
Launch the local dev environment at `http://localhost:5173`:
```bash
npm run dev
```

### Step 3: Compiling for Production
Bundle the project into optimized static assets under the `dist/` directory:
```bash
npm run build
```

---

## 🧠 Technologies Used
* **Framework:** React 18, Vite
* **Language:** TypeScript
* **State Management:** Zustand
* **Animation Libraries:** Framer Motion, GSAP
* **Styling:** Tailwind CSS, PostCSS, Autoprefixer
* **3D Engine:** Three.js, React Three Fiber, React Three Drei
* **Sound Design:** Web Audio API (oscillators, custom gain nodes)
* **Icons:** Lucide React
