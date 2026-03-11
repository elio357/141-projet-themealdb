# Rick & Morty Explorer

Application Vue.js 3 + Vuetify 3 — code de départ pour le cours C141.

**[Voir la démo en ligne](https://fallinov.github.io/esig-141-demo-vuetify-api/)**

![Page d'accueil](docs/screenshots/home.png)

## Objectif

Compléter l'application en suivant les étapes du cours :

0. **Config** — Palette de couleurs Rick & Morty + favicon
1. **Découvrir l'API** — Requête GET dans Bruno, explorer le JSON
2. **API + affichage** — Charger et afficher les personnages avec `fetch()`
3. **Page statique** — Remplir la page À propos avec des composants Vuetify
4. **Navigation** — Ajouter un menu de navigation latéral
5. **Déploiement** — Déployer sur Vercel
6. **Fiche détail** (bonus) — Route dynamique, page détail d'un personnage

La branche [`solution`](https://github.com/fallinov/esig-141-demo-vuetify-api/tree/solution) contient le résultat final. Voir [`etapes-demo.md`](etapes-demo.md) pour le guide complet.

## Aperçu de la solution

| Page d'accueil | Fiche détail | À propos |
|:-:|:-:|:-:|
| ![Accueil](docs/screenshots/home.png) | ![Détail](docs/screenshots/character-detail.png) | ![À propos](docs/screenshots/about.png) |

## Installation

```bash
git clone https://github.com/fallinov/esig-141-demo-vuetify-api.git
cd esig-141-demo-vuetify-api
npm install
npm run dev
```

L'application s'ouvre sur [http://localhost:3000](http://localhost:3000).

## Structure

```
public/
├── favicon.ico          # Favicon multi-tailles (16, 32, 48px)
└── favicon.png          # Favicon PNG (silhouettes Rick & Morty)
src/
├── App.vue              # Layout (app-bar + footer)
├── main.js              # Point d'entrée
├── pages/
│   ├── index.vue        # TODO : Liste des personnages (route /)
│   └── about.vue        # TODO : Page statique (route /about)
├── plugins/
│   ├── index.js         # Enregistrement des plugins
│   └── vuetify.js       # Configuration Vuetify (dark theme)
├── router/
│   └── index.js         # Routes auto-générées (unplugin-vue-router)
└── stores/
    └── index.js         # Pinia store
```

## API Rick and Morty

- **URL** : [`https://rickandmortyapi.com/api/character`](https://rickandmortyapi.com/api/character)
- **Documentation** : [rickandmortyapi.com/documentation](https://rickandmortyapi.com/documentation)
- **Réponse** : `{ info: {...}, results: [...] }`
- **Champs utiles** : `id`, `name`, `status`, `species`, `image`

## Stack

- [Vue.js 3](https://vuejs.org/) — Composition API
- [Vuetify 3](https://vuetifyjs.com/) — Composants Material Design
- [Vue Router 4](https://router.vuejs.org/) + unplugin-vue-router (routage automatique)
- [Vite](https://vitejs.dev/) — Build tool
