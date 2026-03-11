import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#E67E22',   // orange chaud
          secondary: '#27AE60', // vert frais
          accent: '#F4C542',    // jaune doré
          error: '#E74C3C',
          info: '#3498DB',
          success: '#2ECC71',
          warning: '#F39C12',
        },
      },
    },
  },
})