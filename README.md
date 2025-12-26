# Famille Tameghe · Arbre généalogique interactif

Plateforme web destinée à rassembler les membres de la grande famille Bamougoum (Ouest Cameroun) autour d’un arbre généalogique vivant : visualisation complète des lignées, dashboard d’administration pour gérer les membres, loader sonore « pu su pepong » et design chaleureux respectant les rôles de chaque génération.

## 🎯 Objectifs

- Répertorier tous les membres (ancêtres, oncles, tantes, cousins, petits-enfants…).
- Représenter les unions complexes (polygamie, divorces, remariages) sans dupliquer l’information.
- Offrir un tableau de bord pour créer/relier les personnes, définir les couleurs de cadres et téléverser les photos.
- Garantir une expérience accueillante : loader animé, son d’accueil, navigation fluide (zoom + drag) et modals détaillés.

## ✨ Fonctionnalités clés

1. **Arbre généalogique interactif**
   - Layout hiérarchique avec `react-d3-tree` (ou équivalent d3) et support du zoom/drag.
   - Traits et connecteurs personnalisés pour montrer parents, unions multiples et descendants.
   - Modal détaillée au clic (biographie, âges, unions, enfants, filtres par branche ou génération).

2. **Dashboard d’administration**
   - CRUD sur les membres (prénom, nom, dates, genre, photo, couleur de cadre).
   - Gestion des unions : mariage, concubinage, divorce, séparation.
   - Attribution automatique des relations enfants ↔ parents (max 2 parents biologiques/adoptifs par membre).

3. **Identité visuelle**
   - Thème clair, palette sable/doré/vert eucalyptus adaptée aux rôles :
     - Chef de famille : cadre doré.
     - Oncles/tantes : bleu nuit.
     - Petits-enfants : corail.
     - Arrière-petits-enfants : menthe.
   - Loader plein écran + audio d’accueil « pu su pepong ».

4. **Expérience utilisateur**
   - Responsive (desktop/tablette/mobile), navigation latérale, légende des couleurs.
   - Filtres (branche, génération) et recherche par nom.
   - Animations légères (hover, sélection).

## 🗄️ Supabase & Modèle de données

| Table        | Champs principaux | Rôle |
|--------------|------------------|------|
| `members`    | `id (uuid)`, `prenom`, `nom`, `date_naissance`, `date_deces?`, `genre`, `photo_url?`, `cadre_couleur`, `generation_index`, `bio?`, `created_at` | Source de vérité pour chaque personne. |
| `relationships` | `id`, `parent_id`, `enfant_id`, `type_relation` (biologique, adoptif, alliance) | Contrainte logique pour limiter à deux parents par enfant. |
| `unions`     | `id`, `partenaire_a_id`, `partenaire_b_id`, `date_debut`, `date_fin?`, `type_relation`, `notes?` | Supporte polygamie, divorces, remariages. |
| (Optionnel) `member_tags` | `member_id`, `label`, `color` | Tags libres (branche maternelle, diaspora…). |

**Règles Supabase**
- RLS activées (lecture publique, écriture restreinte via dashboard ou session authentifiée).
- Edge Functions / triggers pour vérifier qu’un enfant ne dépasse jamais deux parents actifs.

## 🧱 Architecture front-end

- **Framework** : React 19 + Vite + TypeScript.
- **UI** : CSS Modules / Tailwind (à définir) + Motion (`framer-motion`) pour animations ciblées.
- **Routing** : `react-router-dom` (`/` arbre, `/admin` dashboard, `/member/:id` modal deep link).
- **State management** : `zustand` pour les filtres globaux et le membre sélectionné.
- **Data layer** : `@supabase/supabase-js`, hooks de fetching (`useFamilyTree`, `useMembers`, `useUnions`) + SWR ou React Query pour cache temps réel.
- **Arbre** : `react-d3-tree` (ou `@visx/hierarchy`) enveloppé dans un composant `TreeCanvas` avec configuration responsive.
- **Audio** : composant `WelcomeAudio` (Web Audio API) déclenché après consentement utilisateur.

```
src/
├─ supabase/
│  ├─ client.ts            # Singleton Supabase
│  ├─ types.ts             # Types générés (supabase gen types)
│  └─ hooks/
├─ components/
│  ├─ tree/
│  ├─ dashboard/
│  ├─ modals/
│  └─ loader/
├─ pages/
│  ├─ FamilyTreePage.tsx
│  └─ AdminDashboardPage.tsx
├─ context/
└─ utils/
```

## ⚙️ Installation & scripts

### Prérequis
- Node.js ≥ 20 (LTS recommandé).
- Compte Supabase + projet configuré (URL + clé anon/public).
- Fichier audio `public/audio/pu-su-pepong.mp3` ou URL remote.

### Étapes
```bash
# 1. Installer les dépendances
npm install

# 2. Copier l'exemple d'environnement
cp .env.example .env.local

# 3. Renseigner les clés Supabase
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# 4. Lancer le projet
npm run dev
```

Scripts disponibles :

| Script        | Description |
|---------------|-------------|
| `npm run dev` | Lance Vite en mode développement. |
| `npm run build` | Compile TypeScript + bundle production. |
| `npm run preview` | Sert le build localement. |
| `npm run lint` | Vérifie les règles ESLint/TypeScript. |

## 🔐 Variables d’environnement

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL du projet Supabase. |
| `VITE_SUPABASE_ANON_KEY` | Clé publique anonyme. |
| `VITE_WELCOME_AUDIO_URL` *(optionnel)* | URL personnalisée du son d’accueil. |

## 🛣️ Roadmap (prochaine itération)

1. Ajouter l’authentification Supabase (roles admin/modérateur).
2. Construire le builder graphique des unions (drag & drop pour relier les parents).
3. Générer des exports PDF/PNG de l’arbre.
4. Ajouter un mode « timeline » pour voir l’évolution historique.

## 🤝 Contribution

1. Fork → nouvelle branche.
2. Implémenter des changements ciblés + tests.
3. Créer une Pull Request en décrivant la génération impactée (interface, data, UX).

## 📜 Licence

Projet familial à usage privé. Merci de respecter les données sensibles des membres.
