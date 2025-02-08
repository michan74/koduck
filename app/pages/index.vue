<template>
  <div>
    <v-file-input 
      label="File input" 
      prepend-icon="mdi-image" 
      variant="filled"
      :rules="rules"
      accept="image/png, image/jpeg">
    </v-file-input>
  </div>
</template>
<script>
export default {
  async mounted() {
    const { $firebase } = useNuxtApp();
    const model = $firebase.model;
    try {
      const result = await model.generateContent("こんにちは、世界！");
      const response = result.response;
      console.log(response.text());
      return response.text();
    } catch (error) {
      throw new Error(`error generating content: ${error}`);
    }
  },
  methods: {
    async postVertexApi() {
      const { $firebase } = useNuxtApp();
      const model = $firebase.model;
      try {
        const result = await model.generateContent("こんにちは、世界！");
        const response = result.response;
        console.log(response.text());
        return response.text();
      } catch (error) {
        throw new Error(`error generating content: ${error}`);
      }
    }
  }
}
</script>