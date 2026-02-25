# MusicSeer

Forked from the Raycast **Genius Lyrics** extension: [raycast/extensions/tree/main/extensions/genius-lyrics](https://github.com/raycast/extensions/tree/main/extensions/genius-lyrics).

MusicSeer helps you find and work with song lyrics from Genius. You can search by title, search by remembered lyric lines, auto-search using the track currently playing on macOS, and open source pages on Genius.com. It also includes AI lyric interpretation with a prompt management interface so you can customize how interpretations are generated.

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
