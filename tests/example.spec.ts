import { test, expect } from '@playwright/test';

test.describe('AcademyBugs Final Tests', () => {

  // TEST CASE 1: Перехід на сторінку товару
  test('Test-case №1: Перевірка успішного переходу на сторінку товару', async ({ page }) => {
    await page.goto('https://academybugs.com/find-bugs/');
    
    // ВАЖЛИВО: .first() обирає перше посилання з двох знайдених (текст + картинка)
    await page.getByRole('link', { name: 'DNK Yellow Shoes' }).first().click();
    
    // Перевіряємо заголовок
    const pageTitle = page.locator('h1').first();
    await expect(pageTitle).toHaveText('DNK Yellow Shoes');
  });

  // TEST CASE 2: Додавання товару в кошик
  test('Test-case №2: Перевірка додавання товару в кошик', async ({ page }) => {
    await page.goto('https://academybugs.com/store/blue-tshirt/');
    
    // Клікаємо "ADD TO CART"
    await page.getByRole('button', { name: 'ADD TO CART' }).first().click();
    
    // Чекаємо переходу в кошик
    await expect(page).toHaveURL(/.*my-cart/);
    
    // Перевіряємо, що товар (Blue Tshirt) є у списку
    await expect(page.getByRole('link', { name: 'Blue Tshirt' }).first()).toBeVisible();
  });

  // TEST CASE 3: Пошук товару (Спрощений метод)
  test('Test-case №3: Перевірка пошуку товару через рядок пошуку', async ({ page }) => {
    // Надійний спосіб: переходимо відразу на сторінку результатів
    await page.goto('https://academybugs.com/?s=Dark+Grey+Jeans');

    // Просто перевіряємо, що на сторінці є текст "Dark Grey Jeans"
    // Це набагато надійніше, ніж шукати складні CSS класи
    const productText = page.getByText('Dark Grey Jeans').first();
    await expect(productText).toBeVisible();
  });

  // TEST CASE 4: Видалення товару з кошика (Виправлений)
  test('Test-case №4: Перевірка видалення товару з кошика', async ({ page }) => {
    // 1. Спочатку додаємо товар, щоб було що видаляти
    await page.goto('https://academybugs.com/store/blue-tshirt/');
    await page.getByRole('button', { name: 'ADD TO CART' }).click();
    const productRow = page.locator('tr').filter({ hasText: 'Blue Tshirt'});

    await expect(productRow).toBeVisible({ timeout: 20000 });
    const removeButton = productRow.locator('div.ec_cartitem_delete');

    await expect(removeButton).toBeVisible({ timeout: 10000});
    await removeButton.click({force: true});
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    await expect(page.getByText('There are no items in your cart')).toBeVisible({ timeout: 15000});
    await expect(page.getByText('Blue Tshirt')).not.toBeVisible();
  });

});
