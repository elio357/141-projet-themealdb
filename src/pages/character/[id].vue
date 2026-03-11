<template>
  <v-container>
    <!-- Chargement (skeleton) -->
    <v-row v-if="loading">
      <v-col cols="12" md="4">
        <v-skeleton-loader type="image" />
      </v-col>
      <v-col cols="12" md="8">
        <v-skeleton-loader type="heading, text@3" />
      </v-col>
    </v-row>

    <!-- Erreur -->
    <v-alert v-else-if="error" type="error" class="my-4">
      {{ error }}
    </v-alert>

    <!-- Détail du personnage -->
    <template v-else>
      <v-btn to="/" variant="text" class="mb-4">
        <v-icon icon="mdi-arrow-left" class="mr-1" />
        Retour à la liste
      </v-btn>

      <v-row>
        <!-- Image -->
        <v-col cols="12" md="4">
          <v-img
            :src="character.image"
            :alt="character.name"
            rounded="lg"
          />
        </v-col>

        <!-- Informations -->
        <v-col cols="12" md="8">
          <h1 class="text-h3 mb-4">{{ character.name }}</h1>

          <v-chip
            :color="statusColor(character.status)"
            class="mr-2 mb-4"
          >
            {{ character.status }}
          </v-chip>
          <v-chip class="mb-4" variant="outlined">
            {{ character.species }}
          </v-chip>

          <v-list lines="two">
            <v-list-item prepend-icon="mdi-gender-male-female">
              <v-list-item-title>Genre</v-list-item-title>
              <v-list-item-subtitle>{{ character.gender }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item prepend-icon="mdi-earth">
              <v-list-item-title>Origine</v-list-item-title>
              <v-list-item-subtitle>{{ character.origin?.name }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item prepend-icon="mdi-map-marker">
              <v-list-item-title>Localisation</v-list-item-title>
              <v-list-item-subtitle>{{ character.location?.name }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item prepend-icon="mdi-television">
              <v-list-item-title>Épisodes</v-list-item-title>
              <v-list-item-subtitle>Apparaît dans {{ character.episode?.length }} épisode(s)</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// État réactif
const character = ref(null)
const loading = ref(true)
const error = ref(null)

function statusColor(status) {
  const colors = { Alive: 'green', Dead: 'red', unknown: 'grey' }
  return colors[status] || 'grey'
}

// Chargement du personnage au montage
onMounted(async () => {
  try {
    const id = route.params.id
    const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`)

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`)
    }

    character.value = await response.json()
  } catch (err) {
    error.value = `Impossible de charger le personnage : ${err.message}`
  } finally {
    loading.value = false
  }
})
</script>
