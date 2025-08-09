import { $, write, file } from "bun";
import { getCookies } from "./lib/dropout";
import { getCredentials } from "./lib/login";
import { checkInstalledPrograms } from "./lib/programs";
import { error, log } from "./lib/log";
import { formatName } from "./lib/name";

// Enable debug messages with -d
const debug = process.argv.includes("-d");

// Check if yt-dlp is installed in path or in the directory
await checkInstalledPrograms();

const cookiePath = "cookies.txt";

// Get video url from -v arg
const vIndex = process.argv.indexOf("-v");
const videoUrl = vIndex !== -1 ? process.argv[vIndex + 1] : undefined;

if (!videoUrl) {
  error("No video URL specified");
}

// If cookies exist
if (await file(cookiePath).exists()) {
  log(
    `Downloading video "${formatName(
      videoUrl?.substring(videoUrl.lastIndexOf("/") + 1) || ""
    )}" from Dropout...`
  );
  if (debug) {
    await $`./yt-dlp.exe ${videoUrl} --cookies ${cookiePath}`;
  } else {
    await $`./yt-dlp.exe ${videoUrl} --cookies ${cookiePath}`.quiet();
  }
  log("Download complete.");
  process.exit(0);
}

const { DROPOUT_EMAIL, DROPOUT_PASSWORD } = await getCredentials();

// For development purposes
// const { DROPOUT_EMAIL = "", DROPOUT_PASSWORD = "" } = Bun.env;

const cookies = await getCookies(DROPOUT_EMAIL, DROPOUT_PASSWORD);

await write(cookiePath, cookies);
log(`Saving cookies...`);
if (debug) {
  await $`./yt-dlp.exe ${videoUrl} --cookies ${cookiePath}`;
} else {
  await $`./yt-dlp.exe ${videoUrl} --cookies ${cookiePath}`.quiet();
}
log("Download complete.");

// await $`yt-dlp ${url} --cookies ${cookiePath} --write-subs --embed-subs --sub-langs en --output "game-changer/season:7/%(title)s.%(ext)s"`.text();
