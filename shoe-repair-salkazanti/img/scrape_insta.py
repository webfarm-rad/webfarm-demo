import asyncio
import os
import json
import time
from pathlib import Path
from playwright.async_api import async_playwright

IMG_DIR = Path(__file__).parent
PROFILE_URL = "https://www.instagram.com/salkazanti_a/"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            viewport={"width": 1440, "height": 900},
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        
        print("Opening Instagram profile...")
        await page.goto(PROFILE_URL, wait_until="networkidle", timeout=30000)
        await asyncio.sleep(3)
        
        # Close login popup if appears
        try:
            close_btn = page.locator("text=Not Now").first
            if await close_btn.is_visible(timeout=3000):
                await close_btn.click()
                print("Closed 'Not Now' popup")
                await asyncio.sleep(1)
        except:
            pass
        
        try:
            close_btn = page.locator('[aria-label="Close"]').first
            if await close_btn.is_visible(timeout=2000):
                await close_btn.click()
                print("Closed modal")
                await asyncio.sleep(1)
        except:
            pass
            
        # Try to dismiss cookie banner
        try:
            cookie_btn = page.locator("text=Allow all cookies").first
            if await cookie_btn.is_visible(timeout=2000):
                await cookie_btn.click()
                print("Accepted cookies")
                await asyncio.sleep(1)
        except:
            pass

        # Get profile info first
        try:
            bio_text = await page.locator("header section").inner_text()
            print(f"\n=== PROFILE INFO ===\n{bio_text}\n")
        except:
            print("Could not get profile info")

        # Scroll down to load more posts
        print("Scrolling to load posts...")
        
        post_links = set()
        for scroll_round in range(25):  # 25 rounds of scrolling
            # Collect all post links
            links = await page.locator('a[href*="/p/"]').all()
            for link in links:
                try:
                    href = await link.get_attribute("href")
                    if href and "/p/" in href:
                        post_links.add(href)
                except:
                    pass
            
            print(f"  Round {scroll_round+1}: found {len(post_links)} posts so far")
            
            # Scroll down
            await page.evaluate("window.scrollBy(0, 1500)")
            await asyncio.sleep(1.5)
            
            # Check if we hit the end
            if scroll_round > 5 and len(post_links) == prev_count:
                print("  No new posts loaded, stopping scroll")
                break
            prev_count = len(post_links)
        
        print(f"\nTotal posts found: {len(post_links)}")
        
        # Now visit each post and download media
        post_links = sorted(post_links)
        
        media_data = []
        downloaded = 0
        max_download = 60  # Download up to 60 items
        
        for i, post_url in enumerate(post_links[:max_download]):
            full_url = f"https://www.instagram.com{post_url}" if post_url.startswith("/") else post_url
            print(f"\n[{i+1}/{min(len(post_links), max_download)}] Opening {post_url}...")
            
            try:
                await page.goto(full_url, wait_until="networkidle", timeout=15000)
                await asyncio.sleep(2)
                
                # Close any popups
                try:
                    close_btn = page.locator("text=Not Now").first
                    if await close_btn.is_visible(timeout=1000):
                        await close_btn.click()
                        await asyncio.sleep(0.5)
                except:
                    pass
                
                post_info = {"url": full_url, "type": "unknown", "files": []}
                
                # Get post text/caption
                try:
                    # Try multiple selectors for caption
                    caption = ""
                    for sel in ['article h1', 'article span[dir="auto"]', 'div[data-testid="post-comment-root"] span']:
                        try:
                            el = page.locator(sel).first
                            if await el.is_visible(timeout=1000):
                                caption = await el.inner_text()
                                if len(caption) > 10:
                                    break
                        except:
                            continue
                    post_info["caption"] = caption[:200] if caption else ""
                except:
                    post_info["caption"] = ""
                
                # Check for video
                video_els = await page.locator("article video").all()
                if video_els:
                    post_info["type"] = "video"
                    for vid_el in video_els:
                        try:
                            src = await vid_el.get_attribute("src")
                            poster = await vid_el.get_attribute("poster")
                            if src:
                                post_info["video_src"] = src
                            if poster:
                                post_info["poster"] = poster
                        except:
                            pass
                    
                    # Download video poster as thumbnail
                    if post_info.get("poster"):
                        fname = f"post_{i+1:03d}_video_thumb.jpg"
                        try:
                            resp = await page.request.get(post_info["poster"])
                            if resp.ok:
                                body = await resp.body()
                                if len(body) > 5000:  # At least 5KB
                                    fpath = IMG_DIR / fname
                                    with open(fpath, "wb") as f:
                                        f.write(body)
                                    post_info["files"].append(fname)
                                    print(f"  Saved video thumbnail: {fname} ({len(body)//1024}KB)")
                                    downloaded += 1
                        except Exception as e:
                            print(f"  Error downloading poster: {e}")
                    
                    # Try to download the actual video
                    if post_info.get("video_src"):
                        vfname = f"post_{i+1:03d}_video.mp4"
                        try:
                            resp = await page.request.get(post_info["video_src"])
                            if resp.ok:
                                body = await resp.body()
                                if len(body) > 50000:  # At least 50KB
                                    fpath = IMG_DIR / vfname
                                    with open(fpath, "wb") as f:
                                        f.write(body)
                                    post_info["files"].append(vfname)
                                    print(f"  Saved video: {vfname} ({len(body)//1024}KB)")
                                    downloaded += 1
                        except Exception as e:
                            print(f"  Error downloading video: {e}")
                
                # Check for images
                img_els = await page.locator('article img[srcset], article img[sizes]').all()
                if not img_els:
                    img_els = await page.locator('article div[role="button"] img').all()
                
                if img_els:
                    if post_info["type"] == "unknown":
                        post_info["type"] = "image"
                    
                    for j, img_el in enumerate(img_els):
                        try:
                            srcset = await img_el.get_attribute("srcset")
                            src = await img_el.get_attribute("src")
                            alt = await img_el.get_attribute("alt") or ""
                            
                            # Skip profile pics and tiny images
                            if "profile" in alt.lower() or "аватар" in alt.lower():
                                continue
                            
                            # Get the highest resolution from srcset
                            best_url = src
                            if srcset:
                                parts = srcset.split(",")
                                best_w = 0
                                for part in parts:
                                    part = part.strip()
                                    tokens = part.split(" ")
                                    if len(tokens) >= 2:
                                        w = int(tokens[-1].replace("w", ""))
                                        if w > best_w:
                                            best_w = w
                                            best_url = tokens[0]
                            
                            if best_url:
                                fname = f"post_{i+1:03d}_img{j+1}.jpg"
                                resp = await page.request.get(best_url)
                                if resp.ok:
                                    body = await resp.body()
                                    if len(body) > 10000:  # At least 10KB
                                        fpath = IMG_DIR / fname
                                        with open(fpath, "wb") as f:
                                            f.write(body)
                                        post_info["files"].append(fname)
                                        post_info["alt"] = alt[:100]
                                        print(f"  Saved: {fname} ({len(body)//1024}KB) alt='{alt[:60]}'")
                                        downloaded += 1
                                    else:
                                        print(f"  Skipped tiny image ({len(body)} bytes)")
                        except Exception as e:
                            print(f"  Error with image {j}: {e}")
                
                # Check for carousel (multiple images)
                next_btn = page.locator('button[aria-label="Next"]').first
                carousel_page = 1
                while True:
                    try:
                        if not await next_btn.is_visible(timeout=500):
                            break
                        await next_btn.click()
                        await asyncio.sleep(1)
                        carousel_page += 1
                        
                        # Get new images after clicking next
                        new_imgs = await page.locator('article img[srcset], article img[sizes]').all()
                        for j, img_el in enumerate(new_imgs):
                            try:
                                srcset = await img_el.get_attribute("srcset")
                                src = await img_el.get_attribute("src")
                                alt = await img_el.get_attribute("alt") or ""
                                if "profile" in alt.lower():
                                    continue
                                
                                best_url = src
                                if srcset:
                                    parts = srcset.split(",")
                                    best_w = 0
                                    for part in parts:
                                        part = part.strip()
                                        tokens = part.split(" ")
                                        if len(tokens) >= 2:
                                            w = int(tokens[-1].replace("w", ""))
                                            if w > best_w:
                                                best_w = w
                                                best_url = tokens[0]
                                
                                fname = f"post_{i+1:03d}_img{carousel_page}_{j+1}.jpg"
                                # Check if already downloaded
                                if (IMG_DIR / fname).exists():
                                    continue
                                    
                                if best_url:
                                    resp = await page.request.get(best_url)
                                    if resp.ok:
                                        body = await resp.body()
                                        if len(body) > 10000:
                                            fpath = IMG_DIR / fname
                                            with open(fpath, "wb") as f:
                                                f.write(body)
                                            post_info["files"].append(fname)
                                            print(f"  Carousel p{carousel_page}: {fname} ({len(body)//1024}KB)")
                                            downloaded += 1
                            except:
                                pass
                        
                        if carousel_page > 10:  # Safety limit
                            break
                    except:
                        break
                
                media_data.append(post_info)
                
            except Exception as e:
                print(f"  Error: {e}")
                continue
        
        # Save metadata
        meta_path = IMG_DIR / "posts_metadata.json"
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(media_data, f, ensure_ascii=False, indent=2)
        
        print(f"\n{'='*60}")
        print(f"DONE! Downloaded {downloaded} files from {len(media_data)} posts")
        print(f"Metadata saved to: {meta_path}")
        
        # Summary
        videos = [p for p in media_data if p["type"] == "video"]
        images = [p for p in media_data if p["type"] == "image"]
        print(f"Videos: {len(videos)}, Images: {len(images)}")
        
        await browser.close()

prev_count = 0
asyncio.run(main())
