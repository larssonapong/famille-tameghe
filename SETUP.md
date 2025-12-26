# Configuration Backend - Famille Tameghe

## 1. Configuration Supabase

### Créer le projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre `Project URL` et `anon/public key`

### Exécuter le schéma de base de données
1. Ouvrez le SQL Editor dans votre dashboard Supabase
2. Copiez le contenu de `supabase/schema.sql`
3. Exécutez le script pour créer les tables et politiques RLS

### Créer le compte admin
1. Dans Supabase Dashboard → Authentication → Users
2. Cliquez sur "Add user" → "Create new user"
3. Email: `famille@tameghe`
4. Password: `Azerty123@`
5. Confirmez l'email automatiquement (toggle "Auto Confirm User")

### Ajouter l'admin à la table admin_users
Exécutez cette requête SQL (remplacez `USER_UUID` par l'UUID de l'utilisateur créé):

```sql
INSERT INTO admin_users (id, email)
VALUES ('USER_UUID', 'famille@tameghe');
```

## 2. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine du projet:

```env
VITE_SUPABASE_URL=votre_project_url
VITE_SUPABASE_ANON_KEY=votre_anon_key
```

## 3. Migration des données

Les données fictives dans `src/data/mockFamily.ts` devront être migrées vers Supabase.
Un script de migration sera créé pour faciliter cette opération.

## 4. Démarrage

```bash
npm install
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 5. Connexion Admin

- URL: `http://localhost:5173/admin`
- Email: `famille@tameghe`
- Mot de passe: `Azerty123@`
