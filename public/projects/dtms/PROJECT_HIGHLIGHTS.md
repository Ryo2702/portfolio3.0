# DOCTRAMS — Project Highlights

DOCTRAMS (Document Tracking Management System) is a municipal workflow platform built for the Municipality of Bansud. It digitizes document submission, routing, review, approval, resubmission, and archival while keeping ownership, timing, and activity history visible to every participating office.

## Core capabilities

- Multi-step, department-based document workflows
- Role-aware access for administrators, department heads, and staff
- Reviewer queues with receive, approve, return, reassign, and resubmit actions
- Document attachments, required-document rules, and tracking numbers
- Processing-time monitoring with office hours, due dates, grace periods, and overdue states
- Dashboards and reports for workload, status, urgency, department demand, and reviewer activity
- Audit logs, notifications, password recovery, email verification, and account status controls
- PDF, Excel, and Word report generation with optional thermal receipt printing

## Technology stack

| Layer | Technologies |
| --- | --- |
| Backend | PHP 8.2+, Laravel 12, Eloquent ORM, Laravel session authentication |
| Frontend | Blade templates, Tailwind CSS v4, modular JavaScript |
| Build tooling | Vite 7, Laravel Vite Plugin, npm |
| Database | MySQL/MariaDB |
| Authorization | Spatie Laravel Permission, policies, middleware, request validation |
| Analytics | Chart.js |
| UI | Lucide icons and reusable Blade components |
| Documents and output | Dompdf, Laravel Excel, PHPWord, ESC/POS printer support |
| Testing and quality | PHPUnit, Mockery, Laravel Pint, Faker |

## Application components

| Component | Responsibility |
| --- | --- |
| `app/Actions` | Encapsulates transaction creation and reviewer actions such as approval, return, reassignment, receiving, and resubmission. |
| `app/Services` | Owns workflow orchestration, processing-time calculations, reporting, dashboard metrics, user management, notifications, and printing. |
| `app/Repositories` and `app/Queries` | Provides focused data access, review filters, sorting, and transaction retrieval. |
| `app/Http/Requests` | Validates transaction, workflow, review, department, and user input at the request boundary. |
| `app/Models` | Represents users, departments, workflows, workflow steps, transactions, reviewers, audit logs, notifications, and related records. |
| `app/DataTransferObjects` | Carries typed review filters, sorting options, statistics, reviewer details, and action results. |
| `app/Policies` and `app/Http/Middleware` | Enforces authorization, role checks, user status, activity tracking, and audit logging. |
| `app/Exports` and `app/Mail` | Produces operational reports and transaction/account email notifications. |
| `resources/views/components` | Reusable Blade UI for cards, tables, badges, filters, modals, sidebars, toasts, and transaction actions. |
| `resources/js` | Modular browser behavior for notifications, messages, dashboards, filters, workflow forms, review actions, and navigation. |
| `database/migrations` and `database/seeders` | Defines the relational schema and provides roles, departments, workflows, users, tags, and demo data. |

## Package highlights

### PHP / Composer

- `laravel/framework` — application framework, routing, validation, sessions, queues, mail, and Eloquent ORM.
- `spatie/laravel-permission` — role and permission management.
- `barryvdh/laravel-dompdf` — PDF report generation.
- `maatwebsite/excel` — Excel exports, including audit-log exports.
- `phpoffice/phpword` — Word document report generation.
- `mike42/escpos-php` — thermal receipt printing.
- `vinkla/hashids` — obfuscated identifiers in user-facing URLs.
- `mallardduck/blade-lucide-icons` — Blade integration for Lucide icons.
- `endroid/qr-code`, `simplesoftwareio/simple-qrcode`, and `khanamiryan/qrcode-detector-decoder` — installed QR-code generation and decoding support.

### JavaScript / npm

- `tailwindcss` and `@tailwindcss/vite` — utility-first styling and Vite integration.
- `vite` and `laravel-vite-plugin` — frontend asset bundling and Laravel integration.
- `chart.js` — dashboard visualizations and reporting charts.
- `axios` — HTTP requests for browser modules.
- `jquery` — DOM and interaction utilities used by existing frontend code.
- `lucide` — client-side icon rendering.

## Workflow overview

1. A user submits a document transaction with its type, urgency, department, and attachments.
2. The workflow engine routes it through configured department steps and reviewers.
3. Reviewers receive the transaction and can approve, return, reassign, or request resubmission.
4. Processing time, due dates, grace periods, status changes, and reviewer actions are recorded.
5. Dashboards, audit logs, notifications, and exports provide operational visibility and accountability.

## Portfolio summary

This project demonstrates full-stack Laravel development, business-process modeling, role-based authorization, reusable Blade UI, relational data design, workflow automation, reporting, operational integrations, and maintainable separation between controllers, actions, services, queries, and presentation components.

## Screenshots

- [Portfolio showcase](public/images/portfolio/portfolio-page.png)
- [Analytics dashboard](public/images/portfolio/dashboard.png)
- [Transaction tracking](public/images/portfolio/transactions.png)
- [Review queue](public/images/portfolio/workflow-review.png)
