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

    <!-- Liste des personnages -->
    <v-row v-else>
      <v-col
        v-for="character in characters"
        :key="character.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card :to="`/character/${character.id}`" class="h-100" hover>
          <v-img
            :src="character.image"
            :alt="character.name"
            height="200"
            cover
          />
          <v-card-title>{{ character.name }}</v-card-title>
          <v-card-text>
            <v-chip
              :color="statusColor(character.status)"
              size="small"
              class="mr-2"
            >
              {{ character.status }}
            </v-chip>
            <v-chip size="small" variant="outlined">
              {{ character.species }}
            </v-chip>
          </v-card-text>
        </v-card>
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

/**
 * Retourne la couleur du chip selon le statut du personnage.
 */
function statusColor(status) {
  const colors = { Alive: 'green', Dead: 'red', unknown: 'grey' }
  return colors[status] || 'grey'
}

// Chargement des données au montage du composant
onMounted(async () => {
  try {
    const response = await fetch('https://rickandmortyapi.com/api/character')

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`)
    }

    const data = await response.json()
    characters.value = data.results
  } catch (err) {
    error.value = `Impossible de charger les personnages : ${err.message}`
  } finally {
    loading.value = false
  }
})
</script>
