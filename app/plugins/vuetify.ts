// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    // theme: {
    //   defaultTheme: 'dark'
    // },
    // ... your configuration
  })
  app.vueApp.use(vuetify)
})
