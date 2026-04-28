# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Habit Tracker app >> logs in an existing user and loads only that user&apos;s habits
- Location: tests\e2e\app.spec.ts:50:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "/dashboard" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]: Login
      - generic [ref=e6]: Sign in to your account
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]:
          - generic [ref=e10]: Email
          - textbox "you@example.com" [ref=e11]: user1@example.com
        - generic [ref=e12]:
          - generic [ref=e13]: Password
          - textbox "••••••••" [ref=e14]: password123
        - generic [ref=e15]: Invalid email or password
        - button "Sign in" [active] [ref=e16]
      - generic [ref=e17]:
        - text: Don't have an account?
        - link "Sign up" [ref=e18] [cursor=pointer]:
          - /url: /signup
  - button "Open Next.js Dev Tools" [ref=e24] [cursor=pointer]:
    - img [ref=e25]
  - alert [ref=e28]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Habit Tracker app', () => {
  4   |   test.beforeEach(async ({ page, context }) => {
  5   |     // Clear localStorage before each test
  6   |     await context.addInitScript(() => {
  7   |       localStorage.clear();
  8   |     });
  9   |   });
  10  | 
  11  |   test('shows the splash screen and redirects unauthenticated users to /login', async ({
  12  |     page,
  13  |   }) => {
  14  |     await page.goto('/');
  15  |     await expect(page.getByTestId('splash-screen')).toBeVisible();
  16  |     await page.waitForURL('/login', { timeout: 5000 });
  17  |   });
  18  | 
  19  |   test('redirects authenticated users from / to /dashboard', async ({ page, context }) => {
  20  |     // Set up an authenticated session
  21  |     await context.addInitScript(() => {
  22  |       localStorage.setItem(
  23  |         'habit-tracker-session',
  24  |         JSON.stringify({ userId: 'test-user', email: 'test@example.com' })
  25  |       );
  26  |     });
  27  | 
  28  |     await page.goto('/');
  29  |     await page.waitForURL('/dashboard', { timeout: 5000 });
  30  |   });
  31  | 
  32  |   test('prevents unauthenticated access to /dashboard', async ({ page }) => {
  33  |     await page.goto('/dashboard');
  34  |     await page.waitForURL('/login', { timeout: 5000 });
  35  |   });
  36  | 
  37  |   test('signs up a new user and lands on the dashboard', async ({ page }) => {
  38  |     await page.goto('/signup');
  39  | 
  40  |     await page.getByTestId('auth-signup-email').fill('newuser@example.com');
  41  |     await page.getByTestId('auth-signup-password').fill('password123');
  42  |     await page.locator('input[type="password"]').nth(1).fill('password123');
  43  | 
  44  |     await page.getByTestId('auth-signup-submit').click();
  45  |     await page.waitForURL('/dashboard', { timeout: 5000 });
  46  | 
  47  |     await expect(page.getByTestId('dashboard-page')).toBeVisible();
  48  |   });
  49  | 
  50  |   test('logs in an existing user and loads only that user&apos;s habits', async ({
  51  |     page,
  52  |     context,
  53  |   }) => {
  54  |     // Setup: create a user through signup
  55  |     await page.goto('/signup');
  56  |     await page.getByTestId('auth-signup-email').fill('user1@example.com');
  57  |     await page.getByTestId('auth-signup-password').fill('password123');
  58  |     await page.locator('input[type="password"]').nth(1).fill('password123');
  59  |     await page.getByTestId('auth-signup-submit').click();
  60  |     await page.waitForURL('/dashboard');
  61  | 
  62  |     // Create a habit
  63  |     await page.getByTestId('create-habit-button').click();
  64  |     await page.getByTestId('habit-name-input').fill('User1 Habit');
  65  |     await page.getByTestId('habit-save-button').click();
  66  | 
  67  |     // Logout
  68  |     await page.getByTestId('auth-logout-button').click();
  69  |     await page.waitForURL('/login');
  70  | 
  71  |     // Login with same user
  72  |     await page.getByTestId('auth-login-email').fill('user1@example.com');
  73  |     await page.getByTestId('auth-login-password').fill('password123');
  74  |     await page.getByTestId('auth-login-submit').click();
> 75  |     await page.waitForURL('/dashboard');
      |                ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  76  | 
  77  |     // Should see the habit
  78  |     await expect(page.locator('text=User1 Habit')).toBeVisible();
  79  |   });
  80  | 
  81  |   test('creates a habit from the dashboard', async ({ page }) => {
  82  |     await page.goto('/signup');
  83  |     await page.getByTestId('auth-signup-email').fill('habituser@example.com');
  84  |     await page.getByTestId('auth-signup-password').fill('password123');
  85  |     await page.locator('input[type="password"]').nth(1).fill('password123');
  86  |     await page.getByTestId('auth-signup-submit').click();
  87  |     await page.waitForURL('/dashboard');
  88  | 
  89  |     await page.getByTestId('create-habit-button').click();
  90  |     await page.getByTestId('habit-name-input').fill('Morning Exercise');
  91  |     await page.getByTestId('habit-description-input').fill('30 minutes of exercise');
  92  |     await page.getByTestId('habit-save-button').click();
  93  | 
  94  |     await expect(page.locator('text=Morning Exercise')).toBeVisible();
  95  |   });
  96  | 
  97  |   test('completes a habit for today and updates the streak', async ({ page }) => {
  98  |     await page.goto('/signup');
  99  |     await page.getByTestId('auth-signup-email').fill('streakuser@example.com');
  100 |     await page.getByTestId('auth-signup-password').fill('password123');
  101 |     await page.locator('input[type="password"]').nth(1).fill('password123');
  102 |     await page.getByTestId('auth-signup-submit').click();
  103 |     await page.waitForURL('/dashboard');
  104 | 
  105 |     await page.getByTestId('create-habit-button').click();
  106 |     await page.getByTestId('habit-name-input').fill('Daily Reading');
  107 |     await page.getByTestId('habit-save-button').click();
  108 | 
  109 |     const slug = 'daily-reading';
  110 |     await page.getByTestId(`habit-complete-${slug}`).click();
  111 | 
  112 |     await expect(page.getByTestId(`habit-streak-${slug}`)).toContainText('1 days');
  113 |   });
  114 | 
  115 |   test('persists session and habits after page reload', async ({ page, context }) => {
  116 |     await page.goto('/signup');
  117 |     await page.getByTestId('auth-signup-email').fill('persistuser@example.com');
  118 |     await page.getByTestId('auth-signup-password').fill('password123');
  119 |     await page.locator('input[type="password"]').nth(1).fill('password123');
  120 |     await page.getByTestId('auth-signup-submit').click();
  121 |     await page.waitForURL('/dashboard');
  122 | 
  123 |     await page.getByTestId('create-habit-button').click();
  124 |     await page.getByTestId('habit-name-input').fill('Persistent Habit');
  125 |     await page.getByTestId('habit-save-button').click();
  126 | 
  127 |     // Wait for habit to be saved and rendered
  128 |     await expect(page.locator('text=Persistent Habit')).toBeVisible();
  129 |     await page.waitForTimeout(1000);
  130 | 
  131 |     await page.reload();
  132 |     await page.waitForURL('/dashboard', { timeout: 5000 });
  133 |     await page.waitForTimeout(1000);
  134 | 
  135 |     await expect(page.locator('text=Persistent Habit')).toBeVisible();
  136 |   });
  137 | 
  138 |   test('logs out and redirects to /login', async ({ page }) => {
  139 |     await page.goto('/signup');
  140 |     await page.getByTestId('auth-signup-email').fill('logoutuser@example.com');
  141 |     await page.getByTestId('auth-signup-password').fill('password123');
  142 |     await page.locator('input[type="password"]').nth(1).fill('password123');
  143 |     await page.getByTestId('auth-signup-submit').click();
  144 |     await page.waitForURL('/dashboard');
  145 | 
  146 |     await page.getByTestId('auth-logout-button').click();
  147 |     await page.waitForURL('/login');
  148 | 
  149 |     await expect(page.getByTestId('auth-login-email')).toBeVisible();
  150 |   });
  151 | 
  152 |   test('loads the cached app shell when offline after the app has been loaded once', async ({
  153 |     page,
  154 |   }) => {
  155 |     // First load to cache
  156 |     await page.goto('/signup');
  157 |     await page.getByTestId('auth-signup-email').fill('offlineuser@example.com');
  158 |     await page.getByTestId('auth-signup-password').fill('password123');
  159 |     await page.locator('input[type="password"]').nth(1).fill('password123');
  160 |     await page.getByTestId('auth-signup-submit').click();
  161 |     await page.waitForURL('/dashboard');
  162 | 
  163 |     // Wait for service worker to cache the page
  164 |     await page.waitForTimeout(2000);
  165 | 
  166 |     // Go offline and reload
  167 |     await page.context().setOffline(true);
  168 |     await page.reload();
  169 | 
  170 |     // Should still show cached content (dashboard or splash screen)
  171 |     const dashboardVisible = await page.getByTestId('dashboard-page').isVisible().catch(() => false);
  172 |     const splashVisible = await page.getByTestId('splash-screen').isVisible().catch(() => false);
  173 | 
  174 |     expect(dashboardVisible || splashVisible).toBe(true);
  175 | 
```