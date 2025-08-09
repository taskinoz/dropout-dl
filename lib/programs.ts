import { $, file } from "bun";
import { error } from "./log";

const debug = process.argv.includes("-d");

export async function checkInstalledPrograms(): Promise<void> {
  const programs = ['yt-dlp', 'ffmpeg'];
  for (const program of programs) {
    // Check globally
    let isGlobal = false;
    try {
      if (debug) {
        isGlobal = (await $`which ${program}`).exitCode === 0;
      } else {
        isGlobal = (await $`which ${program}`.quiet()).exitCode === 0;
      }
    } catch (e) {
      isGlobal = false;
    }

    // Check locally
    const isInstalled = await file(`${program}.exe`).exists();
    
    if (!isInstalled && !isGlobal) {
      error(`${program} is not installed. Please install it globally or place it in the current directory.`);
    }
  }
}


