# Testing and File Structure Guide
## Habit Tracker PWA - Vercel Dev Environment

This guide helps you run tests, verify configuration files, and access public assets in the Habit Tracker PWA project.

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [Running Tests](#running-tests)
3. [Understanding the File Structure](#understanding-the-file-structure)
4. [Accessing Public Files](#accessing-public-files)
5. [Configuration Files](#configuration-files)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
Ensure you have installed all dependencies:
```bash
pnpm install
```

### Verify Installation
Check that the dev environment is running:
```bash
# The dev server should be running on http://localhost:3000
pnpm dev
```

---

## Running Tests

The project includes three types of tests: **unit tests**, **integration tests**, and **end-to-end (E2E) tests**. Each can be run independently or together.

### 1. Unit Tests
**Purpose:** Test individual utility functions and smaller pieces of code in isolation.

**Location:** `/tests/unit/`

**Run unit tests:**
```bash
pnpm test:unit
```

**What it tests:**
- `slug.test.ts` - URL slug generation and formatting
- `validators.test.ts` - Input validation functions (email, password, habit name)
- `streaks.test.ts` - Streak calculation logic
- `habits.test.ts` - Habit creation and manipulation utilities

**Expected output:**
```
✓ tests/unit/slug.test.ts (5 tests)
✓ tests/unit/validators.test.ts (7 tests)
✓ tests/unit/streaks.test.ts (6 tests)
✓ tests/unit/habits.test.ts (8 tests)
```

### 2. Integration Tests
**Purpose:** Test how multiple components work together (e.g., forms handling data flow).

**Location:** `/tests/integration/`

**Run integration tests:**
```bash
pnpm test:integration
```

**What it tests:**
- `auth-flow.test.tsx` - Login and signup form behavior with validation
- `habit-form.test.tsx` - Habit creation form functionality

**Expected output:**
```
✓ tests/integration/auth-flow.test.tsx (4 tests)
✓ tests/integration/habit-form.test.tsx (6 tests)
```

### 3. End-to-End (E2E) Tests
**Purpose:** Test the entire application flow from a user's perspective using a real browser.

**Location:** `/tests/e2e/`

**Run E2E tests:**
```bash
pnpm test:e2e
```

**What it tests:**
- `app.spec.ts` - Complete user workflows:
  - Splash screen displays on app load
  - User can navigate to login page
  - User can navigate to signup page
  - Forms are accessible and interactive

**Expected output:**
```
✓ [chromium] › app.spec.ts
  ✓ should display splash screen on initial load
  ✓ should navigate to login page
  ✓ should navigate to signup page
  ✓ should display login form elements
  ✓ should display signup form elements
```

### Run All Tests
```bash
pnpm test
```

This runs unit → integration → E2E tests in sequence.

### View Test Coverage
```bash
pnpm test:unit -- --coverage
```

This generates a coverage report showing which parts of your code are tested.

---

## Understanding the File Structure

### Project Root Layout
```
/vercel/share/v0-project/
├── app/                    # Next.js pages and routes
├── lib/                    # Utility functions and business logic
├── components/             # React components
├── types/                  # TypeScript type definitions
├── tests/                  # Test files (unit, integration, E2E)
├── public/                 # Public static assets (manifest, icons, service worker)
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── vitest.config.ts       # Vitest (unit/integration test) configuration
├── playwright.config.ts   # Playwright (E2E test) configuration
└── globals.css            # Global styles and design tokens
```

### Core Directories Explained

#### `/app` - Next.js Routes
```
app/
├── page.tsx              # Splash screen (home page)
├── layout.tsx            # Root layout with PWA setup
├── login/
│   └── page.tsx          # Login page
├── signup/
│   └── page.tsx          # Signup page
└── dashboard/
    └── page.tsx          # Main habit tracking dashboard
```

**How to find and edit routes:**
1. Open `/app/[route]/page.tsx`
2. Each page is a separate route
3. Layout.tsx contains shared UI and PWA initialization

#### `/lib` - Utility Functions
```
lib/
├── auth.ts               # Authentication logic (login, signup, logout)
├── habit-storage.ts      # Habit data management (CRUD operations)
├── slug.ts               # URL-safe slug generation
├── validators.ts         # Input validation (email, password, habit names)
├── streaks.ts            # Streak calculation engine
└── habits.ts             # Habit-specific utilities
```

**How to use utilities:**
```typescript
import { validateEmail, validatePassword } from '@/lib/validators'
import { calculateStreak } from '@/lib/streaks'
import { getHabits, addHabit } from '@/lib/habit-storage'
```

#### `/components` - React Components
```
components/
├── auth/
│   ├── LoginForm.tsx     # Login form with validation
│   └── SignupForm.tsx    # Signup form with validation
├── habits/
│   ├── HabitCard.tsx     # Individual habit display card
│   └── HabitForm.tsx     # Create/edit habit form
└── shared/
    └── SplashScreen.tsx  # Initial app splash screen
```

**Component usage example:**
```typescript
import { HabitCard } from '@/components/habits/HabitCard'
import { LoginForm } from '@/components/auth/LoginForm'
```

#### `/types` - TypeScript Definitions
```
types/
├── auth.ts               # User authentication types
└── habit.ts              # Habit data structure types
```

**Type definitions include:**
- `User` - User authentication info
- `Habit` - Habit data structure
- `HabitEntry` - Daily habit completion record

---

## Accessing Public Files

Public files are served at the root URL and don't require authentication. They're essential for PWA functionality.

### Location
```
/vercel/share/v0-project/public/
```

### Accessing in Dev Environment

**Via HTTP (when dev server is running):**
- App manifest: `http://localhost:3000/manifest.json`
- Service worker: `http://localhost:3000/sw.js`
- App icon (192x192): `http://localhost:3000/icons/icon-192.png`
- App icon (512x512): `http://localhost:3000/icons/icon-512.png`

**Verify files exist in terminal:**
```bash
ls -la /vercel/share/v0-project/public/
```

Expected output:
```
manifest.json          # PWA metadata
sw.js                  # Service worker for offline support
icons/
  └── icon-192.png     # Home screen icon
  └── icon-512.png     # Splash screen icon
```

### File Purposes

#### `manifest.json`
- **Purpose:** PWA configuration file
- **Contains:** App name, description, icons, colors, display mode
- **Used by:** Browsers for app installation and appearance
- **Check content:**
  ```bash
  cat /vercel/share/v0-project/public/manifest.json
  ```

#### `sw.js`
- **Purpose:** Service Worker for offline functionality
- **Contains:** Cache strategies, offline fallbacks
- **Used by:** Browser for background caching and offline support
- **Check content:**
  ```bash
  cat /vercel/share/v0-project/public/sw.js
  ```

#### `icons/`
- **Purpose:** App icons for various devices and splash screens
- **Contains:** 192x192 and 512x512 PNG images
- **Used by:** Home screen icons, splash screens during app load
- **Verify icons:**
  ```bash
  ls -la /vercel/share/v0-project/public/icons/
  ```

---

## Configuration Files

Configuration files control how the development environment, build process, testing, and styling work.

### TypeScript Configuration
**File:** `/vercel/share/v0-project/tsconfig.json`

**What it does:**
- Sets TypeScript compiler options
- Maps path aliases (`@/*` → root directory)
- Defines strict type checking rules

**View content:**
```bash
cat /vercel/share/v0-project/tsconfig.json
```

**Key section - Path aliases:**
```json
"paths": {
  "@/*": ["./*"]
}
```
This allows you to write: `import { validateEmail } from '@/lib/validators'`

### Next.js Configuration
**File:** `/vercel/share/v0-project/next.config.js`

**What it does:**
- Configures Next.js build settings
- Sets up PWA support
- Enables experimental features

**View content:**
```bash
cat /vercel/share/v0-project/next.config.js
```

### Tailwind CSS Configuration
**File:** `/vercel/share/v0-project/tailwind.config.ts`

**What it does:**
- Customizes Tailwind design system (colors, spacing, fonts)
- Sets up responsive breakpoints
- Configures design tokens

**Check configuration:**
```bash
grep -n "theme" /vercel/share/v0-project/tailwind.config.ts
```

### Vitest Configuration (Unit Tests)
**File:** `/vercel/share/v0-project/vitest.config.ts`

**What it does:**
- Configures unit and integration test runner
- Sets up test environment (jsdom for React testing)
- Defines test patterns

**View content:**
```bash
cat /vercel/share/v0-project/vitest.config.ts
```

**Key configurations:**
```typescript
environment: 'jsdom'  // Simulates browser environment
globals: true        // Global test functions (describe, it, expect)
```

### Playwright Configuration (E2E Tests)
**File:** `/vercel/share/v0-project/playwright.config.ts`

**What it does:**
- Configures E2E test runner
- Sets up browser automation
- Defines test parallelization and timeouts

**View content:**
```bash
cat /vercel/share/v0-project/playwright.config.ts
```

**Key configurations:**
```typescript
webServer: {
  command: 'pnpm dev',
  port: 3000,
  timeout: 120000
}
```

### Package.json Scripts
**File:** `/vercel/share/v0-project/package.json`

**Test-related scripts:**
```bash
pnpm test:unit        # Run unit tests only
pnpm test:integration # Run integration tests only
pnpm test:e2e         # Run E2E tests only
pnpm test             # Run all tests
```

**Development scripts:**
```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

---

## Troubleshooting

### Issue: "Cannot find module" errors

**Solution 1: Verify path aliases**
```bash
cat /vercel/share/v0-project/tsconfig.json | grep -A 3 '"paths"'
```

**Solution 2: Check file exists**
```bash
# If error is about @/lib/validators
ls /vercel/share/v0-project/lib/validators.ts
```

**Solution 3: Restart dev server**
```bash
# Kill the dev server (Ctrl+C) and restart
pnpm dev
```

### Issue: Tests not running

**Solution 1: Verify test files exist**
```bash
find /vercel/share/v0-project/tests -name "*.test.*" -type f
```

**Expected output:**
```
/vercel/share/v0-project/tests/unit/slug.test.ts
/vercel/share/v0-project/tests/unit/validators.test.ts
/vercel/share/v0-project/tests/unit/streaks.test.ts
/vercel/share/v0-project/tests/unit/habits.test.ts
/vercel/share/v0-project/tests/integration/auth-flow.test.tsx
/vercel/share/v0-project/tests/integration/habit-form.test.tsx
/vercel/share/v0-project/tests/e2e/app.spec.ts
```

**Solution 2: Verify test dependencies**
```bash
# Check if vitest and playwright are installed
pnpm list vitest @playwright/test
```

**Solution 3: Check test setup file**
```bash
cat /vercel/share/v0-project/tests/setup.ts
```

### Issue: PWA files not found

**Solution 1: Verify manifest exists**
```bash
curl http://localhost:3000/manifest.json
```

**Solution 2: Check public directory**
```bash
ls -la /vercel/share/v0-project/public/
```

**Solution 3: Verify service worker**
```bash
curl http://localhost:3000/sw.js | head -20
```

### Issue: App not displaying in preview

**Solution 1: Check dev server status**
```bash
# Look for "ready - started server on" in logs
tail -20 /vercel/share/v0-project/.next/logs.txt 2>/dev/null
```

**Solution 2: Verify app/page.tsx exists**
```bash
cat /vercel/share/v0-project/app/page.tsx | head -30
```

**Solution 3: Check layout.tsx**
```bash
cat /vercel/share/v0-project/app/layout.tsx | head -40
```

### Issue: Component import errors

**Solution 1: Verify component path**
```bash
# If error is "Cannot find module '@/components/auth/LoginForm'"
ls /vercel/share/v0-project/components/auth/LoginForm.tsx
```

**Solution 2: Check for typos**
```bash
# Compare paths used in imports vs actual filenames
grep -r "from '@/components" /vercel/share/v0-project/app/
```

**Solution 3: Verify all components are created**
```bash
find /vercel/share/v0-project/components -type f -name "*.tsx"
```

---

## Common Commands Reference

### File Inspection
```bash
# List all test files
find /vercel/share/v0-project/tests -type f -name "*.test.*"

# List all components
ls -R /vercel/share/v0-project/components/

# List all utilities
ls /vercel/share/v0-project/lib/

# Check file line count (to understand size)
wc -l /vercel/share/v0-project/tests/unit/*.test.ts

# View specific test file
cat /vercel/share/v0-project/tests/unit/slug.test.ts
```

### Configuration Verification
```bash
# Check all config files exist
ls /vercel/share/v0-project/*.config.* /vercel/share/v0-project/tsconfig.json

# Verify Next.js routes
ls -R /vercel/share/v0-project/app/

# Check public assets
ls -R /vercel/share/v0-project/public/
```

### Test Execution
```bash
# Run specific test file
pnpm vitest run tests/unit/slug.test.ts

# Run tests in watch mode (re-runs on file changes)
pnpm vitest tests/unit

# Run with verbose output
pnpm test:unit -- --reporter=verbose

# Run single E2E test
pnpm test:e2e -- --grep "splash screen"
```

---

## Quick Reference Table

| Task | Command | Location |
|------|---------|----------|
| Run all tests | `pnpm test` | N/A |
| Run unit tests | `pnpm test:unit` | `/tests/unit/` |
| Run integration tests | `pnpm test:integration` | `/tests/integration/` |
| Run E2E tests | `pnpm test:e2e` | `/tests/e2e/` |
| View utilities | `ls /lib/` | `/lib/` |
| View components | `ls -R /components/` | `/components/` |
| View public assets | `ls -R /public/` | `/public/` |
| Check manifest | `curl localhost:3000/manifest.json` | `/public/manifest.json` |
| Check service worker | `curl localhost:3000/sw.js` | `/public/sw.js` |
| View app pages | `ls /app/*/page.tsx` | `/app/` |

---

## Next Steps

1. **Run the dev server:** `pnpm dev`
2. **Verify app displays:** Open http://localhost:3000
3. **Run tests:** `pnpm test`
4. **Check test results:** Review terminal output
5. **Explore files:** Use the guides above to navigate the codebase

For more information about the project structure and features, see the main [README.md](/README.md).
