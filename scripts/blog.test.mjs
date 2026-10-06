import assert from "node:assert/strict";
import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";

const baseUrl = process.env.BLOG_CHECK_URL || "http://localhost:3100";
const slugs = (await readdir("content/posts"))
  .filter((file) => file.endsWith(".md"))
  .map((file) => path.basename(file, ".md"));

test("feed includes every article before JavaScript runs", async () => {
  const response = await fetch(`${baseUrl}/feed`);
  assert.equal(response.status, 200);
  const html = await response.text();
  for (const slug of slugs) {
    assert.ok(new RegExp(`<a[^>]+href="/posts/${slug}"`).test(html), `Missing server-rendered post: ${slug}`);
  }
});

for (const slug of slugs) {
  test(`post ${slug} previews animations, reserves image space and prioritizes loading`, async () => {
    const response = await fetch(`${baseUrl}/posts/${slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    const markdown = await readFile(`content/posts/${slug}.md`, "utf8");
    const fences = [...markdown.matchAll(/^```([^\s]*)[^\n]*\n[\s\S]*?^```/gm)];
    assert.equal((html.match(/class="code-block"/g) || []).length, fences.length, "Every fenced block should use the shared component");
    assert.equal((html.match(/title="Copy to clipboard"/g) || []).length, fences.length, "Every block should offer copying");
    for (const language of new Set(fences.map((fence) => fence[1] || "text"))) {
      assert.ok(html.includes(`data-language="${language}"`), `Missing highlighted language: ${language}`);
    }
    const images = html.match(/<img\b[^>]*>/g) || [];
    assert.ok(images.length > 0);
    assert.doesNotMatch(images[0], /loading="lazy"/);
    assert.match(images[0], /src="\/images\/[^"?]+\.(?:webp|gif)"/);
    for (const [index, image] of images.entries()) {
      assert.match(image, /width="[1-9]\d*"/);
      assert.match(image, /height="[1-9]\d*"/);
      if (index > 0) assert.match(image, /loading="lazy"/);
      const source = /\ssrc="([^"]+)"/.exec(image)?.[1]?.replaceAll("&amp;", "&");
      assert.ok(source);
      const url = new URL(source, baseUrl);
      const asset = url.pathname === "/_next/image"
        ? url.searchParams.get("url")
        : url.pathname;
      assert.ok(asset?.startsWith("/images/"));
      await access(path.join("public", decodeURIComponent(asset)));
      const metadata = await sharp(path.join("public", decodeURIComponent(asset))).metadata();
      if ((metadata.pages || 1) > 1) {
        const poster = /background-image:url\(&quot;data:image\/webp;base64,([A-Za-z0-9+/=]+)&quot;\)/.exec(image);
        assert.ok(poster, "Animations should show a first-frame preview before downloading");
        const preview = await sharp(Buffer.from(poster[1], "base64")).metadata();
        assert.equal(preview.pages || 1, 1);
        assert.ok(preview.width <= 320 && preview.height <= 320);
        assert.ok(Math.abs(preview.width / preview.height - metadata.width / metadata.height) < 0.01);
      }
    }
    const firstSource = /\ssrc="([^"]+)"/.exec(images[0])[1];
    const animation = await fetch(new URL(firstSource, baseUrl));
    assert.equal(animation.status, 200);
    assert.match(animation.headers.get("content-type"), /image\/(?:webp|gif)/);
    const data = Buffer.from(await animation.arrayBuffer());
    assert.ok((await sharp(data).metadata()).pages > 1, "Animation must retain its frames");
  });
}

test("unknown posts return 404 with a route back home", async () => {
  const response = await fetch(`${baseUrl}/posts/this-post-does-not-exist`);
  assert.equal(response.status, 404);
  assert.ok(/href="\/"/.test(await response.text()), "404 page should provide a route home");
});

test("native sitemap and robots include the published posts", async () => {
  const sitemap = await fetch(`${baseUrl}/sitemap.xml`);
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  for (const slug of slugs) assert.ok(xml.includes(`/posts/${slug}</loc>`));
  const robots = await fetch(`${baseUrl}/robots.txt`);
  assert.equal(robots.status, 200);
  assert.ok((await robots.text()).includes("/sitemap.xml"));
});
