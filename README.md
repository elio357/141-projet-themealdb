# Rick & Morty Explorer

Application Vue.js 3 + Vuetify 3 qui consomme l'[API Rick and Morty](https://rickandmortyapi.com/) avec `fetch()`.

**3 pages** pour introduire les bases du routage Vue Router :

| Page | Route | Concept |
|------|-------|---------|
| Personnages | `/` | Appel API + affichage dynamique |
| Détail personnage | `/character/:id` | Route dynamique, `useRoute()` |
| À propos | `/about` | Page statique, composants Vuetify |

Navigation via `v-navigation-drawer` (hamburger menu).

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/fallinov/esig-141-demo-vuetify-api.git
cd esig-141-demo-vuetify-api

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application s'ouvre sur [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
├── App.vue              # Layout (drawer + v-app-bar + v-main + v-footer)
├── main.js              # Point d'entrée
├── pages/
│   ├── HomePage.vue     # Liste des personnages (API + v-card)
│   ├── CharacterPage.vue # Détail d'un personnage (route dynamique)
│   └── AboutPage.vue    # Page statique (présentation + stack)
├── components/          # Composants réutilisables
├── plugins/
│   ├── index.js         # Enregistrement des plugins
│   └── vuetify.js       # Configuration Vuetify (dark theme)
├── router/
│   └── index.js         # 3 routes (/, /character/:id, /about)
└── stores/
    └── index.js         # Pinia store
```

## Concepts clés

### Appel API avec `fetch()`

```js
const characters = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await fetch('https://rickandmortyapi.com/api/character')
    if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)
    const data = await response.json()
    characters.value = data.results
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
```

**3 états à gérer** : `loading` (chargement en cours), `error` (erreur réseau/serveur), `characters` (données).

### Navigation

```html
<!-- Menu latéral avec v-list-item cliquables -->
<v-list-item to="/" prepend-icon="mdi-account-group" title="Personnages" />
<v-list-item to="/about" prepend-icon="mdi-information" title="À propos" />
```

Vuetify supporte la prop `to` nativement — elle fonctionne comme `<RouterLink>`.

### Route dynamique

```js
// router/index.js
{ path: '/character/:id', name: 'character', component: CharacterPage }

// CharacterPage.vue
const route = useRoute()
const id = route.params.id
await fetch(`https://rickandmortyapi.com/api/character/${id}`)
```

## Stack

- [Vue.js 3](https://vuejs.org/) — Composition API
- [Vuetify 3](https://vuetifyjs.com/) — Composants Material Design
- [Vue Router 4](https://router.vuejs.org/)
- [Vite](https://vitejs.dev/) — Build tool
