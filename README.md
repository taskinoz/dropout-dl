<p align="center">
    <img src="./assets/icon.png" alt="Dropout DL Icon" width="128" />
</p>


# Dropout DL

A video downloader for [dropout.tv](https://dropout.tv)

## Download

Download the latest release from the [Releases page](https://github.com/taskinoz/dropout-dl/releases).

### macOS & Linux Permissions

After downloading, you may need to make the binary executable:

```sh
chmod +x dropout-dl-macos
# or
chmod +x dropout-dl-linux
```

## Dependencies
This tool requires [`ffmpeg`](https://ffmpeg.org/) and [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) to be installed and available in your system's PATH or in the executables directory.

## Usage

```sh
./dropout-dl [flags]
```

### Flags

| Flag | Description                                                        |
| ---- | ------------------------------------------------------------------ |
| `-v` | Video or show URL to download (required)                           |
| `-u` | Email/username for authentication (optional if using `login.json`) |
| `-p` | Password for authentication (optional if using `login.json`)       |
| `-d` | Enable debug mode to show extra information (e.g., yt-dlp output)  |

## Authentication

Create a `login.json` file in the same directory as the binary with your credentials:

```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Note:** Keep your credentials secure and never share your `login.json` file.

## How it works
The downloader launches a headless browser using Puppeteer to automate logging in to dropout.tv. After successful authentication, it exports the session cookies and passes them to `yt-dlp`, which downloads the video streams. `ffmpeg` is used by `yt-dlp` to combine the video segments into a single file.

## License

MIT
