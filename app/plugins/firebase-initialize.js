// Import the functions you need from the SDKs you need
import { initializeApp, firebase } from "firebase/app";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export default defineNuxtPlugin((nuxtApp) => {

  const config = useRuntimeConfig();

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: config.public.apiKey,
    authDomain: config.public.authDomain,
    projectId: config.public.projectId,
    storageBucket: config.public.storageBucket,
    messagingSenderId: config.public.messagingSenderId,
    appId: config.public.appId,
  };

  // Initialize Firebase or get existing app
  const app = initializeApp(firebaseConfig);

  // Firebase 認証の取得
  // const auth = getAuth(firebaseApp)

  // nuxtApp.provide('auth', auth)
})