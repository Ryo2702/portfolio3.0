# Portfolio Plan — Charles Aeron L. Pelayo

Updated: 30 September 2026

Build a freelance developer portfolio with a persistent sidebar, a scrollable main page, and individual URLs for published project case studies and blog articles. Help visitors understand Charles's capabilities, inspect relevant work, and start an inquiry. Use React, shadcn/ui, Lucide, and Motion with a Neubrutalism / 1-bit monochrome design.

Positioning: Freelance Web Developer.

Core services: Web Development, WordPress Development, and SEO.

## 1. Page structure

| Order | Section | Content and layout | shadcn/ui components |
| --- | --- | --- | --- |
| Shell | Sidebar Nav | Logo/name, role, section links, active-section indicator, and contact action. Fixed on desktop and available as an off-canvas menu on mobile. | Sidebar, SidebarProvider, SidebarHeader, SidebarContent, SidebarMenu, SidebarFooter, SidebarTrigger; the sidebar's mobile Sheet behavior. |
| 1 | Hero | Name, Freelance Web Developer role, short business-focused promise, small 1-bit portrait, and Start a Project / View My Work actions. Show availability only when current. | Button, Badge; a custom portrait frame. |
| 2 | Featured Projects | Two or three strongest projects with larger previews, problem, personal contribution, delivered features, and case-study links. | Card, Badge, Button, AspectRatio. |
| 3 | Projects | The full published project catalog with compact previews, descriptions, technologies, status, and demo/repository links. Add category filtering and search when the collection warrants them. | Card, Badge, Button; Input and ToggleGroup for filtering. |
| 4 | Tech Stack & Tools | Group demonstrated tools into frontend, backend, CMS, SEO, and development tools. Keep labels visible and connect capabilities to actual work. | Card, Badge, Separator; Tooltip for optional supporting details. |
| 5 | Experience | Reverse-chronological entries with role, organization, dates, engagement type, responsibilities, and supported outcomes. | A custom semantic timeline built from Card, Badge, and Separator. |
| 6 | About | Brief personal introduction, approach to problem solving, core services, and a compact explanation of how projects are delivered. | Card, Separator, Button. |
| 7 | Blog | Up to three recent published articles with title, short excerpt, topic, date, and Read Article links. Include View All Articles when more posts exist. | Card, Badge, Button. |
| 8 | GitHub Calendar | Real contribution activity, selected date range, total contributions for that range, update timestamp, and profile link. | Custom contribution grid inside Card; Tooltip, Skeleton, Select, and ScrollArea where needed. |
| 9 | Footer | Contact invitation, visible email, copy-email action, professional links, copyright, and Back to Top. | Button, Separator. |

Main page order: Hero, Featured Projects, Projects, Tech Stack & Tools, Experience, About, Blog, GitHub Calendar, Footer. The sidebar remains part of the page shell. Service information belongs in Hero and About; the primary contact destination is the Footer.

Use the official Sidebar composition and its desktop/mobile state handling as the starting point. [5] The timeline and contribution grid are custom components composed with shadcn/ui primitives.

## 2. Content direction

Lead with the business problem and the work that solves it. Keep technical details in project descriptions and the skills section. Use clear, specific wording and claim only outcomes that can be supported.

| Service | Problem to address | Proposed scope |
| --- | --- | --- |
| Web Development | No professional website, unclear service information, or a difficult mobile experience. | Responsive business websites, service pages, inquiry flows, and redesigns. |
| WordPress Development | Outdated layouts, broken features, or a site that is difficult to maintain. | WordPress builds, layout improvements, troubleshooting, performance work, and maintenance. |
| SEO | Unclear page structure or weak search presentation. | On-page optimization, titles and descriptions, headings, internal links, and technical fixes within the agreed scope. |

Each featured project should explain context, problem, role, solution, and evidence. Featured Projects provides the deeper case-study presentation; Projects provides a compact, browsable catalog. Maintain one project data record with a featured flag so both sections stay consistent. Label academic work, personal projects, prototypes, and client work accurately. Use measured results only when measurements exist; otherwise describe the functionality delivered.

Experience entries should accurately distinguish employment, internships, training, and freelance work. Use only confirmed organizations, dates, roles, and outcomes. A concise entry with two or three specific contributions is enough.

Blog articles should contain real published content. Suitable topics include project lessons, React implementation notes, WordPress fixes, and practical SEO work. Display a clear empty state until the first article is published; draft ideas must not appear as published posts with invented dates or reading times.

Keep the main call to action consistent: Start a Project. It leads to the Footer contact block. View My Work leads to Featured Projects. Make direct email and copy-email actions available from the Footer and a contact action available in the Sidebar.

## 3. Visual system

| Element | Proposed specification |
| --- | --- |
| Palette | Black `#000000` and white `#FFFFFF` only for authored UI colors. |
| Typography | Object Sans from the existing brand assets, with a system sans-serif fallback. Bold display headings and comfortable regular-weight body text. |
| Borders | Consistent 2–3 px solid borders. |
| Shadows | Hard, unblurred offsets around 6 px, using the contrasting palette color. |
| Corners | Square or minimally rounded, around 0–4 px. |
| Layout | Approximately 240–260 px desktop sidebar, with a fluid main column capped around 1100 px. Keep generous padding between the sidebar and content. |
| Type sizes | Body text around 16–18 px; a fluid hero heading around 40–80 px, checked against the actual name and headline. |
| Imagery | Small 1-bit dithered portrait and clear black-and-white project covers. Keep dithering away from text. |
| Icons | Consistent Lucide icons, generally 20–24 px, with matching stroke weight. |
| Decorative detail | Sparse numbered labels, black blocks, or checkerboard accents. Keep patterns outside reading areas. |
| Mobile | Single-column reading order, comfortable tap targets, and stacked primary actions when needed. |
| Component states | Selected controls invert black and white. Errors and statuses use explicit text and icons. Keep focus outlines clearly visible. |
| GitHub cells | White outlined cells for zero contributions and solid black cells for one or more contributions. Show exact daily counts separately. |

Treat 1-bit as the authored visual palette; browser text and vector antialiasing can still produce intermediate edge pixels. Retain normal text rendering for readability. Use hard edges and solid surfaces throughout; keep gradients, blur effects, and soft shadows out of this design.

Theme shadcn/ui through its semantic CSS variables, then adjust the selected components' borders, radii, shadows, and state classes. [6] Map surfaces, foregrounds, borders, rings, sidebar states, and status colors to the black-and-white palette. Override translucent fills and reduced-opacity text that would introduce intentional gray surfaces. Use opaque black or white for the mobile sheet backdrop and preserve its explicit close control. Default skeleton pulse effects should become static bordered placeholders for this design.

## 4. Interaction and motion

- Use Motion for small section entrances, project-card interactions, and button press feedback. Let the shadcn Sidebar/Sheet own menu state and focus behavior; coordinate its transition styling with Motion so one element is not animated twice.
- Prefer a short movement of roughly 8–12 px for section reveals and a 2–3 px movement into the hard shadow on button press. Proposed durations: 150–250 ms for controls and 250–400 ms for section entrances.
- Keep the hero and essential text visible immediately. Section effects should run once and must not block reading.
- Use native section anchors with an offset for the compact mobile header. Highlight the active Sidebar link as sections enter the viewport. Respect reduced-motion settings for both CSS scrolling and Motion animations.
- Configure `MotionConfig` with `reducedMotion="user"`; use `useReducedMotion` where a custom interaction needs separate behavior. [4]
- Provide visible keyboard focus and a Skip to Content link. The mobile menu must expose its expanded state, close with Escape, and return focus to its trigger. After a visitor selects a section, close the mobile menu and ensure the destination is reachable.
- Keep the Sidebar vertically scrollable on short screens. A collapsed desktop icon rail must retain accessible labels and tooltips. Keep the responsive CSS breakpoint and the Sidebar mobile-state breakpoint aligned.
- Keep the hero and text fully opaque during movement to preserve the strict palette. Reduced-motion mode should show content immediately.
- Announce copied-email feedback only after a successful clipboard write and leave the email selectable if copying fails.

## 5. Implementation approach

| Technology | Responsibility |
| --- | --- |
| React | Reusable sections and interactive components. [1] |
| TypeScript | Typed component props, project records, experience entries, article metadata, and contribution data. |
| Vite | Development and build tooling for this scope. Use the current official shadcn/ui Vite setup. [7] |
| Tailwind CSS | shadcn/ui styling, responsive layouts, borders, shadows, and focus states; add custom CSS for the monochrome tokens. [7] |
| shadcn/ui | Sidebar and reusable UI components, restyled to the portfolio design system. [5][6][8] |
| `lucide-react` | Named icon imports so unused icons can be excluded from the bundle. [2] |
| `motion` | React animation components and hooks imported from `motion/react`. [3] |
| GitHub GraphQL API | Contribution dates, daily counts, and range totals for the calendar. [9] |

At implementation time, use current compatible stable package releases and commit the lockfile. Initialize shadcn/ui using the current official workflow, add only the needed components, and retain the same primitive family throughout. Install the supporting packages required by those components through that workflow.

Keep project, tool, and experience content in typed data files. Store blog content as Markdown with title, slug, date, summary, and tags. Use routes such as `/projects/<slug>` and `/blog/<slug>` for published detail pages, with direct-load support and unique page metadata. Plan static rendering for published article and case-study content during the build. Start with local content; a CMS is optional later.

Suggested components: PortfolioLayout, AppSidebar, MobileHeader, Hero, FeaturedProjects, ProjectCard, Projects, TechStackTools, Experience, ExperienceItem, About, Blog, BlogCard, GitHubCalendar, Footer, and Section. Keep shadcn/ui components in their generated UI directory and feature components separate from them.

## 6. GitHub Calendar integration

Initial profile setting: `Ryo2702`, based on the user-provided profile context. The implementation must fetch actual activity before displaying any totals.

Use GitHub's `contributionsCollection` and `contributionCalendar` data, including dates, daily contribution counts, and total contributions. [9] Label the values as contributions. Use a small server endpoint to make the authenticated GraphQL request; keep its credential in a server-side environment variable. The browser receives the calendar JSON. GitHub documents authentication for GraphQL calls. [10]

Default to the last year and show the range explicitly. Cache successful results for a proposed six hours and refresh on demand when stale. A year selector can request earlier supported ranges. Show the last successful update time and keep a profile link available if the API fails. A failed request must show an unavailable state or an identified older snapshot, never a fabricated zero-activity year.

Render a custom contribution grid using square black-and-white cells. Use a clear legend: white means zero; black means one or more. Exact counts and dates remain available on hover, keyboard focus, or tap. Provide an accessible text/list alternative for the selected period and an aggregate summary. Contain horizontal scrolling inside the calendar on narrow screens, with the latest dates initially visible. Use static Skeleton placeholders while loading.

The contribution grid is a custom visualization; shadcn/ui supplies its surrounding Card, Tooltip, Select, Skeleton, and optional ScrollArea. A date-picker calendar is not the required visualization.

## 7. Build order and completion criteria

1. **Prepare content:** select featured projects, assemble the full project catalog, confirm experience entries, gather brand assets, and prepare actual blog content.
2. **Set up the foundation:** initialize React, TypeScript, Vite, Tailwind, and shadcn/ui; establish the monochrome theme and responsive Sidebar layout.
3. **Build all sections:** implement the main page, reusable cards, project/article detail routes, and the Footer contact actions.
4. **Connect data and interactions:** add project filtering, Sidebar active states, copy-email feedback, and the GitHub Calendar's real data, caching, loading, and failure states.
5. **Add restrained motion:** apply short transitions and reduced-motion behavior without obscuring content.
6. **Verify and prepare launch:** check mobile layouts, keyboard navigation, published routes, project links, contact actions, contribution values and failures, image loading, and page metadata.

The first release is ready when all requested sections are present, the Sidebar works on desktop and mobile, and the two project sections serve their separate purposes. Every displayed project, experience, and service claim must be accurate. Published articles and case studies must open directly by URL. Contact actions must work, contribution values must match the retrieved date range, and an API failure must leave the rest of the portfolio usable. Keyboard focus must be visible, reduced-motion preferences respected, and the production build successful. Allow horizontal scrolling only inside intentional components such as the contribution grid. Include page titles, descriptions, social sharing images, a favicon, and a correct heading hierarchy before publication.

## Sources and planning basis

- Updated user brief: React, Lucide, Motion, shadcn/ui, Neubrutalism / 1-bit monochrome, Sidebar Nav, Hero, Featured Projects, Projects, Tech Stack & Tools, Experience, About, Blog, GitHub Calendar, and Footer.
- Existing user-provided brand context: freelance web development, WordPress, SEO, Object Sans, and a preference for clean layouts with limited animation.
- [1] [React — Quick Start](https://react.dev/learn): component-based UI structure.
- [2] [Lucide — Getting started with React](https://lucide.dev/guide/react/getting-started): `lucide-react`, named imports, and tree shaking.
- [3] [Motion — React installation](https://motion.dev/docs/react-installation): the `motion` package and `motion/react` import path.
- [4] [Motion — Accessibility](https://motion.dev/docs/react-accessibility): reduced-motion configuration and hooks.
- [5] [shadcn/ui — Sidebar](https://ui.shadcn.com/docs/components/sidebar): Sidebar composition, collapsible behavior, and mobile Sheet handling.
- [6] [shadcn/ui — Theming](https://ui.shadcn.com/docs/theming): semantic CSS variables and component styling tokens.
- [7] [shadcn/ui — Vite installation](https://ui.shadcn.com/docs/installation/vite): React, TypeScript, Vite, and Tailwind setup.
- [8] [shadcn/ui — Card](https://ui.shadcn.com/docs/components/card): composition for content cards.
- [9] [GitHub — GraphQL user and contribution types](https://docs.github.com/en/graphql/reference/users): contribution collections, calendar dates, counts, and totals.
- [10] [GitHub — Forming GraphQL calls](https://docs.github.com/en/graphql/guides/forming-calls-with-graphql): authentication and query requests.

Official documentation checked on 30 September 2026. Page order, dimensions, and interaction timings above are proposed design decisions for this portfolio.
