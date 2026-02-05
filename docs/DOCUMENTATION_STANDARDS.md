# 📚 Standards de Documentation - Destino IA

> **Version**: 1.0.0  
> **Date**: 5 février 2026  
> **Mainteneur**: Équipe Technique Destino IA

---

## 📑 Table des Matières

1. [Audit de la Documentation Existante](#1-audit-de-la-documentation-existante)
2. [Arborescence Cible](#2-arborescence-cible)
3. [Actions de Consolidation](#3-actions-de-consolidation)
4. [Règles de Création de Fichiers](#4-règles-de-création-de-fichiers)
5. [Standards de Contenu Markdown](#5-standards-de-contenu-markdown)
6. [Navigation et Lisibilité](#6-navigation-et-lisibilité)
7. [Documentation Vivante](#7-documentation-vivante)

---

## 1. Audit de la Documentation Existante

### 1.1 Inventaire des Fichiers (23 fichiers .md)

| Emplacement | Fichier | Lignes | Catégorie | Verdict |
|-------------|---------|--------|-----------|---------|
| `/` | README.md | ~35 | Entrée | ✅ Conserver |
| `/` | IMPLEMENTATION_SUMMARY.md | ~311 | Historique | 🔄 Archiver |
| `/` | DEPLOYMENT_CHECKLIST.md | ~309 | Opérations | 🔄 Fusionner → OPERATIONS.md |
| `/docs` | README.md | ~179 | Navigation | ❌ Obsolète |
| `/docs` | ARCHITECTURE.md | ~262 | Technique | ✅ Conserver |
| `/docs` | BASE_DE_CONNAISSANCE.md | ~981 | Central | ✅ Conserver (source de vérité) |
| `/docs` | AUDIT_TECHNIQUE_PRE_INTEGRATION.md | ~450 | Audit | ✅ Conserver (baseline actuelle) |
| `/docs` | AUDIT_TECHNIQUE_COMPLET.md | ~1208 | Audit | ❌ Obsolète (remplacé) |
| `/docs` | AUDIT_SECURITY_QA_COMPLETE.md | ~1049 | Sécurité | 🔄 Extraire sections → SECURITY.md |
| `/docs` | AUDIT_PROGRESSION.md | ~732 | Audit | ❌ Obsolète (snapshot passé) |
| `/docs` | ANALYSE_CONNEXION_SUPABASE.md | ~1113 | Technique | 🔄 Fusionner → OPERATIONS.md |
| `/docs` | SCALABILITY_ANALYSIS.md | ~544 | Analyse | 🔄 Fusionner → PERFORMANCE.md |
| `/docs` | PERFORMANCE_ANALYSIS.md | ~1072 | Analyse | 🔄 Renommer → PERFORMANCE.md |
| `/docs` | FINOPS_COST_ANALYSIS.md | ~1084 | Coûts | ✅ Conserver (référence FinOps) |
| `/docs` | MODE_LOCAL.md | ~157 | Guide | 🔄 Fusionner → GETTING_STARTED.md |
| `/docs` | VUE_TEST_PARTICIPANT.md | ~195 | Feature | 🔄 Fusionner → FEATURES.md |
| `/docs` | FUNCIONALIDAD_VER_EJEMPLO.md | ~151 | Feature | 🔄 Fusionner → FEATURES.md |
| `/docs` | ADMIN_AI_EXAMPLES.md | ~293 | Feature | 🔄 Fusionner → FEATURES.md |
| `/docs` | QUIZ_1_DOMINANDO_EL_PROMPT.md | ~277 | Contenu | 🔄 Déplacer → /content |
| `/docs` | RAPPORT_PHASE_0_COMPLETE.md | ~280 | Historique | 🔄 Archiver → /archive |
| `/docs` | RAPPORT_PHASE_1_COMPLETE.md | ~502 | Historique | 🔄 Archiver → /archive |
| `/public/assets/ai-examples` | README.md | ~149 | Assets | ✅ Conserver (collocated) |
| `/src/.../AgenciaViajesExercise` | README.md | ~165 | Composant | ✅ Conserver (collocated) |

### 1.2 Problèmes Identifiés

| Problème | Sévérité | Fichiers Concernés |
|----------|----------|-------------------|
| **Redondance audits** | 🔴 Élevée | 4 fichiers d'audit avec chevauchements |
| **Documentation dispersée** | 🟡 Moyenne | Features documentées dans 4 fichiers séparés |
| **Analyses fragmentées** | 🟡 Moyenne | Performance + Scalabilité = 2 fichiers séparés |
| **Historique mélangé** | 🟡 Moyenne | Rapports de phase dans docs/ principal |
| **Index obsolète** | 🔴 Élevée | docs/README.md référence des fichiers inexistants |
| **Langues mélangées** | 🟢 Faible | Français, espagnol, anglais selon fichiers |

---

## 2. Arborescence Cible

### 2.1 Structure Finale Recommandée

```
Destino-IA/
├── README.md                          # Porte d'entrée unique (EN/ES)
│
├── docs/
│   ├── README.md                      # Index de documentation (liens vers sections)
│   │
│   ├── GETTING_STARTED.md             # Guide démarrage rapide (dev + formateur)
│   ├── ARCHITECTURE.md                # Architecture technique (existant)
│   ├── FEATURES.md                    # Catalogue des fonctionnalités
│   ├── OPERATIONS.md                  # Déploiement, Supabase, config
│   ├── PERFORMANCE.md                 # Performance + Scalabilité (consolidé)
│   ├── SECURITY.md                    # Sécurité, RLS, authentification
│   ├── FINOPS.md                      # Analyse coûts cloud (existant renommé)
│   │
│   ├── BASE_DE_CONNAISSANCE.md        # Source de vérité projet (existant)
│   ├── AUDIT_TECHNIQUE.md             # Audit consolidé post-amélioration (existant renommé)
│   │
│   ├── DOCUMENTATION_STANDARDS.md     # Ce fichier - règles de documentation
│   │
│   ├── archive/                       # Historique (lecture seule)
│   │   ├── RAPPORT_PHASE_0.md
│   │   ├── RAPPORT_PHASE_1.md
│   │   └── IMPLEMENTATION_SUMMARY.md
│   │
│   └── content/                       # Contenu pédagogique
│       └── QUIZ_DOMINANDO_PROMPT.md
│
├── public/assets/ai-examples/
│   └── README.md                      # Doc collocated (conserver)
│
└── src/.../AgenciaViajesExercise/
    └── README.md                      # Doc collocated (conserver)
```

### 2.2 Principes de l'Arborescence

| Principe | Application |
|----------|-------------|
| **Centralisation par thème** | 1 fichier = 1 domaine (pas de micro-docs) |
| **Collocated docs** | README dans composants = près du code |
| **Archive séparée** | Historique hors chemin principal |
| **Contenu pédagogique séparé** | Quiz/exercices dans `/content` |
| **Index navigable** | docs/README.md comme hub central |

---

## 3. Actions de Consolidation

### 3.1 Phase 1 - Nettoyage (Priorité P0)

| Action | Fichier Source | Destination | Effort |
|--------|----------------|-------------|--------|
| ❌ Supprimer | `docs/README.md` (actuel) | - | 1 min |
| ❌ Supprimer | `docs/AUDIT_TECHNIQUE_COMPLET.md` | - | 1 min |
| ❌ Supprimer | `docs/AUDIT_PROGRESSION.md` | - | 1 min |
| 🔄 Renommer | `AUDIT_TECHNIQUE_PRE_INTEGRATION.md` | `AUDIT_TECHNIQUE.md` | 1 min |
| 🔄 Renommer | `FINOPS_COST_ANALYSIS.md` | `FINOPS.md` | 1 min |

### 3.2 Phase 2 - Fusion (Priorité P1)

| Action | Fichiers Sources | Destination | Effort |
|--------|------------------|-------------|--------|
| 🔄 Fusionner | `MODE_LOCAL.md` + sections DEPLOYMENT_CHECKLIST | `GETTING_STARTED.md` | 30 min |
| 🔄 Fusionner | `PERFORMANCE_ANALYSIS.md` + `SCALABILITY_ANALYSIS.md` | `PERFORMANCE.md` | 45 min |
| 🔄 Fusionner | `DEPLOYMENT_CHECKLIST.md` + `ANALYSE_CONNEXION_SUPABASE.md` | `OPERATIONS.md` | 45 min |
| 🔄 Fusionner | `VUE_TEST_PARTICIPANT.md` + `FUNCIONALIDAD_VER_EJEMPLO.md` + `ADMIN_AI_EXAMPLES.md` | `FEATURES.md` | 30 min |
| 🔄 Extraire | Sections sécurité de `AUDIT_SECURITY_QA_COMPLETE.md` | `SECURITY.md` | 30 min |

### 3.3 Phase 3 - Archivage (Priorité P2)

| Action | Fichier | Destination |
|--------|---------|-------------|
| 📦 Déplacer | `RAPPORT_PHASE_0_COMPLETE.md` | `docs/archive/RAPPORT_PHASE_0.md` |
| 📦 Déplacer | `RAPPORT_PHASE_1_COMPLETE.md` | `docs/archive/RAPPORT_PHASE_1.md` |
| 📦 Déplacer | `IMPLEMENTATION_SUMMARY.md` | `docs/archive/IMPLEMENTATION_SUMMARY.md` |
| 📦 Déplacer | `QUIZ_1_DOMINANDO_EL_PROMPT.md` | `docs/content/QUIZ_DOMINANDO_PROMPT.md` |

### 3.4 Phase 4 - Index (Priorité P1)

| Action | Fichier | Description |
|--------|---------|-------------|
| ✨ Créer | `docs/README.md` (nouveau) | Index navigable avec liens vers toutes sections |

---

## 4. Règles de Création de Fichiers

### 4.1 Quand Créer un Nouveau Fichier .md

| ✅ Créer un fichier SI | ❌ NE PAS créer SI |
|------------------------|-------------------|
| Nouveau domaine technique majeur | Simple ajout à une fonctionnalité existante |
| Documentation requise par un framework/outil | Note temporaire ou brouillon |
| Contenu autonome ≥ 200 lignes | Contenu < 100 lignes isolé |
| Audience différente (dev vs user vs ops) | Même audience que fichier existant |
| README collocated près du code | Documentation technique générale |

### 4.2 Quand Ajouter une Section

| ✅ Ajouter une section SI | Format |
|---------------------------|--------|
| Extension d'un domaine existant | Nouvelle `## Section` dans fichier thématique |
| Nouvelle feature d'une catégorie | Ajouter dans `FEATURES.md` |
| Nouvelle décision technique | Ajouter dans `ARCHITECTURE.md` ou `BASE_DE_CONNAISSANCE.md` |
| Nouveau guide opérationnel | Ajouter dans `OPERATIONS.md` |

### 4.3 Taille et Granularité Recommandées

| Type de Document | Taille Cible | Min | Max |
|------------------|--------------|-----|-----|
| README projet | 50-100 lignes | 30 | 150 |
| Guide thématique | 200-500 lignes | 100 | 800 |
| Base de connaissance | 500-1500 lignes | 300 | 2000 |
| README collocated | 50-200 lignes | 30 | 300 |
| Archive/Rapport | Variable | - | - |

### 4.4 Conventions de Nommage

```
✅ FORMATS ACCEPTÉS:
FEATURE_NAME.md          # Majuscules, underscores (préféré)
feature-name.md          # Minuscules, tirets (acceptable)
README.md                # README toujours en majuscules

❌ FORMATS INTERDITS:
Feature Name.md          # Espaces
featureName.md           # camelCase
feature_name.MD          # Extension majuscule
```

| Type | Convention | Exemple |
|------|------------|---------|
| **Index** | `README.md` | `docs/README.md` |
| **Guide technique** | `SCREAMING_SNAKE_CASE.md` | `ARCHITECTURE.md` |
| **Rapport daté** | `RAPPORT_PHASE_X.md` | `RAPPORT_PHASE_1.md` |
| **Contenu** | `THEME_SUJET.md` | `QUIZ_DOMINANDO_PROMPT.md` |

---

## 5. Standards de Contenu Markdown

### 5.1 Structure Standard d'un Document

```markdown
# 📚 Titre du Document

> **Description courte** (1-2 lignes)  
> **Dernière mise à jour**: JJ mois AAAA  
> **Mainteneur**: Équipe/Personne

---

## 📑 Table des Matières

1. [Section 1](#1-section-1)
2. [Section 2](#2-section-2)
...

---

## 1. Section 1

### 1.1 Sous-section

Contenu...

---

## Annexes (optionnel)

### A. Annexe A

---

**Signature/Métadonnées de fin**
```

### 5.2 Hiérarchie des Titres

| Niveau | Usage | Fréquence Max |
|--------|-------|---------------|
| `#` | Titre du document (1 seul) | 1 par fichier |
| `##` | Sections principales | 5-12 par fichier |
| `###` | Sous-sections | 2-6 par section |
| `####` | Points détaillés | 2-4 par sous-section |
| `#####` | Rarement utilisé | Éviter |

### 5.3 Conventions de Formatage

```markdown
# Blocs de Code
```typescript
// Toujours spécifier le langage
const example = "code";
```

# Tableaux
| Colonne 1 | Colonne 2 |
|-----------|-----------|
| Donnée    | Donnée    |

# Listes
- Point simple
  - Sous-point (2 espaces d'indentation)

1. Liste numérotée
2. Deuxième élément

# Liens Internes
[Voir Architecture](./ARCHITECTURE.md)
[Section spécifique](./ARCHITECTURE.md#2-principes)

# Alertes/Notes
> **Note:** Information importante

> ⚠️ **Attention:** Avertissement

> 🔴 **Critique:** Action requise
```

### 5.4 Style Rédactionnel

| ✅ À Faire | ❌ À Éviter |
|------------|------------|
| Ton technique et factuel | Ton marketing ou promotionnel |
| Phrases courtes et directes | Paragraphes de >5 lignes |
| Verbes à l'infinitif (instructions) | Forme passive excessive |
| Exemples concrets | Explications abstraites seules |
| Tableaux pour comparaisons | Listes à puces trop longues |

---

## 6. Navigation et Lisibilité

### 6.1 Index Central (docs/README.md)

Le fichier `docs/README.md` doit servir de hub de navigation:

```markdown
# 📚 Documentation Destino IA

## 🚀 Démarrage Rapide
- [Getting Started](./GETTING_STARTED.md) - Installation et configuration

## 🏗️ Architecture & Technique
- [Architecture](./ARCHITECTURE.md) - Décisions et structure
- [Performance](./PERFORMANCE.md) - Optimisations et scalabilité
- [Sécurité](./SECURITY.md) - RLS, auth, bonnes pratiques

## 📋 Référence
- [Base de Connaissance](./BASE_DE_CONNAISSANCE.md) - Source de vérité
- [Audit Technique](./AUDIT_TECHNIQUE.md) - État actuel du projet
- [Features](./FEATURES.md) - Catalogue des fonctionnalités

## 💰 Opérations
- [Operations](./OPERATIONS.md) - Déploiement et configuration
- [FinOps](./FINOPS.md) - Analyse des coûts cloud

## 📦 Archives
- [Historique](./archive/) - Rapports et anciennes versions
```

### 6.2 Table des Matières

| Document | Table des Matières |
|----------|-------------------|
| > 200 lignes | ✅ Obligatoire |
| 100-200 lignes | 🟡 Recommandé |
| < 100 lignes | ❌ Non nécessaire |

### 6.3 Liens Croisés

Utiliser des liens relatifs entre documents:

```markdown
# ✅ Correct
Voir la [configuration Supabase](./OPERATIONS.md#supabase)

# ❌ Incorrect
Voir la configuration Supabase dans OPERATIONS.md
```

---

## 7. Documentation Vivante

### 7.1 Stratégie de Mise à Jour

| Événement | Action Documentation |
|-----------|---------------------|
| Nouvelle feature | Ajouter section dans `FEATURES.md` |
| Changement architecture | Mettre à jour `ARCHITECTURE.md` |
| Nouvelle décision technique | Ajouter dans `BASE_DE_CONNAISSANCE.md` |
| Correction bug majeur | Mettre à jour section concernée |
| Nouveau déploiement | Vérifier `OPERATIONS.md` |
| Audit/Review | Mettre à jour `AUDIT_TECHNIQUE.md` |

### 7.2 Dates de Mise à Jour

Chaque document doit inclure:

```markdown
> **Dernière mise à jour**: 5 février 2026
```

### 7.3 Règles Anti-Obsolescence

| Règle | Fréquence | Action |
|-------|-----------|--------|
| **Review trimestrielle** | Tous les 3 mois | Vérifier pertinence de chaque doc |
| **Cleanup à chaque release** | Par version | Supprimer infos obsolètes |
| **Un seul mainteneur** | Permanent | Responsable désigné par fichier |
| **Archive plutôt que supprimer** | Lors des changements majeurs | Déplacer vers `/archive` |

### 7.4 Lien Code ↔ Documentation

| Type de Changement | Documentation Requise |
|-------------------|----------------------|
| Nouvelle API/Hook | JSDoc + `FEATURES.md` |
| Nouveau composant majeur | README collocated |
| Changement config | `OPERATIONS.md` |
| Nouvelle dépendance | README projet |
| Refactor majeur | `ARCHITECTURE.md` |

---

## Annexes

### A. Checklist de Création de Document

```markdown
[ ] Nom en SCREAMING_SNAKE_CASE.md
[ ] Titre avec emoji
[ ] Date de création
[ ] Table des matières (si > 200 lignes)
[ ] Sections numérotées
[ ] Liens vers documents liés
[ ] Pas de contenu dupliqué d'un autre fichier
[ ] Vérifié dans l'index docs/README.md
```

### B. Fichiers à Supprimer/Archiver

**À supprimer immédiatement:**
- `docs/README.md` (actuel - obsolète)
- `docs/AUDIT_TECHNIQUE_COMPLET.md` (remplacé)
- `docs/AUDIT_PROGRESSION.md` (obsolète)

**À archiver:**
- `docs/RAPPORT_PHASE_0_COMPLETE.md`
- `docs/RAPPORT_PHASE_1_COMPLETE.md`
- `IMPLEMENTATION_SUMMARY.md`

**À fusionner:**
- Voir Section 3.2

---

**Document créé le**: 5 février 2026  
**Auteur**: Architecture Documentation  
**Statut**: ✅ Approuvé
