# MusicSeer

Forked from the Raycast **Genius Lyrics** extension: [raycast/extensions/tree/main/extensions/genius-lyrics](https://github.com/raycast/extensions/tree/main/extensions/genius-lyrics).

## 🎧 Current Playing Media Search

Automatically detect the song currently playing on macOS and open matching Genius lyrics without typing a query.

## 🎶 Menu Bar Now Playing

Show the current track and artist directly in the Raycast menu bar, with quick actions to open lyrics and track, artist, or album info.

## 🤖 AI Lyric Interpretation

Generate an AI interpretation for the lyrics you are viewing, grounded in the song text and formatted for quick reading.

## 🛠️ Interpretation Prompt Management

Create, edit, and select interpretation prompts to control how AI analysis is generated for each song.

MusicSeer also supports manual song-title search, search by remembered lyric lines, and opening source pages on Genius.com.

## Install `media-control` (macOS)

MusicSeer uses `media-control` to detect the currently playing (or recently paused) track.

Recommended (Homebrew):

```bash
brew install media-control
```

Verify installation:

```bash
media-control get
```

Alternative (advanced): build from source at [ungive/media-control](https://github.com/ungive/media-control).
