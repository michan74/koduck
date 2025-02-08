// Import the functions you need from the SDKs you need]
import { initializeApp } from "firebase/app";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai";
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
  const firebaseApp = initializeApp(firebaseConfig);

  // Vertex AI service　を初期化
  const vertexAI = getVertexAI(firebaseApp);
  // Gemini 1.5 model　を指定　（他の Gemini Versionも指定可能）
  const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

  return {
    provide: {
      firebase: { model },
    },
  };
})