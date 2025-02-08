<template>
  <div>
    画像を選んでね
    
    <!-- アラート -->
    <v-alert
      v-model="isShowAlert"
      type="info"
      variant="tonal"
      closable
      title="Information"
      text="画像をせんたくしてください。"
    ></v-alert>

    <!-- ファイルアップロード -->
    <v-file-input 
      label="File input" 
      prepend-icon="mdi-image" 
      variant="filled"
      :rules="rules"
      accept="image/png, image/jpeg"
      @change="onFileSelected">
    </v-file-input>

    <v-btn @click="onClick">Generate ´•ᴥ•`</v-btn>

    <v-progress-linear
      v-if="isShowProgress"
      color="bg-indigo-lighten-1"
      height="6"
      indeterminate
      rounded
    ></v-progress-linear>

    <!-- ハッシュタグ -->
    <div v-if="hashTags.length > 0">
      <v-chip
        v-for="(hashTag, index) in hashTags"
        :key="index"
        color="indigo"
        text-color="white"
        class="ma-1"
        :variant="selectedHashtags.includes(hashTag) ? 'flat' : 'outlined'"
        @click="onSelectHashtag(hashTag)"
      >
        # {{ hashTag }}
      </v-chip>
    </div>

    {{ selectedHashtags }}
    {{ hashtagText }}
    <!-- 最終コピペ部分 -->
    <v-textarea
      append-inner-icon="mdi-content-copy"
      @click:appendInner="writeToClipboard"
      class="mx-2"
      label="hashtags"
      rows="1"
      v-model="hashtagText"
    >
    </v-textarea>
    <v-snackbar
      v-model="isShowSnackbar"
      :timeout="2000"
      location="top"
    >
      Copyed!
    </v-snackbar>
  </div>
</template>
<script>
export default {
  data: () => ({
    selectedFile: null,
    isShowAlert: false,
    isShowProgress: false,
    isShowSnackbar: false,
    hashTags: [],
    selectedHashtags: [],
    hashtagText: "",
  }),
  watch: {
    selectedHashtags: {
      handler(newVal) {
        let text = "";
        newVal.forEach((hashtag) => {
          text += `#${hashtag} `;
        });
        this.hashtagText = text;
      },
      deep: true,
    },
  },
  methods: {
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
    },
    onClick() {
      if(!this.selectedFile) {
        this.isShowAlert = true;
        return;
      }
      this.isShowAlert = false;

      this.postVertexApi();
    },
    onSelectHashtag(hashtag) {
      console.log(hashtag);
      if(this.selectedHashtags.includes(hashtag)) {
        console.log("remove");
        this.selectedHashtags = this.selectedHashtags.filter((item) => item !== hashtag);
      } else {
        console.log("add");
        this.selectedHashtags.push(hashtag);
      }
    },
    async postVertexApi() {
      this.isShowProgress = true;

      const { $firebase } = useNuxtApp();
      const model = $firebase.model;
      try {
        const imagePart = await this.fileToGenerativePart(this.selectedFile);
        const prompt = "この画像にハッシュタグを付けてください。６つまで。";
        const result = await model.generateContentStream([prompt, imagePart]);

        let responseJsonString = "";
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          responseJsonString += chunkText;
        }
        const responseJson = JSON.parse(responseJsonString);

        this.hashTags = responseJson.hashtags;

        this.isShowProgress = false;
      } catch (error) {
        throw new Error(`error generating content: ${error}`);
      }
    },
    async fileToGenerativePart(file) {
      const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
      });
      return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
      };
    },
    writeToClipboard() {
      navigator.clipboard.writeText(this.hashtagText);
      this.isShowSnackbar = true;
    },
  }
}
</script> 