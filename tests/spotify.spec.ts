import { test, expect } from '@playwright/test';

test.describe('AuraFy Spotify Clone - Desktop Viewport', () => {
  test.beforeEach(async ({ isMobile }) => {
    test.skip(isMobile, 'Desktop tests only');
  });

  test('Home page displays language preference bar, sidebar, and music shelves', async ({ page }) => {
    await page.goto('/');

    // Check Spotify & AuraFy Brand in Sidebar
    const brand = page.locator('[data-testid="sidebar-brand"]');
    await expect(brand).toBeVisible();
    await expect(brand).toContainText('Spotify');
    await expect(brand).toContainText('AuraFy');

    // Check Language Preference Bar on Home
    const langBar = page.locator('[data-testid="home-language-bar"]');
    await expect(langBar).toBeVisible();
    await expect(page.locator('[data-testid="home-lang-pill-hindi"]')).toBeVisible();
    await expect(page.locator('[data-testid="home-lang-pill-tamil"]')).toBeVisible();
    await expect(page.locator('[data-testid="home-lang-pill-punjabi"]')).toBeVisible();

    // Check Quick Access Grid
    await expect(page.locator('[data-testid="quick-access-grid"]')).toBeVisible();

    // Check Popular Artists section
    await expect(page.locator('[data-testid="popular-artists-section"]')).toBeVisible();

    // Take Desktop Home Screenshot
    await page.screenshot({ path: 'tests/screenshots/desktop-home.png', fullPage: false });
  });

  test('Desktop search bar is prominent, searches songs, and displays full 320kbps results', async ({ page }) => {
    await page.goto('/');

    // Navigate to Search view
    const searchNavBtn = page.locator('button:has-text("Search"), [data-testid="nav-search-button"]');
    await searchNavBtn.first().click();

    // Verify Prominent Search Bar exists and is visible
    const searchInput = page.locator('[data-testid="main-search-input"]');
    await expect(searchInput).toBeVisible();

    // Verify Language Filter Bar in Search View
    const langFilterBar = page.locator('[data-testid="language-filter-bar"]');
    await expect(langFilterBar).toBeVisible();

    // Type query "Kesariya" (Hindi)
    await searchInput.fill('Kesariya');

    // Wait for search results container to appear
    const resultsContainer = page.locator('[data-testid="search-results-container"]');
    await expect(resultsContainer).toBeVisible({ timeout: 10000 });

    // Verify Top Result Card
    const topResultCard = page.locator('[data-testid="top-result-card"]');
    await expect(topResultCard).toBeVisible();
    await expect(topResultCard).toContainText('Kesariya');

    // Click Top Result Play Button
    const topPlayBtn = page.locator('[data-testid="top-result-play-button"]');
    await topPlayBtn.click();

    // Verify Desktop Player Bar is active with track info
    const desktopPlayer = page.locator('[data-testid="desktop-player-bar"]');
    await expect(desktopPlayer).toBeVisible();
    await expect(desktopPlayer).toContainText('Kesariya');

    // Take Desktop Search Screenshot
    await page.screenshot({ path: 'tests/screenshots/desktop-search.png', fullPage: false });
  });

  test('Multi-language searches: Tamil, Punjabi, and English', async ({ page }) => {
    await page.goto('/');

    // Switch to search
    await page.locator('[data-testid="nav-search-button"]').click();
    const searchInput = page.locator('[data-testid="main-search-input"]');

    // 1. Tamil: Hukum
    await searchInput.fill('Hukum');
    await expect(page.locator('[data-testid="search-results-container"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="top-result-card"]')).toContainText('Hukum');

    // 2. Punjabi: Lover
    await searchInput.fill('Lover Diljit');
    await expect(page.locator('[data-testid="search-results-container"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="top-result-card"]')).toContainText('Lover');

    // 3. English: Blinding Lights
    await searchInput.fill('Blinding Lights The Weeknd');
    await expect(page.locator('[data-testid="search-results-container"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="top-result-card"]')).toContainText('Blinding Lights');
  });
});

test.describe('AuraFy Spotify Clone - Mobile Viewport (iPhone 14)', () => {
  test.beforeEach(async ({ isMobile }) => {
    test.skip(!isMobile, 'Mobile tests only');
  });

  test('Mobile: Bottom nav, prominent search bar, and language pills', async ({ page }) => {
    await page.goto('/');

    // Verify Mobile Bottom Nav is visible
    const bottomNavSearch = page.locator('[data-testid="bottom-nav-search"]');
    await expect(bottomNavSearch).toBeVisible();

    // Verify Home Search Trigger pill is visible on mobile
    const homeSearchTrigger = page.locator('[data-testid="home-search-trigger"]');
    await expect(homeSearchTrigger).toBeVisible();

    // Tap Search on Bottom Nav
    await bottomNavSearch.click();

    // Assert the Search Bar is PROMINENT at the very top of mobile viewport
    const mainSearchInput = page.locator('[data-testid="main-search-input"]');
    await expect(mainSearchInput).toBeVisible();

    // Verify search bar has placeholder
    await expect(mainSearchInput).toHaveAttribute('placeholder', /What do you want to play/);

    // Verify Language selector pills are present and horizontally scrollable
    const langBar = page.locator('[data-testid="language-filter-bar"]');
    await expect(langBar).toBeVisible();

    // Take Mobile Search Screenshot
    await page.screenshot({ path: 'tests/screenshots/mobile-search.png', fullPage: false });
  });

  test('Mobile: Playing a song displays floating mini player and opens full Now Playing modal', async ({ page }) => {
    await page.goto('/');

    // Tap Search on Bottom Nav
    await page.locator('[data-testid="bottom-nav-search"]').click();

    // Search for a song
    const searchInput = page.locator('[data-testid="main-search-input"]');
    await searchInput.fill('Kesariya');

    // Wait for results
    await expect(page.locator('[data-testid="search-results-container"]')).toBeVisible({ timeout: 10000 });

    // Tap the first song row
    const firstSong = page.locator('[data-testid="search-song-row-0"]');
    await expect(firstSong).toBeVisible();
    await firstSong.click();

    // Verify Floating Mini Player appears on mobile
    const miniPlayer = page.locator('[data-testid="mobile-mini-player"]');
    await expect(miniPlayer).toBeVisible();
    await expect(miniPlayer).toContainText('Kesariya');

    // Tap the Mini Player to open the full-screen Now Playing modal
    await miniPlayer.click();

    // Verify Now Playing Modal opens
    const fullModal = page.locator('[data-testid="mobile-now-playing-modal"]');
    await expect(fullModal).toBeVisible();
    await expect(fullModal).toContainText('Kesariya');

    // Take Mobile Now Playing Modal Screenshot
    await page.screenshot({ path: 'tests/screenshots/mobile-now-playing.png', fullPage: false });

    // Close the modal
    const closeBtn = page.locator('[data-testid="close-now-playing-modal"]');
    await closeBtn.click();
    await expect(fullModal).not.toBeVisible();
  });
});
