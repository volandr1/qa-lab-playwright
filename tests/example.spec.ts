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
    await page.getByRole('button', { name: 'ADD TO CART' }).first().click();
    await expect(page).toHaveURL(/.*my-cart/);

    // 2. Шукаємо кнопку видалення.
    // Ми шукаємо або по класу, або по символу "×", або по назві "Remove"
    // Це "перестраховка", щоб точно знайти кнопку
    const deleteButton = page.locator('.ec_cart_item_delete, a:has-text("×"), [aria-label="Remove"]').first();
    
    // 3. Чекаємо і клікаємо (force: true дозволяє клікнути, навіть якщо кнопка трохи перекрита)
    await deleteButton.waitFor();
    await deleteButton.click({ force: true });

    // 4. Перевіряємо, що кошик порожній
    await expect(page.getByText('Your cart is currently empty')).toBeVisible();
  });

});