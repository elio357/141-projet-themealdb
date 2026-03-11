<template>
  <v-app>
    <!-- Menu de navigation latéral -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav>
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- Barre de navigation -->
    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-app-bar-title>
        <RouterLink to="/" class="text-decoration-none d-flex align-center" style="color: inherit">
          <img src="/favicon.png" alt="Rick & Morty" width="28" height="28" class="mr-2">
          Rick & Morty Explorer
        </RouterLink>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>

    <v-footer class="text-center">
      <v-col>
        Démo C141 — ESIG {{ currentYear }} —
        API
        <a href="https://rickandmortyapi.com" target="_blank" rel="noopener noreferrer" class="text-primary">
          rickandmortyapi.com
        </a>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(false)
const currentYear = new Date().getFullYear()

const navItems = [
  { title: 'Personnages', to: '/', icon: 'mdi-account-group' },
  { title: 'À propos', to: '/about', icon: 'mdi-information' },
]
</script>
