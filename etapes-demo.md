# Étapes de la démo — Rick & Morty Explorer

Code de départ : branche [`main`](https://github.com/fallinov/esig-141-demo-vuetify-api/tree/main) | Solution : branche [`solution`](https://github.com/fallinov/esig-141-demo-vuetify-api/tree/solution)

| Étape | Durée | Contenu |
|-------|-------|---------|
| 0. Config Vuetify | ~5 min | Palette de couleurs Rick & Morty + favicon |
| 1. Découvrir l'API | ~15 min | Requête GET dans Bruno, explorer le JSON |
| 2. Appel API + affichage | ~30 min | `fetch()`, [`v-card`](https://vuetifyjs.com/en/components/cards/), [`v-img`](https://vuetifyjs.com/en/components/images/), [`v-chip`](https://vuetifyjs.com/en/components/chips/) |
| 3. Page À propos | ~15 min | Page statique : [`v-card`](https://vuetifyjs.com/en/components/cards/), [`v-icon`](https://vuetifyjs.com/en/components/icons/), [`v-list`](https://vuetifyjs.com/en/components/lists/) |
| 4. Menu de navigation | ~20 min | [`v-navigation-drawer`](https://vuetifyjs.com/en/components/navigation-drawers/), hamburger, routage |
| 5. Déploiement Vercel | ~10 min | Import GitHub, deploy, test mobile |
| 6. Fiche de détail (bonus) | ~15 min | Route dynamique, `useRoute()`, [`v-skeleton-loader`](https://vuetifyjs.com/en/components/skeleton-loaders/), [`v-list`](https://vuetifyjs.com/en/components/lists/) |
| **Total** | **~1h35** | **+15 min si bonus** |

## Prérequis

- Node.js installé
- Projet cloné et ouvert dans WebStorm
- `npm install` effectué
- `npm run dev` lancé → [http://localhost:3000](http://localhost:3000)

## Introduction — Anatomie d'un composant Vue

Avant de commencer, présenter la structure d'un fichier `.vue` (Single File Component) :
[devjs.ch/vue/anatomie](https://devjs.ch/vue/anatomie.html)

Les élèves doivent comprendre les 3 blocs avant de toucher au code :

- `<template>` — le HTML (ce qu'on voit)
- `<script setup>` — le JavaScript (la logique)
- `<style>` — le CSS (optionnel dans cette démo, Vuetify s'en charge)

Ouvrir [`src/App.vue`](src/App.vue) et [`src/pages/index.vue`](src/pages/index.vue) pour montrer ces blocs en situation réelle.

### Appels API avec `fetch()` et `async/await`

Présenter le principe d'un appel API asynchrone :
[devjs.ch/api/utilisation-en-projet](https://devjs.ch/api/utilisation-en-projet.html)

- `fetch(url)` envoie une requête HTTP et retourne une **promesse**
- `await` met le code en pause jusqu'à ce que la réponse arrive
- `async` est obligatoire sur la fonction qui contient un `await`
- `try` — le code qui peut échouer (appel réseau, parsing JSON)
- `catch` — se déclenche si une erreur survient dans le `try`
- `finally` — s'exécute toujours, que ça ait marché ou non (utile pour couper le loading)
- `throw new Error(...)` — déclenche une erreur volontairement (ex : si le serveur répond 404)

## Configuration initiale — Palette de couleurs Rick & Morty

Dans [`src/plugins/vuetify.js`](src/plugins/vuetify.js), **remplacer tout le contenu du fichier** par :

```js
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

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
```

Cette palette personnalisée s'applique automatiquement à tous les composants Vuetify ([`v-btn`](https://vuetifyjs.com/en/components/buttons/), [`v-card`](https://vuetifyjs.com/en/components/cards/), [`v-chip`](https://vuetifyjs.com/en/components/chips/), etc.).

### Favicon du projet

Le fichier [`public/favicon.png`](public/favicon.png) contient les silhouettes de Rick & Morty (icône officielle de l'API).

Dans [`index.html`](index.html), remplacer la balise `<link rel="icon">` existante par :

```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" href="/favicon.png">
```

### Points à souligner

- Le favicon est l'icône affichée dans l'onglet du navigateur — un détail de finition important
- Deux formats : `.ico` (compatibilité anciens navigateurs) et `.png` (navigateurs modernes)
- Les fichiers dans `public/` sont servis tels quels à la racine du site par Vite

## Étape 1 — Découvrir l'API avec Bruno (~15 min)

### Théorie à présenter

- Qu'est-ce qu'une API REST : [devjs.ch/api/introduction](https://devjs.ch/api/introduction.html)
- Tester une API avant de coder : [devjs.ch/api/tester-son-api](https://devjs.ch/api/tester-son-api.html)
- Documentation de l'API : [rickandmortyapi.com/documentation](https://rickandmortyapi.com/documentation)

### Démo avec Bruno (ou Postman)

1. Ouvrir Bruno → **New Request**
2. Méthode **GET**, URL : `https://rickandmortyapi.com/api/character`
3. Cliquer **Send** → observer le code **200 OK** et la réponse JSON
4. Explorer la structure de la réponse :
   - `info` : métadonnées (count, pages, next, prev)
   - `results` : tableau de 20 personnages
5. Déplier un objet dans `results` → identifier les champs utiles :
   - `id`, `name`, `status`, `species`, `image` (URL d'une image)
6. Tester un personnage seul : `https://rickandmortyapi.com/api/character/1`
   - Montrer que c'est le même objet qu'un élément de `results`
7. Tester une URL invalide : `https://rickandmortyapi.com/api/character/99999`
   - Montrer le code **404** et le message d'erreur

### Points à souligner

- **Toujours tester l'API avant de coder** — on vérifie la structure du JSON
- Méthode GET = récupérer des données (lecture seule)
- Code HTTP **200** = succès, **404** = non trouvé
- La réponse est du **JSON** — JavaScript sait le lire nativement avec `response.json()`
- Pas besoin de clé d'API ici — l'API Rick and Morty est ouverte

## Étape 2 — Appel API et affichage des personnages (~30 min)

### Théorie à présenter

- `async/await`, `try/catch`, `fetch()` : [devjs.ch/api/utilisation-en-projet](https://devjs.ch/api/utilisation-en-projet.html)
- `ref()`, `onMounted` : [devjs.ch/vue/bases](https://devjs.ch/vue/bases.html)

### Rappel de la structure JSON (vue dans Bruno)

```
{ info: { count: 826, pages: 42 }, results: [ { id, name, status, species, image, ... }, ... ] }
```

On veut `data.results` — le tableau de personnages.

### Ce que les élèves codent dans [`index.vue`](src/pages/index.vue)

**1. Le fetch** — dans le bloc `try` existant du `onMounted` (remplacer le commentaire TODO) :

```js
const response = await fetch('https://rickandmortyapi.com/api/character')

if (!response.ok) {
  throw new Error(`Erreur HTTP ${response.status}`)
}

const data = await response.json()
characters.value = data.results
```

> **Vérification** : recharger la page → le texte doit afficher « 20 personnage(s) chargé(s) ». Si ça affiche 0, vérifier que `characters.value` a bien le `.value`.

**2. La fonction `statusColor`** — avant le `onMounted` :

Cette fonction retourne un nom de couleur selon le statut du personnage. On l'utilisera dans le template avec `:color="statusColor(character.status)"` pour colorer les chips automatiquement (vert = vivant, rouge = mort, gris = inconnu).

```js
function statusColor(status) {
  const colors = { Alive: 'green', Dead: 'red', unknown: 'grey' }
  return colors[status] || 'grey'
}
```

**3. Les cards** — dans le [`<v-row>`](https://vuetifyjs.com/en/components/grids/), remplacer le `<v-col>` existant (celui avec le TODO) :

```html
<v-col
  v-for="character in characters"
  :key="character.id"
  cols="12" sm="6" md="4" lg="3"
>
  <v-card class="h-100">
    <v-img :src="character.image" :alt="character.name" height="200" cover />
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
```

> **Vérification** : recharger la page → les 20 personnages s'affichent en grille avec leurs images et chips colorés.

![Résultat étape 2 — Grille de personnages](docs/screenshots/home.png)

### Erreurs fréquentes

| Symptôme | Cause probable | Solution |
|----------|---------------|----------|
| « 0 personnage(s) chargé(s) » | Oubli de `.value` | Écrire `characters.value = data.results` (pas `characters = data.results`) |
| Chip toujours grise | Oubli des `:` devant `color` | Écrire `:color="..."` (avec les deux-points), pas `color="..."` |
| Erreur « key is required » | Oubli de `:key` | Ajouter `:key="character.id"` sur le `<v-col>` du `v-for` |
| Image ne s'affiche pas | Oubli des `:` devant `src` | Écrire `:src="character.image"` (binding), pas `src="character.image"` (texte) |

### Points à souligner

- Le pattern **loading / error / data** avec `v-if / v-else-if / v-else` — déjà en place dans le template ([`v-skeleton-loader`](https://vuetifyjs.com/en/components/skeleton-loaders/), [`v-alert`](https://vuetifyjs.com/en/components/alerts/))
- `fetch()` retourne une **promesse** → on utilise `await` pour attendre la réponse
- `response.ok` vérifie que le code HTTP est 200-299 (pas une erreur)
- `response.json()` transforme le texte JSON en objet JavaScript
- [`v-row`](https://vuetifyjs.com/en/components/grids/) / `v-col` = système de grille 12 colonnes (responsive avec `cols`, `sm`, `md`, `lg`)
- `v-for` avec `:key` obligatoire — Vue a besoin d'identifier chaque élément
- [`v-card`](https://vuetifyjs.com/en/components/cards/) = conteneur avec [`v-card-title`](https://vuetifyjs.com/en/components/cards/#v-card-title), [`v-card-text`](https://vuetifyjs.com/en/components/cards/#v-card-text), actions
- [`v-img`](https://vuetifyjs.com/en/components/images/) avec `cover` pour uniformiser les tailles d'images
- [`v-chip`](https://vuetifyjs.com/en/components/chips/) avec `:color` dynamique — le `:` indique un binding JavaScript

### Astuce démo — Voir les skeleton loaders en action

Les skeleton loaders disparaissent trop vite en local car l'API répond en quelques millisecondes. Pour les montrer aux élèves :

1. Ouvrir les **DevTools** du navigateur (F12)
2. Aller dans l'onglet **Network** (Réseau)
3. Cocher **Disable cache**
4. Dans le menu déroulant de throttling (par défaut « No throttling »), choisir **Slow 3G**
5. Recharger la page → les skeletons s'affichent pendant plusieurs secondes
6. Montrer comment le squelette reprend la forme de la grille finale (image + titre + texte)
7. Remettre « No throttling » après la démo

> C'est aussi l'occasion de montrer l'onglet Network : on y voit la requête `character`, le temps de réponse, le code 200, et le JSON retourné.

## Étape 3 — Page À propos (~15 min)

### Théorie à présenter

- Composants Vuetify : [vuetifyjs.com/components/all](https://vuetifyjs.com/en/components/all/)
- SFC (Single File Component) : [devjs.ch/vue/anatomie](https://devjs.ch/vue/anatomie.html)

### Ce que les élèves codent dans [`about.vue`](src/pages/about.vue)

Page 100% statique — le `<script setup>` reste vide, on ne travaille que dans le `<template>`.

Ajouter dans le [`<v-container>`](https://vuetifyjs.com/en/components/grids/#v-container), après le `<h1>` :

```html
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
```

![Résultat étape 3 — Page À propos](docs/screenshots/about.png)

### Points à souligner

- Pas de JavaScript nécessaire pour une page statique — le `<script setup>` reste vide
- [`v-card`](https://vuetifyjs.com/en/components/cards/) = conteneur principal Vuetify ([`v-card-title`](https://vuetifyjs.com/en/components/cards/#v-card-title), [`v-card-text`](https://vuetifyjs.com/en/components/cards/#v-card-text), actions)
- [`v-icon`](https://vuetifyjs.com/en/components/icons/) pour afficher des icônes MDI
- [`v-list`](https://vuetifyjs.com/en/components/lists/) / [`v-list-item`](https://vuetifyjs.com/en/components/lists/#v-list-item) avec `prepend-icon`, `title`, `subtitle` — tout déclaratif, zéro JS
- Icônes MDI : catalogue sur [pictogrammers.com/library/mdi](https://pictogrammers.com/library/mdi/)
- Tester la navigation : taper `/about` dans la barre d'adresse → la page s'affiche

## Étape 4 — Menu de navigation (~20 min)

### Théorie à présenter

- Vue Router — introduction : [devjs.ch/vue-router/intro](https://devjs.ch/vue-router/intro.html)
- `<RouterView>` dans [`App.vue`](src/App.vue) affiche le composant de la route courante
- Le routage est **automatique** grâce à `unplugin-vue-router` : chaque fichier `.vue` dans `src/pages/` génère une route
  - `src/pages/index.vue` → `/`
  - `src/pages/about.vue` → `/about`
  - `src/pages/character/[id].vue` → `/character/:id` (paramètre dynamique)
- Montrer [`router/index.js`](src/router/index.js) — les routes sont importées depuis `vue-router/auto-routes`

### Ce que les élèves codent dans [`App.vue`](src/App.vue)

**1. Ajouter le drawer** — dans le `<template>`, juste avant le [`<v-app-bar>`](https://vuetifyjs.com/en/components/app-bars/) :

```html
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
```

**2. Ajouter le hamburger** — dans le `<v-app-bar>`, juste avant [`<v-app-bar-title>`](https://vuetifyjs.com/en/components/app-bars/#v-app-bar-title) :

```html
<v-app-bar-nav-icon @click="drawer = !drawer" />
```

**3. Rendre le titre cliquable avec le logo** — remplacer le contenu de `<v-app-bar-title>` :

```html
<v-app-bar-title>
  <RouterLink to="/" class="text-decoration-none d-flex align-center" style="color: inherit">
    <img src="/favicon.png" alt="Rick & Morty" width="28" height="28" class="mr-2">
    Rick & Morty Explorer
  </RouterLink>
</v-app-bar-title>
```

> On réutilise le fichier [`public/favicon.png`](public/favicon.png) (les silhouettes Rick & Morty) comme logo dans le header. On utilise un `<img>` natif plutôt que `<v-img>` pour éviter les problèmes de layout dans la barre de navigation. Les fichiers dans `public/` sont accessibles directement via `/` dans les URLs.

**4. Le script** — remplacer le contenu de `<script setup>` :

```js
import { ref } from 'vue'

const drawer = ref(false)
const currentYear = new Date().getFullYear()

const navItems = [
  { title: 'Personnages', to: '/', icon: 'mdi-account-group' },
  { title: 'À propos', to: '/about', icon: 'mdi-information' },
]
```

> **Vérification** : recharger la page → cliquer sur le hamburger ☰ → le menu s'ouvre → cliquer sur « À propos » → la page change et le drawer se ferme.

### Erreurs fréquentes

| Symptôme | Cause probable | Solution |
|----------|---------------|----------|
| Le drawer ne s'ouvre pas | `drawer` pas déclaré dans le script | Vérifier que `const drawer = ref(false)` est bien dans `<script setup>` |
| Le hamburger n'apparaît pas | Mauvais emplacement | Le `<v-app-bar-nav-icon>` doit être **dans** le `<v-app-bar>`, avant le `<v-app-bar-title>` |
| Erreur sur `navItems` | Oubli de la déclaration | Vérifier que le tableau `navItems` est dans le `<script setup>` |

### Points à souligner

- [`v-navigation-drawer`](https://vuetifyjs.com/en/components/navigation-drawers/) avec `v-model="drawer"` = binding bidirectionnel (ouvre/ferme le drawer)
- `temporary` = le drawer se superpose au contenu (comportement mobile)
- [`v-app-bar`](https://vuetifyjs.com/en/components/app-bars/) contient le hamburger ([`v-app-bar-nav-icon`](https://vuetifyjs.com/en/components/app-bars/#v-app-bar-nav-icon)) et le titre ([`v-app-bar-title`](https://vuetifyjs.com/en/components/app-bars/#v-app-bar-title))
- La prop `to` de Vuetify fonctionne comme `<RouterLink>` — pas besoin d'importer le composant
- `@click="drawer = !drawer"` = expression JS inline, inverse le booléen à chaque clic
- `<RouterLink to="/">` sur le titre = clic sur le logo ramène à l'accueil (convention UX courante)
- L'item actif est automatiquement mis en surbrillance par Vue Router

### Résultat final — `App.vue` complet

Pour vérifier son code, l'élève peut comparer avec le fichier complet. On y retrouve le layout Vuetify : [`v-app`](https://vuetifyjs.com/en/components/application/) → [`v-main`](https://vuetifyjs.com/en/components/application/#v-main) → [`v-footer`](https://vuetifyjs.com/en/components/footers/) :

```vue
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
```

## Étape 5 — Déploiement sur Vercel (~10 min)

### Théorie à présenter

- Vercel = plateforme de déploiement gratuite pour les projets frontend
- Connexion avec GitHub → déploiement automatique à chaque `git push`
- `npm run build` génère le dossier `dist/` → c'est ce que Vercel sert en production

### Procédure

1. Aller sur [vercel.com](https://vercel.com) et se connecter avec GitHub
2. Cliquer **Add New → Project**
3. Importer le dépôt `esig-141-demo-vuetify-api`
4. Vercel détecte Vite automatiquement — ne rien changer
5. Cliquer **Deploy**
6. Attendre ~1 min → l'URL de production s'affiche
7. Ouvrir l'URL sur son téléphone → vérifier le responsive

### Points à souligner

- Chaque `git push` déclenche un nouveau déploiement automatique
- L'URL est publique et accessible depuis n'importe quel appareil
- Vercel gère le HTTPS automatiquement
- C'est gratuit pour les projets personnels (Hobby plan)

## Étape 6 — Fiche de détail d'un personnage (bonus, si le temps le permet)

### Concepts introduits

- **Route dynamique** : `/character/:id` avec un paramètre dans l'URL
- `useRoute()` pour récupérer les paramètres de la route
- 2ème appel API : `fetch()` avec un `id` dynamique

### 1. Créer le fichier [`src/pages/character/[id].vue`](src/pages/character/[id].vue)

> Le nom du dossier `character/` et le fichier `[id].vue` (avec les crochets) génèrent automatiquement la route `/character/:id`. Pas besoin de toucher à `router/index.js`.

Composants utilisés : [`v-container`](https://vuetifyjs.com/en/components/grids/#v-container) / [`v-row`](https://vuetifyjs.com/en/components/grids/) / `v-col` (grille), [`v-skeleton-loader`](https://vuetifyjs.com/en/components/skeleton-loaders/), [`v-alert`](https://vuetifyjs.com/en/components/alerts/), [`v-btn`](https://vuetifyjs.com/en/components/buttons/), [`v-img`](https://vuetifyjs.com/en/components/images/), [`v-chip`](https://vuetifyjs.com/en/components/chips/), [`v-list`](https://vuetifyjs.com/en/components/lists/) / [`v-list-item`](https://vuetifyjs.com/en/components/lists/#v-list-item) / [`v-list-item-title`](https://vuetifyjs.com/en/components/lists/#v-list-item-title) / [`v-list-item-subtitle`](https://vuetifyjs.com/en/components/lists/#v-list-item-subtitle)

```vue
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
        <v-col cols="12" md="4">
          <v-img :src="character.image" :alt="character.name" rounded="lg" />
        </v-col>

        <v-col cols="12" md="8">
          <h1 class="text-h3 mb-4">{{ character.name }}</h1>

          <v-chip :color="statusColor(character.status)" class="mr-2 mb-4">
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

const character = ref(null)
const loading = ref(true)
const error = ref(null)

function statusColor(status) {
  const colors = { Alive: 'green', Dead: 'red', unknown: 'grey' }
  return colors[status] || 'grey'
}

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
```

> **Vérification** : taper `http://localhost:3000/character/1` dans la barre d'adresse → la fiche de Rick Sanchez s'affiche avec son image, son statut et ses infos. Si rien ne s'affiche, vérifier que le fichier est bien dans `src/pages/character/[id].vue` (avec les crochets).

![Résultat étape 6 — Fiche détail de Rick Sanchez](docs/screenshots/character-detail.png)

### 2. Rendre les cards cliquables dans [`index.vue`](src/pages/index.vue)

Ajouter la prop `to` et `hover` sur chaque `<v-card>` :

```html
<!-- Avant -->
<v-card class="h-100">

<!-- Après -->
<v-card :to="`/character/${character.id}`" class="h-100" hover>
```

> **Vérification** : retourner sur la page d'accueil → cliquer sur une card → la fiche du personnage s'affiche → cliquer « Retour à la liste » → on revient à la grille.

### Points à souligner

- `[id]` dans le nom de fichier = **paramètre dynamique** — génère automatiquement la route `/character/:id`
- `useRoute().params.id` récupère la valeur du paramètre (ex : `1` pour `/character/1`)
- Template literals `` `...${id}` `` pour construire l'URL dynamiquement
- `?.` (optional chaining) pour éviter les erreurs si `origin` ou `location` est `null`
- La prop `to` sur [`v-card`](https://vuetifyjs.com/en/components/cards/) la rend cliquable comme un lien — pas besoin de `@click`
- `hover` ajoute un effet visuel au survol pour indiquer que la card est cliquable
- [`v-btn`](https://vuetifyjs.com/en/components/buttons/) avec `to="/"` pour le bouton retour

## Vérification finale

- [ ] Page `/` : grille de 20 personnages avec images et chips colorés
- [ ] Page `/about` : 2 cards avec infos et liste de la stack technique
- [ ] Hamburger → ouvre le drawer → clic sur un lien → navigue et ferme le drawer
- [ ] Zéro erreur dans la console du navigateur (F12)
- [ ] App déployée sur Vercel et accessible depuis un téléphone
- [ ] (Bonus) Clic sur une card → fiche détaillée du personnage
- [ ] (Bonus) Bouton retour → revient à la liste

## Liens utiles

| Ressource | URL |
|-----------|-----|
| API Rick and Morty | [rickandmortyapi.com](https://rickandmortyapi.com) |
| API — documentation | [rickandmortyapi.com/documentation](https://rickandmortyapi.com/documentation) |
| Vuetify — tous les composants | [vuetifyjs.com/components/all](https://vuetifyjs.com/en/components/all/) |
| Icônes MDI | [pictogrammers.com/library/mdi](https://pictogrammers.com/library/mdi/) |
| Vue.js — bases | [devjs.ch/vue/bases](https://devjs.ch/vue/bases.html) |
| API — introduction | [devjs.ch/api/introduction](https://devjs.ch/api/introduction.html) |
| API — tester son API | [devjs.ch/api/tester-son-api](https://devjs.ch/api/tester-son-api.html) |
| API — utilisation en projet | [devjs.ch/api/utilisation-en-projet](https://devjs.ch/api/utilisation-en-projet.html) |
| Vue Router — introduction | [devjs.ch/vue-router/intro](https://devjs.ch/vue-router/intro.html) |
| Créer un projet Vuetify | [devjs.ch/vue/creer-app-vuetify](https://devjs.ch/vue/creer-app-vuetify.html) |

## Projet personnel — À faire pour le prochain cours

L'objectif est de **reproduire ce que l'on vient de faire** avec votre propre projet : une application Vue.js + Vuetify qui consomme une API publique de votre choix.

### Trouver une API publique

Choisir une API gratuite et sans authentification. Quelques idées :

| API | URL | Ressources |
|-----|-----|------------|
| PokéAPI | [pokeapi.co](https://pokeapi.co) | Pokémon, types, abilities |
| Studio Ghibli | [ghibliapi.dev](https://ghibliapi.dev) | Films, personnages, lieux |
| Star Wars | [swapi.dev](https://swapi.dev) | Films, personnages, planètes |
| The Dog API | [thedogapi.com](https://thedogapi.com) | Races de chiens, images |
| Open Meteo | [open-meteo.com](https://open-meteo.com) | Météo, prévisions |
| REST Countries | [restcountries.com](https://restcountries.com) | Pays, drapeaux, capitales |

> Tester l'API avec Bruno **avant** de commencer à coder — exactement comme on l'a fait à l'étape 1.

### Checklist du projet

#### Mise en place
- [ ] Créer un projet Vuetify : [devjs.ch/vue/creer-app-vuetify](https://devjs.ch/vue/creer-app-vuetify.html) (`npm create vuetify`, preset **Recommended**)
- [ ] Créer un dépôt GitHub et pousser le projet
- [ ] `npm install` + `npm run dev` → l'app tourne en local

#### Configuration
- [ ] Personnaliser le titre de l'application dans [`index.html`](index.html) (`<title>`)
- [ ] Ajouter un favicon personnalisé dans `public/` (`.ico` et/ou `.png`)
- [ ] Configurer les balises `<link rel="icon">` dans [`index.html`](index.html)
- [ ] Personnaliser le thème Vuetify dans [`src/plugins/vuetify.js`](src/plugins/vuetify.js) (couleurs, dark/light)

#### Pages (minimum 2)
- [ ] **Page d'accueil** : affiche une liste de ressources depuis l'API (cards, grille responsive)
- [ ] **Page À propos** : présentation du projet et de l'API utilisée (page statique)
- [ ] (Bonus) **Page de détail** : route dynamique `/ressource/:id` avec fiche détaillée

#### Appel API
- [ ] `fetch()` avec `async/await` dans un `onMounted`
- [ ] Gestion du chargement avec [`v-skeleton-loader`](https://vuetifyjs.com/en/components/skeleton-loaders/)
- [ ] Gestion des erreurs avec [`v-alert`](https://vuetifyjs.com/en/components/alerts/)
- [ ] Pattern `v-if="loading"` / `v-else-if="error"` / `v-else`
- [ ] Vérification de `response.ok` + `throw new Error(...)` si échec

#### Navigation
- [ ] Au moins 2 pages dans `src/pages/` (routage automatique via `unplugin-vue-router`)
  - `index.vue` → `/`, `about.vue` → `/about`, `ressource/[id].vue` → `/ressource/:id`
- [ ] Menu de navigation fonctionnel ([`v-navigation-drawer`](https://vuetifyjs.com/en/components/navigation-drawers/) ou [`v-app-bar`](https://vuetifyjs.com/en/components/app-bars/) avec liens)
- [ ] Titre cliquable qui ramène à l'accueil

#### Composants Vuetify (minimum)
- [ ] [`v-card`](https://vuetifyjs.com/en/components/cards/) pour afficher les ressources
- [ ] [`v-img`](https://vuetifyjs.com/en/components/images/) si l'API fournit des images
- [ ] [`v-chip`](https://vuetifyjs.com/en/components/chips/) ou autre composant pour mettre en valeur des données
- [ ] Grille responsive avec [`v-row`](https://vuetifyjs.com/en/components/grids/) / `v-col` et breakpoints (`cols`, `sm`, `md`, `lg`)

#### Déploiement
- [ ] Code poussé sur GitHub (`git add`, `git commit`, `git push`)
- [ ] Application déployée sur [Vercel](https://vercel.com)
- [ ] URL Vercel fonctionnelle et accessible depuis un téléphone
- [ ] Zéro erreur dans la console du navigateur (F12)

#### Qualité
- [ ] Code propre et indenté
- [ ] Pas de `console.log()` oubliés
- [ ] Noms de variables et composants cohérents
- [ ] Application responsive (testée sur mobile via Vercel)
