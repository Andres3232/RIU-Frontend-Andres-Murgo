# RIU-Frontend-Andres-Murgo

A Single Page Application (SPA) built with Angular 19 for superhero management.
Allows you to list, filter, add, edit, and delete superheroes — all powered by Signals, Tailwind CSS, DaisyUI, lazy-loaded routes, and a clean modular architecture.

## What does this app do?

- Paginated list of superheroes with DaisyUI table
- Real-time search/filter by name (with debounce)
- Add, edit, and delete superheroes (with confirmation modal)
- Reactive forms with custom validations
- Custom directive for uppercase input on hero name
- Loading spinner overlay during create/update/delete operations
- All data is managed locally in-memory (no backend required)

## Main Technologies

- **Angular 19** (standalone components, signals, `viewChild`, `input`, `output`)
- **Tailwind CSS 4** + **DaisyUI 5** (utility-first styling, no Angular Material)
- **Signals** (reactive state management without RxJS stores)
- **RxJS** (observables for async operations, `takeUntilDestroyed` for cleanup)
- **Reactive Forms** (with custom validators)
- **Vitest** (unit tests)

## Project Structure

```
src/app/
├── shared/
│   ├── components/
│   │   ├── pagination/          # Pagination component + service
│   │   ├── modals/              # Reusable confirmation modal
│   │   └── form-error-label/    # Form validation error display
│   ├── directives/
│   │   └── uppercase.directive  # Transforms input to uppercase
│   ├── interceptors/
│   │   └── loading.interceptor  # HttpInterceptorFn for loading state
│   └── services/
│       └── loading.service      # Global loading state (signal-based)
├── super-hero/
│   ├── models/
│   │   └── super-hero.interface # SuperHero type definition
│   ├── services/
│   │   └── super-hero.service   # CRUD operations with simulated delay
│   ├── components/
│   │   └── hero-list/           # Hero table with edit/delete actions
│   └── pages/
│       ├── home-page/           # Main page: list + search + pagination
│       └── details-page/        # Create/Edit hero form
└── utils/
    └── form-utils              # Form validation helpers
```

## How to Run in Development

```bash
# Clone the repo
git clone https://github.com/Andres3232/RIU-Frontend-Andres-Murgo.git
cd RIU-Frontend-Andres-Murgo

# Install dependencies
npm install

# Start the development server
npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

## How to Run Tests

```bash
npm run test
```

## How to run with Docker

```bash
# Build the Docker image
docker build -t super-hero-app .
# Run the container
docker run -p 4200:80 super-hero-app
```

Then access the app at [http://localhost:4200](http://localhost:4200).



## Key Architectural Decisions

- Tailwind CSS + DaisyUI for a lightweight, customizable UI
- **Signals over BehaviorSubject** — Modern Angular reactivity (`signal`, `computed`, `effect`)
- **Functional HTTP Interceptor** — `HttpInterceptorFn` (Angular 19 style) for loading state
- **Standalone components** — No NgModules, tree-shakable by default
- **Lazy-loaded routes** — Pages loaded on demand for optimal bundle size
- **`takeUntilDestroyed`** — Automatic subscription cleanup without `ngOnDestroy`
- **In-memory data** — Service simulates async operations with `Observable` + `delay()`

## Notes

- All data is handled locally (in-memory signal array, no backend required).
- Write operations (create, update, delete) simulate latency with a 600ms delay to demonstrate the loading interceptor.
- This challenge focuses on Angular best practices, modular architecture, and clean code.

## Author

Andrés Murgo
