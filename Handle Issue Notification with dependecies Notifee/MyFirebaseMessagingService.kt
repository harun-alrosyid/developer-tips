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
   
