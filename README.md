# StoryFlow + AI Director (local-first beta)

The existing StoryFlow filmmaking workspace, now with a 10-shot AI Director.

## Local-first project saving

StoryFlow automatically writes notes, scripts, storyboards, projects, nested boards and AI Director plans into this browser's local storage on edits. It restores this work on reload. **This is not Google Cloud sync.** Use **Local Backups** to download JSON and import it in another browser. Clearing browser data, private mode, storage quotas, or losing your device can delete local work. Download regular backups.

## Run locally

Requires Node.js 20+:

    npm install
    npm run dev

Open http://localhost:3000. Notes, Script Studio, Storyboard and Media Library work without an API key.

## AI Director

Copy .env.example to .env.local and set OPENAI_API_KEY on the private server only. The API key must never be committed or exposed in browser JavaScript. For safer access and predictable cost, all three levels default to gpt-5-mini and can be overridden by environment variables. The levels also vary creative instructions and supported reasoning effort. The server requests exactly 10 shots and a 4-part soundtrack map with silence.

The AI route has **in-memory prototype limits**, not production authentication or durable spending caps. Do not host it publicly until you add real user authentication, durable per-user quotas, cost monitoring, abuse protection and privacy controls. The code does not guarantee a $100/month ceiling.

## The merged workflow

1. Open AI Director in the navigation.
2. Enter a story and specify duration, mood, equipment and location constraints.
3. Choose Quick, Balanced or Director's Cut, and generate.
4. Review the 10 shots and 4 sound beats.
5. Select **Add all 10 to Storyboard** to arrange those scene cards visually.
6. Edit your Notes or Script Studio, refresh and confirm that content persists.
7. Open Local Backups to export a copy of your work.

## Known limitations

- The old email-only Google sign-in was simulated. It has been replaced with truthful local backup controls; actual Google OAuth/cloud sync still need implementation.
- A live AI call, complete production build, authentication security audit, deployment and app-store packages have **not** been performed in this change.
- Plans save locally as browser data, not synced online.
- For large media files and multi-device use, add a database and object storage later.
