# 📚 Documentation - Système d'Exercices

Bienvenue dans la documentation du système de pilotage d'exercices et quiz en temps réel.

## 📖 Documents disponibles

### 🚀 Pour commencer

- **[EXERCISE_QUICKSTART.md](EXERCISE_QUICKSTART.md)**  
  Guide de démarrage rapide pour utiliser le système  
  👥 Public : Formateurs et participants  
  ⏱️ Lecture : 5 min

- **[../DEPLOYMENT_CHECKLIST.md](../DEPLOYMENT_CHECKLIST.md)**  
  Checklist complète pour déployer le système  
  👥 Public : Développeurs et administrateurs système  
  ⏱️ Durée : 30-60 min

### 🔧 Documentation technique

- **[EXERCISE_SYSTEM.md](EXERCISE_SYSTEM.md)**  
  Documentation technique complète du système  
  👥 Public : Développeurs  
  ⏱️ Lecture : 15 min  
  Contenu : Architecture, API, personnalisation, débogage

- **[ARCHITECTURE.md](ARCHITECTURE.md)**  
  Architecture globale du projet  
  👥 Public : Développeurs et architectes  
  📍 Référence pour comprendre l'ensemble du projet

### 📝 Résumé

- **[../IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md)**  
  Résumé de l'implémentation complète  
  👥 Public : Tous  
  ⏱️ Lecture : 10 min  
  Vue d'ensemble de ce qui a été créé

## 🎯 Choisir le bon document

### Je veux utiliser le système maintenant

→ Lire [EXERCISE_QUICKSTART.md](EXERCISE_QUICKSTART.md)

### Je veux déployer le système

→ Suivre [DEPLOYMENT_CHECKLIST.md](../DEPLOYMENT_CHECKLIST.md)

### Je veux comprendre comment ça marche

→ Lire [EXERCISE_SYSTEM.md](EXERCISE_SYSTEM.md)

### Je veux personnaliser ou déboguer

→ Consulter [EXERCISE_SYSTEM.md](EXERCISE_SYSTEM.md) section "Personnalisation" et "Débogage"

### Je veux ajouter de nouveaux exercices

→ Éditer `src/data/exercises.ts` (voir exemples dans le fichier)

### Je veux comprendre l'architecture globale

→ Lire [ARCHITECTURE.md](ARCHITECTURE.md) et [EXERCISE_SYSTEM.md](EXERCISE_SYSTEM.md)

## 🗂️ Organisation du projet

```
destino-ia---atelier-interactif/
│
├── docs/                           # 📚 Documentation
│   ├── README.md                   # ← Vous êtes ici
│   ├── ARCHITECTURE.md             # Architecture globale
│   ├── BASE_DE_CONNAISSANCE.md     # Base de connaissances
│   ├── EXERCISE_SYSTEM.md          # Doc technique exercices
│   └── EXERCISE_QUICKSTART.md      # Guide rapide
│
├── src/
│   ├── data/
│   │   └── exercises.ts            # 📊 Base d'exercices
│   │
│   ├── features/
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   └── ExerciseControl.tsx  # 🎛️ Module admin
│   │   │   └── hooks/
│   │   │       └── useExerciseSync.ts   # 🔄 Sync temps réel
│   │   │
│   │   └── workshop/
│   │       └── components/
│   │           ├── ParticipantView.tsx
│   │           └── ExerciseViewer.tsx   # 📱 Affichage participant
│   │
│   └── services/
│       └── supabase/
│           ├── client.ts
│           └── index.ts
│
├── supabase/
│   └── migrations/
│       └── 001_exercise_system.sql      # 🗄️ Schéma DB
│
├── IMPLEMENTATION_SUMMARY.md            # 📝 Résumé implémentation
├── DEPLOYMENT_CHECKLIST.md              # ✅ Checklist déploiement
└── README.md                            # 📖 README principal

```

## 🔗 Liens rapides

- [Base d'exercices](../src/data/exercises.ts)
- [Module Admin](../src/features/admin/components/ExerciseControl.tsx)
- [Hook de synchronisation](../src/features/admin/hooks/useExerciseSync.ts)
- [Affichage participant](../src/features/workshop/components/ExerciseViewer.tsx)
- [Migration SQL](../supabase/migrations/001_exercise_system.sql)

## 💡 Besoin d'aide ?

1. Consulter la section [Dépannage](EXERCISE_SYSTEM.md#débogage) dans la doc technique
2. Vérifier la [Checklist de déploiement](../DEPLOYMENT_CHECKLIST.md#-dépannage)
3. Consulter les logs Supabase
4. Vérifier la console navigateur (F12)

## 📊 Diagramme du flux

```
┌─────────────┐
│    ADMIN    │
│  Dashboard  │
└──────┬──────┘
       │
       │ Sélectionne & Lance
       │ un exercice
       ▼
┌─────────────────────┐
│    SUPABASE         │
│  session_state      │ ◄──── Realtime Sync
│  notifications      │
└──────┬──────────────┘
       │
       │ Broadcast
       │
       ▼
┌─────────────────────┐
│   PARTICIPANTS      │
│   ExerciseViewer    │
└─────────────────────┘
       │
       │ Complète
       │
       ▼
┌─────────────────────┐
│    ADMIN            │
│  Termine exercice   │
└─────────────────────┘
       │
       │ Broadcast fin
       │
       ▼
┌─────────────────────┐
│  TOUS retournent    │
│  à la présentation  │
└─────────────────────┘
```

## 🎓 Ressources additionnelles

- [Documentation Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Documentation React](https://react.dev)
- [Documentation TypeScript](https://www.typescriptlang.org/docs/)
- [Lucide Icons](https://lucide.dev/)

## 🔄 Mises à jour

Cette documentation est à jour avec la version actuelle du système.

Dernière mise à jour : Janvier 2026
