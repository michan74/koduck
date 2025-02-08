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