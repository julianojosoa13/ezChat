import 'dotenv/config';

export default {
  "expo": {
    "name": "ez Chat",
    "slug": "ezchat",
    "version": "1.0.0",
    "scheme": "com.julianojosoa.ezchat",
    "orientation": "portrait",
    "icon": "./assets/branding/png/logo-white.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/branding/png/logo-color.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "package": "com.julianojosoa.ezchat",
      "googleServicesFile": "./google-services.json",
      "adaptiveIcon": {
        "foregroundImage": "./assets/branding/png/logo-white.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "android.permission.RECORD_AUDIO"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends."
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "92bfc589-a38c-4a1a-8833-f6a278183e65"
      },
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
    },
    "owner": "josoajuliano",
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/92bfc589-a38c-4a1a-8833-f6a278183e65"
    }
  }
}
