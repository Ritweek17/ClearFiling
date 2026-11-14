# ClearFiling Admin Panel — Architecture Audit & Technical Blueprint
**Phase 1 — Technical Architecture Specification**  
**Document Management System (DMS) Release Foundation**  
**Repository:** `/Users/ritweek/Desktop/Clearfiling/ClearFiling`  
**Production Domain:** `https://www.clearfiling.co.in/`  
**Version:** 1.0.0  
**Date:** 2026-11-10  
**Status:** ARCHITECTURAL SPECIFICATION & AUDIT (PHASE 1 READ-ONLY)

---

## 1. Executive Summary & System Vision

ClearFiling is a premium Indian corporate compliance, tax filing, and financial advisory platform. The existing application is a production-hardened React 18 Single Page Application (SPA) deployed to Vercel, backed by an ESM Express/Node.js API and MongoDB database layer.

This blueprint specifies the architectural foundation for a dedicated, secure **Admin Panel** starting with a high-integrity **Document Management System (DMS)**. 

### Core Release Capabilities
- **Administrative Operations:** Secure authentication, PDF document upload, file replacement, metadata management (title, slug, description, category, tags), draft/publish lifecycle states, PDF preview, document deletion, category management, and audit logging.
- **Public Operations:** Browsing published documents, full-text and category search, PDF preview, and direct PDF downloads on the public website.
- **Extensible Foundation:** Modular MERN architecture designed to incorporate future modules (Leads, Blog, FAQs, Services, and Testimonials) without architectural rework.

---

## 2. Existing Repository Audit & Baseline Findings

### 2.1 Repository Structure Baseline
```text
ClearFiling/
├── .git/                        # Git version control
├── .gitignore                   # Root ignore rules (.env, node_modules, dist)
├── PROJECT_RULES.md             # Development standards and conventions
├── UI_SPECIFICATION.md          # Visual and component design tokens
├── package.json                 # Monorepo root manager (concurrently scripts)
├── package-lock.json            # Monorepo root dependency lockfile
├── client/                      # Public Website (React 18 + Vite 5 SPA)
│   ├── public/                  # Static assets (robots.txt, sitemap.xml)
│   ├── src/                     # React application source code
│   │   ├── components/          # ui/, common/, features/, contact/, seo/
│   │   ├── config/              # business.js, contact.js, seo.js
│   │   ├── data/                # services.js, indianLocations.js, etc.
│   │   ├── layouts/             # MainLayout.jsx, LegalPageLayout.jsx, etc.
│   │   ├── pages/               # Home.jsx, Services.jsx, Contact.jsx, etc.
│   │   ├── services/            # emailService.js
│   │   ├── styles/              # index.css (Tailwind CSS directives)
│   │   ├── App.jsx              # Application router & layout wrapping
│   │   └── main.jsx             # React DOM entry point
│   ├── tailwind.config.js       # Brand color palette tokens & fonts
│   ├── vercel.json              # Security headers & SPA rewrites
│   ├── vite.config.js           # Chunking & Vite build config
│   └── package.json             # Frontend dependencies
└── server/                      # Express Backend
    ├── config/                  # Configuration directory (.gitkeep)
    ├── controllers/             # Controller layer (.gitkeep)
    ├── middleware/              # Middleware layer (.gitkeep)
    ├── models/                  # Database models layer (.gitkeep)
    ├── routes/                  # Express routes layer (.gitkeep)
    ├── .env.example             # Environment sample (PORT, MONGODB_URI)
    ├── package.json             # Backend dependencies (ESM type: module)
    └── server.js                # Express server entry point
```

### 2.2 Existing Backend Findings
1. **Module System:** Configured as standard ECMAScript Modules (`"type": "module"` in `server/package.json`). All backend imports use ESM syntax (`import ... from '...'`).
2. **Current Dependencies:**
   - `express: ^4.19.2`
   - `mongoose: ^8.4.1` (installed and ready for schema definitions)
   - `cors: ^2.8.5`
   - `dotenv: ^16.4.5`
   - `nodemon: ^3.1.2` (dev dependency)
3. **Current Entry Point (`server/server.js`):** Basic Express server with `cors()`, `express.json()`, and a health check route (`GET /api/status`).
4. **Existing Directory Scaffolding:** `server/config/`, `server/controllers/`, `server/middleware/`, `server/models/`, and `server/routes/` are already scaffolded with `.gitkeep` files, matching the proposed architecture.
5. **Missing Backend Dependencies for DMS:** `bcryptjs`, `jsonwebtoken`, `cookie-parser`, `helmet`, `express-rate-limit`, `multer`, `cloudinary`.

### 2.3 Existing Frontend Findings
1. **Framework & Tooling:** React 18.3, Vite 5.4, Tailwind CSS 3.4, React Router DOM 6.30, Lucide React icons, Framer Motion.
2. **Design System & Tokens:**
   - `brand-primary`: `#1D4ED8` (Primary Royal Blue)
   - `brand-secondary`: `#0F172A` (Dark Navy Slate)
   - `brand-accent`: `#2563EB` (Vibrant Blue)
   - `brand-bg`: `#EFF6FF` (Soft Light Blue Tint)
   - `brand-success`: `#10B981` (Emerald Green)
   - Typography: `Poppins` (headings), `Inter` (body/data)
3. **Current State:** Purely public-facing marketing and compliance website. Forms submit inquiries to EmailJS. No current document browsing portal exists in `client/`.

---

## 3. Separation of Concerns & Target Directory Architecture

The three application tiers (Public Frontend, Admin Frontend, and Backend API) are cleanly separated into dedicated subdirectories. Each can be independently installed, developed, built, and deployed.

```text
ClearFiling/
├── client/                              # Tier 1: Public Website (Vite + React)
│   ├── public/
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── src/
│   │   ├── ... (existing public components, pages, data)
│   │   ├── pages/
│   │   │   ├── Documents.jsx            # [New] Public Document Catalogue & Search
│   │   │   └── DocumentViewer.jsx       # [New] Public Document Preview & Details
│   │   ├── services/
│   │   │   ├── emailService.js          # [Preserved]
│   │   │   └── publicDocumentService.js # [New] Public API consumer for documents
│   │   ├── App.jsx                      # [Modified] Add /documents routes
│   │   └── ...
│   ├── package.json
│   └── vercel.json
│
├── admin/                               # Tier 2: New Admin Panel (Vite + React)
│   ├── public/
│   │   ├── favicon.svg
│   │   └── robots.txt                   # Disallow: / (Prevent search indexing)
│   ├── src/
│   │   ├── assets/                      # Admin brand assets & icons
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── AdminHeader.jsx      # Top navigation, user profile, logout
│   │   │   │   ├── AdminSidebar.jsx     # Collapsible admin module navigation
│   │   │   │   └── ProtectedRoute.jsx   # Auth guard with redirect to /login
│   │   │   ├── ui/
│   │   │   │   ├── AdminButton.jsx      # Standardized administrative buttons
│   │   │   │   ├── AdminInput.jsx       # Form input with validation states
│   │   │   │   ├── AdminSelect.jsx      # Styled dropdown select
│   │   │   │   ├── StatusBadge.jsx      # Draft / Published / Archived badge
│   │   │   │   ├── ConfirmationDialog.jsx # Modal confirmation dialog
│   │   │   │   └── SearchBar.jsx        # Debounced search input
│   │   │   ├── documents/
│   │   │   │   ├── DocumentTable.jsx    # Paginated document inventory table
│   │   │   │   ├── DocumentForm.jsx     # Metadata create/edit form
│   │   │   │   ├── PDFUploader.jsx      # Drag-and-drop PDF dropzone
│   │   │   │   ├── PDFPreview.jsx       # Embedded PDF viewer modal/panel
│   │   │   │   └── CategorySelector.jsx # Category selection & inline creation
│   │   │   └── shared/
│   │   │       ├── Pagination.jsx       # Table pagination control
│   │   │       ├── LoadingSpinner.jsx   # Accessible loading indicator
│   │   │       └── EmptyState.jsx       # Zero-state illustration and prompt
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Current admin state & session lifecycle
│   │   ├── hooks/
│   │   │   ├── useAuth.js               # Auth context consumer
│   │   │   └── useDebounce.js           # Search input debouncer
│   │   ├── layouts/
│   │   │   ├── AdminLayout.jsx          # Sidebar + Header + Content shell
│   │   │   └── AuthLayout.jsx           # Centered card layout for Login
│   │   ├── pages/
│   │   │   ├── Login.jsx                # Secure administrator login
│   │   │   ├── Dashboard.jsx            # Metric cards & recent activity feed
│   │   │   ├── Documents.jsx            # Document list, filter, search, actions
│   │   │   ├── AddDocument.jsx          # PDF upload & metadata entry
│   │   │   ├── EditDocument.jsx         # Metadata update & PDF replacement
│   │   │   ├── Categories.jsx           # Category management (CRUD)
│   │   │   ├── ActivityLogs.jsx         # Administrative audit trail table
│   │   │   └── Settings.jsx             # Admin profile & credentials
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx            # React Router v6 route configuration
│   │   ├── services/
│   │   │   ├── api.js                   # Axios client with credentials & interceptors
│   │   │   ├── authService.js           # Login, logout, session verification
│   │   │   ├── documentService.js       # CRUD & publish/unpublish API calls
│   │   │   ├── categoryService.js       # Category API calls
│   │   │   └── activityService.js       # Activity log API calls
│   │   ├── styles/
│   │   │   └── index.css                # Admin Tailwind directives
│   │   ├── utils/
│   │   │   ├── formatters.js            # File size, date, and status formatters
│   │   │   └── validators.js            # Form and file validation heuristics
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tailwind.config.js           # Shared palette tokens
│   │   ├── vercel.json                  # Admin SPA rewrites & security headers
│   │   └── vite.config.js
│   └── ...
│
├── server/                              # Tier 3: Unified Express Backend
│   ├── config/
│   │   ├── db.js                        # [New] Mongoose connection & events
│   │   ├── cloudinary.js                # [New] Cloudinary SDK configuration
│   │   └── cors.js                      # [New] Multi-origin CORS allowlist
│   ├── controllers/
│   │   ├── authController.js            # [New] Admin login, logout, me
│   │   ├── documentController.js        # [New] Admin document CRUD & file replace
│   │   ├── categoryController.js        # [New] Category CRUD
│   │   ├── activityController.js        # [New] Audit trail queries
│   │   └── publicDocumentController.js  # [New] Public published document queries
│   ├── middleware/
│   │   ├── authMiddleware.js            # [New] JWT verification via HttpOnly cookie
│   │   ├── uploadMiddleware.js          # [New] Multer memory storage & PDF magic-byte
│   │   ├── errorMiddleware.js           # [New] Centralized error handler & 404
│   │   └── rateLimitMiddleware.js       # [New] Auth & API brute-force protection
│   ├── models/
│   │   ├── AdminUser.js                 # [New] Administrator accounts
│   │   ├── Document.js                  # [New] Document records & metadata
│   │   ├── DocumentCategory.js          # [New] Document category taxonomy
│   │   └── ActivityLog.js               # [New] Audit log records
│   ├── routes/
│   │   ├── authRoutes.js                # [New] /api/admin/auth/*
│   │   ├── adminDocumentRoutes.js       # [New] /api/admin/documents/*
│   │   ├── categoryRoutes.js            # [New] /api/admin/categories/*
│   │   ├── activityRoutes.js            # [New] /api/admin/activity/*
│   │   └── publicDocumentRoutes.js      # [New] /api/public/documents/*
│   ├── services/
│   │   ├── storageService.js            # [New] Cloudinary upload/replace/delete
│   │   ├── documentService.js           # [New] Document business logic
│   │   └── activityService.js           # [New] Activity log recorder helper
│   ├── validators/
│   │   ├── authValidators.js            # [New] Request schemas for auth
│   │   ├── documentValidators.js        # [New] Request schemas for documents
│   │   └── categoryValidators.js        # [New] Request schemas for categories
│   ├── utils/
│   │   ├── tokenUtils.js                # [New] JWT sign/verify & cookie options
│   │   └── slugify.js                   # [New] URL-safe slug generator
│   ├── scripts/
│   │   └── seedAdmin.js                 # [New] CLI utility to seed super admin
│   ├── .env.example                     # [Modified] Add JWT, Cloudinary, Origins
│   ├── package.json                     # [Modified] Add auth/upload dependencies
│   └── server.js                        # [Modified] Mount routes and middleware
│
├── docs/
│   └── admin/
│       └── phase_1_admin_architecture_blueprint.md # [This Document]
│
├── PROJECT_RULES.md                     # [Preserved]
├── UI_SPECIFICATION.md                  # [Preserved]
└── package.json                         # [Modified] Add "admin" npm scripts
```

---

## 4. System Communication Architecture Diagram

```mermaid
flowchart TD
    subgraph Clients["Frontend Layer"]
        PublicApp["Public Website (React/Vite)<br>www.clearfiling.co.in"]
        AdminApp["Admin Panel (React/Vite)<br>admin.clearfiling.co.in"]
    end

    subgraph CDN["Edge & Static Assets"]
        CloudinaryCDN["Cloudinary Asset CDN<br>PDF Previews & Downloads"]
    end

    subgraph API["Backend API Layer (Express / Node.js)"]
        Router["Express App Router<br>api.clearfiling.co.in"]
        
        subgraph Middlewares["Middleware Pipeline"]
            CORS["CORS Allowlist"]
            Helmet["Helmet Security Headers"]
            RateLimit["Rate Limiter"]
            AuthCheck["Auth Middleware<br>(JWT in HttpOnly Cookie)"]
            UploadPipe["Upload Middleware<br>(Multer + %PDF Magic Byte)"]
        end

        subgraph Controllers["Business Controllers"]
            AuthController["authController"]
            DocController["documentController"]
            CatController["categoryController"]
            PublicDocController["publicDocumentController"]
            LogController["activityController"]
        end

        subgraph Services["Service Abstraction"]
            StorageService["storageService.js<br>(Cloudinary SDK Wrapper)"]
            DocService["documentService.js"]
            ActivityService["activityService.js"]
        end
    end

    subgraph Data["Persistent Storage Layer"]
        MongoDB[("MongoDB Atlas<br>AdminUser, Document,<br>DocumentCategory, ActivityLog")]
        CloudinaryStorage[("Cloudinary Raw Storage<br>PDF Files in clearfiling/documents/")]
    end

    %% Communications
    PublicApp -->|GET /api/public/documents| Router
    AdminApp -->|POST /api/admin/auth/login<br>(Sets HttpOnly Cookie)| Router
    AdminApp -->|CRUD /api/admin/documents<br>(Cookie Auth)| Router
    AdminApp -->|CRUD /api/admin/categories<br>(Cookie Auth)| Router

    Router --> CORS --> Helmet --> RateLimit
    RateLimit --> AuthCheck
    AuthCheck --> UploadPipe

    UploadPipe --> DocController
    RateLimit --> AuthController
    RateLimit --> PublicDocController

    DocController --> StorageService
    DocController --> DocService
    DocController --> ActivityService
    
    StorageService -->|Upload / Replace / Delete| CloudinaryStorage
    DocService -->|Mongoose Queries| MongoDB
    ActivityService -->|Insert Logs| MongoDB
    AuthController -->|Verify & Sign JWT| MongoDB

    PublicApp -.->|Direct Streaming / Download| CloudinaryCDN
    AdminApp -.->|Preview PDF| CloudinaryCDN
    CloudinaryStorage --> CloudinaryCDN
```

---

## 5. Database Schema Design (MongoDB & Mongoose)

All schemas leverage Mongoose 8.4, strict typing, schema-level validation, and appropriate indexing.

### 5.1 Collection: `AdminUser` (`server/models/AdminUser.js`)
```javascript
import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Never returned in default queries
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'editor'],
      default: 'admin',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
```

### 5.2 Collection: `DocumentCategory` (`server/models/DocumentCategory.js`)
```javascript
import mongoose from 'mongoose';

const documentCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [80, 'Category name cannot exceed 80 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
```

### 5.3 Collection: `Document` (`server/models/Document.js`)
```javascript
import mongoose from 'mongoose';

const fileMetadataSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'File URL is required'],
    },
    publicId: {
      type: String,
      required: [true, 'Storage Public ID is required'],
      index: true,
    },
    fileName: {
      type: String,
      required: [true, 'Original file name is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size in bytes is required'],
    },
    mimeType: {
      type: String,
      required: true,
      default: 'application/pdf',
    },
    pageCount: {
      type: Number,
      default: null,
    },
    checksum: {
      type: String,
      default: null,
    },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Document slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocumentCategory',
      required: [true, 'Document category is required'],
      index: true,
    },
    file: {
      type: fileMetadataSchema,
      required: [true, 'File metadata is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: [true, 'Uploader ID is required'],
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
    downloadsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound indexes for rapid public filtering & sorting
documentSchema.index({ status: 1, category: 1, publishedAt: -1 });
// Full-text search index for keyword searching
documentSchema.index({ title: 'text', description: 'text', tags: 'text' });
```

### 5.4 Collection: `ActivityLog` (`server/models/ActivityLog.js`)
```javascript
import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'LOGIN',
        'LOGOUT',
        'DOCUMENT_CREATE',
        'DOCUMENT_UPDATE',
        'DOCUMENT_REPLACE_FILE',
        'DOCUMENT_DELETE',
        'DOCUMENT_PUBLISH',
        'DOCUMENT_UNPUBLISH',
        'CATEGORY_CREATE',
        'CATEGORY_UPDATE',
        'CATEGORY_DELETE',
      ],
      index: true,
    },
    entityType: {
      type: String,
      required: true,
      enum: ['Document', 'DocumentCategory', 'AdminUser', 'Session'],
      index: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    entityTitle: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// TTL index: automatically expire logs older than 180 days
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15552000 });
```

---

## 6. Authentication & Security Architecture

### 6.1 Authentication Mechanism
1. **Admin Creation Guard:** No public registration route (`POST /api/admin/auth/register`) exists. New admin accounts can only be provisioned via the secure CLI script (`node scripts/seedAdmin.js`) or by authenticated `super_admin` users.
2. **Password Hashing:** Passwords hashed using `bcryptjs` with salt round `12`.
3. **Session Transport:**
   - On successful authentication, server issues a signed JSON Web Token (JWT) encapsulating `{ id: user._id, role: user.role }`.
   - Token is stored in an `HttpOnly`, `SameSite=None` (production) / `SameSite=Lax` (local dev), `Secure: true` cookie named `clearfiling_admin_token`.
   - **Zero localStorage usage:** Tokens are never stored in `localStorage` or `sessionStorage` to eliminate XSS token theft vectors.
4. **Logout Mechanism:** `POST /api/admin/auth/logout` clears the cookie with identical path and security flags.
5. **CSRF Protection:**
   - Double-submit CSRF cookie pattern or strict origin check against allowlist (`ADMIN_ORIGIN`).
   - Browser enforces `SameSite` restrictions on credentials.

### 6.2 Rate Limiting & Protection
- **Login Rate Limit:** `express-rate-limit` enforces a maximum of 5 login attempts per 15-minute window per IP.
- **API Rate Limit:** 100 requests per minute for authenticated administrative endpoints.
- **Helmet Headers:** Integrated in `server/server.js` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, etc.).
- **CORS Allowlist:** Strictly permits requests only from verified origins:
  - `CLIENT_ORIGIN` (e.g. `https://www.clearfiling.co.in`)
  - `ADMIN_ORIGIN` (e.g. `https://admin.clearfiling.co.in`)
  - `credentials: true` enabled.

---

## 7. PDF Storage & Processing Architecture (Cloudinary)

### 7.1 Provider Abstraction Layer (`server/services/storageService.js`)
To prevent vendor lock-in, all storage interactions are abstracted behind a unified interface:
- `uploadFile(buffer, filename, folder)` &rarr; `{ url, publicId, fileSize, mimeType }`
- `replaceFile(oldPublicId, buffer, filename, folder)` &rarr; `{ url, publicId, fileSize, mimeType }`
- `deleteFile(publicId)` &rarr; `{ success: true }`

If ClearFiling later migrates to AWS S3, Cloudflare R2, or Google Cloud Storage, only `storageService.js` requires updates; controllers and models remain untouched.

### 7.2 Upload Security & Validation Pipeline
1. **File Type Filtering:** `multer` configured with memory storage (`multer.memoryStorage()`) and explicit `mimetype: 'application/pdf'` check.
2. **Magic-Byte Signature Verification:** Prior to streaming to Cloudinary, server inspects the first 4 bytes of the memory buffer to confirm `%PDF` (`0x25 0x50 0x44 0x46`). Files disguised with `.pdf` extensions (executables, HTML/JS polyglots) are immediately rejected with `400 Bad Request`.
3. **File Size Boundary:** Enforces a maximum file size of 15 MB (`15 * 1024 * 1024` bytes).
4. **Cloudinary Configuration:**
   - `resource_type: 'raw'` (required for PDF documents to preserve integrity).
   - Folder: `clearfiling/documents/{categorySlug}`.
   - Access mode: Public delivery with HTTPS.
5. **Orphan Cleanup Strategy:**
   - When a document is replaced (`PATCH /api/admin/documents/:id` with new file), the previous Cloudinary asset is destroyed using `uploader.destroy(oldPublicId, { resource_type: 'raw' })`.
   - If document record creation in MongoDB fails after Cloudinary upload, a compensation rollback deletes the newly uploaded asset to prevent orphaned storage waste.

---

## 8. Comprehensive API Specification

### 8.1 Admin Authentication (`/api/admin/auth`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/auth/login` | Public (Rate-limited) | Authenticates credentials; issues `HttpOnly` JWT cookie |
| `POST` | `/api/admin/auth/logout` | Authenticated | Clears `HttpOnly` cookie; logs session termination |
| `GET` | `/api/admin/auth/me` | Authenticated | Returns current administrator profile and permissions |

### 8.2 Admin Category Management (`/api/admin/categories`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/categories` | Admin | Lists all categories (with document counts) |
| `POST` | `/api/admin/categories` | Admin | Creates a new document category |
| `PATCH` | `/api/admin/categories/:id` | Admin | Updates category title, description, or active status |
| `DELETE` | `/api/admin/categories/:id` | Super Admin | Deletes category (guards against deleting if documents attached) |

### 8.3 Admin Document Management (`/api/admin/documents`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/documents` | Admin | Paginated list with filters (`status`, `category`, `search`, `page`, `limit`) |
| `POST` | `/api/admin/documents` | Admin | Uploads PDF (multipart) & creates document in `draft` or `published` state |
| `GET` | `/api/admin/documents/:id` | Admin | Retrieves complete document details and history |
| `PATCH` | `/api/admin/documents/:id` | Admin | Updates metadata (title, category, description, tags) |
| `PUT` | `/api/admin/documents/:id/file` | Admin | Replaces existing PDF file (destroys old Cloudinary asset) |
| `PATCH` | `/api/admin/documents/:id/status` | Admin | Toggles status (`draft` &harr; `published` &harr; `archived`) |
| `DELETE` | `/api/admin/documents/:id` | Super Admin | Permanently deletes document record and Cloudinary asset |

### 8.4 Admin Activity Logs (`/api/admin/activity`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/activity` | Admin | Paginated audit log feed with filters (`action`, `adminId`, `dateRange`) |

### 8.5 Public Document Access (`/api/public/documents`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/public/documents` | Public | Lists **published** documents only; supports category filter, search, pagination |
| `GET` | `/api/public/documents/:slug` | Public | Returns published document details and increments `viewsCount` |
| `GET` | `/api/public/documents/:slug/download` | Public | Increments `downloadsCount` and redirects to secure Cloudinary URL |
| `GET` | `/api/public/categories` | Public | Lists active categories having at least one published document |

---

## 9. Admin Frontend Page & Component Architecture

The Admin Panel is organized into focused, accessible pages with modular subcomponents.

```text
Admin Pages:
├── Login (/login)
│   └── Centered card, email & password inputs, loading button, error banner
├── Dashboard (/)
│   ├── MetricCards (Total Docs, Published Docs, Drafts, Total Downloads)
│   ├── QuickActions (Upload Document, Add Category)
│   └── RecentActivityFeed (Last 10 administrative actions)
├── Documents (/documents)
│   ├── FilterBar (Search input, category dropdown, status tab pills)
│   ├── DocumentTable (Title, Category, Status badge, File size, Published Date, Actions)
│   └── PaginationControls (Page selector, items per page)
├── AddDocument (/documents/new)
│   ├── PDFUploader (Drag & drop zone, progress bar, file size indicator)
│   └── DocumentForm (Title, slug auto-generator, CategorySelector, Description, Tags, Status switch)
├── EditDocument (/documents/:id/edit)
│   ├── MetadataEditor (Update title, category, description)
│   ├── FileReplacementZone (Replace PDF with automatic Cloudinary cleanup)
│   └── DocumentPreviewModal (In-browser PDF preview via iframe / object)
├── Categories (/categories)
│   ├── CategoryListTable (Name, Slug, Linked Documents Count, Actions)
│   └── CategoryModalForm (Create / Edit category dialog)
├── ActivityLogs (/activity-logs)
│   └── AuditLogTable (Timestamp, Admin User, Action type, Target entity, Details)
└── Settings (/settings)
    └── AdminProfileForm (Change display name, update password)
```

### Visual & UX Standards
- **Color Discipline:** Primary blue (`#1D4ED8`), dark slate (`#0F172A`), light grey borders (`slate-200`), clean white card surfaces.
- **Form Standard:** `h-[44px]` to `h-[48px]` input heights, clear validation error messages under fields, disabled states with loading spinners on active submissions.
- **Destructive Actions:** Deletions and file replacements always prompt an explicit confirmation modal before executing.

---

## 10. Public Website Integration Strategy

The existing public website (`client/`) remains completely isolated, but will be enhanced with a dedicated public document browsing experience:

1. **New Public Route (`client/src/pages/Documents.jsx`):**
   - Accessible at `https://www.clearfiling.co.in/documents`.
   - Hero banner introducing ClearFiling's official corporate forms, guides, and compliance templates.
   - Search bar with instant debounced filtering.
   - Category filter pills (e.g. *Company Registration*, *GST Compliance*, *Income Tax*, *Trademarks*).
   - Document cards with PDF badge, title, category, file size, "Preview" modal button, and "Download PDF" button.
2. **SEO & Indexability:**
   - Public documents page configured with canonical metadata via `<SEOHead title="Official Documents & Compliance Forms | ClearFiling" />`.
   - Individual document pages optionally enabled for deep-linking (`/documents/:slug`).
3. **No Auth Overhead:**
   - Public consumers interact strictly with `/api/public/documents` endpoints, which require zero cookies, zero tokens, and reject any drafts.

---

## 11. Independent Deployment Strategy

| Tier | Host Provider | Build Command | Output Dir | Environment Domain |
| :--- | :--- | :--- | :--- | :--- |
| **Public Website** | Vercel (Project: `clearfiling-public`) | `npm run build` | `dist` | `www.clearfiling.co.in` |
| **Admin Panel** | Vercel (Project: `clearfiling-admin`) | `npm run build` | `dist` | `admin.clearfiling.co.in` |
| **Backend API** | Render / Railway / Node VM | `npm start` | Root (`server/`) | `api.clearfiling.co.in` |
| **Database** | MongoDB Atlas (M0 / Dedicated) | N/A | Cloud Managed | `mongodb+srv://...` |
| **Storage** | Cloudinary | N/A | Cloud Managed | Cloudinary Secure CDN |

### Cookie & Domain Strategy
- In production, when API is hosted at `api.clearfiling.co.in` and Admin at `admin.clearfiling.co.in`:
  - Cookie settings: `httpOnly: true`, `secure: true`, `sameSite: 'none'` (or `domain: '.clearfiling.co.in'` with `sameSite: 'lax'`).
  - CORS configuration explicitly sets `origin: ['https://admin.clearfiling.co.in', 'https://www.clearfiling.co.in']` and `credentials: true`.

---

## 12. Environment Variables Specification

### 12.1 Backend Environment (`server/.env`)
```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/clearfiling?retryWrites=true&w=majority

# Authentication Security
JWT_SECRET=REPLACE_WITH_A_SECURE_RANDOM_SECRET
JWT_EXPIRES_IN=8h
COOKIE_SECRET=REPLACE_WITH_A_SECURE_RANDOM_SECRET

# Allowed Frontend Origins (Comma-separated or individual)
CLIENT_ORIGIN=https://www.clearfiling.co.in
ADMIN_ORIGIN=https://admin.clearfiling.co.in

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=REPLACE_WITH_CLOUDINARY_API_SECRET
```

### 12.2 Admin Frontend Environment (`admin/.env`)
```env
VITE_API_BASE_URL=https://api.clearfiling.co.in/api
```

### 12.3 Public Frontend Environment (`client/.env`)
```env
# Existing EmailJS variables preserved
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...

# New Backend Document API connection
VITE_API_BASE_URL=https://api.clearfiling.co.in/api
```

---

## 13. Future Modules Expansion Strategy

The proposed schema, controller, and frontend structure natively accommodates future administrative features without refactoring:

1. **Lead Management:** Add `server/models/Lead.js`, `server/controllers/leadController.js`, and route `/api/admin/leads`. Add `admin/src/pages/Leads.jsx`.
2. **Blog Management:** Add `server/models/BlogPost.js`, `server/controllers/blogController.js`, and `admin/src/pages/Blog.jsx` with markdown/rich-text editor.
3. **FAQ Management:** Add `server/models/FAQ.js` with category linkage, exposed dynamically to homepage and service pages.
4. **Service Catalogue Management:** Transition `services.js` hardcoded objects into dynamic MongoDB records with price/feature controls.

---

## 14. Implementation Roadmap (Phases 2 through 5)

- [x] **Phase 1: Architecture Audit & Technical Blueprint (This Phase — Read-Only)**
- [ ] **Phase 2: Backend Core & Database Implementation**
  - Install backend dependencies (`bcryptjs`, `jsonwebtoken`, `cookie-parser`, `helmet`, `express-rate-limit`, `multer`, `cloudinary`).
  - Implement Mongoose models (`AdminUser`, `DocumentCategory`, `Document`, `ActivityLog`).
  - Build `storageService.js` (Cloudinary wrapper) and `uploadMiddleware.js` (magic-byte validation).
  - Implement controllers, routes, and `seedAdmin.js` script.
  - Test all endpoints with automated API integration tests.
- [ ] **Phase 3: Admin Frontend Application Development**
  - Scaffold `admin/` directory using React + Vite + Tailwind CSS.
  - Implement `AuthContext`, `ProtectedRoute`, and `Login.jsx`.
  - Build `AdminLayout`, `AdminSidebar`, `AdminHeader`.
  - Build Document management pages (`Documents.jsx`, `AddDocument.jsx`, `EditDocument.jsx`).
  - Integrate PDF uploader, Cloudinary replacement workflow, and PDF preview.
  - Implement `Categories.jsx` and `ActivityLogs.jsx`.
- [ ] **Phase 4: Public Website Documents Portal**
  - Add `client/src/pages/Documents.jsx` and document preview component.
  - Wire up `client/src/services/publicDocumentService.js` to `/api/public/documents`.
  - Add search, category filtering, preview modal, and download counter.
- [ ] **Phase 5: Deployment & Release Verification**
  - Configure production environment variables in Vercel and backend host.
  - Execute end-to-end user acceptance and smoke tests.

