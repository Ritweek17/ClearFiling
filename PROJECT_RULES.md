# ClearFiling Project Rules & Standards

This document establishes the architectural guidelines, styling standards, and coding conventions for the ClearFiling website. Every developer and AI agent contributing to this repository must strictly adhere to these rules.

---

## 1. Folder Structure

The project is structured as a monorepo containing `/client` (frontend) and `/server` (backend).

```text
clearfiling-website/
├── client/                     # React Frontend (Vite)
│   ├── public/                 # Static assets (favicons, robots.txt)
│   ├── src/
│   │   ├── assets/             # Brand logos, images, vectors
│   │   ├── components/         # Reusable presentation and layout components
│   │   │   ├── ui/             # Core primitives (Button, Input, Badge, Textarea)
│   │   │   ├── common/         # Layout modules (Navbar, Footer, FloatingCTAs, StickyMobileBar)
│   │   │   └── features/       # Feature-specific components (LeadForm, ServiceCard)
│   │   ├── pages/              # Router page view components
│   │   ├── router/             # React Router config and routes
│   │   ├── services/           # Frontend API and helper services
│   │   ├── styles/             # Global CSS and Tailwind directives
│   │   ├── App.jsx             # Root React component
│   │   └── main.jsx            # Application entry point
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                     # Express Backend (Node.js)
│   ├── config/                 # DB connection and system configuration
│   ├── controllers/            # Request handlers / Controller layer
│   ├── models/                 # Mongoose schemas / Database layer
│   ├── routes/                 # Express API routes
│   ├── middleware/             # Express middlewares (Validation, Error Handling)
│   ├── server.js               # Express application entry point
│   └── package.json
├── PROJECT_RULES.md            # Coding standards (This document)
└── package.json                # Root dependency manager (Scripts for parallel run)
```

---

## 2. Naming Conventions

### Frontend (React/Vite)
- **Directories**: lowercase, dash-separated (e.g., `src/components/ui/`, `src/services/`).
- **React Components**: PascalCase (e.g., `ServiceCard.jsx`, `FloatingCTAs.jsx`, `LeadForm.jsx`).
- **Standard Hooks**: camelCase starting with `use` (e.g., `useFormValidation.js`).
- **Helper Functions / Utilities**: camelCase (e.g., `formatPhoneNumber.js`).
- **Styles / CSS files**: lowercase, dash-separated (e.g., `index.css`).

### Backend (Node/Express)
- **Files**: camelCase or lowercase, dash-separated (e.g., `leadController.js`, `db.js`, `leadModel.js`).
- **Mongoose Models**: PascalCase, singular (e.g., `Lead`).
- **Variables / Functions**: camelCase (e.g., `createLead`).
- **Environment Variables**: UPPERCASE_UNDERLINE (e.g., `MONGODB_URI`, `PORT`).

---

## 3. Component Architecture

- **Separation of Concerns**: Components should focus on UI rendering. Side effects and API requests should be separated into dedicated helper functions or Custom Hooks.
- **Controlled Components**: All forms (specifically `LeadForm`) must be controlled inputs, managing state via standard React `useState`.
- **Reusable Primitives**: Create atomic components under `src/components/ui/` for buttons, input inputs, textareas, and badges to ensure visual consistency.
- **Props Validation**: Document and validate all props (using default values or basic type-checking comments).
- **No Inline Styles**: All layout styling must be done using Tailwind utility classes or custom class names defined in `index.css`.

---

## 4. Color Palette & Design Tokens

Tailwind config must extend the theme using these precise hex codes:

| Token | Hex Value | Tailwind Config Name | Intended Use Case |
| :--- | :--- | :--- | :--- |
| **Primary Green** | `#166534` | `brand-primary` | Headings, primary buttons, hero highlights, main brand assets |
| **Accent Green** | `#22C55E` | `brand-accent` | Hover states, active markers, form success indicators, dynamic pills |
| **Dark (Slate)** | `#0F172A` | `brand-dark` | Primary typography, footers, dark backgrounds, high-contrast sections |
| **Background** | `#F8FAFC` | `brand-bg` | Main website background, light sections, off-white panels |
| **White** | `#FFFFFF` | `white` | Hero cards, navbar background, form inputs, secondary panels |

---

## 5. Typography

Poppins and Inter must be imported from Google Fonts.

- **Headings (h1, h2, h3, h4)**: Poppins
  - Styling guidelines: Semibold/Bold weight, tracking-tight, slate-900 color.
- **Body & Captions**: Inter
  - Styling guidelines: Regular/Medium weight, high line-height (`leading-relaxed`), slate-600/slate-700 color.

---

## 6. Responsive Breakpoints

Design follows a **Mobile-First** approach. Use standard Tailwind CSS breakpoints:

- **Mobile**: Default styles (under `640px`)
- **Small Tablet (sm)**: `640px` (min-width: 640px)
- **Tablet (md)**: `768px` (min-width: 768px) -> *Hide sticky bottom mobile bar, show floating CTAs*
- **Desktop (lg)**: `1024px` (min-width: 1024px)
- **Large Desktop (xl)**: `1280px` (min-width: 1280px)

---

## 7. Coding Standards

### General Standards
- **ES6+ Syntax**: Always use modern JS features (const/let, arrow functions, destructuring, template literals, async/await).
- **Semi-colons**: Consistent use of semi-colons across all JS/JSX files.
- **Indentation**: 2 spaces.
- **Comments**: Write self-documenting code, but use short, clear comments to explain complex validation logic or backend schemas.

### React Standards
- Prefer Functional Components over Class Components.
- Keep hooks at the top of the component file.
- Clean up side effects in `useEffect` (e.g., event listeners or timeout cleanups).

### Backend Standards
- **Express Error Handling**: Always catch async database errors using a standard `try-catch` block or middleware wrapper. No unhandled promise rejections.
- **JSON Response Structure**:
  - Success: `{ success: true, data: { ... } }`
  - Error: `{ success: false, error: "Detailed error message" }`
- **Data Validation**: Sanitization and validation must be done in the Express route layer using a custom validator or Joi before accessing controller logic.

---

## 8. Animation Rules (Framer Motion)

Animations should feel **premium, subtle, and quick**. Do not over-animate.
- **Transitions**: Keep transitions within `0.2s` to `0.4s` using smooth easing functions (e.g., `easeOut` or custom cubic-bezier).
- **Scroll Animations**: Use Framer Motion's `whileInView` with `viewport={{ once: true, margin: "-100px" }}` to prevent repetitive triggering of animations on scroll.
- **Hover effects**: Use standard scale (max `scale-105`), subtle translate transitions, or light opacity changes.
- **Reduce Motion**: Respect user OS accessibility settings by checking for reduced motion preferences:
  ```javascript
  const shouldReduceMotion = useReducedMotion();
  ```

---

## 9. Accessibility Rules (a11y)

- **Semantic HTML**: Use HTML5 structural elements (`<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`, `<article>`).
- **Interactive Controls**: Always use buttons (`<button>`) or links (`<a>`) for interactive components, never generic divs/spans with onClick handlers.
- **ARIA Attributes**: Ensure screen-reader capability by adding appropriate `aria-label` or `aria-expanded` properties (especially on the Mobile Navigation toggle, Floating CTAs, and Accordions).
- **Contrast Ratios**: Maintain WCAG AA standard contrast ratios (at least 4.5:1 for body text, 3:1 for large headings) between background and foreground colors.
- **Form Labels**: Every input element must have an associated `<label>` or explicit `aria-label` for screen reader navigation.
- **Keyboard Navigation**: Ensure all links, buttons, and form inputs are keyboard focusable and display a visible focus outline.
