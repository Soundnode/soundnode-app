# XUNIA SOUNDS + SoundCloudOpen Desktop Bridge

## Beginner version

This fork turns Soundnode into a desktop front end for the creator-owned SoundCloudOpen workflow.

**PLAY / BROWSE IN SOUNDNODE → OPEN XUNIA SOUNDS → DESCRIBE A SOUND → BUILD A VIRGINIA + BEATSTARS DISCOVERY MISSION → REVIEW THE BEAT/LiCENSE → OPTIONALLY SAVE SOUNDCLOUD MEDIA YOU OWN OR ARE ALLOWED TO SAVE**

The original Soundnode player remains intact. The new integration lives beside it.

## What each part does

| Part | Job |
|---|---|
| Soundnode | Desktop SoundCloud listening/browsing interface |
| XUNIA SOUNDS panel | Beginner desktop control surface |
| `integrations/soundcloudopenBridge.js` | Shell-safe bridge from Electron to the SoundCloudOpen CLI |
| `xunia-sounds` | Builds the VIRGINIA / 3LM CLAUDE / BeatStars discovery mission |
| `soundcloudopen` | Saves authorized SoundCloud tracks/playlists with the existing SoundCloudOpen rules |
| BeatStars MCP | Discovery tool provider used through Claude |

## Install the companion CLI

Soundnode does not embed Python. Install SoundCloudOpen 1.2+ on the same computer:

```bash
python3 -m pip install git+https://github.com/sonoxo/soundcloudopen.git
```

Then verify:

```bash
soundcloudopen --version
xunia-sounds --version
```

## Open the desktop panel

Start Soundnode, then use:

**XUNIA SOUNDS → Open XUNIA SOUNDS + SoundCloudOpen**

Keyboard shortcut:

```text
Cmd/Ctrl + Shift + X
```

The panel can:

1. check whether both SoundCloudOpen commands are available;
2. build a structured XUNIA SOUNDS mission;
3. build only the Claude/BeatStars natural-language prompt;
4. pass an optional authorized SoundCloud URL into the mission; and
5. run the existing SoundCloudOpen save command for authorized media.

## Security boundary

The Electron bridge never constructs a shell command string. It calls child processes with an executable plus an argument array and `shell: false`.

SoundCloudOpen remains responsible for its existing URL validation, dependency checks, browser-cookie selection, metadata handling, and yt-dlp/FFmpeg execution.

The desktop panel also validates SoundCloud hostnames before execution and asks for confirmation before starting a save.

## Verification

The integration has a dependency-free Node test lane:

```bash
npm run check:xunia
```

CI runs that verification on:

- Windows / Node 18 and 20
- macOS / Node 18 and 20
- Ubuntu / Node 18 and 20

This focused lane intentionally does not install the legacy Electron 8 / node-sass dependency tree just to verify the new bridge.
