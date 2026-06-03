# Smart Parking Full Setup (Web + Mobile)

This guide is for setting up this repository on a new machine in a reliable way.

It covers:

- Web app setup
- Mobile app setup
- Running Cloud Functions on local emulator
- Using **remote Firebase Auth** (not Auth emulator)
- Common machine-specific issues

---

## 1. Project Structure

From repo root:

- `Web App/` -> React web app + Firebase Functions + emulator scripts
- `mobile_app/` -> Expo React Native mobile app

Important: folder name has a space (`Web App`), so always quote paths in commands when needed.

---

## 2. Machine Requirements

## 2.1 Required software

- Node.js: `22.x` (required; functions `engines.node` is `22`)
- npm: `10.x` recommended (comes with Node)
- Git
- Firebase CLI (`firebase-tools`)

For mobile:

- Expo CLI is not required globally (uses local `expo` package via npm scripts)
- Android Studio (Android testing), or physical Android device
- Xcode + macOS (iOS testing)

Optional but recommended:

- Java runtime `17+` (required if you run Firestore emulator via `firebase:emulators:all`)

## 2.2 Recommended hardware

- RAM: 8 GB minimum, 16 GB preferred (web + emulators + mobile together)
- Free disk: at least 5 GB

---

## 3. Access Requirements

You must have access to Firebase project:

- `digital-parking-f9d2c`

You need:

- Firebase project member access (Auth/Firestore/Functions usage permissions)
- Firebase web app config values (API key, app ID, etc.)
- Google Maps API key (web + mobile maps)

For Functions emulator with Admin SDK, one of these must be true:

- You have the service account JSON in `Web App/` (team standard), or
- Your local Firebase auth/default credentials are set correctly

---

## 4. One-Time Install

Run from repo root:

```powershell
# Web app deps
cd "Web App"
npm ci

# Functions deps
cd functions
npm ci
cd ..

# Mobile deps
cd ..\mobile_app
npm install --legacy-peer-deps
```

Install Firebase CLI (if missing):

```powershell
npm install -g firebase-tools
```

Verify tools:

```powershell
node --version
npm --version
firebase --version
git --version
```

Important:

- Keep committed lockfiles (`package-lock.json`) in all projects.
- Do not run `npm audit fix --force` blindly in `Web App/`; it can upgrade `webpack-dev-server` to an incompatible version for `react-scripts`.
- This repository already contains required `overrides` in package files to keep security fixes and startup compatibility together.

---

## 5. Firebase CLI Login + Project

From any folder:

```powershell
firebase login
```

From `Web App/`:

```powershell
firebase use digital-parking-f9d2c
```

(`Web App/.firebaserc` already points default to this project.)

---

## 6. Environment Files

Create env files from examples.

## 6.1 Web env

```powershell
cd "Web App"
Copy-Item .env.example .env
```

Set these in `Web App/.env`:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_DATABASE_URL=
REACT_APP_FIREBASE_PROJECT_ID=digital-parking-f9d2c
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=

# Required for local functions emulator
REACT_APP_USE_FUNCTIONS_EMULATOR=true
REACT_APP_FUNCTIONS_EMULATOR_HOST=localhost
REACT_APP_FUNCTIONS_EMULATOR_PORT=5001
```

Important behavior in web code:

- In development, functions emulator is auto-used unless `REACT_APP_USE_FUNCTIONS_EMULATOR=false`.
- Auth and Firestore still use remote Firebase project config above.

## 6.2 Mobile env

```powershell
cd "..\mobile_app"
Copy-Item .env.example .env
```

Set these in `mobile_app/.env`:

```env
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=digital-parking-f9d2c
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

GOOGLE_MAPS_API_KEY=
WEB_APP_HOST=localhost

USE_FUNCTIONS_EMULATOR=true
FUNCTIONS_EMULATOR_HOST=localhost
FUNCTIONS_EMULATOR_PORT=5001
```

Important behavior in mobile code:

- Auth and Firestore are remote (from Firebase env values)
- Functions client points to emulator when `USE_FUNCTIONS_EMULATOR=true`
- If emulator is unreachable, wrapper may fall back to production functions for some error types

---

## 7. Service Account Key (Web Functions Emulator)

Team setup typically expects:

- Place key at: `Web App/digital-parking-f9d2c-firebase-adminsdk-*.json`

Do not commit it. `Web App/.gitignore` already excludes:

- `*.env`
- `*-firebase-adminsdk-*.json`

---

## 8. Run Everything (Daily Workflow)

Use 3 terminals.

## Terminal 1: Functions emulator

```powershell
cd "Web App"
npm run firebase:emulators
```

This runs local Functions emulator only at `http://localhost:5001`.

## Terminal 2: Web app

```powershell
cd "Web App"
npm start
```

Web app: `http://localhost:3000`

## Terminal 3: Mobile app

```powershell
cd "mobile_app"
npm start
```

Then launch:

- `a` for Android emulator (or `npm run android`)
- iOS only on macOS (`npm run ios`)

---

## 9. Remote Auth Requirement (Important)

This repo supports your required mode:

- Functions: local emulator
- Auth: remote Firebase Auth
- Firestore: remote Firebase Firestore (unless you manually change code/setup)

So for this mode:

- Do **not** run/use Auth emulator
- Do **not** change app code to `connectAuthEmulator(...)`

Auth requests should go to Google/Firebase endpoints, not localhost auth emulator.

---

## 10. Verification Checklist

## Dependency verification

- `mobile_app`: `npm audit` -> `found 0 vulnerabilities`
- `Web App`: `npm audit` -> `found 0 vulnerabilities`
- `Web App/functions`: `npm audit` -> `found 0 vulnerabilities`

## Web verification

- App opens at `http://localhost:3000`
- Browser console shows: `Using Functions emulator at localhost:5001`
- Login works with Firebase remote users
- Function actions hit emulator

## Mobile verification

- App boots without env errors
- Login works (remote auth)
- Function-driven actions work (booking/check-in/payment flows)
- Emulator connection log appears in Metro when enabled

## Network verification

- Functions calls -> `localhost:5001`
- Auth calls -> Firebase/Google auth endpoints (remote)
- Firestore calls -> Firebase Firestore endpoints (remote)

---

## 11. Cross-Machine Troubleshooting

## 11.1 Port already in use

- Functions emulator port `5001`
- Web app port `3000`
- Emulator UI `4000` (if running all emulators)

Change emulator port in:

- `Web App/firebase.json`
- matching env variables

## 11.2 Mobile device cannot reach localhost emulator

If running on a physical phone, `localhost` points to the phone, not your PC.

Set in `mobile_app/.env`:

- `FUNCTIONS_EMULATOR_HOST=<your-computer-LAN-IP>`

Keep:

- `FUNCTIONS_EMULATOR_PORT=5001`

Also ensure phone and computer are on same network.

## 11.3 Firebase permission errors

- Confirm your account is added to project `digital-parking-f9d2c`
- Confirm Firestore rules/role documents are correct for your test user

## 11.4 Wrong Node version problems

If you hit dependency/runtime mismatch:

- use Node `22.x`
- reinstall clean:

```powershell
cd "Web App"
Remove-Item -Recurse -Force node_modules
npm ci
cd functions
Remove-Item -Recurse -Force node_modules
npm ci
cd ..\..\mobile_app
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps
```

## 11.5 Functions emulator starts but function calls fail

- Check Terminal 1 logs for function registration errors
- Confirm `REACT_APP_USE_FUNCTIONS_EMULATOR=true` (web)
- Confirm `USE_FUNCTIONS_EMULATOR=true` (mobile)
- Confirm host/port values match emulator output

## 11.6 Web app fails with `onAfterSetupMiddleware` schema error

Symptom:

- `npm start` fails with: `Invalid options object ... unknown property 'onAfterSetupMiddleware'`

Cause:

- Incompatible `webpack-dev-server` version with `react-scripts`.

Fix:

1. Ensure `Web App/package.json` still has `react-scripts` on `^5.0.1` and keep existing `overrides`.
2. Reinstall clean:

```powershell
cd "Web App"
Remove-Item -Recurse -Force node_modules
npm ci
```

3. Start again:

```powershell
npm start
```

---

## 12. Useful Commands

From `Web App/`:

```powershell
npm run lint
npm run build
npm run firebase:emulators
npm run firebase:emulators:all
npm run deploy:firestore
npm run deploy:functions
```

From `Web App/functions/`:

```powershell
npm run lint
```

From `mobile_app/`:

```powershell
npm start
npm run android
npm run ios
npm run test
```

---

## 13. New Machine Quick Start (Short Version)

1. Install Node 22, Git, Firebase CLI, Android Studio (and Xcode if macOS/iOS).
2. Install dependencies in:
   - `Web App/` (`npm ci`)
   - `Web App/functions/` (`npm ci`)
   - `mobile_app/` (`--legacy-peer-deps`)
3. Create `.env` for web + mobile from `.env.example`.
4. Set emulator flags for functions (`*_USE_FUNCTIONS_EMULATOR=true`).
5. Firebase login + select project `digital-parking-f9d2c`.
6. Put service account key in `Web App/` (team standard).
7. Start:
   - Functions emulator (`Web App`, terminal 1)
   - Web app (`Web App`, terminal 2)
   - Mobile app (`mobile_app`, terminal 3)

This gives: local functions + remote auth (and remote firestore) on both clients.
