import asyncio
import sys
import json
import hashlib
from pathlib import Path
from playwright.async_api import async_playwright

sys.stdout.reconfigure(line_buffering=True)

IMG_DIR = Path(__file__).parent
PROFILE_URL = "https://www.instagram.com/salkazanti_a/"
DOWNLOAD_DIR = IMG_DIR / "downloaded"

def log(msg=""):
    print(msg, flush=True)

async def main():
    DOWNLOAD_DIR.mkdir(exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            viewport={"width": 1440, "height": 900},
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        )
        page = await context.new_page()

        log("=" * 60)
        log("  СКАЧИВАНИЕ ФОТО ИЗ INSTAGRAM")
        log("=" * 60)
        log("  Залогинься в открывшемся браузере.")
        log("=" * 60)

        await page.goto("https://www.instagram.com/accounts/login/", wait_until="domcontentloaded", timeout=60000)

        # Accept cookies
        try:
            cookie_btn = page.locator('button:has-text("Allow"), button:has-text("Разрешить"), button:has-text("Accept")')
            if await cookie_btn.first.is_visible(timeout=3000):
                await cookie_btn.first.click()
        except:
            pass

        # Wait for login (up to 3 min)
        logged_in = False
        for i in range(36):
            await asyncio.sleep(5)
            url = page.url
            if "login" not in url and "accounts" not in url and "challenge" not in url:
                log(f"  Залогинился! URL: {url[:50]}")
                logged_in = True
                break
            try:
                for sel in ['svg[aria-label="Главная"]', 'svg[aria-label="Home"]', 'a[href="/direct/inbox/"]']:
                    if await page.locator(sel).first.is_visible(timeout=300):
                        log("  Залогинился!")
                        logged_in = True
                        break
                if logged_in:
                    break
            except:
                pass
            log(f"  Жду логин... {(i+1)*5}с")

        if not logged_in:
            log("  Таймаут логина, пробую продолжить...")

        await asyncio.sleep(3)

        # Navigate to profile
        log(f"\n  Открываю профиль...")
        await page.goto(PROFILE_URL, wait_until="domcontentloaded", timeout=60000)
        await asyncio.sleep(4)

        # Dismiss notifications popup
        try:
            not_now = page.locator('button:has-text("Not Now"), button:has-text("Не сейчас")')
            if await not_now.first.is_visible(timeout=2000):
                await not_now.first.click()
        except:
            pass

        # Scroll to load posts
        log("  Прокручиваю ленту...")
        post_links = set()
        prev_count = 0
        stall = 0

        for r in range(100):
            links = await page.locator('a[href*="/p/"], a[href*="/reel/"]').all()
            for link in links:
                try:
                    href = await link.get_attribute("href")
                    if href and ("/p/" in href or "/reel/" in href):
                        if href.startswith("/"):
                            href = "https://www.instagram.com" + href
                        post_links.add(href)
                except:
                    pass

            if r % 5 == 0:
                log(f"  Раунд {r+1}: {len(post_links)} постов")

            await page.evaluate("window.scrollBy(0, 1500)")
            await asyncio.sleep(1.5)

            if len(post_links) == prev_count:
                stall += 1
                if stall > 8:
                    break
            else:
                stall = 0
            prev_count = len(post_links)

        photo_posts = sorted([u for u in post_links if "/p/" in u])
        reel_posts = sorted([u for u in post_links if "/reel/" in u])
        log(f"\n  Найдено: {len(photo_posts)} фото-постов, {len(reel_posts)} рилсов (пропускаю)")

        # Download tracking
        seen_hashes = set()
        all_data = []
        total_photos = 0

        async def download_img(url, filename):
            """Download image, skip duplicates by hash."""
            nonlocal total_photos
            try:
                resp = await page.request.get(url)
                if not resp.ok:
                    return False
                body = await resp.body()
                if len(body) < 10000:
                    return False
                h = hashlib.md5(body).hexdigest()
                if h in seen_hashes:
                    return False
                seen_hashes.add(h)
                with open(DOWNLOAD_DIR / filename, "wb") as f:
                    f.write(body)
                total_photos += 1
                return True
            except:
                return False

        async def get_post_images(page):
            """Get image URLs from current post page.

            Instagram 2026 DOM: post images are inside div._aagv,
            NO srcset, only src. Profile pics have different parent (SPAN/A).
            """
            urls = []
            seen = set()

            # Find all images inside ._aagv (post image containers)
            imgs = await page.locator("div._aagv img").all()
            if not imgs:
                # Fallback: try broader selector
                imgs = await page.locator("img.x5yr21d").all()

            for img in imgs:
                try:
                    alt = (await img.get_attribute("alt") or "").lower()
                    # Skip profile pictures
                    if "фото профиля" in alt or "profile" in alt.lower():
                        continue

                    src = await img.get_attribute("src") or ""
                    if not src or src in seen:
                        continue
                    # Skip tiny thumbnails (150x150)
                    if "s150x150" in src or "/s150x150/" in src:
                        continue
                    seen.add(src)
                    urls.append(src)
                except:
                    pass

            return urls

        async def scrape_post(page, post_idx):
            """Scrape all images from a post, including carousel slides."""
            all_urls = []
            seen_srcs = set()

            # Get initial images
            initial = await get_post_images(page)
            # Only take first 2 images max from initial load (rest are "suggested posts")
            for url in initial[:2]:
                if url not in seen_srcs:
                    seen_srcs.add(url)
                    all_urls.append(url)

            # Try carousel: click "Далее" to get more slides
            for slide in range(1, 20):
                clicked = False
                for sel in ['button[aria-label="Далее"]', 'button[aria-label="Next"]', 'button[aria-label="Go forward"]']:
                    try:
                        btn = page.locator(sel).first
                        if await btn.is_visible(timeout=600):
                            await btn.click()
                            clicked = True
                            break
                    except:
                        pass

                if not clicked:
                    break

                await asyncio.sleep(1.0)

                # Get new images after clicking
                new_imgs = await get_post_images(page)
                for url in new_imgs[:2]:
                    if url not in seen_srcs:
                        seen_srcs.add(url)
                        all_urls.append(url)

            return all_urls

        # Process posts
        for i, post_url in enumerate(photo_posts):
            shortcode = post_url.split("/p/")[1].rstrip("/") if "/p/" in post_url else "?"
            log(f"\n  [{i+1}/{len(photo_posts)}] {shortcode[:11]}")

            try:
                await page.goto(post_url, wait_until="domcontentloaded", timeout=20000)
                await asyncio.sleep(2.5)

                # Dismiss popups
                try:
                    for sel in ['svg[aria-label="Закрыть"]', 'svg[aria-label="Close"]']:
                        btn = page.locator(sel).first
                        if await btn.is_visible(timeout=300):
                            await btn.click()
                            await asyncio.sleep(0.3)
                            break
                except:
                    pass

                # Get caption
                caption = ""
                try:
                    for sel in ['h1', 'span[dir="auto"]']:
                        el = page.locator(sel).first
                        if await el.is_visible(timeout=600):
                            text = await el.inner_text()
                            if len(text) > 5 and "log in" not in text.lower() and "войти" not in text.lower():
                                caption = text[:500]
                                break
                except:
                    pass

                # Scrape images
                img_urls = await scrape_post(page, i)

                if not img_urls:
                    log(f"    — нет фото")
                    continue

                post_info = {
                    "url": post_url,
                    "shortcode": shortcode,
                    "index": i + 1,
                    "type": "carousel" if len(img_urls) > 1 else "image",
                    "files": [],
                    "caption": caption[:300]
                }

                for j, img_url in enumerate(img_urls):
                    fname = f"p_{i+1:03d}_{j+1}.jpg"
                    if await download_img(img_url, fname):
                        post_info["files"].append(fname)
                        log(f"    + {fname} ({len(img_urls)} total)")

                if post_info["files"]:
                    all_data.append(post_info)

                    # Save incrementally
                    with open(DOWNLOAD_DIR / "posts.json", "w", encoding="utf-8") as f:
                        json.dump(all_data, f, ensure_ascii=False, indent=2)

            except Exception as e:
                log(f"    ОШИБКА: {str(e)[:60]}")

            await asyncio.sleep(0.8)

        # Final save
        with open(DOWNLOAD_DIR / "posts.json", "w", encoding="utf-8") as f:
            json.dump(all_data, f, ensure_ascii=False, indent=2)

        log(f"\n{'='*60}")
        log(f"  ГОТОВО!")
        log(f"  Скачано фото: {total_photos}")
        log(f"  Постов с фото: {len(all_data)}")
        log(f"  Каруселей: {sum(1 for d in all_data if d['type'] == 'carousel')}")
        log(f"  Папка: {DOWNLOAD_DIR}")
        log(f"{'='*60}")

        await browser.close()

asyncio.run(main())
