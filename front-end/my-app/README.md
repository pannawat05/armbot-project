# ARMbot Portfolio

A SvelteKit portfolio for the ARMbot 6-DOF pick-and-place project.

## Pages

- `/` — project overview and system highlights.
- `/demo` — video player and AI dubbing demo.
- `/structure` — interactive Three.js view of the supplied STL parts.

## Run the frontend

From this directory:

```sh
npm install
npm run dev
```

Build for production with `npm run build`.

## Run the dubbing demo

The demo streams the video's audio to the local Gemini Live API server.
Translation requires a valid Gemini API key and both processes running.

1. Add `GEMINI_API_KEY=your_api_key` to `server/.env`. Keep this key on the
   server; do not put it in frontend files.
2. In a terminal, start the dubbing server:

   ```sh
   cd ../../server
   npm install
   npm start
   ```

3. In a second terminal opened in this app directory, start the frontend with
   `npm run dev`.

The frontend connects to the dubbing server on port `8080`. Choose a target
language, start dubbing, then play the clip.

## Run with Docker Compose

From the project root, copy `.env.example` to `.env`, set `GEMINI_API_KEY`,
then run:

```sh
docker compose up --build
```

Open `http://localhost:3000`; the API listens on port `8080`. Keep `.env`
private. Docker Compose is for container hosts; Vercel deploys the frontend
from the repository and does not run this Compose file. The frontend keeps
SvelteKit's automatic adapter for Vercel and uses the Node adapter in Docker.
For Vercel, host the WebSocket API separately and set the frontend build
environment variable `PUBLIC_DUBBING_API_URL` to its public `wss://` URL.
