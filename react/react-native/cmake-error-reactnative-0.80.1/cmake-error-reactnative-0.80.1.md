# 🛠️ Fix: CMake error on React Native 0.80.x (tested on 0.80.1)

> A pragmatic fix for CMake / `[CXX14xx]` build errors on RN 0.80.x by purging native caches and pinning `react-native-config`.

---

## TL;DR — Copy & Paste

```bash
# from project root
rm -rf android/app/build
rm -rf android/app/.cxx
rm -rf android/build
rm -rf android/.gradle
rm -rf node_modules
npm install react-native-config@1.5.3
npm i
watchman watch-del-all || true
cd android && ./gradlew --stop 
cd ..
npm run clean
npm run android
npm run build
```

---

## Common Symptoms

- `CMake Error` during configure/generate
- `[CXX1429] error when building with cmake`
- Native build stuck at `:app:configureCMake...`

---

## Why this works

- **Purge NDK/CMake caches** (`android/app/.cxx`, `android/.gradle`, `app/build`) so stale toolchain configs don’t linger.
- **Stop Gradle daemon** to avoid reusing old state (`./gradlew --stop`).
- **Re-install JS deps** and pin **`react-native-config@1.5.3`**, which is known stable on RN 0.80.x across many setups.
- **Reset file watchers** (Watchman) to prevent phantom rebuild issues.
- **Run your build scripts** (`clean`, `android:outer`, `build:outer`) end-to-end.

---

## Full Steps (with notes)

```bash
# 1) Drop all native build artifacts & caches
rm -rf android/app/build
rm -rf android/app/.cxx
rm -rf android/build
rm -rf android/.gradle

# 2) Fresh install JavaScript deps
rm -rf node_modules
npm install react-native-config@1.5.3
npm i


# 3) Reset watchman (optional but recommended)
watchman watch-del-all || true


# 4) Stop any lingering Gradle daemons
cd android && ./gradlew --stop 
cd ..


# 5) Run your project scripts
npm run clean
npm run android
npm run build
```

> Notes:
> - Replace `android` / `build` with your actual script names if they differ.
> - If you use **Yarn**: change `npm i` → `yarn`, and `npm install ...` → `yarn add ...`.
> - If you use **pnpm**: `pnpm add react-native-config@1.5.3`.

---

## Verification

- Build completes without CMake / `CXX1429` errors.
- `app/.cxx` and `android/.gradle` are regenerated during build.
- `react-native-config` is pinned at **v1.5.3**:
  ```bash
  npm ls react-native-config
  # or
  cat package.json | grep react-native-config
  ```

---

## Troubleshooting (if issues persist)

- **Check NDK & CMake versions** in Android Studio SDK Manager / `gradle.properties`.
- **Purge global Gradle caches**:
  ```bash
  rm -rf ~/.gradle/caches
  ```
- **Align Clang/NDK versions** if logs mention mismatched compiler IDs (e.g., “C/CXX compiler identification is Clang 18.x”).
- **Drop Gradle build cache**:
  ```bash
  ( cd android && ./gradlew cleanBuildCache || true )
  ```

---

## Optional: One-liner helper script

Add this to your `package.json` to run the whole flow in one command:

```json
{
  "scripts": {
    "rn:fix-cmake": "rm -rf android/app/build android/app/.cxx android/build android/.gradle node_modules && npm install react-native-config@1.5.3 && npm i && watchman watch-del-all || true && cd android && ./gradlew --stop && cd .. && npm run clean && npm run android:outer && npm run build:outer"
  }
}
```

Run it:
```bash
npm run rn:fix-cmake
```

---

**Drop this section straight into your `README.md` so your team can re-run the fix anytime.**
