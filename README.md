# Vishnu Billing

An [Expo](https://expo.dev) + [Expo Router](https://docs.expo.dev/router/introduction/) app for lightweight billing/customer management.

## What's in the app

- **Dashboard**: Placeholder screen (WIP).
- **Products**: Placeholder screen (WIP).
- **Contacts**: Customer list with search, pagination, add contact, view/edit details, and soft delete.
- **Invoice**: Placeholder screen (WIP).

## Prerequisites

- Node.js and npm
- Expo CLI (run via `npx`)

## Setup

Install dependencies:

```bash
npm install
```

## Environment (Firebase)

This app uses Firebase (Firestore, and web-only Analytics). Runtime config is loaded from `expoConfig.extra` (preferred) with a fallback to `process.env` for web development.

Required environment variables:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`

Where to set them:

- **Web**: export them in your shell before running `npm run web`, or use your environment tooling of choice.
- **Native (Expo)**: provide them via Expo config `extra` (e.g. `app.config.*`). This repo currently validates variables in `config/env.ts`.

## Run

Start the dev server:

```bash
npm start
```

Platform shortcuts:

```bash
npm run android
npm run ios
npm run web
```

## Code quality (Biome)

This repo uses [Biome](https://biomejs.dev) for linting/formatting.

```bash
npm run lint
npm run format
npm run check
```

## Project structure

- `app/`: Expo Router screens (file-based routing)
- `config/`: runtime configuration (Firebase + env validation)
- `hooks/`, `store/`, `utils/`, `styles/`: app logic and UI styling

## Notes

- `npm run reset-project` is a `create-expo-app` helper script. Running it will move/delete existing app code; use with care.
