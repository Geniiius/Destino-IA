# 🚀 Checklist de déploiement - Système d'Exercices

## ✅ Étape 1 : Configuration Supabase

### 1.1 Créer les tables

```bash
# Se connecter à votre projet Supabase
supabase login

# Appliquer la migration
supabase db push
```

Ou via le Dashboard Supabase :

1. Aller dans **SQL Editor**
2. Coller le contenu de `supabase/migrations/001_exercise_system.sql`
3. Cliquer sur **Run**

### 1.2 Activer Realtime

1. Aller dans **Database → Replication**
2. Trouver la table `session_state`
3. Activer **Realtime**
4. Trouver la table `notifications`
5. Activer **Realtime**
6. Cliquer sur **Save**

### 1.3 Vérifier les politiques RLS

Dans **Authentication → Policies** :

Pour `session_state` :

- ✅ "Tout le monde peut lire l'état de session"
- ✅ "Les admins peuvent modifier l'état de session"

Pour `notifications` :

- ✅ "Tout le monde peut lire les notifications"
- ✅ "Tout le monde peut créer des notifications"

## ✅ Étape 2 : Variables d'environnement

Vérifier que `.env` existe et contient :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anonyme-publique
```

Pour obtenir ces valeurs :

1. Dashboard Supabase → **Settings → API**
2. Copier **Project URL** → `VITE_SUPABASE_URL`
3. Copier **anon public** → `VITE_SUPABASE_ANON_KEY`

## ✅ Étape 3 : Installation des dépendances

```bash
npm install
```

Vérifier que le projet a bien :

- React
- TypeScript
- Supabase client
- Lucide React (icons)

## ✅ Étape 4 : Build et test local

```bash
# Développement
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview
```

## ✅ Étape 5 : Test fonctionnel

### Test 1 : Admin peut lancer un exercice

1. Ouvrir `http://localhost:5173` (ou votre URL)
2. Se connecter en tant qu'Admin
3. Cliquer sur l'onglet **"Exercices"**
4. Vérifier que les 4 exercices s'affichent
5. Cliquer sur l'exercice 01
6. Vérifier la modal de détails
7. Cliquer **"Lancer cet exercice"**
8. ✅ Vérifier l'indicateur "Exercice en cours"
9. ✅ Vérifier "Présentation en pause"

### Test 2 : Participant reçoit l'exercice

1. Ouvrir un nouvel onglet (ou navigateur privé)
2. Accéder à la vue Participant
3. Quand l'admin lance un exercice :
   - ✅ L'exercice s'affiche automatiquement en plein écran
   - ✅ Tous les détails sont visibles
   - ✅ Les boutons "Copier" fonctionnent
4. Cliquer **"J'ai terminé cet exercice"**

### Test 3 : Reprise de la présentation

1. Sur l'écran Admin, cliquer **"Terminer l'exercice"**
2. ✅ L'indicateur "Exercice en cours" disparaît
3. ✅ La présentation reprend à la même slide
4. Sur l'écran Participant :
   - ✅ Retour automatique à la présentation
   - ✅ Même slide que l'admin

### Test 4 : Synchronisation temps réel

1. Ouvrir 3 onglets :
   - Onglet 1 : Admin
   - Onglet 2 : Participant 1
   - Onglet 3 : Participant 2
2. Admin lance un exercice
3. ✅ Les 2 participants reçoivent l'exercice simultanément
4. Admin termine l'exercice
5. ✅ Les 2 participants reviennent à la présentation

## ✅ Étape 6 : Vérifications de sécurité

### Vérifier que les données sensibles ne sont pas exposées

```bash
# Ne PAS commiter ces fichiers :
.env
.env.local
.env.production
```

Vérifier `.gitignore` :

```
.env
.env.*
!.env.example
```

### Créer un fichier `.env.example`

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## ✅ Étape 7 : Déploiement

### Option A : Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Ajouter les variables d'environnement dans le dashboard Vercel
```

### Option B : Netlify

```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Déployer
netlify deploy --prod

# Ajouter les variables d'environnement dans le dashboard Netlify
```

### Option C : Build manuel

```bash
# Build
npm run build

# Le dossier `dist/` contient les fichiers statiques
# Upload sur votre serveur web
```

## ✅ Étape 8 : Configuration post-déploiement

### Mettre à jour les URLs autorisées dans Supabase

1. Dashboard Supabase → **Authentication → URL Configuration**
2. Ajouter votre domaine de production dans **Site URL**
3. Ajouter votre domaine dans **Redirect URLs**

Exemple :

```
Site URL: https://votre-domaine.com
Redirect URLs:
  https://votre-domaine.com/**
  http://localhost:5173/**
```

### Tester en production

1. Accéder à votre URL de production
2. Répéter tous les tests fonctionnels (Étape 5)
3. Vérifier les logs de la console (F12)
4. Vérifier qu'il n'y a pas d'erreurs

## ✅ Étape 9 : Monitoring

### Activer les logs Supabase

1. Dashboard Supabase → **Logs**
2. Surveiller les requêtes en temps réel
3. Vérifier les erreurs éventuelles

### Logs navigateur

```javascript
// Ajouter dans la console pour déboguer
localStorage.setItem("debug", "supabase:*");
// Recharger la page
```

## ✅ Étape 10 : Documentation utilisateur

### Créer un guide pour les formateurs

Partager :

- `docs/EXERCISE_QUICKSTART.md` - Guide de démarrage rapide
- `docs/EXERCISE_SYSTEM.md` - Documentation technique complète

### Former les formateurs

1. Session de démonstration
2. Walkthrough complet du flux
3. Q&A
4. Test pratique

## 🆘 Dépannage

### Problème : L'exercice ne s'affiche pas chez les participants

**Solutions :**

1. Vérifier que Realtime est activé dans Supabase
2. Vérifier la connexion réseau
3. Vérifier les variables d'environnement
4. Regarder la console (F12) pour les erreurs

### Problème : "Error: Invalid API key"

**Solution :**

- Vérifier que `VITE_SUPABASE_ANON_KEY` est correct
- Regénérer la clé dans Supabase si nécessaire
- Redémarrer le serveur de dev après modification du `.env`

### Problème : La présentation ne reprend pas

**Solution :**

1. Vérifier que `presentation_slide_index` est bien sauvegardé
2. Vérifier les logs Supabase
3. Cliquer manuellement sur une slide pour reprendre

### Problème : Latence dans la synchronisation

**Solution :**

- Vérifier la région du serveur Supabase
- Activer le CDN si disponible
- Optimiser les requêtes (utiliser les subscriptions Realtime)

## ✅ Checklist finale

Avant de considérer le déploiement comme terminé :

- [ ] Tables Supabase créées
- [ ] Realtime activé sur les tables
- [ ] Variables d'environnement configurées (dev + prod)
- [ ] Build réussi sans erreurs
- [ ] Test Admin : Lancer un exercice ✓
- [ ] Test Participant : Recevoir un exercice ✓
- [ ] Test Synchronisation : Multiple participants ✓
- [ ] Test Reprise : Retour à la présentation ✓
- [ ] URLs autorisées configurées dans Supabase
- [ ] Documentation partagée avec l'équipe
- [ ] Formation des formateurs effectuée
- [ ] Monitoring activé
- [ ] Plan de support défini

## 🎉 Félicitations !

Si toutes les cases sont cochées, votre système d'exercices est prêt pour la production !

**Support :**

- Documentation : `docs/EXERCISE_SYSTEM.md`
- Guide rapide : `docs/EXERCISE_QUICKSTART.md`
- Résumé : `IMPLEMENTATION_SUMMARY.md`
