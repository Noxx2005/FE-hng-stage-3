import { test, expect } from '@playwright/test';

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear localStorage before each test
    await context.addInitScript(() => {
      localStorage.clear();
    });
  });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await page.waitForURL('/login', { timeout: 5000 });
  });

  test('redirects authenticated users from / to /dashboard', async ({ page, context }) => {
    // Set up an authenticated session
    await context.addInitScript(() => {
      localStorage.setItem(
        'habit-tracker-session',
        JSON.stringify({ userId: 'test-user', email: 'test@example.com' })
      );
    });

    await page.goto('/');
    await page.waitForURL('/dashboard', { timeout: 5000 });
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('/login', { timeout: 5000 });
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');

    await page.getByTestId('auth-signup-email').fill('newuser@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.locator('input[type="password"]').nth(1).fill('password123');

    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('/dashboard', { timeout: 5000 });

    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('logs in an existing user and loads only that user&apos;s habits', async ({
    page,
    context,
  }) => {
    // Setup: create a user through signup
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('user1@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.locator('input[type="password"]').nth(1).fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('/dashboard');

    // Create a habit
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('User1 Habit');
    await page.getByTestId('habit-save-button').click();

    // Logout
    await page.getByTestId('auth-logout-button').click();
    await page.waitForURL('/login');

    // Login with same user
    await page.getByTestId('auth-login-email').fill('user1@example.com');
    await page.getByTestId('auth-login-password').fill('password123');
    await page.getByTestId('auth-login-submit').click();
    await page.waitForURL('/dashboard');

    // Should see the habit
    await expect(page.locator('text=User1 Habit')).toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('habituser@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.locator('input[type="password"]').nth(1).fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('/dashboard');

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Morning Exercise');
    await page.getByTestId('habit-description-input').fill('30 minutes of exercise');
    await page.getByTestId('habit-save-button').click();

    await expect(page.locator('text=Morning Exercise')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('streakuser@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.locator('input[type="password"]').nth(1).fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('/dashboard');

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Daily Reading');
    await page.getByTestId('habit-save-button').click();

    const slug = 'daily-reading';
    await page.getByTestId(`habit-complete-${slug}`).click();

    await expect(page.getByTestId(`habit-streak-${slug}`)).toContainText('1 days');
  });

  test('persists session and habits after page reload', async ({ page, context }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('persistuser@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.locator('input[type="password"]').nth(1).fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('/dashboard');

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Persistent Habit');
    await page.getByTestId('habit-save-button').click();

    // Wait for habit to be saved and rendered
    await expect(page.locator('text=Persistent Habit')).toBeVisible();
    await page.waitForTimeout(1000);

    await page.reload();
    await page.waitForURL('/dashboard', { timeout: 5000 });
    await page.waitForTimeout(1000);

    await expect(page.locator('text=Persistent Habit')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('logoutuser@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.locator('input[type="password"]').nth(1).fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('/dashboard');

    await page.getByTestId('auth-logout-button').click();
    await page.waitForURL('/login');

    await expect(page.getByTestId('auth-login-email')).toBeVisible();
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({
    page,
  }) => {
    // First load to cache
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('offlineuser@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.locator('input[type="password"]').nth(1).fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('/dashboard');

    // Wait for service worker to cache the page
    await page.waitForTimeout(2000);

    // Go offline and reload
    await page.context().setOffline(true);
    await page.reload();

    // Should still show cached content (dashboard or splash screen)
    const dashboardVisible = await page.getByTestId('dashboard-page').isVisible().catch(() => false);
    const splashVisible = await page.getByTestId('splash-screen').isVisible().catch(() => false);

    expect(dashboardVisible || splashVisible).toBe(true);

    // Go back online
    await page.context().setOffline(false);
  });
});
