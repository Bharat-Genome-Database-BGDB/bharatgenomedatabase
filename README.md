```markdown
# 🧬 Bharat Genome Database (BGDB) — Next.js Master Platform

> **India's National Genomic Repository for Indigenous Biodiversity & Translational Bioinformatics** > *Parent Organization:* Sivasakthi Science Foundation (SSF)

---

## 📌 Executive Summary & Architecture Goals

The **Bharat Genome Database (BGDB)** is being modernized from a legacy static HTML website into a high-performance, dynamic web platform using the **SSF Next.js App Router Master Template**.

### Key Migration Objectives:
1. **Decouple Web Presentation from Heavy Compute:** The Next.js web application acts strictly as a visual presentation layer. Heavy bioinformatics pipelines (`Prokka`, `antiSMASH`, `GECCO`, `BLAST`, `CoGe_Pipeline`) run on external cloud/HPC compute instances, storing sequence outputs (`.fasta`, `.gff`, `.json`) in cloud storage (AWS S3).
2. **Dynamic Data Management:** Eliminate hardcoded HTML links. The navigation bar and homepage rotators query the database live, allowing curators to upload or edit species records without modifying codebase files.
3. **Role-Based (RBAC) & Entitlement-Based (ABAC) Access Control:** Restrict raw sequence downloads, JBrowse visualizers, and admin forms based on user roles and pay-per-dataset purchases.
4. **Ecosystem Standardization:** Reuse SSF design tokens (`src/styles/variables.css`) and component classes (`cards.css`, `buttons.css`, `forms.css`) while adopting a distinct **Clinical Earth / Forest Green** theme.

---

## 🏗 System Architecture Overview

```text
                                  +---------------------------+
                                  |   Next.js App Router      |
                                  |   (Vercel / Netlify)      |
                                  +-------------+-------------+
                                                |
                        +-----------------------+-----------------------+
                        |                                               |
                        v                                               v
            +-----------------------+                       +-----------------------+
            |  SUPABASE (Postgres)  |                       |     AWS S3 BUCKET     |
            |                       |                       |                       |
            | - Metadata Catalog    |                       | - Assembled FASTA     |
            | - Users & Roles (RBAC)|                       | - GFF Annotations     |
            | - Entitlements (ABAC) |                       | - JBrowse Track Configs|
            | - Admin Form Feeds    |                       | - Raw Read FASTQ Links|
            +-----------------------+                       +-----------+-----------+
                                                                        |
                                                                        v
                                                            +-----------------------+
                                                            | HEAVY COMPUTE ENGINE  |
                                                            | (AWS EC2 / HPC Docker)|
                                                            |                       |
                                                            | Runs:                 |
                                                            | - BLAST Engine        |
                                                            | - Prokka / antiSMASH  |
                                                            +-----------------------+

```

---

## 🛠 Tech Stack

* **Frontend Framework:** Next.js (App Router, React Client/Server Components)
* **Database & Auth:** Supabase (PostgreSQL, Passwordless Magic Link Auth, Row-Level Security)
* **File & Bio Storage:** AWS S3 / Supabase Storage (FASTA, GFF, BAM, JSON tracks)
* **Bioinformatics Visualizers:** JBrowse 2 (Embedded React Linear Genome Browser)
* **Styling & Tokens:** Modular CSS Component Architecture (`src/styles/`) driven by CSS custom properties. Zero inline styles.

---

## 📁 Repository Directory Structure

```text
bgdb-nextjs-platform/
├── .env.local                  # Local Environment Keys (Supabase URL, Anon Key, Org Slug)
├── jsconfig.json               # Absolute Path Aliases (@/, @components, @styles, @db)
├── package.json
├── public/                     # Static Brand Icons, Favicons & Logos
└── src/
    ├── app/                    # Next.js App Router Structure
    │   ├── layout.jsx          # Root Shell Wrapper (Header, Footer, Global Providers)
    │   ├── page.jsx            # Homepage (Hero, Dynamic Rotator, Quick Utilities)
    │   ├── about/              # About Hub (Our Story, ODOG Initiative, Partners)
    │   ├── genomes/            # Hosted Data Catalog (Filterable Bento Data Grid)
    │   │   └── [id]/page.jsx   # Individual Species Detail View (Tier-Gated)
    │   ├── tools/              # Scientific Tools Hub
    │   │   ├── browser/        # Embedded JBrowse 2 Chromosome Visualizer
    │   │   ├── blast/          # Sequence Alignment Search Form
    │   │   └── pipelines/      # Annotation Workflows & Flowchart Guide
    │   ├── contact/            # Multi-Tenant Inquiries & Intake Form
    │   ├── admin/
    │   │   ├── login/          # Passwordless Magic Link Login Page
    │   │   ├── dashboard/      # Curator & Species Management Panel
    │   │   └── theme-preview/  # Internal Live CSS Variables Playground
    │   └── privacy/            # Legal Policies
    ├── components/             # Reusable React UI Components
    │   ├── Layout/             # Header.jsx, Footer.jsx
    │   ├── SpeciesRotator.jsx  # Homepage Carousel Querying Featured Datasets
    │   └── DataGrid.jsx        # Searchable / Sortable Catalog Component
    ├── db/
    │   └── supabaseClient.js   # Supabase Client Initialization
    └── styles/                 # Central Design Token System
        ├── variables.css       # Brand Color Tokens (Forest Green / Ocean Blue)
        ├── main.css            # Central Master Stylesheet Bundle
        ├── header.css
        ├── footer.css
        └── components/         # Reusable Component Styles
            ├── buttons.css
            ├── cards.css
            └── forms.css

```

---

## 🧭 Navigation & Hub Menu Strategy

### 1. Header Navigation (`Header.jsx`)

* **Home (`/`):** High-impact national overview, key metrics, and the dynamic featured species rotator.
* **About (`/about`):** Mission, One Day One Genome (ODOG) national initiative, and partners.
* **Hosted Data (`/genomes`) [Clickable + Dynamic Dropdown]:**
* *Clicking the Link:* Routes directly to `/genomes` (interactive catalog grid with search, sort, and category filters).
* *Hovering:* Dynamically renders top species categories (`Flora`, `Fauna`, `Microbes`, `Disease Cohorts`) queried live from the database.


* **Tools & Pipelines (`/tools`):** Direct links to `/tools/browser` (JBrowse 2), `/tools/blast` (Sequence Query), and `/tools/pipelines` (Workflow documentation).
* **Contact Us (`/contact`):** Institutional inquiries and data request intake.
* **Admin Access (`/admin`):** Gated portal for curators and administrators.

### 2. Multi-Column Footer Directory (`Footer.jsx`)

Organized into 4 distinct vertical link groups:

1. **Genomic Catalogs:** Flora, Fauna, Microbes & AMR, Disease Cohorts.
2. **Tools & Analysis:** JBrowse 2 Viewer, BLAST Query, Pipeline Docs.
3. **Organization:** About Mission, ODOG Initiative, Partners, FAQs.
4. **Parent Ecosystem:** Sivasakthi Science Foundation ↗, GenAI Research Labs ↗, AarogyaSakthi ↗.

---

## 👥 Role & Entitlement Access Matrix

Access is controlled via a combination of user roles and explicit dataset purchase entitlements.

| User Role | Access Level | What They See on Frontend |
| --- | --- | --- |
| **`superadmin`** | System Master | Unrestricted access to user roles, data entry, logs, and global system configurations. |
| **`admin`** | Data Curator | Access to `/admin/dashboard` to upload species, edit text, attach `.gff` files, and toggle featured homepage cards. |
| **`tier_2_customer`** | Commercial / High-Tier Research | Full access to whole-genome assembly FASTA downloads, FASTQ raw reads, and computational pipeline endpoints. |
| **`tier_1_customer`** | Academic / Basic Research | Access to annotated assemblies, interactive JBrowse chromosome maps, `.gff` files, and BLAST sequence queries. |
| **`student` / Public** | General Directory | High-level species taxonomy cards, educational summaries, and public catalog views. |

---

## 🚀 Quick Start for Developers

### Prerequisites

* Node.js v18.0.0 or higher
* Git
* Supabase Account & Project Keys

### Local Setup Instructions

1. **Clone the Repository:**
```bash
git clone [https://github.com/Bharat-Genome-Database-BGDB/bgdb-nextjs-platform.git](https://github.com/Bharat-Genome-Database-BGDB/bgdb-nextjs-platform.git)
cd bgdb-nextjs-platform

```


2. **Install Dependencies:**
```bash
npm install

```


3. **Configure Environment Variables:**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=[https://your-supabase-project-id.supabase.co](https://your-supabase-project-id.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_ORG_SLUG=bharatgenomedatabase

```


4. **Run Development Server:**
```bash
npm run dev

```


Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser.

---

## 🎨 Non-Technical Stakeholder Management Guidelines

Non-technical stakeholders frequently focus on micro visual changes (e.g., button sizes, margins, color shades). Follow these guidelines to keep project development smooth:

1. **Use the Theme Playground (`/admin/theme-preview`):**
* Direct stakeholders to `/admin/theme-preview` rather than manually editing CSS files for small design requests.
* This internal tool exposes CSS color pickers and sliders for global variables (`--brand-primary`, `--font-heading-size`, `--btn-border-radius`).
* Once stakeholders finalize their preferred look live on screen, copy the resulting CSS block into `src/styles/variables.css`.


2. **Global Component Class Rule:**
* Styles are strictly tied to global component tokens (`.card`, `.btn-solid`, `.hero-title`). Changes made to a button on the homepage apply universally across the entire portal.



---

## 📜 Maintenance & Deployment

* **Deployment Host:** Netlify / Vercel (Auto-deploys on commit to `main` branch).
* **Database Keep-Alive:** A GitHub Action (`.github/workflows/keep-alive.yml`) pings the database periodically to prevent free-tier project pausing.

---

*Maintained by Sivasakthi Science Foundation & Bharat Genome Database Engineering Team.*

```

```