<template>
  <v-container>
    <h1 class="text-h4 my-4">À propos</h1>

    <v-card class="mb-4">
      <v-card-title>
        <v-icon icon="mdi-alien" class="mr-2" />
        Rick & Morty Explorer
      </v-card-title>
      <v-card-text>
        Application de démonstration pour le cours
        <strong>C141 — Développer des applications web adaptatives</strong>.
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>
        <v-icon icon="mdi-layers-triple" class="mr-2" />
        Stack technique
      </v-card-title>
      <v-card-text>
        <v-list density="compact">
          <v-list-item prepend-icon="mdi-vuejs" title="Vue.js 3" subtitle="Composition API" />
          <v-list-item prepend-icon="mdi-vuetify" title="Vuetify 3" subtitle="Composants Material Design" />
          <v-list-item prepend-icon="mdi-sign-direction" title="Vue Router 4" subtitle="Navigation entre pages" />
          <v-list-item prepend-icon="mdi-lightning-bolt" title="Vite" subtitle="Build tool" />
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
  //
</script>
