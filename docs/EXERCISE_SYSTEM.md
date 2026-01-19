# Module de Pilotage d'Exercices et Quiz en Temps Réel

## Vue d'ensemble

Ce module permet au formateur (Admin) de piloter la session de formation en temps réel en lançant des exercices et quiz qui sont automatiquement diffusés aux participants.

## Fonctionnalités clés

### 🎯 Pour le Formateur (Admin)

1. **Sélection d'exercices**

   - Interface de sélection avec filtres par type (Fondements, Pratique, Avancé, Marketing)
   - Aperçu détaillé de chaque exercice avant lancement
   - Affichage du temps estimé et du niveau de difficulté

2. **Lancement d'exercices**

   - Bouton de lancement qui diffuse automatiquement l'exercice à tous les participants
   - La présentation principale est mise en pause automatiquement
   - L'index de la slide actuelle est sauvegardé

3. **Suivi en temps réel**

   - Visualisation de l'état de l'exercice en cours
   - Indicateur de pause de présentation
   - Possibilité d'arrêter l'exercice à tout moment

4. **Reprise automatique**
   - Bouton "Terminer l'exercice" pour reprendre la présentation
   - Retour automatique à la slide exacte où la présentation avait été mise en pause

### 👥 Pour les Participants

1. **Réception automatique**

   - L'exercice s'affiche automatiquement en plein écran
   - Interface immersive dédiée à l'exercice

2. **Affichage complet**

   - Objectif de l'exercice
   - Points d'apprentissage clés
   - Instructions étape par étape
   - Comparaison "Mauvais prompt" vs "Prompt RCTF professionnel"
   - Message clé à retenir

3. **Validation de complétion**
   - Bouton "J'ai terminé cet exercice"
   - Notification envoyée au formateur

## Architecture technique

### Fichiers créés

```
src/
├── data/
│   └── exercises.ts              # Base de données des exercices
├── features/
│   ├── admin/
│   │   ├── components/
│   │   │   └── ExerciseControl.tsx    # Module de pilotage admin
│   │   └── hooks/
│   │       └── useExerciseSync.ts     # Hook de synchronisation
│   └── workshop/
│       └── components/
│           └── ExerciseViewer.tsx     # Affichage exercice pour participants
```

### Base de données Supabase

Deux tables principales:

1. **session_state**

   - `session_id`: Identifiant unique de la session
   - `current_exercise`: Objet JSON de l'exercice actuel
   - `is_exercise_active`: Boolean indiquant si un exercice est en cours
   - `is_presentation_paused`: Boolean pour l'état de la présentation
   - `presentation_slide_index`: Index de la slide en pause
   - `participants`: Array JSON des participants et leur statut

2. **notifications**
   - Notifications temps réel pour événements (exercise_started, exercise_ended, etc.)

### Synchronisation temps réel

Le système utilise **Supabase Realtime** pour synchroniser l'état entre admin et participants:

1. L'admin modifie l'état dans la table `session_state`
2. Supabase diffuse le changement via WebSocket
3. Tous les participants reçoivent la mise à jour instantanément
4. L'UI se met à jour automatiquement

## Flux de travail

```
ADMIN                           SYSTÈME                      PARTICIPANTS
  │                                │                              │
  ├─ Sélectionne exercice          │                              │
  ├─ Clique "Lancer"               │                              │
  │                                │                              │
  ├───── launchExercise() ────────▶│                              │
  │                                ├─ Sauvegarde slide actuelle   │
  │                                ├─ Update session_state        │
  │                                │   - is_exercise_active: true │
  │                                │   - is_presentation_paused   │
  │                                ├─ Broadcast via Realtime      │
  │                                │                              │
  │                                ├──────────────────────────────▶
  │                                │         Reçoit exercice       │
  │                                │         Affiche ExerciseViewer│
  │                                │                              │
  │   Présentation EN PAUSE        │                              │
  │   ⏸️ Indicateur visible        │                              │
  │                                │                              │
  │                                │           Participant travaille
  │                                │           sur l'exercice      │
  │                                │                              │
  │                                │         ◄─ Clique "Terminé" ─┤
  │                                │                              │
  │                                ├─ markExerciseComplete()      │
  │                                ├─ Update participants[]       │
  │                                │                              │
  ├─ Clique "Terminer exercice"    │                              │
  │                                │                              │
  ├───── stopExercise() ──────────▶│                              │
  │                                ├─ Update session_state        │
  │                                │   - is_exercise_active: false│
  │                                │   - is_presentation_paused   │
  │                                ├─ Broadcast fin exercice      │
  │                                │                              │
  │                                ├──────────────────────────────▶
  │                                │    Retour à la présentation   │
  │                                │    (même slide)               │
  │   Présentation REPREND ▶️      │                              │
  │   (slide exacte restaurée)     │                              │
```

## Intégration dans le projet

### 1. AdminDashboard.tsx

```tsx
import { ExerciseControl } from "./ExerciseControl";
import { useExerciseSync } from "../hooks/useExerciseSync";

// Dans le composant
const { sessionState, launchExercise, stopExercise, updatePresentationSlide } =
  useExerciseSync(session.session_id, true);

// Dans le render (onglet "exercises")
<ExerciseControl
  sessionId={session.session_id}
  onLaunchExercise={handleLaunchExercise}
  onStopExercise={handleStopExercise}
  currentExercise={sessionState.currentExercise}
  isExerciseActive={sessionState.isExerciseActive}
/>;
```

### 2. ParticipantView.tsx

```tsx
import { ExerciseViewer } from "./ExerciseViewer";
import { useExerciseSync } from "../../admin/hooks/useExerciseSync";

// Dans le composant
const { sessionState: exerciseState, markExerciseComplete } = useExerciseSync(
  sessionId,
  false
);

// Affichage conditionnel
if (exerciseState.isExerciseActive && exerciseState.currentExercise) {
  return (
    <ExerciseViewer
      exercise={exerciseState.currentExercise}
      onComplete={handleCompleteExercise}
      userId={userId}
    />
  );
}
```

## Configuration Supabase

### 1. Créer les tables

Exécuter le fichier SQL:

```bash
supabase/migrations/001_exercise_system.sql
```

### 2. Configurer Realtime

Dans le dashboard Supabase:

1. Database → Replication
2. Activer Realtime pour les tables `session_state` et `notifications`

### 3. Variables d'environnement

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Ajout de nouveaux exercices

Les exercices sont définis dans `src/data/exercises.ts`:

```typescript
{
  id: "05",
  title: "Titre de l'exercice",
  part: "PARTE 3: MARKETING",
  type: "MARKETING",
  typeColor: "bg-amber-600",
  time: "15 min",
  level: "Intermedio",
  emoji: "📱",
  objective: "Description de l'objectif",
  learns: [
    "Point d'apprentissage 1",
    "Point d'apprentissage 2",
  ],
  badPrompt: {
    title: "PROMPT FAIBLE",
    content: "Exemple de mauvais prompt...",
    result: "Résultat médiocre obtenu"
  },
  goodPrompt: {
    title: "PROMPT RCTF PROFESSIONNEL",
    content: "Exemple de bon prompt RCTF...",
    result: "Résultat professionnel obtenu"
  },
  keyMessage: "Message clé à retenir",
  instructions: [
    "Étape 1",
    "Étape 2",
  ]
}
```

## Personnalisation

### Filtres d'exercices

Modifiez les filtres dans `ExerciseControl.tsx`:

```typescript
const exerciseTypes = [
  { value: "all", label: "Tous", icon: "📚" },
  { value: "FUNDAMENTO", label: "Fondements", icon: "🎯" },
  // Ajoutez vos types personnalisés
];
```

### Styles

Les couleurs des types d'exercices sont définies dans les objets `typeColor`:

- `bg-blue-500` - Fondements
- `bg-emerald-500` - Pratique
- `bg-violet-500` - Avancé
- `bg-amber-600` - Marketing

## Débogage

### Vérifier la synchronisation

```javascript
// Dans la console du navigateur (Admin)
window.addEventListener("sessionUpdate", (e) => {
  console.log("Session updated:", e.detail);
});

// Console Participant
console.log("Exercise state:", exerciseState);
```

### Logs Supabase

Activer les logs dans `useExerciseSync.ts`:

```typescript
const channel = supabase
  .channel(`session:${sessionId}`)
  .on('postgres_changes', {...}, (payload) => {
    console.log('Realtime update:', payload); // ← Ajouter ce log
  })
```

## Améliorations futures

- [ ] Indicateur de progression des participants qui ont terminé
- [ ] Timer visible pour les exercices avec durée limitée
- [ ] Système de badges pour les exercices complétés
- [ ] Export des résultats en fin de session
- [ ] Chat intégré pendant les exercices
- [ ] Partage d'écran pour montrer les meilleures réalisations

## Support

Pour toute question ou problème, consultez:

- Documentation Supabase Realtime: https://supabase.com/docs/guides/realtime
- Architecture du projet: `docs/ARCHITECTURE.md`
