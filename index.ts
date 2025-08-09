import puppeteer from "puppeteer";
import { $, write } from 'bun';

// const { DROPOUT_EMAIL, DROPOUT_PASSWORD } = process.env;

const DROPOUT_EMAIL = process.env.DROPOUT_EMAIL || ""
const DROPOUT_PASSWORD = process.env.DROPOUT_PASSWORD || "";

if (!DROPOUT_EMAIL || !DROPOUT_PASSWORD) {
	throw new Error("Set DROPOUT_EMAIL and DROPOUT_PASSWORD in your environment.");
}

if (DROPOUT_EMAIL.length !== 20) {
	throw new Error("Invalid DROPOUT_EMAIL length.");
}

if (DROPOUT_PASSWORD.length < 16) {
	throw new Error("Invalid DROPOUT_PASSWORD length.");
}

const browser = await puppeteer.launch({
	// headless: false,              // set true later once stable
	args: ["--window-size=1280,1024"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 1024 });

await page.goto("https://www.dropout.tv/login", { waitUntil: "domcontentloaded" });

// Accept cookies
await page.waitForSelector('button[aria-label="Accept All"]', { visible: true });
await page.click('button[aria-label="Accept All"]');

// Email step
await page.waitForSelector("#signin-email-input", { visible: true });
await page.type("#signin-email-input", DROPOUT_EMAIL, { delay: 50 });

await page.waitForSelector("#signin-email-submit:not([disabled])", { visible: true });
await page.click("#signin-email-submit", { delay: 50 });

// Password step
await page.waitForSelector("#signin-password-input", { visible: true });

await page.type("#signin-password-input", DROPOUT_PASSWORD, { delay: 50 });

await page.waitForSelector("#signin-password-submit:not([disabled])", { visible: true });
await Promise.all([
	page.waitForNavigation({ waitUntil: "networkidle0", timeout: 30000 }),
	page.click("#signin-password-submit", { delay: 50 }),
]);

// Optional: confirm you’re logged in (adjust selector to something only visible when signed in)
await page.waitForSelector('[data-test-id="account-menu"]', { timeout: 10000 }).catch(() => { });

// Dump cookies
const cookies = await page.cookies();

// Convert cookies to Netscape cookie file format for yt-dlp
const netscapeCookies = [
	"# Netscape HTTP Cookie File",
	...cookies.map(cookie => [
		cookie.domain.startsWith('.') ? cookie.domain : '.' + cookie.domain,
		"TRUE",
		cookie.path,
		cookie.secure ? "TRUE" : "FALSE",
		Math.floor(cookie.expires || 0),
		cookie.name,
		cookie.value
	].join('\t'))
].join('\n');

await write("cookies.txt", netscapeCookies);

await browser.close();

await $`./yt-dlp.exe https://www.dropout.tv/game-changer/season:7/videos/behind-the-scenes-of-who-wants-to-be-jacob-wysocki --cookies cookies.txt`;


// await $`yt-dlp https://www.dropout.tv/game-changer/season:7/videos/behind-the-scenes-of-who-wants-to-be-jacob-wysocki --cookies cookies.json --write-subs --embed-subs --sub-langs en --output "game-changer/season:7/%(title)s.%(ext)s"`.text();
