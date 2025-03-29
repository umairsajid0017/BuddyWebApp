# Google Authentication Implementation

This README explains the implementation of Google Sign-In in the Buddy Customer Web application and outlines what configuration is required.

## Implementation Details

1. **Firebase Configuration**: 
   - We've created a Firebase configuration file at `src/lib/firebase.ts` with the Firebase credentials you provided.
   - This initializes Firebase authentication and the Google authentication provider.

2. **Google Sign-In Button Component**:
   - Created a reusable component at `src/components/ui/google-signin-button.tsx`.
   - This button handles the Google sign-in process using Firebase authentication popup.
   - After successful Google authentication, it sends the user details to your existing login API.

3. **Login Schema Update**:
   - Modified `src/lib/schemas.ts` to handle different login types (manual, Google, Facebook).
   - Used Zod's discriminated union to validate different login credential requirements based on login type.

4. **Login Page Update**:
   - Added the Google Sign-In button to the login page with appropriate styling.

## What You Need to Configure

1. **Firebase Console Setup**:
   - Ensure your Firebase project has Google Authentication enabled:
     - Go to the [Firebase Console](https://console.firebase.google.com/)
     - Select your project: "buddy-temp-e6420"
     - Navigate to Authentication > Sign-in method
     - Enable Google as a sign-in provider
     - Configure your authorized domains to include your application's domain

2. **Backend API Adjustments**:
   - Ensure your login API endpoint can handle requests with `login_type: "google"` and without a password.
   - Your API should validate Google Sign-In requests differently from manual login requests.

3. **Environment Configuration**:
   - If you want to secure your Firebase credentials further, consider moving them to environment variables in `.env.local` file.

## Flow of Google Authentication

1. User clicks "Sign in with Google" button
2. Google authentication popup appears
3. User selects their Google account
4. Firebase returns authentication details
5. Application sends those details to your login API with `login_type: "google"`
6. Your backend validates the request and returns a token
7. User is redirected to the home page

## Testing

To test this implementation:
1. Make sure your backend API is ready to handle Google login requests
2. Try signing in with Google on the login page
3. Check browser console for any errors
4. Confirm that the user is correctly authenticated and redirected

## Troubleshooting

If you encounter issues:
1. Verify Firebase console configuration
2. Check browser console for Firebase-related errors
3. Ensure your backend API is correctly handling the Google login type
4. Verify that your domain is allowed in Firebase Authentication settings 