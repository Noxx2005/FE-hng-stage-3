# Habit Tracker PWA

A progressive web app for tracking daily habits with offline support, built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: Signup and login with email/password
- **Habit Management**: Create, read, update, and delete habits
- **Streak Tracking**: Automatic streak calculation based on consecutive completed days
- **Daily Completions**: Mark habits as complete for any day
- **Offline Support**: Service worker enables offline functionality after initial load
- **Responsive Design**: Mobile-first design optimized for all screen sizes
- **Local Persistence**: All data stored in browser localStorage
- **Progressive Web App**: Installable on mobile devices as a native-like app

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

Build for production:

```bash
npm run build
npm start
```

## Project Structure

```
/src
  /types              - TypeScript type definitions
    - auth.ts        - User and Session types
    - habit.ts       - Habit type definition
  /lib                - Utility functions
    - auth.ts        - Authentication (signup, login, logout)
    - habit-storage.ts - Habit CRUD operations
    - slug.ts        - Convert habit names to URL slugs
    - validators.ts  - Input validation functions
    - streaks.ts     - Streak calculation logic
    - habits.ts      - Habit manipulation functions
  /components
    /auth            - Authentication components
      - LoginForm.tsx
      - SignupForm.tsx
    /habits          - Habit management components
      - HabitCard.tsx
      - HabitForm.tsx
    /shared          - Shared components
      - SplashScreen.tsx
/app
  /page.tsx          - Splash screen and routing
  /login             - Login page
  /signup            - Signup page
  /dashboard         - Main dashboard with habits
  /layout.tsx        - Root layout with PWA setup
/public
  - manifest.json    - PWA manifest
  - sw.js           - Service worker
  /icons            - App icons
/tests
  /unit             - Unit tests for utilities
  /integration      - Integration tests
  /e2e             - End-to-end tests with Playwright
```

## Data Structure

### LocalStorage Keys

**habit-tracker-users**
```typescript
[
  {
    id: string;
    email: string;
    password: string;
    createdAt: string;
  }
]
```

**habit-tracker-session**
```typescript
{
  userId: string;
  email: string;
} | null
```

**habit-tracker-habits**
```typescript
[
  {
    id: string;
    userId: string;
    name: string;
    description: string;
    frequency: 'daily';
    createdAt: string;
    completions: string[]; // YYYY-MM-DD dates
  }
]
```

## Running Tests

### Unit Tests with Coverage

```bash
npm run test:unit
```

Tests located in `/tests/unit`:
- `slug.test.ts` - Habit name slug conversion
- `validators.test.ts` - Input validation
- `streaks.test.ts` - Streak calculation
- `habits.test.ts` - Habit manipulation

### Integration Tests

```bash
npm run test:integration
```

Tests located in `/tests/integration`:
- `auth-flow.test.tsx` - Authentication flows
- `habit-form.test.tsx` - Habit creation, editing, deletion, and completion

### End-to-End Tests

```bash
npm run test:e2e
```

Tests located in `/tests/e2e`:
- `app.spec.ts` - Full user journeys including:
  - Splash screen and redirect logic
  - Signup and login flows
  - Dashboard access control
  - Habit CRUD operations
  - Streak updates
  - Offline functionality
  - Session persistence

### Run All Tests

```bash
npm test
```

## PWA Support

### Service Worker

The app includes a service worker (`public/sw.js`) that:
- Caches the app shell on first load
- Uses network-first strategy for dynamic content
- Falls back to cache when offline
- Automatically updates cache when files are fetched

### Installation

On supported browsers, users can install the app:
1. Look for the "Install" button in the address bar or menu
2. Or add to home screen on mobile devices
3. The app will run in standalone mode like a native app

### Manifest

The `public/manifest.json` file defines PWA metadata:
- App name and short name
- Icons for various sizes
- Start URL
- Display mode (standalone)
- Theme colors

## Routes

| Route | Description |
|-------|-------------|
| `/` | Splash screen - redirects to /login or /dashboard |
| `/signup` | User signup form |
| `/login` | User login form |
| `/dashboard` | Main app - requires authentication |

## Key Features & Trade-offs

### Offline-First Data Storage
- **Benefit**: Works completely offline after first load
- **Trade-off**: No cross-device sync - data only in browser localStorage

### localStorage for Persistence
- **Benefit**: Simple, no backend required, fast access
- **Trade-off**: ~5-10MB limit per domain, not secure for sensitive data, per-browser

### Client-Side Streak Calculation
- **Benefit**: Instant updates without network requests
- **Trade-off**: Assumes timezone consistency, no server-side validation

### Basic Password Storage
- **Benefit**: Simple, demo-friendly
- **Trade-off**: Not production-ready; would need hashing and secure backend in production

### Single Frequency (Daily)
- **Benefit**: Simplified UI and logic
- **Trade-off**: No weekly/monthly habit support

## Browser Support

- Chrome/Edge 51+
- Firefox 50+
- Safari 15.1+
- Mobile browsers with service worker support

## Security Notes

This is a demo app. For production use:
- Never store passwords in localStorage
- Use a proper backend with password hashing (bcrypt, etc.)
- Implement secure session management with HTTP-only cookies
- Add HTTPS enforcement
- Implement proper rate limiting on auth endpoints
- Add CSRF protection
- Validate all input server-side

## Development

### Adding New Features

1. Create utility functions in `/src/lib/`
2. Add unit tests in `/tests/unit/`
3. Create components in `/src/components/`
4. Add integration tests in `/tests/integration/`
5. Update pages in `/app/`
6. Add e2e tests for user flows

### Testing Checklist

- Write unit tests for all utility functions
- Write integration tests for component interactions
- Write e2e tests for critical user journeys
- Test offline functionality in DevTools

## Styling

The app uses Tailwind CSS with a simple blue and white color scheme:
- Primary: Blue (#2563eb)
- Background: Light blue (#eff2f5)
- Text: Dark gray/blue
- Accent: Green for completed habits
- Error: Red

Styles are kept simple and accessible with:
- Sufficient color contrast
- Clear focus states
- Semantic HTML
- Visible labels

## Performance

- Minimal dependencies
- Static PWA icons
- Efficient localStorage usage
- Service worker caching
- No external API calls
- Fast initial load

## Future Enhancements

- Cloud sync with backend service
- Dark mode support
- Multiple habit frequencies (weekly, monthly)
- Habit history charts
- Reminder notifications
- Data export/import
- Habit templates
- Social sharing
