# ClearFiling UI Specification

This document defines the complete user interface system, design language, and layout rules for the ClearFiling website. The visual theme takes inspiration from modern SaaS products (Stripe, Linear, Vercel) with clean typography, generous spacing, fine borders, and subtle accents, customized for a high-trust Indian finance consultancy.

---

## 1. Overall Design Philosophy
- **Modern Corporatism**: Clean layouts combined with deep professional green accents to convey credibility, growth, and regulatory precision.
- **Visual Clarity**: High information hierarchy, low cognitive load. Use thin, semi-transparent borders (`border-slate-200/80`) and solid white background cards rather than busy grids.
- **Trust Elements**: Display clear certifications, professional micro-copy (e.g., "100% Secure & Regulated"), and transparent client metrics.
- **Glassmorphism**: Use backdrop blurs (`backdrop-blur-md`) and translucent overlays to create a layered, multi-dimensional feel on sticky navbars and modal forms.

---

## 2. Grid System
The layout utilizes a strict horizontal grid with a maximum content container width:
- **Max Width**: `max-w-7xl` (`1280px`) centered margins (`mx-auto`).
- **Desktop Grid**: 12-column layout (`grid grid-cols-12 gap-8`) for complex sections (e.g., About Us and Split Hero).
- **Service & Card Lists**:
  - Desktop: 3 columns (`grid-cols-3 gap-6` or `gap-8`)
  - Tablet: 2 columns (`grid-cols-2 gap-6`)
  - Mobile: 1 column (`grid-cols-1 gap-4`)
- **Default Container Padding**:
  - Desktop: `px-8`
  - Tablet: `px-6`
  - Mobile: `px-4`

---

## 3. Spacing Scale
Consistent vertical rhythms using a 4px/8px incremental scale (Tailwind standard values):
- **Section Spacing (Vertical)**:
  - Mobile: `py-12` (48px)
  - Tablet: `py-16` (64px)
  - Desktop: `py-24` (96px)
- **Inner Component Spacing**:
  - Cards: `p-6` (24px) or `p-8` (32px)
  - Form Fields: Stacked with `space-y-5` (20px) or `space-y-6` (24px)
  - Layout gaps: `gap-4` (16px), `gap-6` (24px), `gap-8` (32px)

---

## 4. Border Radius
Soft, consistent corner rounding across all UI components:
- **Buttons / Form Inputs**: `rounded-lg` (8px) for structural alignment.
- **Small Badges / Pills**: `rounded-full` (9999px) for friendly, organic shapes.
- **Cards / Images**: `rounded-xl` (12px) or `rounded-2xl` (16px) to match modern application design.
- **Hero / Banners**: `rounded-3xl` (24px) for prominent visual grouping.

---

## 5. Shadows & Elevation
Minimalist depth system avoiding heavy dark drop-shadows:
- **Flat Borders (Default state)**: `border border-slate-200/60` (no shadow) for a clean look.
- **Default Card Elevation**: `shadow-[0_2px_8px_rgba(0,0,0,0.04)]` combined with a soft border.
- **Hover/Interactive Elevation**: `shadow-[0_8px_30px_rgb(0,0,0,0.06)]` with an active accent border shift.
- **Sticky Navbar / Overlays**: `shadow-[0_4px_20px_rgba(15,23,42,0.03)]` combined with `backdrop-blur-md bg-white/80`.

---

## 6. Buttons

All buttons must have a clear visual priority, state transitions (hover, active, focus), and smooth transitions (`transition-all duration-200`).

- **Primary Button**: Solid dark forest green.
  - *Styles*: `bg-[#166534] text-white hover:bg-[#166534]/90 font-medium px-5 py-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-[#22C55E]/50 focus:ring-offset-2`
- **Secondary Button**: Minimal slate styling.
  - *Styles*: `bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 font-medium px-5 py-2.5 rounded-lg focus:ring-2 focus:ring-slate-200`
- **Accent/Alert Button**: Action-driven bright green.
  - *Styles*: `bg-[#22C55E] text-white hover:bg-[#22C55E]/90 font-medium px-5 py-2.5 rounded-lg focus:ring-2 focus:ring-[#22C55E]/30`
- **Text Link Button**: Inline text link with arrow icon.
  - *Styles*: `text-[#166534] hover:text-[#22C55E] inline-flex items-center gap-1.5 font-semibold group`

---

## 7. Input Fields

Inputs must clearly indicate state (active, error, focused) to guarantee user confidence during lead submission:
- **Default State**:
  - *Styles*: `w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-4 py-3 text-sm transition-all focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/10 outline-none`
- **Label State**:
  - *Styles*: `block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2`
- **Error State**:
  - *Styles*: `border-red-500 focus:ring-red-500/10 focus:border-red-500`
- **Helper text / Validation message**:
  - *Styles*: `text-xs mt-1 text-red-500 font-medium`

---

## 8. Cards

Cards form the core structural unit of ClearFiling's pages:
- **Structure**: White solid background (`bg-white`), micro thin borders (`border border-slate-100` or `border-slate-200/60`), and a padded viewport.
- **Hover Behavior**: Minimal translate shift (e.g., `-translate-y-1`), transition of text accent colors to `#166534`, and subtle shadow enlargement.
- **Category Badge**: Top-left alignment using a small uppercase badge:
  - *Styles*: `text-[10px] font-bold tracking-widest text-[#166534] bg-[#166534]/5 px-2.5 py-1 rounded-full uppercase`

---

## 9. Navbar

The header must remain accessible while presenting a high-end corporate feeling.
- **Layout**: Horizontal split. Brand Logo on the left, primary navigation links centered, CTA button ("Get Free Consultation") + contact phone on the right.
- **Responsive Behavior**: Transitions to a clean hamburger menu on screen widths below `1024px`. Clicking the menu triggers a smooth sliding overlay (drawer layout).
- **Background Mode**: Sticky position (`sticky top-0 z-50`), with white glassmorphism background (`bg-white/90 backdrop-blur-md border-b border-slate-100`).

---

## 10. Hero Section

The primary entrance point of the website must command authority and generate immediate leads:
- **Layout (Split Screen on Desktop)**:
  - **Left Column**: Clean, large text stack:
    - *Pill Indicator*: "Trusted Corporate Partners in India" (small badge)
    - *Title (H1)*: Bold, premium heading: "Compliance, Licensing & Tax Solutions Done Right."
    - *Sub-headline*: Short description emphasizing speed and professionalism.
    - *CTAs*: Inline horizontal group linking to services and lead form.
    - *Trust Metrics*: Mini grid displaying "10,000+ Filings Complete" and "Verified CAs & CSs".
  - **Right Column**: Integrated, premium `LeadForm` container to capture interest immediately.
- **Background Visuals**: Clean solid background (`bg-slate-50`) decorated with a soft radial gradient highlight (using the primary green `#166534` at `5%` opacity) to keep the layout minimal and uncluttered.

---

## 11. Services Section

- **Layout**: Clear header with a category filter bar (e.g., Business Registration, Tax & GST, Licensing, Legal). Clicking a category dynamically filters the grid cards below without reloading.
- **Card Styling**: Each card features a clean Lucide icon with a soft background highlight, service title, three brief bullet points outlining key compliance deliverables, and a text link "Learn Details".

---

## 12. About Section

- **Philosophy**: Emphasize trust, speed, and regulatory compliance.
- **Layout**: 2-column grid. Left contains copy defining ClearFiling's mission (partnering in India's growth, simplifying compliance). Right presents high-contrast cards highlighting three core principles:
  1. *Expert Driven*: Handled by verified CAs and CSs.
  2. *Tech-Enabled*: Secure documents storage and fast processes.
  3. *Clear Pricing*: Absolute transparency, no hidden consultancy costs.

---

## 13. Process Section

- **Philosophy**: Break down business filings into a stress-free experience.
- **Layout**: 4-step horizontal process timeline on desktop (vertical timeline on mobile):
  - *Step 1*: Submit Inquiry (Brief form completion)
  - *Step 2*: Expert consultation (Tailored advisory call)
  - *Step 3*: Document collection (Secure cloud upload)
  - *Step 4*: Filing & Compliance completion
- **Visuals**: Fine dotted connection line between numbers, with numerical indicators styled as green circles (`bg-[#166534] text-white`).

---

## 14. "Why Choose Us" Section

- **Layout**: Minimalist full-width layout. Left features strong trust banners. Right highlights a 4-grid layout of core differentiators:
  - High success rate
  - Quick turnaround times
  - Secured corporate vaults for files
  - Live call/chat support

---

## 15. Testimonials

- **Layout**: Horizontal masonry card layout (infinite scroll mock or multi-column grid).
- **Content**: Include real client quotes, corporate logos, and verify badges ("Verified client").
- **Styling**: Large quote icons and user avatars to feel human and premium.

---

## 16. FAQ Section

- **Layout**: Centered, structured accordion list.
- **Interactivity**: Clicking a question header smoothly opens it (using Framer Motion `height` transitions), showing a clear, concise answer.
- **Styling**: Standard borders separating questions, with indicator arrows rotating `180` degrees on activation.

---

## 17. Contact Section

- **Layout**: 2-column split layout.
  - **Left Panel**: Direct phone number, email, official address in New Delhi/Mumbai, operational timings, and quick social links.
  - **Right Panel**: A second occurrence of the interactive `LeadForm` but focused on custom inquiries.

---

## 18. Footer

- **Layout**: Large, dark background container (`bg-[#0F172A] text-slate-400`).
- **Columns**:
  - *Col 1*: Brand logo, brief statement, social media icons.
  - *Col 2*: Business Registrations links.
  - *Col 3*: Compliance & GST filing links.
  - *Col 4*: Company info (About, Contact, Careers, FAQ).
- **Bottom Bar**: Standard corporate copyright notice, Privacy Policy, Terms of Service, and a mandatory Indian regulatory disclaimer (e.g., "ClearFiling is a corporate consultancy services firm, not associated with the government...").

---

## 19. Mobile Responsive Behavior (< 768px)
- **Navigation**: Hidden inline links, accessible via a slide-in side drawer.
- **Sticky Bottom Mobile Bar**: Affixed to the bottom of the screen (`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 grid grid-cols-2 p-3 gap-2`). Offers a "Call" button and "WhatsApp" button with quick access.
- **Grids**: All multi-column grids collapse to `grid-cols-1`.
- **Spacing**: Vertical padding reduced to `py-12`, font-sizes reduced to avoid line overflows.

---

## 20. Tablet Behavior (768px - 1024px)
- **Navigation**: Desktop menu collapses, replaced by the mobile slide drawer at `1024px` to prevent overflow of dense text lists.
- **Sticky Bottom Mobile Bar**: Hidden (`hidden md:grid` checks trigger off).
- **Floating CTAs**: Visible on bottom right of viewport (`fixed bottom-6 right-6 z-40 flex flex-col gap-3`).
- **Grids**: 2-column grids applied for services and team layouts.

---

## 21. Desktop Behavior (> 1024px)
- **Navigation**: Full inline navigation menu, sticky with glassmorphism.
- **Floating CTAs**: Visible in bottom-right corner.
- **Grids**: 3-column and 4-column card systems active. Large 12-column grid layout for sections like Hero and About.
- **Animations**: Standard scroll animations enabled.

---

## 22. Animation Specification (Framer Motion)
All animations must be lightweight:
- **Fade In Up (Standard Section Entry)**:
  - *Initial*: `{ opacity: 0, y: 20 }`
  - *Animate*: `{ opacity: 1, y: 0 }`
  - *Transition*: `{ duration: 0.4, ease: "easeOut" }`
- **Fade In Left/Right (Hero visual offsets)**:
  - *Initial*: `{ opacity: 0, x: -30 }` / `{ opacity: 0, x: 30 }`
  - *Animate*: `{ opacity: 1, x: 0 }`
  - *Transition*: `{ duration: 0.5, ease: "easeOut" }`
- **Hover Scaling**:
  - *Hover state*: `{ scale: 1.02 }`
  - *Transition*: `{ duration: 0.2, ease: "easeInOut" }`

---

## 23. Icon Usage (Lucide React)
- **Stroke Width**: Uniformly set to `1.75px` or `2px` for a crisp, high-end outline look (avoid bold/chunky styles).
- **Sizing**: Consistent sizing across similar interfaces:
  - Card Headers / Accents: `24px` (`w-6 h-6`)
  - Form Fields: `18px` (`w-5 h-5`)
  - Floating Buttons: `20px` (`w-5 h-5`)
- **Colors**: Set to Primary Green (`#166534`) for action icons, and Slate (`text-slate-400` or `text-slate-500`) for secondary visual representations.

---

## 24. Image & Illustration Style
- **SaaS Icons & Visuals**: Avoid cheap corporate stock imagery. Instead, use clean, minimal vector graphics, structural mockups, or premium abstract SVG patterns.
- **Team Headshots**: Black and white or high-contrast corporate portraits with clean slate background, maintaining consistent lighting and cropping.
- **Borders & Overlays**: All images must feature subtle rounded corners (`rounded-xl` or `rounded-2xl`) and fine borders (`border border-slate-200/60`).

---

## 25. CTA (Call To Action) Placement
Maximize conversion using clear entry points:
1. **Hero Primary Form**: Placed directly inside the Hero card on desktop for immediate submissions.
2. **Navbar Header**: Direct click link ("Get Free Consultation") at top right.
3. **Mid-Page Banner**: Banner with accent green background prompting users to schedule a compliance checkup.
4. **Services List footer**: "Need a custom business package? Talk to our CAs" button.
5. **Contact Page Form**: Full customized form layout with field details.
6. **Mobile Sticky Bar / Desktop Floating CTAs**: Permanent Call/WhatsApp contact options visible contextually based on device viewport.
