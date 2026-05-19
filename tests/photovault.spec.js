const { test, expect } = require('@playwright/test');
const path = require('path');

const IMAGE = path.resolve(__dirname, 'fixtures/red.png');

test.beforeEach(async ({ page }) => {
  await page.goto('/photovault/index.html');
});

test('gallery is empty on load', async ({ page }) => {
  await expect(page.locator('.photo-card')).toHaveCount(0);
  await expect(page.locator('#count')).toHaveText('0 photos');
});

test('uploading 1 image shows 2 cards', async ({ page }) => {
  await page.locator('#fileInput').setInputFiles(IMAGE);
  await expect(page.locator('.photo-card')).toHaveCount(2);
});

test('uploading 3 images shows 6 cards', async ({ page }) => {
  await page.locator('#fileInput').setInputFiles([IMAGE, IMAGE, IMAGE]);
  await expect(page.locator('.photo-card')).toHaveCount(6);
});

test('count label reflects doubled photo count', async ({ page }) => {
  await page.locator('#fileInput').setInputFiles(IMAGE);
  await expect(page.locator('#count')).toHaveText('2 photos');
});

test('deleting a card removes only that card', async ({ page }) => {
  await page.locator('#fileInput').setInputFiles(IMAGE);
  await expect(page.locator('.photo-card')).toHaveCount(2);
  await page.locator('.photo-card').first().hover();
  await page.locator('.photo-card').first().locator('.delete-btn').click();
  await expect(page.locator('.photo-card')).toHaveCount(1);
  await expect(page.locator('#count')).toHaveText('1 photo');
});

test('lightbox opens when clicking a card image', async ({ page }) => {
  await page.locator('#fileInput').setInputFiles(IMAGE);
  await page.locator('.photo-card img').first().click();
  await expect(page.locator('#lightbox')).toHaveClass(/open/);
});

test('lightbox closes with Escape key', async ({ page }) => {
  await page.locator('#fileInput').setInputFiles(IMAGE);
  await page.locator('.photo-card img').first().click();
  await expect(page.locator('#lightbox')).toHaveClass(/open/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#lightbox')).not.toHaveClass(/open/);
});

test('lightbox closes with close button', async ({ page }) => {
  await page.locator('#fileInput').setInputFiles(IMAGE);
  await page.locator('.photo-card img').first().click();
  await page.locator('#close').click();
  await expect(page.locator('#lightbox')).not.toHaveClass(/open/);
});

test('lightbox next/prev navigation wraps around', async ({ page }) => {
  await page.locator('#fileInput').setInputFiles(IMAGE);
  await page.locator('.photo-card img').first().click();
  await expect(page.locator('#lightboxInfo')).toContainText('1 / 2');
  await page.locator('#next').click();
  await expect(page.locator('#lightboxInfo')).toContainText('2 / 2');
  await page.locator('#next').click();
  await expect(page.locator('#lightboxInfo')).toContainText('1 / 2');
  await page.locator('#prev').click();
  await expect(page.locator('#lightboxInfo')).toContainText('2 / 2');
});

test('lightbox arrow key navigation', async ({ page }) => {
  await page.locator('#fileInput').setInputFiles(IMAGE);
  await page.locator('.photo-card img').first().click();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#lightboxInfo')).toContainText('2 / 2');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#lightboxInfo')).toContainText('1 / 2');
});
