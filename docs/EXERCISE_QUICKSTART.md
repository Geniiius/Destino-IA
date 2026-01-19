# 🚀 Guide de Démarrage Rapide - Système d'Exercices

## Pour le Formateur (Admin)

### 1. Accéder au Module Exercices

1. Ouvrir le panneau Admin
2. Cliquer sur l'onglet **"Exercices"** dans la barre de navigation supérieure
3. Le module de pilotage s'affiche

### 2. Lancer un Exercice

1. **Parcourir les exercices disponibles**

   - Utilisez les filtres (Tous, Fondements, Pratique, Avancé, Marketing)
   - Chaque carte montre : emoji, titre, durée, niveau

2. **Prévisualiser un exercice**

   - Cliquez sur une carte d'exercice
   - Une fenêtre modale s'ouvre avec tous les détails
   - Consultez l'objectif, les apprentissages, et les instructions

3. **Lancer l'exercice**
   - Cliquez sur le bouton **"🚀 Lancer cet exercice"**
   - ✅ L'exercice est immédiatement diffusé à tous les participants
   - ⏸️ La présentation est automatiquement mise en pause
   - Le système sauvegarde votre position actuelle

### 3. Pendant l'Exercice

- **Indicateur visible** : Un badge "Exercice en cours" apparaît
- **État de présentation** : Vous voyez "Présentation en pause"
- **Surveillance** : Vous pouvez voir quels participants ont terminé (à venir)

### 4. Terminer l'Exercice

1. Cliquez sur le bouton **"🛑 Terminer l'exercice"**
2. ✅ Tous les participants reviennent automatiquement à la présentation
3. ▶️ La présentation reprend exactement où elle s'était arrêtée

## Pour les Participants

### 1. Réception Automatique

- L'exercice s'affiche **automatiquement en plein écran**
- Pas besoin de cliquer ou naviguer
- La présentation disparaît temporairement

### 2. Travailler sur l'Exercice

L'interface montre :

- 🎯 **Objectif** : Ce que vous allez apprendre
- 📚 **Apprentissages** : Points clés à retenir
- 📝 **Instructions** : Étapes à suivre
- ❌ **Mauvais prompt** : Exemple à éviter (avec bouton copier)
- ✅ **Prompt RCTF** : Version professionnelle (avec bouton copier)
- 💡 **Conseil pro** : Message clé

### 3. Terminer

1. Cliquez sur **"✓ J'ai terminé cet exercice"**
2. Le formateur est notifié
3. Attendez que le formateur termine l'exercice
4. Retour automatique à la présentation

## Astuces

### Pour le Formateur

- ⏱️ **Timing** : Surveillez la durée estimée de chaque exercice
- 📊 **Progression** : Utilisez les exercices progressifs (01 → 11)
- 🎨 **Variété** : Alternez types d'exercices pour maintenir l'engagement
- 💬 **Communication** : Prévenez les participants avant de lancer un exercice

### Pour les Participants

- 📋 **Copier-coller** : Utilisez les boutons pour copier les prompts
- 🎯 **Focus** : Concentrez-vous sur UN élément à la fois
- 💡 **Comparer** : Analysez bien la différence entre mauvais et bon prompt
- 🔄 **Pratiquer** : Testez réellement les prompts dans vos outils IA

## Raccourcis Clavier (à venir)

- `Alt + E` : Ouvrir/fermer le module exercices (Admin)
- `Ctrl + Enter` : Marquer comme terminé (Participant)

## Résolution de Problèmes

### L'exercice ne s'affiche pas chez les participants

✅ **Vérifications** :

1. Les participants sont-ils connectés ? (indicateur "En vivo")
2. La synchronisation Supabase est-elle active ?
3. Vérifier la console : `Ctrl + Shift + I` → Console

### La présentation ne reprend pas

✅ **Solution** :

1. Cliquez à nouveau sur "Terminer l'exercice"
2. Si le problème persiste, naviguez manuellement avec les flèches ◀️ ▶️

### Les modifications ne sont pas synchronisées

✅ **Vérifier** :

1. Configuration Supabase dans `.env`
2. Tables créées dans Supabase
3. Realtime activé pour `session_state`

## Prochaines Étapes

📚 Consultez la documentation complète : `docs/EXERCISE_SYSTEM.md`
🛠️ Configuration Supabase : `supabase/migrations/001_exercise_system.sql`
🎨 Personnalisation : Modifiez `src/data/exercises.ts`
