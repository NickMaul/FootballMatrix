const firebaseConfig = {
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAEQ7NNFHmPkMN7xlNEK28Vmx-45E_HJcQ",
    authDomain: "fussballmatrix-sga.firebaseapp.com",
    databaseURL: "https://fussballmatrix-sga-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fussballmatrix-sga",
    storageBucket: "fussballmatrix-sga.firebasestorage.app",
    messagingSenderId: "913921840109",
    appId: "1:913921840109:web:bb3ec09a5d133aa1728de4",
    measurementId: "G-CX1B8Y3EDW"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
};

// Export for use in other scripts (works because files are loaded in <script> order)
window._FM_FIREBASE_CONFIG = firebaseConfig;
