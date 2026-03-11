<template>
  <v-container>
    <h1 class="text-h4 my-4">Personnages Rick & Morty</h1>

    <!-- Chargement (skeleton) -->
    <v-row v-if="loading">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="image, heading, text" />
      </v-col>
    </v-row>

    <!-- Erreur -->
    <v-alert v-else-if="error" type="error" class="my-4">
      {{ error }}
    </v-alert>

    <!-- TODO : Liste des personnages -->
    <v-row v-else>
      <v-col cols="12">
        <p>{{ characters.length }} personnage(s) chargé(s)</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// État réactif
const characters = ref([])
const loading = ref(true)
const error = ref(null)

// TODO : Charger les personnages depuis l'API Rick and Morty
// URL : https://rickandmortyapi.com/api/character
// La réponse contient { info: {...}, results: [...] }
onMounted(async () => {
  try {
    // TODO : fetch + vérification response.ok + extraction des résultats

  } catch (err) {
    error.value = `Impossible de charger les personnages : ${err.message}`
  } finally {
    loading.value = false
  }
})
</script>
