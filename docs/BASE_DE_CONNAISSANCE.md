# 📚 Base de Connaissance - Destino IA

> **Source de Vérité Unique** pour le projet Destino IA - Atelier Interactif  
> Dernière mise à jour : 10 janvier 2026  
> Version : 1.0.0

---

## 📑 Table des Matières

1. [Présentation du Projet](#1-présentation-du-projet)
2. [Objectifs](#2-objectifs)
3. [État Actuel du Projet](#3-état-actuel-du-projet)
4. [Périmètre du Projet](#4-périmètre-du-projet)
5. [Workflow de Création](#5-workflow-de-création)
6. [Structure des Fichiers et Dossiers](#6-structure-des-fichiers-et-dossiers)
7. [Standards Créatifs et Techniques](#7-standards-créatifs-et-techniques)
8. [Prompts de Référence](#8-prompts-de-référence)
9. [Règles d'Évolution de la Base de Connaissance](#9-règles-dévolution-de-la-base-de-connaissance)
10. [Glossaire](#10-glossaire)
11. [Historique des Décisions](#11-historique-des-décisions)

---

## 1. Présentation du Projet

### 1.1 Description Claire et Synthétique

**Destino IA** est une plateforme web interactive conçue pour animer des ateliers de formation à l'Intelligence Artificielle Générative. L'application permet à un formateur (administrateur) de guider des participants à travers une présentation structurée en temps réel, avec synchronisation des contenus et communication bidirectionnelle.

**Stack Technique Principal :**

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS
- **Backend/Realtime** : Supabase (optionnel)
- **Traitement PDF** : PDF.js (via CDN)

### 1.2 Vision Globale

> _"El taller definitivo de IA Generativa para mentes creativas"_

Destino IA vise à démocratiser l'apprentissage de l'IA générative à travers une expérience immersive et collaborative. La plateforme transforme les ateliers traditionnels en sessions interactives où chaque participant peut suivre, interagir et pratiquer en temps réel.

**Axes Stratégiques :**

```
┌─────────────────────────────────────────────────────────────┐
│                    VISION DESTINO IA                        │
├─────────────────────────────────────────────────────────────┤
│  🎯 Accessibilité    │  Rendre l'IA compréhensible à tous  │
│  🔄 Interactivité    │  Engagement actif des participants  │
│  ⚡ Temps Réel       │  Synchronisation instantanée        │
│  🎨 Créativité       │  Focus sur la génération créative   │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Contexte d'Utilisation

| Acteur                       | Rôle            | Fonctionnalités Clés                                        |
| ---------------------------- | --------------- | ----------------------------------------------------------- |
| **Administrateur/Formateur** | Anime l'atelier | Gestion des slides, navigation, monitoring des participants |
| **Participant**              | Suit l'atelier  | Visualisation synchronisée, chat, accès aux ressources      |

---

## 2. Objectifs

### 2.1 Objectifs Principaux

| ID     | Objectif                 | Description                                                                   | Priorité    |
| ------ | ------------------------ | ----------------------------------------------------------------------------- | ----------- |
| **O1** | Présentation Interactive | Permettre au formateur de piloter une présentation synchronisée en temps réel | 🔴 Critique |
| **O2** | Participation Active     | Offrir aux participants une interface immersive pour suivre et interagir      | 🔴 Critique |
| **O3** | Gestion de Contenu       | Permettre l'import et la structuration automatique de PDFs en slides          | 🟠 Haute    |
| **O4** | Communication Temps Réel | Faciliter les échanges via chat intégré                                       | 🟠 Haute    |

### 2.2 Objectifs Secondaires

| ID     | Objectif               | Description                                    | Priorité   |
| ------ | ---------------------- | ---------------------------------------------- | ---------- |
| **O5** | Gestion des Ressources | Permettre le partage de fichiers et ressources | 🟡 Moyenne |
| **O6** | Quiz & Exercices       | Intégrer des modules d'évaluation interactive  | 🟡 Moyenne |
| **O7** | Défis Créatifs         | Proposer des challenges avec compteur de temps | 🟢 Basse   |
| **O8** | Analytics              | Suivre la participation et l'engagement        | 🟢 Basse   |

### 2.3 Indicateurs de Réussite (KPIs)

```yaml
Indicateurs Techniques:
  - Temps de chargement initial: < 3 secondes
  - Latence synchronisation: < 500ms
  - Disponibilité: 99.5%
  - Score Lighthouse Performance: > 90

Indicateurs Fonctionnels:
  - Participants max simultanés: 50
  - Slides max par session: 100
  - Taux d'erreur traitement PDF: < 5%

Indicateurs UX:
  - Temps moyen pour rejoindre: < 30 secondes
  - Navigation intuitive sans formation préalable
```

---

## 3. État Actuel du Projet

### 3.1 Éléments Déjà Réalisés ✅

| Composant                      | Description                            | Statut     |
| ------------------------------ | -------------------------------------- | ---------- |
| **Architecture Feature-First** | Structure modulaire par fonctionnalité | ✅ Complet |
| **Page d'Accueil**             | Landing page avec navigation           | ✅ Complet |
| **Dashboard Admin**            | Interface complète de gestion          | ✅ Complet |
| **Vue Participant**            | Interface immersive participant        | ✅ Complet |
| **Formulaire d'Inscription**   | JoinForm avec validation               | ✅ Complet |
| **Système de Types**           | TypeScript complet                     | ✅ Complet |
| **Traitement PDF**             | Extraction texte via PDF.js            | ✅ Complet |
| **UI Components**              | Button, Card, Input                    | ✅ Complet |
| **Configuration Supabase**     | Client singleton configuré             | ✅ Complet |
| **Styles CSS**                 | Design system Tailwind                 | ✅ Complet |
| **Mock Data**                  | Données de développement               | ✅ Complet |

### 3.2 Éléments En Cours 🔄

| Composant                    | Description                   | Progression |
| ---------------------------- | ----------------------------- | ----------- |
| **Synchronisation Realtime** | Intégration Supabase Realtime | 40%         |
| **Chat Fonctionnel**         | Messages persistants          | 30%         |
| **Gestion Participants**     | CRUD participants temps réel  | 20%         |

### 3.3 Éléments À Faire 📋

| Composant                  | Description              | Priorité   |
| -------------------------- | ------------------------ | ---------- |
| **Authentification Admin** | Sécurisation accès admin | 🔴 Haute   |
| **Persistance Slides**     | Sauvegarde Supabase      | 🔴 Haute   |
| **Module Quiz**            | Questions interactives   | 🟡 Moyenne |
| **Module Exercices**       | Activités pratiques      | 🟡 Moyenne |
| **Gestion Ressources**     | Upload/Download fichiers | 🟡 Moyenne |
| **Emails Jetables**        | Envoi credentials        | 🟢 Basse   |
| **Analytics Dashboard**    | Métriques participation  | 🟢 Basse   |
| **Export Session**         | Génération rapport       | 🟢 Basse   |
| **Mode Hors-Ligne**        | PWA capabilities         | 🟢 Basse   |

### 3.4 Diagramme de Progression

```
Progression Globale: ████████████░░░░░░░░ 60%

Par Module:
  Core App        ████████████████████ 100%
  UI Components   ████████████████████ 100%
  Admin Features  ████████████████░░░░  80%
  Participant     ████████████████░░░░  80%
  Realtime        ████████░░░░░░░░░░░░  40%
  Quiz/Exercises  ░░░░░░░░░░░░░░░░░░░░   0%
  Analytics       ░░░░░░░░░░░░░░░░░░░░   0%
```

---

## 4. Périmètre du Projet

### 4.1 Ce Qui Est Inclus ✅

#### Fonctionnalités Core

- ✅ Système de navigation par slides
- ✅ 4 types de slides : Intro, Théorie, Exercice, Challenge
- ✅ Import automatique de PDF
- ✅ Synchronisation temps réel (Supabase)
- ✅ Chat intégré
- ✅ Gestion des participants
- ✅ Interface responsive desktop

#### Aspects Techniques

- ✅ Application SPA React
- ✅ TypeScript strict
- ✅ Architecture modulaire
- ✅ Barrel exports
- ✅ Custom hooks réutilisables
- ✅ Design system cohérent

#### Utilisateurs Cibles

- ✅ Formateurs/Animateurs d'ateliers
- ✅ Participants aux ateliers
- ✅ Sessions de 5 à 50 participants

### 4.2 Ce Qui Est Exclu ❌

#### Hors Périmètre Fonctionnel

- ❌ **Fonctionnalités IA embarquées** (pas de LLM, pas de génération)
- ❌ Enregistrement vidéo des sessions
- ❌ Système de paiement/facturation
- ❌ Multi-sessions simultanées par admin
- ❌ Application mobile native
- ❌ Mode présentation projecteur dédié
- ❌ Intégration calendrier externe
- ❌ SSO / OAuth entreprise

#### Hors Périmètre Technique

- ❌ Backend Node.js custom (Supabase uniquement)
- ❌ Base de données relationnelle custom
- ❌ Microservices
- ❌ Container Docker (pour v1)
- ❌ Tests E2E automatisés (pour v1)

> **⚠️ Note Importante** : Ce projet utilise uniquement **PDF.js + Supabase**. Il n'inclut pas de fonctionnalités d'IA générative intégrées - l'IA est le _sujet_ de l'atelier, pas un outil technique du projet.

---

## 5. Workflow de Création

### 5.1 Workflow Général d'une Session

```
┌─────────────────────────────────────────────────────────────────────┐
│                    WORKFLOW SESSION DESTINO IA                       │
└─────────────────────────────────────────────────────────────────────┘

  ┌──────────┐    ┌───────────┐    ┌──────────┐    ┌───────────┐
  │ PRÉPARER │───▶│  ANIMER   │───▶│ ENGAGER  │───▶│  CLÔTURER │
  └──────────┘    └───────────┘    └──────────┘    └───────────┘
       │               │               │                │
       ▼               ▼               ▼                ▼
  • Import PDF    • Navigation    • Exercices      • Feedback
  • Config slides • Sync temps    • Quiz           • Ressources
  • Participants  • Chat live     • Challenges     • Export
```

### 5.2 Étapes Détaillées

#### Phase 1 : Préparation (Admin)

```yaml
1.1 Import du Contenu:
  - Accéder au Dashboard Admin (#admin)
  - Glisser-déposer un PDF dans la zone d'upload
  - Le système extrait automatiquement les pages
  - Chaque page devient un slide structuré

1.2 Configuration des Slides:
  - Vérifier les types assignés (intro/theory/exercise/challenge)
  - Ajuster les titres si nécessaire
  - Réordonner via la playlist (volet droit)

1.3 Préparation des Ressources:
  - Préparer les fichiers à partager
  - Configurer les liens externes
```

#### Phase 2 : Animation (Admin + Participants)

```yaml
2.1 Lancement:
  - Les participants rejoignent via #join
  - Saisie du nom → Accès à la vue participant
  - L'admin voit les connexions en temps réel

2.2 Navigation:
  - Flèches gauche/droite pour naviguer
  - Les participants voient le slide actif automatiquement
  - Le type de slide change la présentation visuelle

2.3 Communication:
  - Chat disponible pour questions
  - L'admin peut envoyer des messages broadcast
```

#### Phase 3 : Engagement (Pendant la session)

```yaml
3.1 Exercices Pratiques:
  - Slide de type "exercise" active le mode pratique
  - Timer optionnel pour limiter le temps
  - Instructions claires affichées

3.2 Quiz (Futur):
  - Questions à choix multiples
  - Résultats en temps réel
  - Classement des participants

3.3 Challenges:
  - Défi final chronométré
  - Objectifs créatifs définis
  - Soumission des résultats
```

#### Phase 4 : Clôture

```yaml
4.1 Conclusion:
  - Slide de type "intro" pour le résumé
  - Remerciements

4.2 Ressources:
  - Participants accèdent à l'onglet Ressources
  - Téléchargement des fichiers partagés

4.3 Export (Futur):
  - Génération d'un rapport de session
  - Liste des participants
  - Statistiques d'engagement
```

### 5.3 Workflow Technique de Développement

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│  IDÉE   │──▶│ DESIGN  │──▶│  CODE   │──▶│  TEST   │──▶│ DEPLOY  │
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
     │             │             │             │             │
     ▼             ▼             ▼             ▼             ▼
 • User Story  • Composant   • Feature     • Manual      • Build
 • Acceptance  • Props/API   • Hook        • Type-check  • Preview
 • Priority    • Variants    • Service     • Lint        • Prod
```

---

## 6. Structure des Fichiers et Dossiers

### 6.1 Organisation Recommandée

```
destino-ia/
│
├── 📄 Configuration Racine
│   ├── index.html              # Point d'entrée HTML + CDN PDF.js
│   ├── package.json            # Dépendances et scripts
│   ├── vite.config.ts          # Configuration Vite
│   ├── tailwind.config.js      # Configuration Tailwind
│   ├── tsconfig.json           # Configuration TypeScript
│   └── postcss.config.js       # Configuration PostCSS
│
├── 📁 docs/                    # Documentation
│   ├── ARCHITECTURE.md         # Décisions architecturales
│   └── BASE_DE_CONNAISSANCE.md # Ce fichier (source de vérité)
│
└── 📁 src/                     # Code source
    │
    ├── 📄 App.tsx              # Composant racine + routing
    ├── 📄 main.tsx             # Point d'entrée React
    ├── 📄 vite-env.d.ts        # Types Vite
    │
    ├── 📁 components/          # Composants partagés (UI Kit)
    │   └── ui/
    │       ├── index.ts        # Barrel export
    │       ├── Button.tsx      # Bouton réutilisable
    │       ├── Card.tsx        # Carte conteneur
    │       └── Input.tsx       # Champ de saisie
    │
    ├── 📁 config/              # Configuration applicative
    │   ├── index.ts            # Barrel export
    │   ├── constants.ts        # Constantes globales (APP, UI, LIMITS)
    │   └── env.ts              # Variables d'environnement
    │
    ├── 📁 features/            # Fonctionnalités (Feature-First)
    │   │
    │   ├── 📁 admin/           # Module Administration
    │   │   ├── index.ts
    │   │   ├── components/
    │   │   │   └── AdminDashboard.tsx
    │   │   ├── hooks/
    │   │   │   └── useSlideGeneration.ts
    │   │   └── data/
    │   │       └── mockData.ts
    │   │
    │   ├── 📁 auth/            # Module Authentification
    │   │   ├── index.ts
    │   │   └── components/
    │   │       └── JoinForm.tsx
    │   │
    │   ├── 📁 home/            # Module Page d'Accueil
    │   │   ├── index.ts
    │   │   └── components/
    │   │       └── HomePage.tsx
    │   │
    │   └── 📁 workshop/        # Module Atelier Participant
    │       ├── index.ts
    │       └── components/
    │           └── ParticipantView.tsx
    │
    ├── 📁 hooks/               # Hooks partagés
    │   ├── index.ts
    │   ├── useDebounce.ts
    │   └── useLocalStorage.ts
    │
    ├── 📁 lib/                 # Utilitaires
    │   ├── index.ts
    │   └── utils.ts
    │
    ├── 📁 services/            # Services externes
    │   ├── index.ts
    │   └── supabase/
    │       ├── index.ts
    │       └── client.ts       # Client Supabase singleton
    │
    ├── 📁 styles/              # Styles globaux
    │   └── index.css           # Tailwind + customs
    │
    └── 📁 types/               # Types TypeScript
        ├── index.ts            # Types globaux
        └── api.ts              # Types API
```

### 6.2 Conventions de Nommage

| Type                | Convention                   | Exemple                 |
| ------------------- | ---------------------------- | ----------------------- |
| **Composant React** | PascalCase                   | `AdminDashboard.tsx`    |
| **Hook**            | camelCase avec préfixe `use` | `useSlideGeneration.ts` |
| **Utilitaire**      | camelCase                    | `utils.ts`              |
| **Constante**       | SCREAMING_SNAKE_CASE         | `MAX_PARTICIPANTS`      |
| **Type/Interface**  | PascalCase                   | `SessionState`          |
| **Fichier barrel**  | `index.ts`                   | `index.ts`              |
| **Dossier**         | kebab-case ou camelCase      | `features/admin/`       |

### 6.3 Règles d'Import

```typescript
// ✅ BONNE PRATIQUE - Import depuis barrel
import { Button, Card } from "@/components/ui";
import { useSlideGeneration } from "@/features/admin";
import { APP, LIMITS } from "@/config";

// ❌ MAUVAISE PRATIQUE - Import profond
import { Button } from "@/components/ui/Button";
import { useSlideGeneration } from "@/features/admin/hooks/useSlideGeneration";
```

### 6.4 Alias de Chemin

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 7. Standards Créatifs et Techniques

### 7.1 Style Visuel

#### Palette de Couleurs

```css
/* Couleurs Principales */
--color-primary: #10b981; /* Emerald 500 - Accent principal */
--color-primary-hover: #059669; /* Emerald 600 - Hover */
--color-background: #050508; /* Noir profond - Fond principal */
--color-surface: #0a0a0f; /* Noir légèrement plus clair */

/* Couleurs de Statut */
--color-success: #10b981; /* Vert émeraude */
--color-warning: #f59e0b; /* Ambre */
--color-error: #ef4444; /* Rouge */
--color-info: #3b82f6; /* Bleu */

/* Couleurs par Type de Slide */
--type-intro: #3b82f6; /* Bleu */
--type-theory: #10b981; /* Émeraude */
--type-exercise: #f59e0b; /* Ambre */
--type-challenge: #8b5cf6; /* Violet */
```

#### Typographie

```css
/* Police principale */
font-family: "Inter", sans-serif;

/* Échelle typographique */
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
--text-3xl: 1.875rem; /* 30px */

/* Poids */
font-weight: 400 (normal), 500 (medium), 600 (semibold), 700 (bold), 900 (black);
```

#### Effets Visuels

```css
/* Glassmorphism */
.card-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Glow Effect */
.glow-emerald {
  box-shadow: 0 0 40px rgba(16, 185, 129, 0.4);
}

/* Gradient Background */
background: radial-gradient(
  circle at center,
  rgba(16, 185, 129, 0.04) 0%,
  transparent 70%
);
```

### 7.2 Ton Narratif

#### Voix de la Marque

| Attribut          | Description                        |
| ----------------- | ---------------------------------- |
| **Inspirant**     | Motiver à explorer l'IA créative   |
| **Accessible**    | Éviter le jargon technique inutile |
| **Dynamique**     | Énergie positive et moderne        |
| **Professionnel** | Crédibilité sans rigidité          |

#### Exemples de Formulations

```
✅ Bon ton :
  - "Prepárate para sumergirte en el universo de la IA Generativa"
  - "El taller definitivo para mentes creativas"
  - "Hoy vas a crear, probar y dominar"

❌ À éviter :
  - "Cliquez ici pour commencer" (trop basique)
  - "Module d'apprentissage machine supervisé" (trop technique)
  - "Veuillez saisir vos informations" (trop formel)
```

### 7.3 Contraintes Techniques

#### Performance

```yaml
Objectifs:
  - First Contentful Paint: < 1.5s
  - Largest Contentful Paint: < 2.5s
  - Time to Interactive: < 3.0s
  - Bundle size (gzip): < 200KB

Pratiques:
  - Lazy loading des composants lourds
  - Optimisation des images
  - Code splitting par route
  - Minification CSS/JS
```

#### Compatibilité

```yaml
Navigateurs Supportés:
  - Chrome: dernières 2 versions
  - Firefox: dernières 2 versions
  - Safari: dernières 2 versions
  - Edge: dernières 2 versions

Résolutions:
  - Desktop: 1024px et plus
  - Tablet: support basique (futur)
  - Mobile: non prioritaire v1
```

#### Sécurité

```yaml
Règles:
  - Variables d'environnement pour secrets
  - Validation côté client ET serveur
  - Sanitization des inputs utilisateur
  - HTTPS obligatoire en production
  - Row Level Security (Supabase)
```

#### Code Quality

```yaml
TypeScript:
  - Mode strict activé
  - Pas de 'any' explicite
  - Interfaces pour toutes les props

Patterns:
  - Composants fonctionnels uniquement
  - Hooks pour la logique réutilisable
  - Props destructurées
  - Early returns pour conditions
```

---

## 8. Prompts de Référence

### 8.1 Prompts pour Développement de Features

#### Création d'un Nouveau Composant

```markdown
# Prompt: Nouveau Composant UI

Contexte: Projet Destino IA - React + TypeScript + Tailwind

Crée un composant [NomComposant] avec les spécifications suivantes:

**Props:**

- prop1: type - description
- prop2?: type - description (optionnel)

**Comportement:**

- Description du comportement attendu

**Style:**

- Utiliser les classes du design system (card-glass, btn-elegant-primary, etc.)
- Respecter la palette de couleurs (emerald-500 pour accent)

**Structure attendue:**

- JSDoc en en-tête
- Interface Props typée
- Export nommé
- Pas de default export
```

#### Création d'un Hook Personnalisé

```markdown
# Prompt: Nouveau Hook

Contexte: Projet Destino IA - Feature-First Architecture

Crée un hook use[NomHook] pour [fonctionnalité]:

**Input:**

- options: { paramètres et callbacks }

**Output:**

- { état, actions, helpers }

**Logique:**

- Description de la logique métier

**Contraintes:**

- Suivre le pattern existant (useSlideGeneration)
- Gestion d'erreur avec état error
- État loading avec isProcessing
- Callbacks onSuccess/onError
```

### 8.2 Prompts pour Contenu d'Atelier

#### Génération de Slide Théorique

```markdown
# Prompt: Slide Théorie IA Générative

Crée un contenu de slide théorique sur [SUJET]:

**Format:**

- Titre: Max 60 caractères, accrocheur
- Sous-titre: Contexte ou catégorie
- Contenu: Max 500 caractères, vulgarisé

**Ton:**

- Accessible aux débutants
- Exemples concrets
- Métaphores si pertinent

**Structure:**

- 1 concept clé par slide
- Pas de jargon non expliqué
```

#### Génération d'Exercice Pratique

```markdown
# Prompt: Exercice Atelier IA

Crée un exercice pratique sur [OUTIL/TECHNIQUE]:

**Format:**

- Titre: Action claire (ex: "Crée ta première image IA")
- Durée estimée: X minutes
- Objectif: Ce que le participant saura faire

**Instructions:**

1. Étape préparatoire
2. Action principale
3. Validation du résultat

**Critères de réussite:**

- Résultat attendu mesurable
```

### 8.3 Prompts de Contrôle Qualité

#### Review de Code

```markdown
# Prompt: Code Review Destino IA

Analyse le code suivant selon les critères:

**Architecture:**

- Respect du pattern Feature-First
- Séparation des responsabilités
- Imports depuis barrels

**TypeScript:**

- Typage strict sans 'any'
- Interfaces bien définies
- Props correctement typées

**React:**

- Hooks utilisés correctement
- Pas de logique dans le JSX
- Keys uniques pour listes

**Style:**

- Classes Tailwind cohérentes
- Pas de styles inline
- Responsive si nécessaire

**Performance:**

- useCallback/useMemo appropriés
- Pas de re-renders inutiles
```

#### Vérification UX

```markdown
# Prompt: UX Review Destino IA

Évalue l'expérience utilisateur:

**Accessibilité:**

- Contraste suffisant
- Labels sur les inputs
- Navigation clavier

**Feedback:**

- États de chargement visibles
- Messages d'erreur clairs
- Confirmations d'actions

**Cohérence:**

- Design system respecté
- Comportements prévisibles
- Terminologie uniforme
```

---

## 9. Règles d'Évolution de la Base de Connaissance

### 9.1 Comment Mettre à Jour ce Fichier

#### Quand Mettre à Jour

| Événement                | Action Requise                       |
| ------------------------ | ------------------------------------ |
| Nouvelle feature ajoutée | Mettre à jour §3 (État Actuel)       |
| Décision architecturale  | Ajouter à §11 (Historique Décisions) |
| Changement de périmètre  | Mettre à jour §4 (Périmètre)         |
| Nouveau standard adopté  | Mettre à jour §7 (Standards)         |
| Nouveau prompt utile     | Ajouter à §8 (Prompts)               |
| Terme technique ajouté   | Ajouter à §10 (Glossaire)            |

#### Processus de Mise à Jour

```
1. Identifier la section concernée
2. Ajouter le contenu avec la date
3. Mettre à jour la date "Dernière mise à jour" en haut
4. Incrémenter la version si changement majeur
5. Commit avec message descriptif: "docs: update knowledge base - [section]"
```

### 9.2 Comment Ajouter de Nouvelles Décisions

#### Template de Décision

```markdown
### [DATE] - [TITRE DÉCISION]

**Contexte:** Pourquoi cette décision est nécessaire

**Options Considérées:**

1. Option A - Avantages / Inconvénients
2. Option B - Avantages / Inconvénients

**Décision:** Option choisie et justification

**Conséquences:**

- Impact sur le code
- Impact sur l'équipe
- Risques identifiés

**Statut:** Acceptée / En discussion / Remplacée par [REF]
```

### 9.3 Versioning du Document

```
Format: MAJEUR.MINEUR.PATCH

MAJEUR: Restructuration complète ou changement de vision
MINEUR: Ajout de nouvelles sections ou contenus significatifs
PATCH:  Corrections, clarifications, mises à jour mineures

Exemple: 1.2.3
         │ │ └── 3ème correction/clarification
         │ └──── 2ème ajout de contenu
         └────── Version majeure 1
```

---

## 10. Glossaire

| Terme             | Définition                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------------- |
| **Barrel Export** | Fichier `index.ts` qui ré-exporte les modules d'un dossier pour simplifier les imports       |
| **Feature-First** | Architecture où le code est organisé par fonctionnalité métier plutôt que par type technique |
| **Glassmorphism** | Style visuel avec effet de verre dépoli (blur + transparence)                                |
| **Hook**          | Fonction React permettant d'utiliser l'état et les effets dans les composants fonctionnels   |
| **LLM**           | Large Language Model - Modèle de langage de grande taille (ex: GPT, Claude)                  |
| **Mock Data**     | Données fictives utilisées pendant le développement                                          |
| **PDF.js**        | Bibliothèque JavaScript de Mozilla pour afficher/traiter des PDFs                            |
| **Realtime**      | Fonctionnalité Supabase pour synchronisation en temps réel via WebSocket                     |
| **Slide**         | Unité de contenu dans la présentation (équivalent d'une diapositive)                         |
| **Supabase**      | Backend-as-a-Service open source (alternative Firebase)                                      |
| **TypeScript**    | Sur-ensemble de JavaScript avec typage statique                                              |
| **Vite**          | Outil de build moderne pour applications web                                                 |

---

## 11. Historique des Décisions

### 2025-XX-XX - Choix de l'Architecture Feature-First

**Contexte:** Besoin de structurer le code pour faciliter la maintenance et l'évolutivité.

**Options Considérées:**

1. Architecture par type (components/, hooks/, utils/) - Simple mais ne scale pas
2. Architecture Feature-First - Plus complexe initialement mais meilleure organisation

**Décision:** Feature-First pour permettre l'encapsulation des fonctionnalités et faciliter le travail parallèle.

**Statut:** ✅ Acceptée

---

### 2025-XX-XX - PDF.js via CDN plutôt que npm

**Contexte:** Besoin de traiter des PDFs côté client.

**Options Considérées:**

1. Package npm pdfjs-dist - Plus de contrôle mais augmente le bundle
2. CDN global - Mise en cache navigateur, bundle plus léger

**Décision:** CDN pour optimiser le bundle size et bénéficier du cache navigateur.

**Conséquences:**

- Variable globale `window.pdfjsLib`
- Dépendance au CDN externe
- TypeScript avec `@ts-expect-error`

**Statut:** ✅ Acceptée

---

### 2025-XX-XX - Supabase comme Backend

**Contexte:** Besoin de temps réel et persistance sans backend custom.

**Options Considérées:**

1. Backend Node.js custom - Flexibilité maximale mais maintenance lourde
2. Firebase - Bien documenté mais vendor lock-in Google
3. Supabase - Open source, PostgreSQL, bon DX

**Décision:** Supabase pour le temps réel natif, Row Level Security, et possibilité de migration.

**Statut:** ✅ Acceptée

---

### 2026-01-10 - Création de la Base de Connaissance

**Contexte:** Besoin d'une source de vérité unique pour le projet.

**Décision:** Création de ce fichier `BASE_DE_CONNAISSANCE.md` comme référence centrale.

**Statut:** ✅ Acceptée

---

## 📎 Annexes

### A. Commandes Utiles

```bash
# Développement
npm run dev          # Lancer le serveur de développement
npm run build        # Construire pour production
npm run preview      # Prévisualiser le build
npm run type-check   # Vérifier les types TypeScript

# Nettoyage
npm run clean        # Supprimer dist et cache
```

### B. Variables d'Environnement

```env
# .env.local
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-publique
```

### C. Liens Utiles

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Vite](https://vitejs.dev/)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation React](https://react.dev/)
- [Documentation TypeScript](https://www.typescriptlang.org/docs/)

---

<div align="center">

**📚 Base de Connaissance Destino IA**

_Source de Vérité Unique - Maintenue par l'équipe projet_

Version 1.0.0 | Janvier 2026

</div>
