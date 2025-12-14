# Memo Table - Nuxt Project

Un projet Nuxt qui affiche un tableau de 0 à 9 permettant d'associer une icône à chaque chiffre.

## Installation

```bash
npm install
```

## Développement

Lancez le serveur de développement :

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Fonctionnalités

- Tableau affichant les chiffres de 0 à 9
- Sélection d'un chiffre pour lui associer une icône
- Bibliothèque d'icônes variées (fruits, animaux, véhicules, etc.)
- Possibilité de supprimer une icône associée
- Interface moderne et responsive avec Tailwind CSS

## Technologies

- Nuxt 3
- Vue 3
- TypeScript
- Tailwind CSS

## Déploiement sur GitHub Pages

Le projet est configuré pour être déployé automatiquement sur GitHub Pages via GitHub Actions.

### Configuration requise

1. **Activer GitHub Pages dans les paramètres du repository** :
   - Allez dans `Settings` > `Pages`
   - Sous `Source`, sélectionnez `GitHub Actions`

2. **Mettre à jour le workflow** (si nécessaire) :
   - Si votre repository n'est pas à la racine de votre compte GitHub, modifiez la variable `NUXT_PUBLIC_BASE_URL` dans `.github/workflows/deploy.yml`
   - Pour un repository à la racine : `baseURL: '/'`
   - Pour un repository dans un sous-dossier : `baseURL: '/nom-du-repo/'`

3. **Le déploiement se fait automatiquement** :
   - À chaque push sur la branche `main`
   - Ou manuellement via l'onglet `Actions` > `Deploy to GitHub Pages` > `Run workflow`

Le site sera disponible à l'adresse : `https://votre-username.github.io/memo-table/`

