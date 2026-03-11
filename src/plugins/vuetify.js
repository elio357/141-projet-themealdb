/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#00B5CC',    // Bleu turquoise (portail, logo R&M)
          secondary: '#97CE4C',  // Vert portail/slime
          accent: '#F2E94E',     // Jaune (cheveux Morty)
          error: '#E63946',      // Rouge (lasers, danger)
          info: '#44CFCB',       // Cyan clair
          success: '#97CE4C',    // Vert (même que secondary)
          warning: '#FFA724',    // Orange
        },
      },
    },
  },
})
