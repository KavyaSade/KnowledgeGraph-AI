import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Load keys from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = async () => {
  // If keys are placeholders, fallback to simulation so the app is instantly testable
  if (firebaseConfig.apiKey === "mock-api-key-placeholder") {
    console.warn("Firebase is using placeholder keys. Simulating Google Auth.");
    return {
      success: true,
      idToken: "mock-google-id-token-xyz",
      user: {
        name: "Google Test User",
        email: "google.test@example.com",
        uid: "mock-google-uid-12345",
        photoURL: ""
      }
    };
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const idToken = credential?.idToken;
    
    if (!idToken) {
      throw new Error("Failed to retrieve Google ID token from authentication result.");
    }
    
    return {
      success: true,
      idToken,
      user: {
        name: result.user.displayName,
        email: result.user.email,
        uid: result.user.uid,
        photoURL: result.user.photoURL
      }
    };
  } catch (error) {
    console.error("Firebase Google Auth Error:", error);
    return {
      success: false,
      message: error.message
    };
  }
};
