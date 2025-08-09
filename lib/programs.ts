import { $, file } from "bun";
const path = require("path");

export async function checkInstalledPrograms(): Promise<void> {
  const programs = ['yt-dlp', 'ffmpeg'];
  for (const program of programs) {
    // Check globally
    let isGlobal = false;
    try {
      isGlobal = (await $`which ${program}`).exitCode === 0;
    } catch (e) {
      isGlobal = false;
    }

    // Check locally
    const isInstalled = await file(`${program}.exe`).exists();
    
    if (!isInstalled && !isGlobal) {
      console.error(`${program} is not installed`);
      throw new Error(`${program} is not installed. Please install it globally or place it in the current directory.`);
    }
  }
}


