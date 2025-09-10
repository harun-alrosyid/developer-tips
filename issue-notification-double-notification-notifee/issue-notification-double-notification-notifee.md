# Handle Issue Notification with dependecies Notifee

- [Handle Issue Notification with dependecies Notifee](#handle-issue-notification-with-dependecies-notifee)
  - [Double Notification](#double-notification)
  - [Data-Only cannot resolve when the application is quit](#data-only-cannot-resolve-when-the-application-is-quit)
    - [How to resolve](#how-to-resolve)

## Double Notification

Ideally, to send notification you should send paylod as below:

```json
{
  "message": {
    "token": "<FCM_TOKEN>",
    "notification": { "title": "Judul", "body": "Isi" },
    "data": { "type": "informasi" }
  }
}
```

But, when you try create notification in RN and using library [Notifee](https://notifee.app/react-native/docs/overview) usually your application will get twice notification from Default Firebase Messaging and Notifee.

Therefore, Notifee is recommend for using format Data-Only.
So that default Firebase Messaging will not trigger twice notification.
[reference](https://github.com/invertase/notifee/issues/690#issuecomment-1437300596)

```json
{
  "message": {
    "token": "<FCM_TOKEN>",
    "data": { { "title": "Judul", "body": "Isi" },"type": "informasi" },
    "contentAvailable": true,
    "priority": "high",
  }
}
```

## Data-Only cannot resolve when the application is quit

When i send notification Data-Only and set **priority high**. Notification failed to show when application is quit.

### How to resolve

After exploration. I found solution , we need create service native.
Create file `MyFirebaseMessagingService.kt` , in function `onMessageReceived` only check data is not empty and don't anything when data is empty.

```kotlin
package com.yourapp
import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
class MyFirebaseMessagingService : FirebaseMessagingService() {
    override fun onMessageReceived(remoteMessage: RemoteMessage) {

        // handle data-only messages here
        if (remoteMessage.data.isNotEmpty()) {
            Log.d("MyFirebaseMsgService", "Message data payload: ${remoteMessage.data}")

        }
        // please, don`t call super.onMessageReceived() to prevent show notification default
    }

}
```

After that, implemetation `MyFirebaseMessagingService.kt` in `AndroidManifest.xml`
like this:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools" package="com.yourapp">

   ...

    <application
        android:name="com.yourapp.MainApplication"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true"
        android:requestLegacyExternalStorage="true"
        tools:ignore="GoogleAppIndexingWarning">

        <!-- start : implementation service firebase messaging  -->
        <service
        android:name=".MyFirebaseMessagingService"
        android:exported="false">
        <intent-filter>
            <action android:name="com.google.firebase.MESSAGING_EVENT" />
        </intent-filter>
        </service>
        <!-- end implementation service firebase messaging -->
        <activity
            android:name="com.yourapp.MainActivity"
            android:screenOrientation="portrait"
            android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize"
            android:exported="true"
            tools:ignore="DiscouragedApi,LockedOrientationActivity">
            ...
        </activity>
    </application>
</manifest>

```

Before you run your app. Please make sure reclean your gradle `cd android && ./gradlew clean` and run again `npm run-android`

> `Harun Al rosyid`
