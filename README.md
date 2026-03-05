# TireStore 🚗

A full-stack tyre e-commerce SPA built with **Next.js 14** (frontend) and **Express** (backend).

---

## Project Structure

```
tirestore/
├── backend/          # Express API proxy server
│   ├── routes/
│   │   └── products.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/         # Next.js 14 App Router SPA
    ├── app/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── Hero.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── ProductSkeleton.jsx
    │   │   ├── ProductsGrid.jsx
    │   │   ├── FilterSidebar.jsx
    │   │   ├── SearchBar.jsx
    │   │   ├── Pagination.jsx
    │   │   └── CartDrawer.jsx
    │   ├── lib/
    │   │   └── api.js        # Fetch helpers
    │   ├── store/
    │   │   └── index.js      # Zustand (cart + filters)
    │   ├── globals.css
    │   ├── layout.js
    │   └── page.js
    ├── next.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev    # Starts on http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev    # Starts on http://localhost:3000
```

---

## API Proxy

The Express backend proxies all requests to `https://p511.eontyre.com/api/webshop/products`.

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/products` | List products with filters |
| `GET` | `/api/products/:id` | Single product detail |
| `GET` | `/health` | Health check |

**Supported query params:**

| Param | Type | Description |
|-------|------|-------------|
| `query` | string | Search term |
| `diameter` | number | Rim diameter (e.g. 20) |
| `width` | number | Tyre width (e.g. 235) |
| `aspectRatio` | number | Aspect ratio (e.g. 35) |
| `speedIndex` | string | Speed rating (e.g. W) |
| `tyreType` | 1/2/3 | 1=Summer, 2=All Season, 3=Winter |
| `isRunflat` | boolean | Runflat tyres only |
| `isElectricVehicle` | boolean | EV tyres only |
| `isSilence` | boolean | Silent tyres only |
| `isStaggeredFitment` | boolean | Staggered fitment |
| `page` | number | Page number |
| `limit` | number | Results per page (12/24/48) |
| `tyreDimensions[]` | string[] | e.g. `235,35,20` |
| `includeLocations[]` | number[] | Warehouse location IDs |

---

## Features

- ✅ Product listing with live search (debounced)
- ✅ Filter by diameter, width, aspect ratio, speed index, season, features
- ✅ Sort by price / brand
- ✅ Grid / List view toggle
- ✅ Skeleton loading states
- ✅ EU tyre label badges (rolling resistance, wet grip, noise)
- ✅ Pagination
- ✅ Cart with persistent storage (Zustand + localStorage)
- ✅ Cart drawer with quantity controls
- ✅ Mobile responsive with filter drawer
- ✅ Error & empty states

## Coming Next

- [ ] Product detail page (`/tyres/[id]`)
- [ ] Checkout flow
- [ ] Order confirmation
- [ ] User auth
- [ ] Wishlist
- [ ] Vehicle lookup filter
