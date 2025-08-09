import puppeteer from "puppeteer";

export async function getCookies(
  DROPOUT_EMAIL: string,
  DROPOUT_PASSWORD: string
): Promise<string> {
  if (!DROPOUT_EMAIL || !DROPOUT_PASSWORD) {
    throw new Error(
      "Set DROPOUT_EMAIL and DROPOUT_PASSWORD in your environment."
    );
  }


  const browser = await puppeteer.launch({
    // headless: false,              // set true later once stable
    args: ["--window-size=1280,1024"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });

  await page.goto("https://www.dropout.tv/login", {
    waitUntil: "domcontentloaded",
  });

  // Accept cookies
  await page.waitForSelector('button[aria-label="Accept All"]', {
    visible: true,
  });
  await page.click('button[aria-label="Accept All"]');

  // Email step
  await page.waitForSelector("#signin-email-input", { visible: true });
  await page.type("#signin-email-input", DROPOUT_EMAIL, { delay: 50 });

  await page.waitForSelector("#signin-email-submit:not([disabled])", {
    visible: true,
  });
  await page.click("#signin-email-submit", { delay: 50 });

  // Password step
  await page.waitForSelector("#signin-password-input", { visible: true });

  await page.type("#signin-password-input", DROPOUT_PASSWORD, { delay: 50 });

  await page.waitForSelector("#signin-password-submit:not([disabled])", {
    visible: true,
  });
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 30000 }),
    page.click("#signin-password-submit", { delay: 50 }),
  ]);

  // Optional: confirm you’re logged in (adjust selector to something only visible when signed in)
  await page
    .waitForSelector('[data-test-id="account-menu"]', { timeout: 10000 })
    .catch(() => {});

  // Dump cookies
  const cookies = await page.cookies();

  // Convert cookies to Netscape cookie file format for yt-dlp
  const netscapeCookies = [
    "# Netscape HTTP Cookie File",
    ...cookies.map((cookie) =>
      [
        cookie.domain.startsWith(".") ? cookie.domain : "." + cookie.domain,
        "TRUE",
        cookie.path,
        cookie.secure ? "TRUE" : "FALSE",
        Math.floor(cookie.expires || 0),
        cookie.name,
        cookie.value,
      ].join("\t")
    ),
  ].join("\n");

  await browser.close();

  return netscapeCookies;
}
