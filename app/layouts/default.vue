<template>
  <v-app>
    <!-- header -->
    
    
    <NuxtPage />
    
    
    <!-- footer -->
    <v-footer
      class="bg-indigo-lighten-1 text-center d-flex flex-column"
    >
      <div>
        <v-btn
          key="mdi-twitter"
          icon="mdi-twitter"
          class="mx-4"
          variant="text"
          href="https://x.com/SPuemi"
        ></v-btn>
      </div>

      <v-divider></v-divider>

      <div>
        {{ new Date().getFullYear() }} — <strong>どらやき</strong>
      </div>
    </v-footer>
  </v-app>
</template>