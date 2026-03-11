Oui — on peut reprendre **exactement la logique du projet Rick & Morty**, mais en l’adaptant à **TheMealDB**.

Le plus propre pour ton projet, c’est de faire une app du style :

**Nom du projet : Meal Explorer**
Une app Vue + Vuetify qui :

* affiche une liste de plats
* permet de voir une fiche détail
* a une page À propos
* a un menu de navigation
* consomme l’API **TheMealDB**

Je vais te le structurer **comme le document de ton enseignant**, mais pour **ton API**.

---

# Étapes de la démo — Meal Explorer

## Idée générale du projet

Ton application peut avoir :

* **Page d’accueil** : liste de plats
* **Page À propos** : présentation du projet et de l’API
* **Bonus : page détail** d’un plat
* **Menu de navigation**
* **Déploiement sur Vercel**

Comme l’API MealDB est un peu différente de Rick & Morty, il faut choisir **une stratégie simple** pour la page d’accueil.

Le meilleur choix pour un projet étudiant simple est :

### Option recommandée pour la page d’accueil

Utiliser :

```txt
https://www.themealdb.com/api/json/v1/1/search.php?f=a
```

Cette URL retourne tous les plats qui commencent par la lettre **a**.

Pourquoi c’est bien :

* ça retourne directement une **liste**
* chaque plat a déjà :

    * `idMeal`
    * `strMeal`
    * `strMealThumb`
* donc parfait pour faire des **cards**
* plus simple que `search.php?s=` si tu ne veux pas encore gérer un champ de recherche

---

# Plan du projet

| Étape                    | Durée   | Contenu                                           |
| ------------------------ | ------- | ------------------------------------------------- |
| 0. Config Vuetify        | ~5 min  | Palette de couleurs food + favicon                |
| 1. Découvrir l’API       | ~15 min | Tester l’API dans Bruno/Postman, explorer le JSON |
| 2. Appel API + affichage | ~30 min | `fetch()`, cards, images, chips                   |
| 3. Page À propos         | ~15 min | Présentation du projet et de l’API                |
| 4. Menu de navigation    | ~20 min | Drawer, hamburger, routage                        |
| 5. Déploiement Vercel    | ~10 min | GitHub + Vercel                                   |
| 6. Fiche détail (bonus)  | ~20 min | Route dynamique `/meal/:id`                       |

---

# Prérequis

* Node.js installé
* Projet Vuetify créé
* `npm install`
* `npm run dev`
* projet ouvert dans WebStorm

---

# Structure du projet conseillé

```txt
src/
  pages/
    index.vue
    about.vue
    meal/
      [id].vue
  plugins/
    vuetify.js
  App.vue
public/
  favicon.png
index.html
```

---

# Introduction — Anatomie d’un composant Vue

Comme ton prof l’a fait, tu peux rappeler :

* `<template>` = ce qu’on voit
* `<script setup>` = logique JS
* `<style>` = CSS si besoin

---

# Étape 0 — Configuration initiale

## Palette de couleurs Meal Explorer

Dans `src/plugins/vuetify.js`, tu peux mettre une palette plus cuisine / food :

```js
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
```

## Favicon

Dans `index.html` :

```html
<link rel="icon" type="image/png" href="/favicon.png">
```

Tu peux mettre une petite icône assiette, fourchette ou burger dans `public/favicon.png`.

---

# Étape 1 — Découvrir l’API avec Bruno

## Théorie à présenter

* API REST
* méthode GET
* JSON
* tester l’API avant de coder

## Requêtes utiles à tester

### 1. Liste de plats par première lettre

```txt
https://www.themealdb.com/api/json/v1/1/search.php?f=a
```

### 2. Détail d’un plat

```txt
https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772
```

### 3. Liste des catégories

```txt
https://www.themealdb.com/api/json/v1/1/categories.php
```

### 4. Filtrer par catégorie

```txt
https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood
```

## Ce qu’il faut observer dans le JSON

Pour `search.php?f=a`, la réponse ressemble à ça :

```json
{
  "meals": [
    {
      "idMeal": "52771",
      "strMeal": "Spicy Arrabiata Penne",
      "strMealThumb": "https://..."
    }
  ]
}
```

Donc pour la liste, ce qu’on veut récupérer c’est :

```js
data.meals
```

### Champs utiles pour l’accueil

* `idMeal`
* `strMeal`
* `strMealThumb`

### Champs utiles pour la page détail

* `strCategory`
* `strArea`
* `strInstructions`
* `strYoutube`
* `strIngredient1...strIngredient20`
* `strMeasure1...strMeasure20`

## Points à souligner

* ici, la liste est dans **`meals`**
* contrairement à Rick & Morty, il n’y a pas `results`
* donc il faut faire attention à la structure JSON
* parfois `meals` peut être `null` si rien n’est trouvé

---

# Étape 2 — Appel API + affichage des plats

## Objectif

Afficher une grille de plats sur la page d’accueil.

## Fichier

`src/pages/index.vue`

---

## Exemple complet de `index.vue`

```vue
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
```

---

## Ce qu’il faut expliquer

* `fetch()` envoie la requête
* `await` attend la réponse
* `response.ok` vérifie si tout va bien
* `await response.json()` transforme le JSON en objet JS
* `meals.value = data.meals || []`

    * très important
    * car parfois `data.meals` peut être `null`

---

## Différences importantes avec Rick & Morty

Dans Rick & Morty :

```js
characters.value = data.results
```

Dans MealDB :

```js
meals.value = data.meals || []
```

Donc si tu copies le projet du prof, il faut **remplacer `results` par `meals`**.

---

## Erreurs fréquentes

| Symptôme              | Cause probable          | Solution                      |   |     |
| --------------------- | ----------------------- | ----------------------------- | - | --- |
| `0 plat(s) chargé(s)` | mauvaise propriété JSON | utiliser `data.meals`         |   |     |
| erreur sur `.length`  | `meals` vaut `null`     | faire `data.meals             |   | []` |
| images absentes       | mauvais champ           | utiliser `meal.strMealThumb`  |   |     |
| titre vide            | mauvais champ           | utiliser `meal.strMeal`       |   |     |
| problème de boucle    | mauvaise clé            | utiliser `:key="meal.idMeal"` |   |     |

---

# Étape 3 — Page À propos

## Objectif

Créer une page statique pour expliquer le projet.

## Fichier

`src/pages/about.vue`

## Exemple

```vue
<template>
  <v-container>
    <h1 class="text-h4 my-4">À propos</h1>

    <v-card class="mb-4">
      <v-card-title>
        <v-icon icon="mdi-food" class="mr-2" />
        Meal Explorer
      </v-card-title>
      <v-card-text>
        Application de démonstration réalisée avec
        <strong>Vue.js 3</strong> et <strong>Vuetify 3</strong>,
        qui consomme l’API publique <strong>TheMealDB</strong>.
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
          <v-list-item prepend-icon="mdi-sign-direction" title="Vue Router" subtitle="Navigation entre pages" />
          <v-list-item prepend-icon="mdi-api" title="TheMealDB API" subtitle="Plats, catégories, recettes" />
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
</script>
```

---

# Étape 4 — Menu de navigation

## Objectif

Faire un drawer comme dans le projet du prof.

## `App.vue`

```vue
<template>
  <v-app>
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

    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-app-bar-title>
        <RouterLink to="/" class="text-decoration-none d-flex align-center" style="color: inherit">
          <img src="/favicon.png" alt="Meal Explorer" width="28" height="28" class="mr-2">
          Meal Explorer
        </RouterLink>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>

    <v-footer class="text-center">
      <v-col>
        Projet Vue + Vuetify — {{ currentYear }} —
        API
        <a
          href="https://www.themealdb.com/api.php"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary"
        >
          TheMealDB
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
  { title: 'Accueil', to: '/', icon: 'mdi-silverware-fork-knife' },
  { title: 'À propos', to: '/about', icon: 'mdi-information' },
]
</script>
```

---

# Étape 5 — Déploiement sur Vercel

Même logique que le projet du prof :

1. push sur GitHub
2. aller sur Vercel
3. importer le dépôt
4. deploy
5. tester sur mobile

---

# Étape 6 — Bonus : fiche détail d’un plat

Là, on utilise :

```txt
https://www.themealdb.com/api/json/v1/1/lookup.php?i=ID
```

Par exemple :

```txt
https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772
```

## Fichier

`src/pages/meal/[id].vue`

## Exemple complet

```vue
<template>
  <v-container>
    <v-row v-if="loading">
      <v-col cols="12" md="4">
        <v-skeleton-loader type="image" />
      </v-col>
      <v-col cols="12" md="8">
        <v-skeleton-loader type="heading, text@5" />
      </v-col>
    </v-row>

    <v-alert v-else-if="error" type="error" class="my-4">
      {{ error }}
    </v-alert>

    <template v-else-if="meal">
      <v-btn to="/" variant="text" class="mb-4">
        <v-icon icon="mdi-arrow-left" class="mr-1" />
        Retour à la liste
      </v-btn>

      <v-row>
        <v-col cols="12" md="4">
          <v-img :src="meal.strMealThumb" :alt="meal.strMeal" rounded="lg" />
        </v-col>

        <v-col cols="12" md="8">
          <h1 class="text-h4 mb-4">{{ meal.strMeal }}</h1>

          <v-chip color="primary" class="mr-2 mb-2">
            {{ meal.strCategory }}
          </v-chip>

          <v-chip color="secondary" class="mb-2">
            {{ meal.strArea }}
          </v-chip>

          <v-card class="mt-4 mb-4">
            <v-card-title>Instructions</v-card-title>
            <v-card-text>
              {{ meal.strInstructions }}
            </v-card-text>
          </v-card>

          <v-btn
            v-if="meal.strYoutube"
            :href="meal.strYoutube"
            target="_blank"
            color="error"
          >
            Voir sur YouTube
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const meal = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const id = route.params.id
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`)
    }

    const data = await response.json()
    meal.value = data.meals ? data.meals[0] : null

    if (!meal.value) {
      throw new Error('Plat introuvable')
    }
  } catch (err) {
    error.value = `Impossible de charger le détail : ${err.message}`
  } finally {
    loading.value = false
  }
})
</script>
```

---

# Ce qu’il faut bien comprendre pour la fiche détail

Contrairement à Rick & Morty où le détail renvoie directement un objet, ici :

```js
const data = await response.json()
meal.value = data.meals[0]
```

Parce que `lookup.php?i=...` renvoie aussi un tableau `meals`.

Donc il faut récupérer le **premier élément**.

---

# Bonus encore mieux : afficher les ingrédients

TheMealDB a les ingrédients dans des champs séparés :

* `strIngredient1`
* `strIngredient2`
* ...
* `strIngredient20`

et pareil pour les quantités :

* `strMeasure1`
* `strMeasure2`
* ...

Tu peux transformer ça avec une fonction :

```js
function getIngredients(meal) {
  const ingredients = []

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient,
        measure,
      })
    }
  }

  return ingredients
}
```

Puis dans le template :

```html
<v-card class="mt-4">
  <v-card-title>Ingrédients</v-card-title>
  <v-card-text>
    <v-list density="compact">
      <v-list-item
        v-for="item in ingredients"
        :key="item.ingredient"
        :title="item.ingredient"
        :subtitle="item.measure"
      />
    </v-list>
  </v-card-text>
</v-card>
```

Et dans le script :

```js
import { computed } from 'vue'

const ingredients = computed(() => {
  if (!meal.value) return []
  return getIngredients(meal.value)
})
```

Ça, ça fait très propre dans un projet étudiant.

---

# Version “projet de base” à rendre

Voici ce que je te conseille de faire au minimum :

## Minimum demandé

* page `/` avec liste de plats
* page `/about`
* menu de navigation
* appel API avec `fetch`
* loading
* gestion d’erreur
* cards responsive
* déploiement Vercel

## Bonus fort

* page détail `/meal/:id`
* ingrédients
* lien YouTube
* filtre par catégorie

---

# Checklist adaptée à ton projet

## Mise en place

* [ ] créer projet Vuetify
* [ ] lancer `npm install`
* [ ] lancer `npm run dev`
* [ ] push sur GitHub

## Configuration

* [ ] changer le titre dans `index.html`
* [ ] ajouter un favicon
* [ ] personnaliser `src/plugins/vuetify.js`

## Pages

* [ ] `src/pages/index.vue`
* [ ] `src/pages/about.vue`
* [ ] bonus : `src/pages/meal/[id].vue`

## Appel API

* [ ] utiliser `fetch()`
* [ ] utiliser `onMounted`
* [ ] gérer `loading`
* [ ] gérer `error`
* [ ] utiliser `response.ok`
* [ ] récupérer `data.meals`

## Composants Vuetify

* [ ] `v-card`
* [ ] `v-img`
* [ ] `v-chip`
* [ ] `v-row`
* [ ] `v-col`
* [ ] `v-alert`
* [ ] `v-skeleton-loader`

## Navigation

* [ ] `v-navigation-drawer`
* [ ] hamburger
* [ ] `RouterView`
* [ ] titre cliquable

## Déploiement

* [ ] GitHub
* [ ] Vercel
* [ ] test mobile

---

# Le point le plus important pour ne pas te tromper

Avec **TheMealDB**, les réponses sont souvent dans :

```js
data.meals
```

et pas dans :

```js
data.results
```

Donc ton projet sera le même que celui du prof, mais avec ces remplacements :

### Rick & Morty

* `characters`
* `results`
* `character.id`
* `character.name`
* `character.image`

### TheMealDB

* `meals`
* `meals`
* `meal.idMeal`
* `meal.strMeal`
* `meal.strMealThumb`

---

# Ce que tu peux dire à l’oral / dans ton rapport

> J’ai repris la structure du projet de démonstration Vue + Vuetify présenté en classe, mais en l’adaptant à l’API publique TheMealDB.
> L’application permet d’afficher une liste de plats sous forme de cartes, avec image et nom, puis d’accéder à une fiche détail via une route dynamique.
> Le projet utilise `fetch()` avec `async/await`, le pattern `loading / error / data`, une navigation avec Vuetify et un déploiement sur Vercel.

---

# Mon conseil concret

Pour éviter de te disperser, fais dans cet ordre :

1. créer `index.vue` avec la liste de plats
2. faire marcher l’API
3. faire `about.vue`
4. faire `App.vue` avec le menu
5. seulement après, ajouter la page détail

Comme ça tu sécurises déjà le minimum.

Je peux maintenant te donner directement le **code complet des 3 fichiers principaux** :

* `src/pages/index.vue`
* `src/pages/about.vue`
* `src/App.vue`

prêts à copier-coller pour ton projet MealDB.
