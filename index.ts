
import { $, write, file } from 'bun';
import { getCookies } from './lib/dropout';
import { getCredentials } from './lib/login';
import { checkInstalledPrograms } from './lib/programs';

// Check if yt-dlp is installed in path or in the directory
await checkInstalledPrograms();

const cookiePath = 'cookies.txt';

// Get video url from -v arg
const vIndex = process.argv.indexOf('-v');
const videoUrl = vIndex !== -1 ? process.argv[vIndex + 1] : undefined;

if (!videoUrl) {
  console.error('No video URL specified');
  process.exit(1);
}

// If cookies exist
if (await file(cookiePath).exists()) {
  console.log('Using existing cookies');
  await $`./yt-dlp.exe ${videoUrl} --cookies ${cookiePath}`;
  process.exit(0);
}

const { DROPOUT_EMAIL, DROPOUT_PASSWORD } = await getCredentials();

// For development purposes
// const { DROPOUT_EMAIL = "", DROPOUT_PASSWORD = "" } = Bun.env;

const cookies = await getCookies(DROPOUT_EMAIL, DROPOUT_PASSWORD);

await write(cookiePath, cookies);

await $`./yt-dlp.exe ${videoUrl} --cookies ${cookiePath}`;


// await $`yt-dlp ${url} --cookies ${cookiePath} --write-subs --embed-subs --sub-langs en --output "game-changer/season:7/%(title)s.%(ext)s"`.text();
