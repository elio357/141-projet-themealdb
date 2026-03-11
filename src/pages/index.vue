<template>
  <v-container>
    <h1 class="text-h4 my-4">Meal Explorer</h1>

    <!-- Chargement -->
    <v-row v-if="loading">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="image, article" />
      </v-col>
    </v-row>

    <!-- Erreur -->
    <v-alert v-else-if="error" type="error" class="my-4">
      {{ error }}
    </v-alert>

    <!-- Liste -->
    <v-row v-else>
      <v-col cols="12">
        <p>{{ meals.length }} plat(s) chargé(s)</p>
      </v-col>

      <v-col
          v-for="meal in meals"
          :key="meal.idMeal"
          cols="12"
          sm="6"
          md="4"
          lg="3"
      >
        <v-card :to="`/meal/${meal.idMeal}`" class="h-100" hover>
          <v-img
              :src="meal.strMealThumb"
              :alt="meal.strMeal"
              height="200"
              cover
          />
          <v-card-title>{{ meal.strMeal }}</v-card-title>
          <v-card-text>
            <v-chip color="primary" size="small">
              Plat
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const meals = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=a')

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`)
    }

    const data = await response.json()
    meals.value = data.meals || []
  } catch (err) {
    error.value = `Impossible de charger les plats : ${err.message}`
  } finally {
    loading.value = false
  }
})
</script>