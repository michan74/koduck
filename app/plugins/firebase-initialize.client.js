// Import the functions you need from the SDKs you need]
import { initializeApp } from "firebase/app";
import { getVertexAI, getGenerativeModel, Schema } from "firebase/vertexai";
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
  // スキーマの指定
  const jsonSchema = Schema.object({
    properties: {
      hashtags: Schema.array({
        items: Schema.string(),
      }),
    }
  });

  // 関数の指定
  // 良いAPIがあったら、使う
  // const fetchHashtag = async ({ location, date }) => {

  //   // TODO(developer): Write a standard function that would call to an external weather API.
  
  //   // For demo purposes, this hypothetical response is hardcoded here in the expected format.
  //   return {
  //     temperature: 38,
  //     chancePrecipitation: "56%",
  //     cloudConditions: "partlyCloudy",
  //   };
  // }


  // Gemini 1.5 model　を指定　（他の Gemini Versionも指定可能）
  const model = getGenerativeModel(vertexAI, 
    { 
      model: "gemini-1.5-flash" ,
      systemInstruction: "You are a top instagram influencer.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: jsonSchema,
        temperature: 0.9,
      }, 
    });

  return {
    provide: {
      firebase: { model },
    },
  };
})