# 🛠️ Fixing CMake & Gradle Errors in React Native 0.80.1 (Android)

React Native 0.80.x introduced major changes in CMake, Prefab, and Codegen.
Build errors such as FAILED: build.ninja or add_subdirectory ... jni not found usually happen due to mismatched Gradle/AGP/NDK/CMake versions or missing codegen JNI cache.

✅ Recommended Configuration
## 1. Gradle & AGP

android/gradle/wrapper/gradle-wrapper.properties

distributionUrl=https\://services.gradle.org/distributions/gradle-8.10.2-bin.zip


android/build.gradle

```bash
plugins {
  id 'com.android.application' version '8.6.0' apply false
  id 'com.android.library' version '8.6.0' apply false
}
```

## 2. JDK

Use JDK 17:
```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
java -version   # should print "openjdk 17"
```

## 3. NDK & CMake

Check versions inside:

`node_modules/react-native/ReactAndroid/gradle.properties`


Add them to android/gradle.properties:

```bash
android.ndkVersion=26.1.10909125
cmake.version=3.22.1
```


Install via Android SDK Manager:

`sdkmanager "ndk;26.1.10909125" "cmake;3.22.1"`

## 4. Prefab

Enable Prefab (required in RN 0.80.x):

```bash
android/gradle.properties

android.prefabEnabled=true
```

or in android/app/build.gradle:
```bash
android {
  buildFeatures {
    prefab true
  }
}
```
## 5. Codegen

Regenerate JNI codegen:

```bash
rm -rf node_modules
yarn install   # or npm/pnpm
npx react-native codegen
```


## 6. Clean Caches
```bash
cd android
./gradlew --stop
rm -rf .gradle
rm -rf app/.cxx
rm -rf ~/.gradle/caches
./gradlew clean
```

## 7. Rebuild
   
```bash
cd android
./gradlew :app:assembleDebug --info
```

📌 Minimal settings.gradle for RN 0.80.1

Make sure the top of your android/settings.gradle looks like this:
```bash
pluginManagement {
  repositories {
    gradlePluginPortal()
    mavenCentral()
    google()
  }
  includeBuild("../node_modules/@react-native/gradle-plugin")
}

plugins {
  id("com.facebook.react.settings")
}

dependencyResolutionManagement {
  repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
  repositories {
    google()
    mavenCentral()
  }
}
```
🛠️ Additional Troubleshooting

If errors only happen on armeabi-v7a, you can temporarily exclude that ABI:
```bash
defaultConfig {
  ndk {
    abiFilters "arm64-v8a", "x86_64"
  }
}
```


Update all native libraries (react-native-screens, @react-native-async-storage/async-storage, etc.) to versions that explicitly support RN 0.80.1.

If all else fails, wipe everything:

`rm -rf android/.gradle android/app/.cxx ~/.gradle/caches`

🚀 TL;DR

Lock versions → Gradle 8.10.2, AGP 8.6.0, JDK 17.

Match NDK & CMake with RN’s requirements.

Enable Prefab.

Regenerate Codegen JNI.

Clean caches & rebuild.

With this setup, most CMake/ninja errors in React Native 0.80.1 should be resolved. ✅
