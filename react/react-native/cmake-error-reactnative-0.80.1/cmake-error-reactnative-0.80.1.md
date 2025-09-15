# 🛠️ Fixing CMake & Gradle Errors in React Native 0.80.1 (Android)

React Native `0.80.x` introduced major changes in **CMake, Prefab, and Codegen**.  
Common build errors include:

- `FAILED: build.ninja`
- `add_subdirectory ... jni not found`
- `Imported target "ReactAndroid::reactnative" includes non-existent path`

These usually happen due to **mismatched Gradle/AGP/NDK/CMake versions** or **missing codegen JNI artifacts**.

---

## ✅ Recommended Configuration

### 1. Gradle & AGP
**`android/gradle/wrapper/gradle-wrapper.properties`**
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.10.2-bin.zip
