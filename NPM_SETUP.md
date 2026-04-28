# NPM Setup Guide for Habit Tracker PWA

This project has been configured to work seamlessly with **npm** instead of pnpm. Follow these steps to get started locally.

## Quick Start (npm)

```bash
# 1. Clone the repository (if not already done)
git clone <your-repo-url>
cd habit-tracker-pwa

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open http://localhost:3000 in your browser
```

## Running Tests with npm

### Unit Tests
```bash
npm run test:unit
```
Tests the utility functions with coverage reporting.

### Integration Tests
```bash
npm run test:integration
```
Tests React components and form interactions.

### E2E Tests
```bash
npm run test:e2e
```
Tests complete user workflows with Playwright.

### Run All Tests
```bash
npm run test
```
Runs unit, integration, and e2E tests in sequence.

## Common npm Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install all dependencies |
| `npm install <package>` | Install a specific package |
| `npm install -D <package>` | Install as dev dependency |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint |

## File Structure

```
├── app/                    # Next.js routes
│   ├── page.tsx           # Splash screen
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── dashboard/         # Main dashboard
│   └── layout.tsx         # Root layout with PWA config
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication logic
│   ├── slug.ts           # Slug generation
│   ├── validators.ts     # Form validation
│   ├── streaks.ts        # Streak calculation
│   ├── habits.ts         # Habit utilities
│   └── habit-storage.ts  # LocalStorage management
├── components/           # React components
│   ├── auth/            # Login/Signup forms
│   ├── habits/          # Habit card and form
│   └── shared/          # Splash screen
├── types/               # TypeScript definitions
├── tests/               # Test files
│   ├── unit/           # Unit tests
│   ├── integration/    # Integration tests
│   └── e2e/           # End-to-end tests
├── public/             # Static assets
│   ├── manifest.json   # PWA configuration
│   ├── sw.js          # Service worker
│   └── icons/         # App icons
├── package.json        # Dependencies and scripts
└── .npmrc             # npm configuration
```

## Troubleshooting

### "Module not found" errors
If you see module errors after `npm install`:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Port already in use (localhost:3000)
```bash
# Run on a different port
npm run dev -- -p 3001
```

### Dependencies not installing correctly
```bash
# Force resolve dependencies
npm install --legacy-peer-deps
```

The `.npmrc` file in this project already includes the `legacy-peer-deps` flag to handle dependency conflicts gracefully.

### Tests failing after npm install
```bash
# Reinstall with clean slate
npm ci  # Uses package-lock.json for exact versions
```

## Configuration Files

- **package.json** - Dependencies and npm scripts
- **.npmrc** - npm configuration (legacy-peer-deps enabled)
- **tsconfig.json** - TypeScript configuration
- **next.config.js** - Next.js configuration
- **tailwind.config.ts** - Tailwind CSS configuration
- **vitest.config.ts** - Vitest configuration
- **playwright.config.ts** - Playwright E2E configuration

## Development Workflow

1. Start dev server: `npm run dev`
2. Make changes to files in `/app`, `/lib`, `/components`
3. Hot reload will apply changes automatically
4. Run tests: `npm run test` (or specific test command)
5. Build for production: `npm run build`
6. Deploy: `npm start`

## PWA Installation (Local)

The app is configured as a Progressive Web App (PWA):

1. Open the app in Chrome: http://localhost:3000
2. Click the install icon in the address bar (or menu)
3. Confirm installation
4. The app will work offline with cached assets via Service Worker

## Next Steps

- Review `TESTING_AND_FILES_GUIDE.md` for detailed testing instructions
- Check `README.md` for feature documentation
- Review the app structure in `/app` and `/components`
- Run tests to verify everything works: `npm run test`

---

**Ready to go!** Your Habit Tracker PWA is fully configured for npm. Happy developing! 🚀
