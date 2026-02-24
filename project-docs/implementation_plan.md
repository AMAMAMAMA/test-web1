# Implementation Plan - Google Auth & Production Rules

The user set up Firebase with **Google Auth** (instead of Email/Password) and **Production Mode** for Firestore. We need to update the application code to match this configuration.

## User Review Required

> [!IMPORTANT]
> **Firestore Rules Action Required**: Since you selected **Production Mode**, your database is likely locked (no reads/writes allowed). You MUST update your Firestore Rules in the [Firebase Console](https://console.firebase.google.com/) to allow authenticated users to post. See the "Firestore Rules" section below for the rules to copy-paste.

## Proposed Changes

### Firebase Configuration
#### [src/firebase.js](file:///c:/Users/yutof/Desktop/test-web1/src/firebase.js)
- Initialize `GoogleAuthProvider` and export it.

### Authentication Context
#### [src/contexts/AuthContext.jsx](file:///c:/Users/yutof/Desktop/test-web1/src/contexts/AuthContext.jsx)
- Add `loginWithGoogle` function using `signInWithPopup`.
- Expose `loginWithGoogle` via the context value.

### Login Page
#### [src/pages/Login.jsx](file:///c:/Users/yutof/Desktop/test-web1/src/pages/Login.jsx)
- Remove Email/Password input fields.
- Replace with a "Sign in with Google" button.
- Update login logic to use `loginWithGoogle` from `AuthContext`.

## Firestore Rules (For User to Apply)

Go to **Firestore Database > Rules** in the Firebase Console and publish these rules:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Allow read/write if the user is signed in
      allow read, write: if request.auth != null;
    }
  }
}
```

## Verification Plan

### Manual Verification
1.  **Start App**: Run `npm run dev`.
2.  **Navigate to Login**: Go to `http://localhost:5173/login`.
3.  **UI Check**: Verify Email/Password form is GONE and "Sign in with Google" button is VISIBLE.
4.  **Action**: Click "Sign in with Google".
    *   *Note: I (the agent) cannot interact with the Google Pop-up window. You (the user) will need to complete the sign-in.*
5.  **Success State**: Verify redirection to `/admin`.
6.  **Data Check**: Verify AdminDashboard loads articles (meaning Firestore read is working with the new rules).
