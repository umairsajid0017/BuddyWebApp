# Google Authentication Implementation (Hybrid Approach)

This README explains the implementation of Google Sign-In in the Buddy Customer Web application using a hybrid approach that keeps Google authentication on the client side while handling login/registration on the server side.

## Implementation Details

1. **Firebase Configuration**: 
   - Client-side Firebase setup in `src/lib/firebase.ts` for the popup authentication.
   - The user's Google account information is obtained directly in the browser.

2. **Google Sign-In Flow**:
   - Client-side: The authentication popup and Google user data retrieval are handled by Firebase client SDK
   - Server-side: The login/registration with your backend API are handled securely through a Next.js API route
   - This approach keeps the sensitive login and registration API calls hidden from the browser's network tab

3. **API Routes**:
   - Created a server-side API route at `src/app/api/auth/google/route.ts`.
   - This route receives Google user data and handles login/registration with your backend.

## What You Need to Configure

1. **Firebase Console Setup**:
   - Enable Google Authentication in your Firebase project:
     - Go to the [Firebase Console](https://console.firebase.google.com/)
     - Select your project: "buddy-temp-e6420"
     - Navigate to Authentication > Sign-in method
     - Enable Google as a sign-in provider
     - Configure your authorized domains to include your application's domain

2. **API Endpoints**:
   - Ensure your backend API endpoints for login and registration are correctly configured
   - Make sure your backend can handle the Google login type and process users accordingly

## Flow of Hybrid Google Authentication

1. User clicks "Sign in with Google" button
2. Google authentication popup appears through Firebase client SDK
3. User selects their Google account
4. Client gets the user data from Google/Firebase
5. Client sends this user data to your Next.js API route
6. Server calls your login API with the Google credentials
7. If the user doesn't exist, server registers them and then logs them in
8. Server returns the authentication response to the client
9. Client updates the auth store and redirects to the home page

## Security Benefits

This approach provides several security benefits:
1. The login/register API calls to your backend are made server-to-server
2. The login credentials and authentication tokens are not visible in the browser's network tab
3. Your backend authentication logic is abstracted away from the client

## Testing

To test this implementation:
1. Enable Google Sign-In in your Firebase project
2. Try signing in with Google on the login page
3. Monitor your server logs for any errors
4. Confirm that the user is correctly authenticated and redirected

## Troubleshooting

If you encounter issues:
1. Check your Firebase configuration on the client side
2. Verify that your API endpoint URLs are correct in the server-side route
3. Look for errors in the browser console and server logs
4. Ensure the Google user data is being correctly passed to the server 