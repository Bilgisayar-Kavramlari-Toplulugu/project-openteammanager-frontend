# Ekip yönetimini basitleştir, verimliliği artır! (Örnek)

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-Bilgisayar-Kavramlari-Toplulugu-181717?style=flat-square&logo=github)](https://github.com/Bilgisayar-Kavramlari-Toplulugu/project-openteammanager-frontend)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**Part of [Ekip yönetimini basitleştir, verimliliği artır!](docs/Project-Definition.md)**

</div>

---

<details open>
<summary><strong>🇹🇷 Türkçe</strong></summary>

<br>

> **ÖNEMLİ:** Bu repository **Ekip yönetimini basitleştir, verimliliği artır!** projesinin bir parçasıdır. Proje hakkında detaylı bilgi için [`docs/Project-Definition.md`](docs/Project-Definition.md) dosyasına bakın.

## 📖 Hakkında


**Temel Özellikler:**
- Kimlik doğrulama (giriş/kayıt) ve otomatik token yenileme
- Organizasyon oluşturma ve yönetimi
- Proje oluşturma, düzenleme, silme ve durum filtresi
- Kanban Board ile görev yönetimi (sürükle-bırak, optimistic update)
- Markdown destekli açıklama editörü
- Koyu/Açık tema desteği
- Responsive tasarım

**Teknoloji Stack:**

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Ant Design 6, Tailwind CSS 4 |
| State | Zustand 5 |
| Veri | TanStack Query 5 |
| Sürükle-Bırak | dnd-kit |
| Form | React Hook Form + Zod |
| HTTP | Axios |
| Dil | TypeScript 5 |

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+
- pnpm

### Başlangıç

```bash
git clone https://github.com/Bilgisayar-Kavramlari-Toplulugu/project-openteammanager-frontend.git
cd project-openteammanager-frontend
pnpm install
```

`.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 💻 Kullanım

```bash
pnpm dev        # Geliştirme sunucusu (http://localhost:3000)
pnpm build      # Üretim derlemesi
pnpm start      # Üretim sunucusu
pnpm lint       # ESLint kontrolü
```

## 📁 Proje Yapısı

```
project-openteammanager-frontend/
├── src/
│   ├── api/                  # API katmanı (servisler, tipler, axios istemci)
│   ├── app/                  # Next.js App Router sayfaları
│   │   ├── (auth)/           #   Giriş & Kayıt
│   │   ├── dashboard/        #   Dashboard
│   │   ├── projects/         #   Proje listesi
│   │   │   └── [id]/         #   Proje detay (Genel Bakış, Kanban, Ekip)
│   │   └── community/        #   Topluluk
│   ├── components/           # Atomic Design bileşenleri
│   │   ├── atoms/            #   FormInput, PrimaryButton, ThemeToggle...
│   │   ├── molecules/        #   FormField, SearchBar, MarkdownEditor, OrgSwitcher...
│   │   ├── organisms/        #   AppSidebar, TopBar, ProjectCard, KanbanBoard...
│   │   └── templates/        #   MainLayout, ProtectedAppLayout, AuthLayout
│   └── store/                # Zustand store'ları (auth, organization, theme, sidebar)
├── docs/                     # Dokümantasyon
└── README.md
```

## 🧪 Test

```bash
pnpm lint       # ESLint kontrolü
pnpm tsc --noEmit  # TypeScript tip kontrolü
```

## 🤝 Katkıda Bulunma

Katkıda bulunmak için lütfen [`CONTRIBUTING.md`](.github/CONTRIBUTING.md) dosyasını inceleyin.

## 📚 Dokümantasyon

- [Proje Tanımı](docs/Project-Definition.md)
- [Mimari Genel Bakış](docs/Architecture-Overview.md)
- [Geliştirme Akışı](docs/Development-Workflow.md)

## 📄 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

**Proje Lideri:** [@hakanceran64](https://github.com/hakanceran64)

</details>

<details>
<summary><strong>🇬🇧 English</strong></summary>

<br>

> **IMPORTANT:** This repository is part of **Ekip yönetimini basitleştir, verimliliği artır!** project. See [`docs/Project-Definition.md`](docs/Project-Definition.md) for details.

## 📖 About

OpenTeamManager Frontend is a modern web application for teams to manage their projects and tasks. It features JWT-based authentication, multi-organization support, project management, drag-and-drop Kanban board, and dark/light theme support.

**Key Features:**
- Authentication (login/register) with automatic token refresh
- Organization creation and management
- Project creation, editing, deletion and status filtering
- Kanban Board for task management (drag-and-drop, optimistic updates)
- Markdown-supported description editor
- Dark/Light theme support
- Responsive design

**Tech Stack:**

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Ant Design 6, Tailwind CSS 4 |
| State | Zustand 5 |
| Data | TanStack Query 5 |
| Drag & Drop | dnd-kit |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Language | TypeScript 5 |

## 🚀 Installation

### Requirements

- Node.js 18+
- pnpm

### Getting Started

```bash
git clone https://github.com/Bilgisayar-Kavramlari-Toplulugu/project-openteammanager-frontend.git
cd project-openteammanager-frontend
pnpm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 💻 Usage

```bash
pnpm dev        # Development server (http://localhost:3000)
pnpm build      # Production build
pnpm start      # Production server
pnpm lint       # ESLint check
```

## 📁 Project Structure

```
project-openteammanager-frontend/
├── src/
│   ├── api/                  # API layer (services, types, axios client)
│   ├── app/                  # Next.js App Router pages
│   │   ├── (auth)/           #   Login & Register
│   │   ├── dashboard/        #   Dashboard
│   │   ├── projects/         #   Project list
│   │   │   └── [id]/         #   Project detail (Overview, Kanban, Team)
│   │   └── community/        #   Community
│   ├── components/           # Atomic Design components
│   │   ├── atoms/            #   FormInput, PrimaryButton, ThemeToggle...
│   │   ├── molecules/        #   FormField, SearchBar, MarkdownEditor, OrgSwitcher...
│   │   ├── organisms/        #   AppSidebar, TopBar, ProjectCard, KanbanBoard...
│   │   └── templates/        #   MainLayout, ProtectedAppLayout, AuthLayout
│   └── store/                # Zustand stores (auth, organization, theme, sidebar)
├── docs/                     # Documentation
└── README.md
```

## 🧪 Testing

```bash
pnpm lint          # ESLint check
pnpm tsc --noEmit  # TypeScript type check
```

## 🤝 Contributing

Please see [`CONTRIBUTING.md`](.github/CONTRIBUTING.md) for contribution guidelines.

## 📚 Documentation

- [Project Definition](docs/Project-Definition.md)
- [Architecture Overview](docs/Architecture-Overview.md)
- [Development Workflow](docs/Development-Workflow.md)

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

**Project Lead:** [@hakanceran64](https://github.com/hakanceran64)

</details>
