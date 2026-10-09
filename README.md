# Astro Firebase Authentication

This is a project demonstrating how to integrate Firebase Authentication with an Astro application.

## Features

- User Authentication using Firebase Auth
- Protected routes
- Firebase client and server initialization

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup Firebase environment variables. Create a `.env` file based on your Firebase configuration. You will need your Firebase project configuration and an Admin SDK service account key.
   
   **Note**: The `.env` file is included in `.gitignore` to keep your secrets safe.

3. Start the development server:
   ```bash
   npm run dev
   ```
   (Or use `astro dev --background` if you prefer background mode)

## Architecture

- Client-side authentication configured in `src/firebase/client.js`
- Server-side token verification using Firebase Admin SDK in `src/firebase/server.js`
