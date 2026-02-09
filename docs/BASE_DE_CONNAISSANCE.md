# 📚 Base de Connaissance - Destino IA

> **Source de Vérité Unique** pour le projet Destino IA - Atelier Interactif  
> Dernière mise à jour : 9 février 2026  
> Version : 2.0.0

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

**Destino IA** est une plateforme web interactive conçue pour animer des ateliers de formation à l'Intelligence Artificielle Générative. L'application permet à un formateur (administrateur) de guider des participants à travers une présentation structurée en temps réel, avec synchronisation des contenus, exercices pratiques, quiz gamifiés et communication bidirectionnelle.

**Stack Technique Principal :**

- **Frontend** : React 18 + TypeScript (strict) + Vite 6
- **Styling** : Tailwind CSS 3.4 — Dark Mode uniquement, Glassmorphism
- **Backend/Realtime** : Supabase (PostgreSQL + Realtime) — hébergé us-east-1 (Virginie)
- **Déploiement** : Vercel (US-East) — CDN pour slides WebP et assets statiques
- **Traitement Slides** : Sharp + pdf2pic (pipeline Node.js PDF → WebP) [MIS À JOUR]
- **Cible géographique** : Mexique

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
│  🎓 Pédagogie        │  Framework 5 éléments (ROEES/RCTF)  │  [NOUVEAU]
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Contexte d'Utilisation

| Acteur                       | Rôle            | Fonctionnalités Clés                                                                            |
| ---------------------------- | --------------- | ----------------------------------------------------------------------------------------------- |
| **Administrateur/Formateur** | Anime l'atelier | Pilotage slides temps réel, lancement exercices/quiz, monitoring présence, messagerie broadcast |
| **Participant**              | Suit l'atelier  | Visualisation synchronisée, exercices pratiques, quiz gamifié, messagerie directe               |

### 1.4 Méthodologie Pédagogique [NOUVEAU]

L'atelier est basé sur le **Framework 5 Éléments** pour structurer un prompt efficace :

| #   | Élément             | Abréviation | Description                                  |
| --- | ------------------- | ----------- | -------------------------------------------- |
| 1   | **ROL**             | R           | Rôle assigné à l'IA (ex: photographe)        |
| 2   | **OBJETIVO**        | O (ou C)    | Objectif/Contexte de la création             |
| 3   | **ESCENA+EMOCIÓN**  | E (ou T)    | Scène visuelle + émotion transmise           |
| 4   | **ESTILO VISUAL**   | E (ou F)    | Style artistique, format, technique          |
| 5   | **SALIDA ESPERADA** | S           | Format de sortie attendu (ratio, résolution) |

> Aussi connu sous les acronymes **ROEES** ou **RCTF** selon le contexte.

### 1.5 Outils IA Couverts dans l'Atelier [NOUVEAU]

| Outil          | Catégorie        | Usage dans l'atelier                    |
| -------------- | ---------------- | --------------------------------------- |
| **ChatGPT**    | Text/Prompting   | Génération de prompts, chain of thought |
| **Ideogram**   | Image Generation | Text-to-image, logos, publicité         |
| **Grok**       | Video Generation | Image-to-video, text-to-video           |
| **Kling AI**   | Video Generation | Vidéos avancées                         |
| **Hailuo**     | Video Generation | Vidéos créatives                        |
| **CapCut**     | Video Editing    | Montage et post-production              |
| **ElevenLabs** | Audio/Voice      | Voix off IA                             |
| **Suno**       | Music Generation | Musique IA pour vidéos                  |

---

## 2. Objectifs

### 2.1 Objectifs Principaux

| ID     | Objectif                 | Description                                                                   | Priorité    | Statut        |
| ------ | ------------------------ | ----------------------------------------------------------------------------- | ----------- | ------------- |
| **O1** | Présentation Interactive | Permettre au formateur de piloter une présentation synchronisée en temps réel | 🔴 Critique | ✅ Implémenté |
| **O2** | Participation Active     | Offrir aux participants une interface immersive pour suivre et interagir      | 🔴 Critique | ✅ Implémenté |
| **O3** | Gestion de Contenu       | Slides WebP pré-générées servies via Vercel CDN                               | 🟠 Haute    | ✅ Implémenté |
| **O4** | Communication Temps Réel | Messagerie directe + broadcast via Supabase Realtime                          | 🟠 Haute    | ✅ Implémenté |

### 2.2 Objectifs Secondaires

| ID     | Objectif               | Description                                    | Priorité   | Statut        |
| ------ | ---------------------- | ---------------------------------------------- | ---------- | ------------- |
| **O5** | Gestion des Ressources | Exemples IA statiques via CDN                  | 🟡 Moyenne | ✅ Implémenté |
| **O6** | Quiz Gamifié           | Quiz interactif avec score, streaks, timer     | 🟡 Moyenne | ✅ Implémenté |
| **O7** | Exercices Pratiques    | 8 exercices RCTF avec lazy loading et registry | 🟡 Moyenne | ✅ Implémenté |
| **O8** | Analytics              | Suivre la participation et l'engagement        | 🟢 Basse   | 📋 Planifié   |

### 2.3 Indicateurs de Réussite (KPIs)

```yaml
Indicateurs Techniques:
  - Temps de chargement initial: < 3 secondes
  - Latence synchronisation: < 500ms
  - Disponibilité: 99.5%
  - Score Lighthouse Performance: > 90
  - Payload Realtime: ~150 bytes/message (index only)  # [MIS À JOUR]
  - Réduction egress Supabase: 99.7% (architecture CDN)  # [NOUVEAU]

Indicateurs Fonctionnels:
  - Participants max simultanés: 50
  - Slides max par session: 100 (45 actuellement)  # [MIS À JOUR]
  - Exercices disponibles: 8 types  # [NOUVEAU]

Indicateurs UX:
  - Temps moyen pour rejoindre: < 30 secondes
  - Navigation intuitive sans formation préalable
```

---

## 3. État Actuel du Projet

> **Statut global : MVP Avancé (Beta-Ready)** — Confiance technique : 8/10 [MIS À JOUR]

### 3.1 Éléments Déjà Réalisés ✅

| Composant                          | Description                                                          | Statut     |
| ---------------------------------- | -------------------------------------------------------------------- | ---------- |
| **Architecture Feature-First**     | Structure modulaire par fonctionnalité                               | ✅ Complet |
| **Page d'Accueil**                 | Landing page avec SplashCursor et Aurora effects                     | ✅ Complet |
| **Dashboard Admin**                | Interface complète avec pilotage live, monitoring, broadcast         | ✅ Complet |
| **Vue Participant (WorkshopView)** | Interface immersive synchronisée en temps réel                       | ✅ Complet |
| **Formulaire d'Inscription**       | JoinForm avec validation et persistance localStorage                 | ✅ Complet |
| **Système de Types**               | TypeScript strict — types session, gallery, aiExamples               | ✅ Complet |
| **Pipeline PDF → WebP**            | Sharp + pdf2pic, manifest JSON, `/public/slides/`                    | ✅ Complet |
| **UI Components**                  | Button, Card, Input, Aurora, SplashCursor                            | ✅ Complet |
| **Configuration Supabase**         | Client singleton, fallback local, 4 migrations SQL                   | ✅ Complet |
| **Styles CSS**                     | Dark mode, Glassmorphism, animations avancées                        | ✅ Complet |
| **Authentification Admin**         | Protection par mot de passe `VITE_ADMIN_PASSWORD`                    | ✅ Complet |
| **Synchronisation Realtime**       | `useLiveSession` + `subscribeToSessionState` via Supabase            | ✅ Complet |
| **Messagerie Directe**             | Admin → Participant via `direct_messages` table                      | ✅ Complet |
| **Messagerie Broadcast**           | `BroadcastMessageModal` avec templates et progression                | ✅ Complet |
| **Gestion Participants**           | CRUD + heartbeat 30s + disconnect auto (`sendBeacon`)                | ✅ Complet |
| **Présence Participant**           | `useParticipantPresence` — heartbeat + `visibilitychange`            | ✅ Complet |
| **Module Quiz Gamifié**            | `GamifiedQuiz.tsx` — score, streaks, timer, feedback visuel          | ✅ Complet |
| **Module Exercices (8 types)**     | Registry avec lazy loading, filtrage par outil/catégorie             | ✅ Complet |
| **Système de Cache**               | `cache.ts` + `useCache` — TTL, déduplication, stale-while-revalidate | ✅ Complet |
| **Exemples IA (CDN statique)**     | Assets `/public/assets/ai-examples/` + hook `useAIExamples`          | ✅ Complet |
| **SlidePresenter**                 | Composant slides avec preloading, états de chargement, modes         | ✅ Complet |
| **Mode Test**                      | Vue `#test` pour simuler un participant                              | ✅ Complet |
| **Context Session**                | `SessionContext` avec `useReducer`, actions typées                   | ✅ Complet |

### 3.2 Éléments En Cours 🔄

| Composant                  | Description                                   | Progression |
| -------------------------- | --------------------------------------------- | ----------- |
| **Galerie Collaborative**  | Upload et partage d'images entre participants | 60%         |
| **Sync Exercices Avancée** | `useExerciseSync` pour progression temps réel | 50%         |
| **Audit RLS Supabase**     | Row Level Security policies à renforcer       | 40%         |

### 3.3 Éléments À Faire 📋

| Composant                | Description                           | Priorité   |
| ------------------------ | ------------------------------------- | ---------- |
| **Optimisation Galerie** | Compression images, fix memory leaks  | 🔴 Haute   |
| **RLS Production**       | Audit et durcissement des policies    | 🔴 Haute   |
| **Analytics Dashboard**  | Métriques participation et engagement | 🟡 Moyenne |
| **Export Session**       | Génération rapport PDF de session     | 🟡 Moyenne |
| **Emails Jetables**      | Envoi credentials aux participants    | 🟢 Basse   |
| **Mode Hors-Ligne**      | PWA capabilities                      | 🟢 Basse   |

### 3.4 Diagramme de Progression [MIS À JOUR]

```
Progression Globale: ████████████████░░░░ 82%

Par Module:
  Core App          ████████████████████ 100%
  UI Components     ████████████████████ 100%
  Admin Features    ████████████████████ 100%
  Participant View  ████████████████████ 100%
  Realtime/Session  ████████████████████ 100%
  Quiz Gamifié      ████████████████░░░░  80%
  Exercices (8)     ████████████████░░░░  80%
  Messagerie        ████████████████████ 100%
  Slides CDN        ████████████████████ 100%
  Galerie           ████████████░░░░░░░░  60%
  Analytics         ░░░░░░░░░░░░░░░░░░░░   0%
```

### 3.5 Dette Technique Identifiée [NOUVEAU]

| Problème                               | Sévérité   | Impact                          |
| -------------------------------------- | ---------- | ------------------------------- |
| Memory leaks dans galerie              | 🔴 Haute   | Fuite mémoire en session longue |
| Images galerie non compressées         | 🟠 Moyenne | Bande passante et performance   |
| RLS policies à auditer                 | 🔴 Haute   | Sécurité données participants   |
| `aiExamples.ts` deprecated non nettoyé | 🟢 Basse   | Code mort à supprimer           |

---

## 4. Périmètre du Projet

### 4.1 Ce Qui Est Inclus ✅

#### Fonctionnalités Core

- ✅ Système de navigation par slides (WebP pré-générés, servis via Vercel CDN) [MIS À JOUR]
- ✅ 45 slides WebP 1920×1080 avec manifest JSON [MIS À JOUR]
- ✅ Pipeline PDF → WebP build-time (Sharp + pdf2pic) [MIS À JOUR]
- ✅ Synchronisation temps réel (Supabase Realtime — ~150 bytes/message) [MIS À JOUR]
- ✅ Messagerie directe + broadcast
- ✅ Gestion des participants avec présence heartbeat
- ✅ Interface responsive desktop
- ✅ Quiz gamifié interactif (score, streaks, timer) [NOUVEAU]
- ✅ 8 exercices pratiques avec lazy loading et registry [NOUVEAU]
- ✅ Exemples IA depuis assets statiques CDN [NOUVEAU]
- ✅ Authentification admin par mot de passe [NOUVEAU]
- ✅ Mode test participant (`#test`) [NOUVEAU]
- ✅ Système de cache en mémoire (TTL, déduplication) [NOUVEAU]

#### Types d'Exercices Disponibles [NOUVEAU]

| ID                        | Nom                          | Outil(s)          | Catégorie          | Difficulté   |
| ------------------------- | ---------------------------- | ----------------- | ------------------ | ------------ |
| `text-to-image-intro`     | Introducción a Text-to-Image | Ideogram, ChatGPT | Prompt Engineering | Beginner     |
| `agencia-viajes`          | Campaña Agencia de Viajes    | Ideogram          | Image Generation   | Intermediate |
| `text-to-image-ads`       | Publicidad Visual            | Ideogram, ChatGPT | Image Generation   | Intermediate |
| `text-to-image-corporate` | Imagen Corporativa           | Ideogram, Gemini  | Image Generation   | Intermediate |
| `text-to-image-logo`      | Diseño de Logotipos          | Ideogram, ChatGPT | Image Generation   | Advanced     |
| `text-to-video-workflow`  | Imagen a Video               | Grok              | Video Generation   | Intermediate |
| `text-to-video-scratch`   | Video desde Cero             | Grok              | Video Generation   | Advanced     |
| `flyer-to-video`          | Del Flyer al Video           | Ideogram, Grok    | Workflow           | Advanced     |

#### Aspects Techniques

- ✅ Application SPA React (hash-based routing)
- ✅ TypeScript strict mode
- ✅ Architecture modulaire Feature-First
- ✅ Barrel exports
- ✅ Custom hooks réutilisables (11 hooks) [MIS À JOUR]
- ✅ Design system cohérent (Dark Mode, Glassmorphism)
- ✅ Système de cache générique [NOUVEAU]
- ✅ Lazy loading des exercices [NOUVEAU]
- ✅ Fallback local sans Supabase [NOUVEAU]

#### Architecture Infrastructure [NOUVEAU]

```
┌─────────────────────────────────────────────────────────────┐
│                  ARCHITECTURE v2 CDN                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Participants (Mexique)                                     │
│       │                                                     │
│       ▼                                                     │
│  ┌──────────────┐     ┌─────────────────┐                  │
│  │  Vercel CDN  │     │  Supabase       │                  │
│  │  (US-East)   │     │  (us-east-1)    │                  │
│  ├──────────────┤     ├─────────────────┤                  │
│  │ • App React  │     │ • Realtime WS   │                  │
│  │ • Slides WebP│     │ • PostgreSQL    │                  │
│  │ • AI Examples│     │ • RLS Policies  │                  │
│  │ • Static JSON│     │ • REST API      │                  │
│  └──────────────┘     └─────────────────┘                  │
│                                                             │
│  Payload Realtime : ~150 bytes (index seulement)           │
│  Réduction egress : 99.7%                                  │
└─────────────────────────────────────────────────────────────┘
```

#### Utilisateurs Cibles

- ✅ Formateurs/Animateurs d'ateliers
- ✅ Participants aux ateliers
- ✅ Sessions de 5 à 50 participants

### 4.2 Ce Qui Est Exclu ❌

#### Hors Périmètre Fonctionnel

- ❌ **Fonctionnalités IA embarquées** (pas de LLM, pas de génération — l'IA est le _sujet_ de l'atelier)
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
- ❌ ~~PDF.js (remplacé par pipeline WebP build-time)~~ [MIS À JOUR]

> **⚠️ Note Importante** : Ce projet utilise **Sharp/pdf2pic (build-time) + Supabase Realtime**. Les slides sont des WebP statiques servis par Vercel CDN. Supabase ne transmet que les index de slides (~150 bytes). L'IA est le _sujet_ de l'atelier, pas un outil technique du projet.

---

## 5. Workflow de Création

### 5.1 Workflow Général d'une Session [MIS À JOUR]

```
┌─────────────────────────────────────────────────────────────────────┐
│                    WORKFLOW SESSION DESTINO IA                       │
└─────────────────────────────────────────────────────────────────────┘

  ┌──────────┐    ┌───────────┐    ┌──────────┐    ┌───────────┐
  │ PRÉPARER │───▶│  ANIMER   │───▶│ ENGAGER  │───▶│  CLÔTURER │
  └──────────┘    └───────────┘    └──────────┘    └───────────┘
       │               │               │                │
       ▼               ▼               ▼                ▼
  • Pipeline     • Navigation    • Exercices      • Feedback
    PDF→WebP     • Sync temps      pratiques      • Ressources
  • Config       • Chat live     • Quiz gamifié   • Export
    session      • Broadcast     • Challenges
  • Participants • Mode switch
```

### 5.2 Étapes Détaillées

#### Phase 0 : Build des Slides (Développeur) [NOUVEAU]

```yaml
0.1 Pipeline PDF → WebP:
  - Placer le PDF dans le dossier racine du projet
  - Exécuter: npm run slides (ou slides:hq pour haute qualité)
  - Le pipeline Sharp + pdf2pic génère les WebP 1920x1080
  - Le manifest slides-manifest.json est créé automatiquement
  - Les fichiers sont déposés dans /public/slides/

0.2 Vérification:
  - Vérifier le nombre de slides dans le manifest
  - Contrôler la qualité visuelle des WebP
  - Les slides sont servis statiquement via Vercel CDN

0.3 Commandes disponibles:
  - npm run slides # Qualité standard (85%, 1920px, 200 DPI)
  - npm run slides:clean # Nettoyer et regénérer
  - npm run slides:hq # Haute qualité (90%, 2560px, 250 DPI)
```

#### Phase 1 : Préparation (Admin)

```yaml
1.1 Accès Admin:
  - Accéder au Dashboard Admin (#admin)
  - S'authentifier avec le mot de passe (VITE_ADMIN_PASSWORD)
  - Le dashboard affiche les slides WebP pré-générés # [MIS À JOUR]

1.2 Configuration de la Session:
  - Vérifier le manifest et le nombre de slides
  - Configurer le thème de slides
  - Activer le mode Live pour commencer la diffusion

1.3 Préparation des Exercices:
  - Vérifier les exercices disponibles dans le registry
  - Préparer les exemples AI via /public/assets/ai-examples/
```

#### Phase 2 : Animation (Admin + Participants)

```yaml
2.1 Lancement:
  - Les participants rejoignent via #join
  - Saisie du nom + email → Accès à WorkshopView
  - Heartbeat automatique (30s) marque la présence
  - L'admin voit les connexions en temps réel # [MIS À JOUR]

2.2 Navigation:
  - L'admin navigue entre les slides (actions.goToSlide)
  - Les participants voient le slide actif via Supabase Realtime
  - Le current_slide_index est synchronisé (~150 bytes) # [MIS À JOUR]
  - Preloading intelligent des N slides suivants

2.3 Communication:
  - Messages directs: Admin → Participant spécifique
  - Messages broadcast: Admin → Tous les participants
  - Templates de messages prédéfinis disponibles # [MIS À JOUR]
```

#### Phase 3 : Engagement (Pendant la session)

```yaml
3.1 Exercices Pratiques: # [MIS À JOUR]
  - L'admin exécute actions.pauseForExercise('exerciseId')
  - Le slide courant est mémorisé (paused_slide_index)
  - L'exercice se charge en lazy loading chez les participants
  - 8 types d'exercices disponibles (image, video, workflow)
  - Chaque exercice suit le framework RCTF / 5 éléments

3.2 Quiz Gamifié: # [MIS À JOUR]
  - L'admin exécute actions.pauseForQuiz()
  - GamifiedQuiz.tsx avec:
      - Système de score + multiplicateurs
      - Streaks de bonnes réponses
      - Timer par question
      - Feedback visuel immédiat
      - Écran de résultats avec statistiques
  - Questions basées sur le Framework 5 éléments

3.3 Reprise de la Présentation:
  - L'admin exécute actions.resumePresentation()
  - Le slide reprend exactement où il était (paused_slide_index)
```

#### Phase 4 : Clôture

```yaml
4.1 Conclusion:
  - L'admin désactive le mode Live
  - Les participants voient la salle d'attente

4.2 Déconnexion:
  - Fermeture d'onglet → sendBeacon marque "disconnected"
  - Le heartbeat s'arrête automatiquement

4.3 Export (Futur):
  - Génération d'un rapport de session
  - Liste des participants et statistiques
```

### 5.3 Workflow Technique de Développement

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│  IDÉE   │──▶│ DESIGN  │──▶│  CODE   │──▶│  TEST   │──▶│ DEPLOY  │
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
     │             │             │             │             │
     ▼             ▼             ▼             ▼             ▼
 • User Story  • Composant   • Feature     • Type-check  • Build
 • Acceptance  • Props/API   • Hook        • Lint         • Vercel
 • Priority    • Variants    • Service     • Manual       • CDN
```

---

## 6. Structure des Fichiers et Dossiers

### 6.1 Organisation Actuelle [MIS À JOUR]

```
destino-ia/
│
├── 📄 Configuration Racine
│   ├── index.html              # Point d'entrée HTML
│   ├── package.json            # Dépendances et scripts
│   ├── vite.config.ts          # Configuration Vite 6
│   ├── tailwind.config.js      # Configuration Tailwind 3.4
│   ├── tsconfig.json           # Configuration TypeScript strict
│   ├── tsconfig.node.json      # TS config pour scripts Node
│   └── postcss.config.js       # Configuration PostCSS
│
├── 📁 docs/                    # Documentation
│   ├── ARCHITECTURE.md         # Décisions architecturales
│   ├── BASE_DE_CONNAISSANCE.md # Ce fichier (source de vérité)
│   ├── FINOPS.md               # Analyse coûts et optimisations
│   ├── PERFORMANCE_ANALYSIS.md # Analyse performance
│   ├── SCALABILITY_ANALYSIS.md # Analyse scalabilité
│   ├── AUDIT_TECHNIQUE.md      # Audit technique
│   ├── AUDIT_SECURITY_QA_COMPLETE.md  # Audit sécurité
│   ├── MODE_LOCAL.md           # Documentation mode local
│   └── archive/                # Documents archivés
│
├── 📁 public/                  # Assets statiques (Vercel CDN)
│   ├── assets/
│   │   └── ai-examples/        # Exemples IA (JSON + médias)
│   │       ├── examples.json   # Index des exemples
│   │       └── README.md
│   └── slides/                 # Slides WebP pré-générés
│       ├── slides-manifest.json # Manifest (index, file, size, dims)
│       └── slide-001.webp … slide-045.webp  # 45 slides 1920×1080
│
├── 📁 scripts/                 # Scripts utilitaires
│   └── pdf-to-webp.ts          # Pipeline PDF → WebP (Sharp + pdf2pic)
│
├── 📁 supabase/                # Migrations SQL
│   └── migrations/
│       ├── 001_participants.sql    # Table participants + RLS
│       ├── 002_ai_examples.sql    # Table exercise_ai_examples
│       ├── 003_direct_messages.sql # Table direct_messages + RLS
│       └── 004_session_state.sql  # Table session_state + Realtime
│
└── 📁 src/                     # Code source
    │
    ├── 📄 App.tsx              # Composant racine + routing (#home/#admin/#join/#workshop/#test)
    ├── 📄 main.tsx             # Point d'entrée React
    ├── 📄 vite-env.d.ts        # Types Vite
    │
    ├── 📁 components/          # Composants partagés
    │   ├── SlidePresenter.tsx   # Visualiseur de slides (preload, loading, thumbnail)
    │   ├── effects/
    │   │   └── SplashCursor.tsx # Effet fluide curseur (OGL WebGL)
    │   ├── messaging/
    │   │   ├── index.ts
    │   │   ├── MessageButton.tsx  # Bouton notification messages
    │   │   └── MessagePanel.tsx   # Panel de messages
    │   └── ui/
    │       ├── index.ts
    │       ├── Aurora.tsx       # Effet visuel Aurora
    │       ├── Button.tsx      # Bouton réutilisable
    │       ├── Card.tsx        # Carte conteneur glassmorphism
    │       └── Input.tsx       # Champ de saisie
    │
    ├── 📁 config/              # Configuration applicative
    │   ├── index.ts
    │   ├── constants.ts        # Constantes globales (APP, UI, LIMITS, API)
    │   └── env.ts              # Variables d'environnement centralisées
    │
    ├── 📁 contexts/            # Contexts React
    │   ├── index.ts
    │   └── SessionContext.tsx   # État global session (useReducer)
    │
    ├── 📁 data/                # Données statiques
    │   └── exercises.ts        # Définition des exercices (types + liste)
    │
    ├── 📁 features/            # Fonctionnalités (Feature-First)
    │   │
    │   ├── 📁 admin/           # Module Administration
    │   │   ├── index.ts
    │   │   ├── components/
    │   │   │   ├── AdminAuth.tsx           # Authentification admin
    │   │   │   ├── AdminDashboard.tsx      # Dashboard principal
    │   │   │   ├── ExampleAIManager.tsx    # Gestion exemples IA
    │   │   │   └── dashboard/
    │   │   │       ├── index.ts
    │   │   │       ├── AdminHeader.tsx          # Header compact
    │   │   │       ├── BroadcastMessageModal.tsx # Modal message broadcast
    │   │   │       ├── SendMessageModal.tsx      # Modal message direct
    │   │   │       ├── ExerciseManagement.tsx    # Gestion exercices
    │   │   │       ├── ParticipantList.tsx       # Liste participants
    │   │   │       └── exerciseData.ts          # Données exercices admin
    │   │   ├── hooks/
    │   │   │   └── useSlideGeneration.ts  # (legacy)
    │   │   └── data/
    │   │       └── mockData.ts            # (legacy)
    │   │
    │   ├── 📁 auth/            # Module Authentification
    │   │   ├── index.ts
    │   │   └── components/
    │   │       └── JoinForm.tsx # Formulaire inscription participant
    │   │
    │   ├── 📁 home/            # Module Page d'Accueil
    │   │   ├── index.ts
    │   │   └── components/
    │   │       └── HomePage.tsx # Landing page
    │   │
    │   ├── 📁 quiz/            # Module Quiz Gamifié
    │   │   ├── index.ts
    │   │   └── components/
    │   │       └── GamifiedQuiz.tsx  # Quiz complet (1272 lignes)
    │   │
    │   └── 📁 workshop/        # Module Atelier Participant
    │       └── components/
    │           ├── WorkshopView.tsx  # Vue participant temps réel
    │           └── exercises/       # 8 exercices lazy-loaded
    │               ├── index.ts
    │               ├── exerciseRegistry.ts    # Registry + helpers
    │               ├── ExerciseLoader.tsx      # Loader avec fallback
    │               ├── ExerciseFallback.tsx    # Composant fallback
    │               ├── AgenciaViajesExercise/  # Exercice voyage
    │               ├── TextToImageIntro/       # Exercice intro
    │               ├── TextToImageAds/         # Exercice publicité
    │               ├── TextToImageCorporate/   # Exercice corporate
    │               ├── TextToImageLogo/        # Exercice logo
    │               ├── TextToVideoWorkflow/    # Exercice img→video
    │               ├── TextToVideoFromScratch/ # Exercice video scratch
    │               └── FlyerToVideoWorkflow/   # Exercice flyer→video
    │
    ├── 📁 hooks/               # Hooks partagés (11 hooks)
    │   ├── index.ts            # Barrel export
    │   ├── useDebounce.ts      # Debounce générique
    │   ├── useLocalStorage.ts  # Persistance localStorage
    │   ├── useCopyToClipboard.ts  # Copier dans le presse-papier
    │   ├── useCache.ts         # Fetch avec cache (TTL, dédup)
    │   ├── useAIExamples.ts    # Chargement exemples IA (CDN)
    │   ├── useParticipants.ts  # Gestion participants (avec cache)
    │   ├── useParticipantMessages.ts  # Messages participant
    │   ├── useLiveSession.ts   # Pilotage session temps réel
    │   ├── useSlideManifest.ts # Manifest slides + preloading
    │   └── useParticipantPresence.ts  # Heartbeat + disconnect
    │
    ├── 📁 lib/                 # Utilitaires
    │   ├── index.ts
    │   ├── utils.ts            # Utilitaires généraux
    │   ├── cache.ts            # Cache en mémoire (Map, TTL)
    │   └── sessionId.ts        # Gestion ID de session
    │
    ├── 📁 services/            # Services externes
    │   ├── index.ts
    │   ├── participants.ts     # CRUD participants Supabase
    │   ├── directMessages.ts   # Messagerie directe Supabase
    │   ├── sessionState.ts     # État session (CRUD + Realtime + fallback local)
    │   ├── aiExamples.ts       # (deprecated — migré vers assets statiques)
    │   └── supabase/
    │       ├── index.ts
    │       └── client.ts       # Client Supabase singleton
    │
    ├── 📁 styles/              # Styles globaux
    │   └── index.css           # Tailwind + customs + animations
    │
    └── 📁 types/               # Types TypeScript
        ├── index.ts            # Types globaux + barrel exports
        ├── api.ts              # Types API / réponses
        ├── session.ts          # Types session temps réel (LiveSessionState, etc.)
        ├── gallery.ts          # Types galerie (GalleryImage, GalleryState)
        └── aiExamples.ts       # Types exemples IA (AIExample, AITool, etc.)
```

### 6.2 Conventions de Nommage

| Type                 | Convention                   | Exemple                  |
| -------------------- | ---------------------------- | ------------------------ |
| **Composant React**  | PascalCase                   | `AdminDashboard.tsx`     |
| **Hook**             | camelCase avec préfixe `use` | `useLiveSession.ts`      |
| **Service**          | camelCase                    | `sessionState.ts`        |
| **Utilitaire**       | camelCase                    | `cache.ts`               |
| **Constante**        | SCREAMING_SNAKE_CASE         | `MAX_PARTICIPANTS`       |
| **Type/Interface**   | PascalCase                   | `LiveSessionState`       |
| **SQL migration**    | `NNN_nom.sql`                | `004_session_state.sql`  |
| **Fichier barrel**   | `index.ts`                   | `index.ts`               |
| **Dossier feature**  | kebab-case                   | `features/admin/`        |
| **Dossier exercice** | PascalCase                   | `AgenciaViajesExercise/` |

### 6.3 Règles d'Import

```typescript
// ✅ BONNE PRATIQUE - Import depuis barrel
import { Button, Card } from "@/components/ui";
import { useLiveSession, useSlideManifest } from "@/hooks";
import { APP, LIMITS } from "@/config";
import type { LiveSessionState, SessionMode } from "@/types/session";

// ❌ MAUVAISE PRATIQUE - Import profond
import { Button } from "@/components/ui/Button";
import { useLiveSession } from "@/hooks/useLiveSession";
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

/* Couleurs Outils IA [NOUVEAU] */
--tool-ideogram: #a855f7; /* Purple */
--tool-grok: #3b82f6; /* Blue */
--tool-gemini: #06b6d4; /* Cyan */
--tool-chatgpt: #10b981; /* Green */
```

#### Mode Sombre et Glassmorphism [MIS À JOUR]

```css
/* Dark Mode UNIQUEMENT - Pas de mode clair */
body {
  background: #050508;
  color: #ffffff;
}

/* Glassmorphism — pattern principal */
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

/* Animations CSS avancées [NOUVEAU] */
@keyframes fadeInUp {
  /* ... */
}
@keyframes slideIn {
  /* ... */
}
@keyframes pulse-glow {
  /* ... */
}
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
font-weight:
  400 (normal),
  500 (medium),
  600 (semibold),
  700 (bold),
  900 (black);
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
  - "Actúa como fotógrafo de viajes..."  (exemple de prompt RCTF)

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
  - Slides WebP: ~140KB/slide (moyenne) # [NOUVEAU]
  - Payload Realtime: ~150 bytes/message # [NOUVEAU]

Pratiques:
  - Lazy loading des exercices (React.lazy) # [MIS À JOUR]
  - Slides WebP pré-optimisées (Sharp) # [MIS À JOUR]
  - Preloading intelligent (N slides ahead) # [NOUVEAU]
  - Code splitting par route
  - Minification CSS/JS
  - Console.log supprimés en prod (vite-plugin-remove-console) # [NOUVEAU]
  - Cache en mémoire avec TTL (useCache) # [NOUVEAU]
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
  - Variables d'environnement pour secrets (VITE_*)
  - Authentification admin par mot de passe (VITE_ADMIN_PASSWORD) # [MIS À JOUR]
  - Session admin persistée via sessionStorage # [NOUVEAU]
  - Validation côté client ET serveur
  - Sanitization des inputs utilisateur
  - HTTPS obligatoire en production
  - Row Level Security (Supabase) — audit en cours # [MIS À JOUR]
  - sendBeacon pour déconnexion fiable # [NOUVEAU]
```

#### Code Quality

```yaml
TypeScript:
  - Mode strict activé
  - Pas de 'any' explicite (sauf exceptions commentées eslint-disable)
  - Interfaces pour toutes les props
  - Types session dédiés (session.ts, gallery.ts, aiExamples.ts) # [MIS À JOUR]

Patterns:
  - Composants fonctionnels uniquement
  - Hooks pour la logique réutilisable
  - Props destructurées
  - Early returns pour conditions
  - Registry pattern pour exercices # [NOUVEAU]
  - Service Result pattern { data, error } # [NOUVEAU]
  - Fallback local sans Supabase # [NOUVEAU]
```

---

## 8. Prompts de Référence

### 8.1 Prompts pour Développement de Features

#### Création d'un Nouveau Composant

```markdown
# Prompt: Nouveau Composant UI

Contexte: Projet Destino IA - React 18 + TypeScript strict + Tailwind
Design: Dark Mode uniquement, Glassmorphism

Crée un composant [NomComposant] avec les spécifications suivantes:

**Props:**

- prop1: type - description
- prop2?: type - description (optionnel)

**Comportement:**

- Description du comportement attendu

**Style:**

- Utiliser les classes du design system (card-glass, glassmorphism)
- Respecter la palette de couleurs (emerald-500 pour accent)
- Dark mode uniquement (bg-[#050508])

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

- Suivre le pattern existant (useLiveSession, useCache)
- Gestion d'erreur avec état error
- État loading
- Retourner { data, error } pattern
- Cleanup dans useEffect return
- Ref mountedRef pour éviter updates post-unmount
```

#### Création d'un Nouvel Exercice [NOUVEAU]

```markdown
# Prompt: Nouvel Exercice Atelier

Contexte: Projet Destino IA - Exercise Registry Pattern

Crée un exercice [NomExercice] avec:

**Config Registry:**

- id: 'mon-exercice'
- difficulty: beginner | intermediate | advanced
- category: image-generation | video-generation | prompt-engineering | workflow
- tools: ['ideogram', 'grok', 'gemini', 'chatgpt']
- duration: X minutes

**Composant:**

- Accepter props ExerciseProps { onComplete?, onProgress? }
- Suivre le Framework 5 éléments (ROL, OBJETIVO, ESCENA+EMOCIÓN, ESTILO, SALIDA)
- Export nommé (pour React.lazy)

**Structure:**

- Dossier dans src/features/workshop/components/exercises/[NomExercice]/
- index.ts barrel
- Composant principal .tsx
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

#### Génération d'Exercice Pratique (Framework RCTF) [MIS À JOUR]

```markdown
# Prompt: Exercice Atelier IA (Framework 5 Éléments)

Crée un exercice pratique sur [OUTIL/TECHNIQUE]:

**Framework RCTF / ROEES:**

1. ROL: Rôle assigné à l'IA
2. OBJETIVO/CONTEXTO: But de la création
3. ESCENA+EMOCIÓN: Description visuelle + sentiment
4. ESTILO VISUAL: Technique artistique, format
5. SALIDA ESPERADA: Format, ratio, résolution

**Format:**

- Titre: Action claire (ex: "Crea tu primera imagen IA")
- Durée estimée: X minutes
- Objectif: Ce que le participant saura faire

**Instructions:**

1. Étape préparatoire (comprendre le ROL)
2. Action principale (construire le prompt)
3. Validation du résultat (comparer avec exemple)

**Critères de réussite:**

- Prompt utilisant les 5 éléments
- Résultat visuellement cohérent
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
- Registry pattern pour exercices

**TypeScript:**

- Typage strict sans 'any'
- Interfaces bien définies
- Types session dédiés

**React:**

- Hooks utilisés correctement
- Pas de logique dans le JSX
- Keys uniques pour listes
- Cleanup dans useEffect
- mountedRef pour async

**Style:**

- Dark mode uniquement
- Glassmorphism cohérent
- Pas de styles inline

**Performance:**

- useCallback/useMemo appropriés
- Lazy loading des exercices
- Pas de re-renders inutiles
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
| Nouvel exercice créé     | Mettre à jour §4.1 tableau exercices |
| Nouvelle migration SQL   | Mettre à jour §6.1 supabase/         |

#### Processus de Mise à Jour

```
1. Identifier la section concernée
2. Ajouter le contenu avec la date
3. Marquer les changements avec [NOUVEAU] ou [MIS À JOUR]
4. Mettre à jour la date "Dernière mise à jour" en haut
5. Incrémenter la version si changement majeur
6. Commit avec message descriptif: "docs: update knowledge base - [section]"
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

Historique:
  1.0.0 (10-01-2026) - Création initiale
  2.0.0 (09-02-2026) - Mise à jour majeure : architecture CDN, exercices, quiz, présence
```

---

## 10. Glossaire

| Terme                    | Définition                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| **Barrel Export**        | Fichier `index.ts` qui ré-exporte les modules d'un dossier pour simplifier les imports       |
| **Broadcast**            | Message envoyé par l'admin à tous les participants simultanément [NOUVEAU]                   |
| **CDN**                  | Content Delivery Network — réseau de distribution de contenu (Vercel) [NOUVEAU]              |
| **Egress**               | Trafic sortant d'un service cloud, souvent facturé [NOUVEAU]                                 |
| **Exercise Registry**    | Pattern centralisant la configuration des exercices avec lazy loading [NOUVEAU]              |
| **Feature-First**        | Architecture où le code est organisé par fonctionnalité métier plutôt que par type technique |
| **FinOps**               | Optimisation des coûts cloud et infrastructure [NOUVEAU]                                     |
| **Framework 5 éléments** | Méthode pédagogique : ROL + OBJETIVO + ESCENA+EMOCIÓN + ESTILO + SALIDA [NOUVEAU]            |
| **Glassmorphism**        | Style visuel avec effet de verre dépoli (blur + transparence)                                |
| **Heartbeat**            | Signal périodique (30s) envoyé par le participant pour confirmer sa présence [NOUVEAU]       |
| **Hook**                 | Fonction React permettant d'utiliser l'état et les effets dans les composants fonctionnels   |
| **Lazy Loading**         | Chargement différé d'un composant — uniquement quand nécessaire [NOUVEAU]                    |
| **LiveSessionState**     | Interface TypeScript représentant l'état complet de la session synchronisée [NOUVEAU]        |
| **Manifest**             | Fichier JSON décrivant les slides disponibles (index, fichier, taille, dimensions) [NOUVEAU] |
| **RCTF / ROEES**         | Acronymes alternatifs pour le Framework 5 éléments de prompting [NOUVEAU]                    |
| **Realtime**             | Fonctionnalité Supabase pour synchronisation en temps réel via WebSocket                     |
| **RLS**                  | Row Level Security — Sécurité au niveau des lignes dans PostgreSQL/Supabase [NOUVEAU]        |
| **sendBeacon**           | API navigateur fire-and-forget pour envoyer des données à la fermeture d'onglet [NOUVEAU]    |
| **SessionMode**          | Type union : `'presentation' \| 'exercise' \| 'quiz'` [NOUVEAU]                              |
| **Sharp**                | Bibliothèque Node.js haute performance pour le traitement d'images [NOUVEAU]                 |
| **Slide**                | Image WebP 1920×1080 représentant une diapositive de la présentation [MIS À JOUR]            |
| **Supabase**             | Backend-as-a-Service open source (PostgreSQL + Realtime + Auth + Storage)                    |
| **TTL**                  | Time To Live — durée de validité d'une entrée en cache [NOUVEAU]                             |
| **TypeScript**           | Sur-ensemble de JavaScript avec typage statique                                              |
| **Vite**                 | Outil de build moderne pour applications web (v6)                                            |
| **WebP**                 | Format d'image moderne développé par Google, meilleure compression que JPEG/PNG [NOUVEAU]    |

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

**Décision:** Création de `BASE_DE_CONNAISSANCE.md` comme référence centrale.

**Statut:** ✅ Acceptée

---

### 2026-01-20 - Migration PDF.js → WebP statiques (Architecture CDN v2) [NOUVEAU]

**Contexte:** PDF.js côté client causait des problèmes de performance (rendu sur thread principal) et l'egress Supabase Storage était coûteux pour les slides.

**Options Considérées:**

1. Garder PDF.js — Simple mais lourd côté client, egress élevé
2. Pipeline build-time PDF → PNG → WebP — Optimisé, servi par CDN, 0 egress Supabase

**Décision:** Migration vers pipeline Sharp + pdf2pic (Node.js build-time). Les slides sont pré-générés en WebP 1920×1080, stockés dans `/public/slides/` et servis via Vercel CDN. Supabase Realtime ne transmet plus que des index de slides (~150 bytes).

**Conséquences:**

- Réduction egress Supabase de 99.7%
- Slides manifest JSON généré automatiquement
- Nouveaux scripts npm : `slides`, `slides:clean`, `slides:hq`
- PDF.js supprimé des dépendances

**Statut:** ✅ Acceptée — Implémentée

---

### 2026-01-20 - Infrastructure Supabase US-East + Vercel [NOUVEAU]

**Contexte:** Choix de la région d'hébergement pour la cible géographique Mexique.

**Décision:** Supabase hébergé en Virginie (us-east-1), Vercel déployé en US-East. Proximité acceptable pour le Mexique avec latence raisonnable.

**Statut:** ✅ Acceptée

---

### 2026-01-25 - Authentification Admin par mot de passe [NOUVEAU]

**Contexte:** Le dashboard admin était accessible sans protection.

**Options Considérées:**

1. Supabase Auth — Complet mais overhead pour un seul admin
2. Mot de passe simple via env variable — Léger et suffisant pour MVP

**Décision:** Protection par `VITE_ADMIN_PASSWORD` avec persistance session via `sessionStorage`. Suffisant pour le contexte d'atelier.

**Conséquences:**

- `AdminAuth.tsx` enveloppe `AdminDashboard`
- Nouvelle variable d'environnement requise
- Session admin persist uniquement dans l'onglet courant

**Statut:** ✅ Acceptée — Implémentée

---

### 2026-01-28 - Exercise Registry Pattern avec Lazy Loading [NOUVEAU]

**Contexte:** Besoin de charger 8 exercices différents sans impacter le bundle initial.

**Options Considérées:**

1. Import statique de tous les exercices — Simple mais gros bundle
2. Registry avec `React.lazy` — Charge chaque exercice à la demande

**Décision:** Registry centralisé dans `exerciseRegistry.ts` avec lazy loading via `React.lazy` et `import()`. Chaque exercice a sa propre config (id, tools, difficulty, category) accessible sans charger le composant.

**Conséquences:**

- Bundle initial ne contient aucun code d'exercice
- Chaque exercice ~50-100KB chargé à la demande
- Helpers de filtrage par outil, catégorie, difficulté

**Statut:** ✅ Acceptée — Implémentée

---

### 2026-02-01 - Système de Cache en Mémoire [NOUVEAU]

**Contexte:** Réduire les appels réseau répétés (participants, exemples IA).

**Décision:** Système `cache.ts` basé sur `Map` avec TTL configurable, déduplication de fetches simultanés, et hook `useCache` générique. Deux niveaux de TTL : SHORT_TTL (30s pour données dynamiques), LONG_TTL (5min pour données statiques).

**Statut:** ✅ Acceptée — Implémentée

---

### 2026-02-08 - Présence Participant avec Heartbeat [NOUVEAU]

**Contexte:** Besoin de savoir quels participants sont réellement connectés.

**Décision:** Hook `useParticipantPresence` avec heartbeat toutes les 30 secondes (update `last_seen_at`). Déconnexion détectée via `beforeunload` (sendBeacon) et `visibilitychange`. Le serveur considère un participant comme déconnecté au-delà de 2× l'intervalle heartbeat sans signal.

**Statut:** ✅ Acceptée — Implémentée

---

### 2026-02-08 - Quiz Gamifié avec Framework 5 Éléments [NOUVEAU]

**Contexte:** Évaluer les connaissances des participants sur la structure de prompt de manière engageante.

**Décision:** Composant `GamifiedQuiz.tsx` (1272 lignes) intégrant score, streaks de bonnes réponses, multiplicateurs, timer par question, feedback visuel immédiat, et écran de résultats. Questions basées sur le Framework 5 éléments (ROEES/RCTF).

**Statut:** ✅ Acceptée — Implémentée

---

### 2026-02-09 - Mise à jour Base de Connaissance v2.0.0 [NOUVEAU]

**Contexte:** Écart significatif entre la v1.0.0 documentée et l'état réel du projet après 30 jours de développement intensif.

**Décision:** Réécriture complète de la Base de Connaissance pour refléter l'état réel : architecture CDN v2, 8 exercices, quiz gamifié, système de présence, cache, et messagerie broadcast.

**Statut:** ✅ Acceptée

---

## 📎 Annexes

### A. Commandes Utiles [MIS À JOUR]

```bash
# Développement
npm run dev          # Lancer le serveur de développement (Vite)
npm run build        # Construire pour production (tsc + Vite)
npm run preview      # Prévisualiser le build
npm run type-check   # Vérifier les types TypeScript

# Slides
npm run slides       # Convertir PDF → WebP (standard: 85%, 1920px, 200 DPI)
npm run slides:clean # Nettoyer et regénérer les slides
npm run slides:hq    # Haute qualité (90%, 2560px, 250 DPI)

# Nettoyage
npm run clean        # Supprimer dist et cache Vite
```

### B. Variables d'Environnement [MIS À JOUR]

```env
# .env.local
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-publique
VITE_ADMIN_PASSWORD=votre-mot-de-passe-admin    # [NOUVEAU]
VITE_APP_ENV=development                         # development | staging | production
VITE_APP_VERSION=0.1.0
VITE_ENABLE_REALTIME=true
```

### C. Tables Supabase [NOUVEAU]

| Table                  | Migration | Description                                  |
| ---------------------- | --------- | -------------------------------------------- |
| `participants`         | 001       | Participants avec session, statut, heartbeat |
| `exercise_ai_examples` | 002       | Exemples IA par exercice (deprecated → CDN)  |
| `direct_messages`      | 003       | Messages Admin → Participant                 |
| `session_state`        | 004       | État session temps réel (slide, mode, live)  |

### D. Liens Utiles

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Vite](https://vitejs.dev/)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation React](https://react.dev/)
- [Documentation TypeScript](https://www.typescriptlang.org/docs/)
- [Documentation Sharp](https://sharp.pixelplumbing.com/) [NOUVEAU]
- [Vercel Documentation](https://vercel.com/docs) [NOUVEAU]

---

<div align="center">

**📚 Base de Connaissance Destino IA**

_Source de Vérité Unique — Maintenue par l'équipe projet_

Version 2.0.0 | Février 2026

</div>
