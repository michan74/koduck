<template>
  <div class="px-5 mx-auto my-15 page-container">
    <div class="d-flex align-center justify-center fill-height">
      <img src="~/public/images/logo.png" alt="logo" height="100px" />
    </div>


    <div class="text-body-1 my-3">画像に合わせたハッシュタグをつくります。↓↓</div>
    
    <!-- アラート -->
    <v-alert
      v-model="isShowAlert"
      type="info"
      variant="tonal"
      closable
      title="Information"
      text="画像を選択してください。画像に合うハッシュタグを作成します。"
    ></v-alert>

    <v-alert
      v-model="isShowFileSizeAlert"
      type="error"
      variant="tonal"
      closable
      title="Error"
      text="20MB以下の画像を選択してください。"
    ></v-alert>
    
    <!-- ファイルアップロード -->
    <v-file-input 
      label="File upload" 
      prepend-icon="mdi-image" 
      variant="filled"
      accept="image/png, image/jpeg"
      @change="onFileSelected">
    </v-file-input>

    <!-- 条件 -->
    <div class="text-subtitle-2">Options</div>
    <v-row no-gutters>
      <!-- 個数 -->
      <v-col cols="4" class="pr-2">
        <v-select
          label="Quantity"
          v-model="selectedQuantity"
          suffix="個"
          :items="['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']"
        ></v-select>
    
      </v-col>
      <!-- 言語 -->
      <v-col cols="8">
        <v-select
          label="Language"
          v-model="selectedLanguages"
          :items="languages"
          chips
          multiple
          :rules="[
            value => !!value.length || 'Required',
          ]"
        ></v-select>
      </v-col>
    </v-row>

    <!-- 説明 -->
    <v-text-field
      v-model="description"
      label="Description"
      :rules="[
        value => (value.length <= 10) || 'Max 10 characters',
      ]"
    ></v-text-field>

    <!-- キャラクター -->
    <v-select
      label="Character"
      v-model="selectedCharacter"
      :items="characters"
      item-title="text"
      item-value="value"
      clearable
    ></v-select>

    <!-- 作成ボタン -->
    <div class="d-flex align-center justify-center fill-height">
      <v-btn @click="onClick" variant="flat" color="primary" width="90%" height="60px">つくる ´•ᴥ•`</v-btn>
    </div>

    <template v-if="isShowProgress">
        <div class="d-flex align-center justify-center fill-height my-8">
        <!-- くるくる -->
        <v-progress-circular color="primary" indeterminate :size="70" class="mx-auto"></v-progress-circular>
      </div>
    </template>
    <template v-else>
      <div>
        <template v-if="isShowVertexError">
          <!-- エラー -->
          <v-alert
            type="error"
            variant="filled"
            closable
            title="Error"
            text="エラーが発生しました。もう一度お試しください。"
          ></v-alert>
        </template>
        <template v-if="hashTags.length > 0">
          <v-divider class="mx-2 my-2"></v-divider>
          <!-- ハッシュタグ -->
          <div class="mx-2 my-2">
            <div class="text-body-1">Generated!</div>
            <v-chip
              v-for="(hashTag, index) in hashTags"
              :key="index"
              color="indigo-accent-1"
              text-color="white"
              class="ma-1"
              :variant="selectedHashtags.includes(hashTag) ? 'flat' : 'outlined'"
              @click="onSelectHashtag(hashTag)"
            >
              #{{ hashTag }}
            </v-chip>
          </div>
    
          <!-- 最終コピペ部分 -->
          <div class="d-flex my-4">
            <v-textarea
              class="mx-2"
              v-model="hashtagText"
            >
            </v-textarea>
            <v-icon @click="writeToClipboard">mdi-content-copy</v-icon>
          </div>
          <v-snackbar
            v-model="isShowSnackbar"
            :timeout="2000"
            location="top"
          >
            Copyed!
          </v-snackbar>
        </template>
      </div>
    </template>

  </div>
</template>
<script>
export default {
  data: () => ({
    selectedFile: null,
    isShowAlert: false,
    isShowFileSizeAlert: false,
    isShowProgress: false,
    isShowSnackbar: false,
    isShowVertexError: false,
    hashTags: [],
    selectedHashtags: [],
    hashtagText: "",
    selectedQuantity: "5",
    selectedLanguages: ['日本語'],
    description: "",
    languages: [
      "日本語","英語"
    ],
    selectedCharacter: [],
    characters: [
      { text: "✧ °キラキラ", value: "pokopoko" },
      { text: "𖧧˒˒丁寧な暮らし", value: "teinei" },
    ],
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
      // 20 MB制限
      if(event.target.files[0].size > 20 * 1024 * 1024) {
        this.isShowFileSizeAlert = true;
        return;
      }

      this.isShowFileSizeAlert = false;
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
        this.selectedHashtags = this.selectedHashtags.filter((item) => item !== hashtag);
      } else {
        this.selectedHashtags.push(hashtag);
      }
    },
    async postVertexApi() {
      this.isShowProgress = true;

      const { $firebase } = useNuxtApp();
      const model = $firebase.model;
      try {
        const imagePart = await this.fileToGenerativePart(this.selectedFile);
        const prompt = this.generatePrompt();
        const result = await model.generateContentStream([prompt, imagePart]);

        let responseJsonString = "";
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          responseJsonString += chunkText;
        }
        const responseJson = JSON.parse(responseJsonString);

        this.hashTags = responseJson.hashtags;
        this.selectedHashtags = responseJson.hashtags;

        this.isShowProgress = false;
      } catch (error) {
        this.isShowProgress = false;
        this.isShowVertexError = true;
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
    // プロンプト英語？？変数いれる
    generatePrompt() {
      let setting = "";
      if(this.selectedCharacter?.length > 0) {
        const characterTextMap = {
          pokopoko: "20代女性、一人暮らし、彼氏持ち、女性らしい服を着る、パパ活してるかと思うくらい金持ちで、自分の容姿やポジションをよく魅せたい人です。",
          teinei: "30代女性、既婚、毎日自炊をする、麻やリネンの服を着る、アロマオイルとか使いがちで、自分の生活が素敵だと魅せたい人です。",
        };
        setting = `あなたは${characterTextMap[this.selectedCharacter]}です。`;
      } else {
        setting = `あなたはSNS名人です。`;
      }

      let prompt = `
        ${setting}この${this.description}の画像の内容(テキスト、人物、風景、物)、
        SNS投稿時のハッシュタグ候補を${this.selectedQuantity}個出してください。 \
        <rule> \
        - 次に示す言語で作成してください: ${this.selectedLanguages} \
        - # は含めないでください \
        - 年齢や性別は特定できないように \
        - 奇想天外な候補を1個以上含める \
        </rule>`;
      console.log(prompt);
      return prompt;
    },
    writeToClipboard() {
      navigator.clipboard.writeText(this.hashtagText);
      this.isShowSnackbar = true;
    },
  }
}
</script> 
<style scoped>

/* PCのみ */
@media (min-width: 600px) {
  .page-container{
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>