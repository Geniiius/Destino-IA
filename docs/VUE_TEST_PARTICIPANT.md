# Vue Test Participant - Guide d'Utilisation 👁️

## Vue d'ensemble

La fonctionnalité **Vue Test Participant** permet au formateur de prévisualiser en temps réel ce que voient les participants lorsqu'un exercice est lancé, directement depuis le dashboard Admin.

## Comment l'utiliser

### 1. Lancer un exercice

Dans le dashboard Admin, onglet "Exercices" :

1. Sélectionnez un exercice dans la grille
2. Cliquez sur "🚀 Lancer cet exercice"
3. L'exercice devient actif et la présentation se met en pause

### 2. Ouvrir la prévisualisation

Une fois l'exercice lancé, un nouveau bouton apparaît en haut à droite :

```
👁️ Vue Participant
```

Cliquez dessus pour ouvrir la prévisualisation.

### 3. Que voyez-vous dans la prévisualisation ?

Le modal affiche **exactement** ce que voient les participants :

- L'en-tête avec l'exercice (partie, type, emoji, titre)
- Les temps et niveaux
- L'objectif stratégique
- Les apprentissages clés
- Les instructions pas à pas
- Le message clé
- Le prompt "mauvais" (à éviter)
- Le bouton pour révéler le prompt RCTF professionnel
- Le prompt RCTF (structure complète avec Rol, Contexto, Tarea, Formato)
- Les boutons de copie pour chaque prompt

### 4. Mode Test

La prévisualisation est en **mode lecture seule** :

- Les boutons de copie fonctionnent
- Le bouton "Révéler le prompt professionnel" fonctionne
- Le bouton "Marquer comme complété" ne fait rien (c'est juste une prévisualisation)
- Aucune action n'affecte les vrais participants

### 5. Fermer la prévisualisation

Cliquez sur le bouton **✕ Fermer** en haut à droite du modal pour revenir au dashboard Admin.

## Cas d'usage

### 🎯 Pendant la formation

- Vérifier que l'exercice affiché est correct
- Anticiper les questions des participants
- S'assurer que les prompts sont bien lisibles
- Contrôler que toutes les informations sont présentes

### 🔍 Avant de lancer

- Prévisualiser un exercice avant de le lancer officiellement
- Comparer plusieurs exercices
- S'entraîner à la navigation

### 🐛 Dépannage

- Vérifier si un participant a un problème d'affichage
- Comparer ce qu'il voit avec votre prévisualisation
- Diagnostiquer les problèmes de synchronisation

## Interface de la prévisualisation

### Header (bandeau bleu)

```
👁️ Prévisualisation Vue Participant
Voici ce que voient les participants en ce moment
[Mode Test] [✕ Fermer]
```

### Contenu

- Fond dégradé sombre (même que les participants)
- Scroll vertical pour tout le contenu
- Design responsive identique
- Animations identiques

## Limitations

⚠️ **Important** : Cette prévisualisation est en mode lecture seule

- Le bouton "Marquer comme terminé" ne fait rien
- Les statistiques de complétion ne sont pas affectées
- C'est uniquement pour **observer**, pas pour **interagir**

## Raccourcis

| Action                          | Méthode                                  |
| ------------------------------- | ---------------------------------------- |
| Ouvrir la prévisualisation      | Cliquer sur "👁️ Vue Participant"         |
| Fermer la prévisualisation      | `✕ Fermer` ou cliquer en dehors du modal |
| Scroll dans la prévisualisation | Molette de souris dans le modal          |

## Comparaison avec la vue réelle

| Caractéristique        | Vue Test            | Vue Participant Réelle |
| ---------------------- | ------------------- | ---------------------- |
| Affichage              | ✅ Identique        | ✅ Identique           |
| Copie des prompts      | ✅ Fonctionne       | ✅ Fonctionne          |
| Révéler prompt RCTF    | ✅ Fonctionne       | ✅ Fonctionne          |
| Marquer comme complété | ❌ Désactivé        | ✅ Fonctionne          |
| Impact sur les stats   | ❌ Aucun            | ✅ Enregistré          |
| Synchronisation        | ❌ En lecture seule | ✅ Temps réel          |

## Workflow recommandé

### Scénario 1 : Formation en présentiel

```
1. Sélectionner l'exercice
2. [OPTIONNEL] Prévisualiser avec "👁️ Vue Participant"
3. Lancer l'exercice
4. Les participants commencent
5. [SI BESOIN] Ouvrir la prévisualisation pour vérifier
6. Terminer l'exercice
```

### Scénario 2 : Formation à distance

```
1. Sélectionner l'exercice
2. Ouvrir "👁️ Vue Participant"
3. Partager votre écran avec la prévisualisation
4. Lancer l'exercice
5. Les participants suivent en même temps que vous
6. Fermer la prévisualisation et continuer
```

## Support technique

### La prévisualisation ne s'ouvre pas ?

- Vérifiez qu'un exercice est bien lancé (voyez-vous "Exercice en cours" ?)
- Rechargez la page
- Vérifiez la console du navigateur (F12)

### L'affichage est différent de ce que voient les participants ?

- C'est peut-être une question de cache navigateur
- Demandez au participant de rafraîchir (F5)
- Vérifiez la connexion réseau

### Le bouton "Vue Participant" n'apparaît pas ?

- Le bouton n'apparaît que si un exercice est **actif**
- Vérifiez l'état en haut du module : "Exercice en cours" doit être visible

## Architecture technique

### Composants utilisés

- `ExerciseControl.tsx` : Contient le bouton et le modal
- `ExerciseViewer.tsx` : Composant réutilisé pour l'affichage
- État partagé : `currentExercise`, `isExerciseActive`

### Props du ExerciseViewer en mode test

```typescript
<ExerciseViewer
  exercise={currentExercise} // L'exercice actif
  onComplete={() => {}} // Fonction vide (pas d'action)
  userId="admin-preview" // ID spécial pour le mode test
/>
```

## Prochaines améliorations

🚀 **Fonctionnalités futures possibles** :

- [ ] Afficher le nombre de participants ayant complété l'exercice
- [ ] Voir la progression en temps réel de chaque participant
- [ ] Envoyer un message aux participants depuis la prévisualisation
- [ ] Mode "Présentation" : projeter la vue participant sur grand écran

---

**Version** : 1.0.0  
**Date** : 11 janvier 2026  
**Auteur** : Système Destino IA
