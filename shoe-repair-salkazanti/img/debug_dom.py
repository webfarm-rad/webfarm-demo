import asyncio
import sys
from playwright.async_api import async_playwright

sys.stdout.reconfigure(line_buffering=True)

POST_URL = "https://www.instagram.com/salkazanti_a/p/DUkmxm5japP/"
# This is the carousel post that was scraped before (post_004)

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            viewport={"width": 1440, "height": 900},
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        )
        page = await context.new_page()

        print("Открываю Instagram для логина...", flush=True)
        await page.goto("https://www.instagram.com/accounts/login/", wait_until="domcontentloaded", timeout=60000)

        # Wait for login
        for i in range(36):
            await asyncio.sleep(5)
            url = page.url
            print(f"  URL: {url[:60]}", flush=True)
            if "login" not in url and "accounts" not in url:
                print("  Залогинился!", flush=True)
                break
            try:
                el = page.locator('svg[aria-label="Главная"]').first
                if await el.is_visible(timeout=300):
                    print("  Залогинился!", flush=True)
                    break
            except:
                pass

        await asyncio.sleep(2)

        # Go to a specific post
        print(f"\nОткрываю пост: {POST_URL}", flush=True)
        await page.goto(POST_URL, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(4)

        # Dump ALL img elements on the page
        print("\n=== ВСЕ IMG ЭЛЕМЕНТЫ ===", flush=True)
        all_imgs = await page.locator("img").all()
        print(f"Всего img: {len(all_imgs)}", flush=True)

        for idx, img in enumerate(all_imgs):
            try:
                src = await img.get_attribute("src") or ""
                srcset = await img.get_attribute("srcset") or ""
                alt = await img.get_attribute("alt") or ""
                cls = await img.get_attribute("class") or ""
                w = await img.get_attribute("width") or ""
                h = await img.get_attribute("height") or ""
                visible = await img.is_visible()

                # Get parent info
                parent_tag = await img.evaluate("el => el.parentElement ? el.parentElement.tagName + '.' + (el.parentElement.className || '').substring(0,50) : 'none'")
                grandparent = await img.evaluate("el => el.parentElement && el.parentElement.parentElement ? el.parentElement.parentElement.tagName + '[' + (el.parentElement.parentElement.getAttribute('role') || '') + ']' : 'none'")

                print(f"\n--- img[{idx}] visible={visible} ---", flush=True)
                print(f"  class: {cls[:80]}", flush=True)
                print(f"  alt: {alt[:80]}", flush=True)
                print(f"  src: {src[:100]}...", flush=True)
                print(f"  srcset: {'YES' if srcset else 'NO'} ({len(srcset)} chars)", flush=True)
                print(f"  size: {w}x{h}", flush=True)
                print(f"  parent: {parent_tag}", flush=True)
                print(f"  grandparent: {grandparent}", flush=True)
            except Exception as e:
                print(f"  ERROR: {e}", flush=True)

        # Also check for any special containers
        print("\n=== ARTICLE/DIALOG/MAIN STRUCTURE ===", flush=True)
        for tag in ['article', 'div[role="dialog"]', 'div[role="presentation"]', 'main']:
            count = await page.locator(tag).count()
            print(f"  {tag}: {count} elements", flush=True)

        # Check for carousel buttons
        print("\n=== CAROUSEL BUTTONS ===", flush=True)
        buttons = await page.locator("button").all()
        for btn in buttons:
            try:
                label = await btn.get_attribute("aria-label") or ""
                if label:
                    visible = await btn.is_visible()
                    print(f"  button[aria-label='{label}'] visible={visible}", flush=True)
            except:
                pass

        print("\n\nГотово! Закрываю через 5 сек...", flush=True)
        await asyncio.sleep(5)
        await browser.close()

asyncio.run(main())
