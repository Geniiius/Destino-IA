# 🔍 Analyse Complète - Connexion Supabase : Destino IA

> **Date d'analyse :** 11 janvier 2026  
> **Projet :** Destino IA - Atelier Interactif  
> **Objectif :** Identifier précisément ce qui manque pour connecter et tester en ligne

---

## A. Éléments Présents ✅

### 1. Configuration Supabase de Base

**Fichier : `src/services/supabase/client.ts`**

- ✅ Import de `@supabase/supabase-js`
- ✅ Singleton pattern implémenté
- ✅ Fonction `isSupabaseConfigured()` pour vérifier la config
- ✅ Fonction `getSupabaseClient()` avec gestion du null
- ✅ Configuration Realtime (10 events/sec)
- ✅ Fonction `checkConnection()` pour tester la connexion

**Fichier : `src/config/env.ts`**

- ✅ Interface `EnvConfig` avec SUPABASE_URL et SUPABASE_ANON_KEY
- ✅ Fonction `getEnvVar()` pour validation
- ✅ Export de l'objet `env` centralisé
- ✅ Feature flag `ENABLE_REALTIME`

### 2. Schéma Base de Données Partiel

**Fichier : `supabase/migrations/001_exercise_system.sql`**

- ✅ Table `session_state` (pour exercices uniquement)

  - `session_id` (TEXT PRIMARY KEY)
  - `current_exercise` (JSONB)
  - `is_exercise_active` (BOOLEAN)
  - `is_presentation_paused` (BOOLEAN)
  - `presentation_slide_index` (INTEGER)
  - `participants` (JSONB)
  - Timestamps

- ✅ Table `notifications` (système d'events)

  - `id` (UUID)
  - `session_id` (TEXT)
  - `type` (TEXT)
  - `data` (JSONB)
  - `created_at` (TIMESTAMP)

- ✅ RLS activé sur les deux tables
- ✅ Policies permissives (à durcir en production)
- ✅ Index pour performances
- ✅ Fonction de nettoyage `clean_old_notifications()`

**Fichier : `supabase/migrations/002_ai_examples.sql`**

- ✅ Table `exercise_ai_examples` (exemples IA)
  - `exercise_id` (TEXT PRIMARY KEY)
  - `media_url`, `media_type`, `prompt`, `description`
  - RLS et policies

### 3. Hooks et Services Existants

**Hook : `src/features/admin/hooks/useExerciseSync.ts`**

- ✅ Hook de synchronisation des exercices
- ✅ Subscription Realtime sur `session_state`
- ✅ Fonctions `launchExercise()` et `stopExercise()`
- ✅ Gestion mode local (fallback sans Supabase)
- ✅ Fonction `markExerciseComplete()` pour participants

**Service : `src/services/aiExamples.ts`**

- ✅ CRUD pour exemples IA
- ✅ Upload vers Storage Supabase
- ✅ Génération URLs publiques

### 4. Composants avec Intégration

- ✅ `ExampleAIManager.tsx` : Upload vers Storage
- ✅ `AdminDashboard.tsx` : Utilise `useExerciseSync`
- ✅ `ParticipantView.tsx` : Écoute état exercices

---

## B. Éléments Manquants 🔴

### 1. Fichier `.env.local` (Critique)

**État : ❌ NON CRÉÉ**

**Fichier à créer : `.env.local` (racine du projet)**

```env
# Configuration Supabase
VITE_SUPABASE_URL=https://VOTRE-PROJET.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-key-ici

# Configuration App
VITE_APP_ENV=development
VITE_APP_VERSION=1.0.0
VITE_ENABLE_REALTIME=true
```

**Priorité : 🔴 CRITIQUE**  
**Pourquoi :** Sans ce fichier, `isSupabaseConfigured()` retourne `false` et tout tombe en mode local.

---

### 2. Tables Manquantes pour Sessions Complètes (Haute Priorité)

**État : ❌ NON CRÉÉES**

Le système actuel gère uniquement les **exercices** via `session_state`, mais il manque les tables pour :

- Gestion complète des sessions
- Participants avec identités
- Slides persistants
- Messages chat

**Tables à créer (voir section C pour le SQL complet) :**

- `sessions` : Sessions workshop complètes
- `participants` : Liste des participants par session
- `slides` : Slides uploadés depuis PDF
- `chat_messages` : Système de chat

**Priorité : 🔴 CRITIQUE pour tests multi-participants**

---

### 3. Hooks Realtime Manquants (Haute Priorité)

#### a) `useSession` - Gestion session active

**Fichier à créer : `src/hooks/useSession.ts`**

**Fonctionnalités :**

```typescript
interface UseSessionReturn {
  session: Session | null;
  loading: boolean;
  error: string | null;
  createSession: (title: string, adminId: string) => Promise<Session>;
  updateSessionStatus: (
    status: "waiting" | "active" | "ended"
  ) => Promise<void>;
  updateCurrentSlide: (slideId: string, slideIndex: number) => Promise<void>;
}
```

**Priorité : 🔴 CRITIQUE**

---

#### b) `useParticipants` - Liste temps réel

**Fichier à créer : `src/hooks/useParticipants.ts`**

**Fonctionnalités :**

```typescript
interface UseParticipantsReturn {
  participants: Participant[];
  loading: boolean;
  addParticipant: (name: string, sessionId: string) => Promise<Participant>;
  updateStatus: (
    id: string,
    status: "connected" | "disconnected"
  ) => Promise<void>;
  getOnlineCount: () => number;
}
```

**Subscription Realtime sur :**

- `INSERT` → Nouveau participant rejoint
- `UPDATE` → Changement de statut
- `DELETE` → Participant quitte

**Priorité : 🔴 CRITIQUE**

---

#### c) `useSlideSync` - Synchronisation slides

**Fichier à créer : `src/hooks/useSlideSync.ts`**

**Fonctionnalités :**

```typescript
interface UseSlideSyncReturn {
  currentSlideId: string | null;
  currentSlideIndex: number;
  slides: Slide[];
  navigateToSlide: (index: number) => Promise<void>;
  uploadPdfSlides: (slides: Slide[]) => Promise<void>;
}
```

**Subscription Realtime sur :**

- Changement de `current_slide_id` dans `sessions`
- Mise à jour automatique côté participant

**Priorité : 🔴 CRITIQUE pour synchronisation**

---

#### d) `useChat` - Messages temps réel

**Fichier à créer : `src/hooks/useChat.ts`**

**Fonctionnalités :**

```typescript
interface UseChatReturn {
  messages: ChatMessage[];
  loading: boolean;
  sendMessage: (content: string, isAdmin: boolean) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
}
```

**Subscription Realtime sur :**

- `INSERT` sur `chat_messages` → Nouveau message reçu

**Priorité : 🟠 HAUTE**

---

#### e) `useRealtimeConnection` - Statut connexion

**Fichier à créer : `src/hooks/useRealtimeConnection.ts`**

**Fonctionnalités :**

```typescript
interface UseRealtimeConnectionReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  reconnect: () => void;
}
```

**Surveille l'état du canal Realtime et gère la reconnexion.**

**Priorité : 🟡 MOYENNE**

---

### 4. Services Manquants (Moyenne Priorité)

#### a) Service Sessions

**Fichier à créer : `src/services/sessions.ts`**

Fonctions CRUD pour :

- `createSession()`
- `getSession(sessionId)`
- `updateSession()`
- `deleteSession()`

**Priorité : 🔴 CRITIQUE**

---

#### b) Service Participants

**Fichier à créer : `src/services/participants.ts`**

Fonctions CRUD pour :

- `joinSession(name, sessionId)`
- `leaveSession(participantId)`
- `getSessionParticipants(sessionId)`

**Priorité : 🔴 CRITIQUE**

---

#### c) Service Chat

**Fichier à créer : `src/services/chat.ts`**

Fonctions pour :

- `sendMessage()`
- `getMessages(sessionId)`
- `subscribeToMessages()`

**Priorité : 🟠 HAUTE**

---

### 5. Composants à Adapter

#### a) `JoinForm.tsx` - Connexion réelle

**Fichier à modifier : `src/features/auth/components/JoinForm.tsx`**

**Modifications requises :**

```typescript
// Au lieu de juste stocker en local
const handleJoin = async (name: string, sessionCode: string) => {
  // 1. Vérifier que la session existe
  const session = await getSession(sessionCode);

  // 2. Créer participant dans Supabase
  const participant = await joinSession(name, sessionCode);

  // 3. Rediriger vers workshop avec participant.id
  navigate(`#workshop?sessionId=${sessionCode}&userId=${participant.id}`);
};
```

**Priorité : 🔴 CRITIQUE**

---

#### b) `AdminDashboard.tsx` - Création de session

**Fichier à modifier : `src/features/admin/components/AdminDashboard.tsx`**

**Modifications requises :**

- Au démarrage, créer une session Supabase si elle n'existe pas
- Afficher le **code de session** pour que les participants puissent rejoindre
- Utiliser `useParticipants()` pour la liste temps réel
- Utiliser `useSlideSync()` pour navigation synchronisée

**Priorité : 🔴 CRITIQUE**

---

#### c) `ParticipantView.tsx` - Synchronisation complète

**Fichier à modifier : `src/features/workshop/components/ParticipantView.tsx`**

**Modifications requises :**

- Utiliser `useSlideSync()` au lieu de mock
- Utiliser `useChat()` pour messages temps réel
- Afficher l'état de connexion avec `useRealtimeConnection()`

**Priorité : 🔴 CRITIQUE**

---

### 6. Storage Supabase

**État : ⚠️ PARTIELLEMENT CONFIGURÉ**

Le code utilise `supabase.storage` mais il faut :

1. **Créer le bucket `workshop-content` dans Supabase Dashboard**

   - Aller sur : `Storage > Create bucket`
   - Nom : `workshop-content`
   - Public : ✅ OUI (pour accès direct aux images)

2. **Configurer policies Storage**

```sql
-- Policy : Tout le monde peut lire
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'workshop-content');

-- Policy : Admins peuvent uploader
CREATE POLICY "Admins can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'workshop-content');
```

**Priorité : 🟠 HAUTE (nécessaire pour exemples IA)**

---

### 7. Gestion des Erreurs et Loading States

**États manquants dans les composants :**

```typescript
// À ajouter partout où on utilise Supabase
{
  !isSupabaseConfigured() && (
    <div className="alert alert-warning">
      ⚠️ Mode local : Configurez Supabase pour la synchronisation
    </div>
  );
}

{
  loading && <LoadingSpinner />;
}
{
  error && <ErrorMessage error={error} />;
}
```

**Priorité : 🟡 MOYENNE**

---

### 8. Documentation pour Déploiement

**Fichier à créer : `docs/SETUP_SUPABASE.md`**

Guide pas-à-pas pour :

1. Créer un projet Supabase
2. Exécuter les migrations
3. Créer le bucket Storage
4. Configurer RLS en production
5. Obtenir les clés API
6. Variables d'environnement

**Priorité : 🟢 BASSE (mais nécessaire pour onboarding)**

---

## C. Schéma SQL Supabase Complet

### Migration `003_core_session_system.sql`

```sql
-- ============================================
-- MIGRATION 003: Système de Session Complet
-- ============================================

-- 1. TABLE: sessions
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  session_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'ended')),
  current_slide_id UUID,
  current_slide_index INTEGER DEFAULT 0,
  admin_id TEXT, -- Identifiant admin (peut être email ou nom)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLE: participants
CREATE TABLE IF NOT EXISTS public.participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb -- Pour données additionnelles
);

-- 3. TABLE: slides
CREATE TABLE IF NOT EXISTS public.slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('intro', 'theory', 'exercise', 'challenge')),
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT,
  image_url TEXT, -- URL de l'image PDF rendue
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLE: chat_messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES public.participants(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEX pour Performances
-- ============================================

CREATE INDEX IF NOT EXISTS idx_sessions_code ON public.sessions(session_code);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.sessions(status);
CREATE INDEX IF NOT EXISTS idx_participants_session ON public.participants(session_id);
CREATE INDEX IF NOT EXISTS idx_participants_status ON public.participants(status);
CREATE INDEX IF NOT EXISTS idx_slides_session ON public.slides(session_id);
CREATE INDEX IF NOT EXISTS idx_slides_order ON public.slides(order_index);
CREATE INDEX IF NOT EXISTS idx_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.chat_messages(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- POLICIES: sessions
CREATE POLICY "Tout le monde peut lire les sessions actives"
  ON public.sessions FOR SELECT
  USING (status IN ('waiting', 'active'));

CREATE POLICY "Tout le monde peut créer une session"
  ON public.sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins peuvent modifier leur session"
  ON public.sessions FOR UPDATE
  USING (true) -- À durcir avec auth en production
  WITH CHECK (true);

-- POLICIES: participants
CREATE POLICY "Participants peuvent voir leur session"
  ON public.participants FOR SELECT
  USING (true);

CREATE POLICY "Participants peuvent rejoindre"
  ON public.participants FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Participants peuvent mettre à jour leur statut"
  ON public.participants FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- POLICIES: slides
CREATE POLICY "Tout le monde peut lire les slides"
  ON public.slides FOR SELECT
  USING (true);

CREATE POLICY "Admins peuvent gérer les slides"
  ON public.slides FOR ALL
  USING (true)
  WITH CHECK (true);

-- POLICIES: chat_messages
CREATE POLICY "Participants peuvent lire les messages de leur session"
  ON public.chat_messages FOR SELECT
  USING (true);

CREATE POLICY "Participants peuvent envoyer des messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (true);

-- ============================================
-- FONCTIONS UTILITAIRES
-- ============================================

-- Fonction pour générer un code de session unique
CREATE OR REPLACE FUNCTION generate_session_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Générer code 6 caractères alphanumériques
    code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));

    -- Vérifier unicité
    SELECT EXISTS(SELECT 1 FROM sessions WHERE session_code = code) INTO exists;

    EXIT WHEN NOT exists;
  END LOOP;

  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger sur sessions
CREATE TRIGGER sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- COMMENTAIRES DOCUMENTATION
-- ============================================

COMMENT ON TABLE public.sessions IS 'Sessions d''atelier avec synchronisation temps réel';
COMMENT ON TABLE public.participants IS 'Participants inscrits à une session';
COMMENT ON TABLE public.slides IS 'Slides de présentation (générés depuis PDF)';
COMMENT ON TABLE public.chat_messages IS 'Messages de chat entre admin et participants';

COMMENT ON COLUMN public.sessions.session_code IS 'Code unique pour rejoindre (6 caractères)';
COMMENT ON COLUMN public.sessions.current_slide_index IS 'Index du slide actuellement affiché';
COMMENT ON COLUMN public.participants.metadata IS 'Données supplémentaires (scores, progression, etc.)';
COMMENT ON COLUMN public.slides.image_url IS 'URL de l''image de la page PDF (Data URL ou Storage)';
```

---

## D. Plan d'Action Ordonné

### Phase 1 : Configuration de Base (30 min)

#### Étape 1.1 : Créer le projet Supabase

```bash
1. Aller sur https://supabase.com
2. Créer un nouveau projet
3. Choisir un nom : "destino-ia-production"
4. Choisir la région la plus proche
5. Générer un mot de passe fort
6. Attendre la création (~2 min)
```

#### Étape 1.2 : Récupérer les clés API

```bash
1. Aller dans Settings > API
2. Copier "Project URL" → VITE_SUPABASE_URL
3. Copier "anon public" key → VITE_SUPABASE_ANON_KEY
```

#### Étape 1.3 : Créer `.env.local`

```bash
# À la racine du projet
touch .env.local

# Coller :
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_ENV=development
VITE_ENABLE_REALTIME=true
```

#### Étape 1.4 : Redémarrer le serveur Vite

```bash
npm run dev
```

✅ **Validation :** L'app affiche "Supabase configuré" au lieu de "Mode local"

---

### Phase 2 : Exécuter les Migrations (15 min)

#### Étape 2.1 : Exécuter migration 001

```sql
-- Dans Supabase Dashboard > SQL Editor
-- Copier/coller le contenu de supabase/migrations/001_exercise_system.sql
-- Cliquer "Run"
```

#### Étape 2.2 : Exécuter migration 002

```sql
-- Copier/coller supabase/migrations/002_ai_examples.sql
-- Cliquer "Run"
```

#### Étape 2.3 : Exécuter migration 003 (NOUVELLE)

```sql
-- Copier/coller le SQL de la section C ci-dessus
-- Cliquer "Run"
```

✅ **Validation :** Aller dans "Table Editor" et vérifier que les tables existent :

- `session_state`
- `notifications`
- `exercise_ai_examples`
- `sessions`
- `participants`
- `slides`
- `chat_messages`

---

### Phase 3 : Configurer Storage (10 min)

#### Étape 3.1 : Créer le bucket

```bash
1. Aller dans Storage > Create bucket
2. Nom : "workshop-content"
3. Public : ✅ OUI
4. Créer
```

#### Étape 3.2 : Configurer les policies

```sql
-- Dans SQL Editor
-- Policy lecture publique
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'workshop-content');

-- Policy upload (tous)
CREATE POLICY "Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'workshop-content');
```

✅ **Validation :** Tester upload d'une image depuis l'onglet "Editar ejemplo"

---

### Phase 4 : Créer les Hooks Manquants (2-3 heures)

#### Priorité 1 : `useSession`

1. Créer `src/hooks/useSession.ts`
2. Implémenter CRUD sessions
3. Tester création session depuis AdminDashboard

#### Priorité 2 : `useParticipants`

1. Créer `src/hooks/useParticipants.ts`
2. Subscription Realtime sur `participants`
3. Tester ajout/suppression

#### Priorité 3 : `useSlideSync`

1. Créer `src/hooks/useSlideSync.ts`
2. Subscription sur `sessions.current_slide_index`
3. Tester navigation admin → participant suit

#### Priorité 4 : `useChat`

1. Créer `src/hooks/useChat.ts`
2. Subscription sur `chat_messages`
3. Tester envoi/réception messages

---

### Phase 5 : Adapter les Composants (2 heures)

#### Modifier `AdminDashboard.tsx`

```typescript
// Au montage du composant
const { session, createSession } = useSession();
const { participants } = useParticipants(session?.id);
const { navigateToSlide } = useSlideSync(session?.id, true);

useEffect(() => {
  if (!session) {
    // Créer session au démarrage
    createSession("Atelier IA Generativa", "admin-123");
  }
}, []);

// Afficher le code de session pour participants
<div className="session-code">
  Code de session : <strong>{session?.session_code}</strong>
</div>;
```

#### Modifier `JoinForm.tsx`

```typescript
const { joinSession } = useParticipants();

const handleJoin = async (name: string, code: string) => {
  try {
    const participant = await joinSession(name, code);
    navigate(`#workshop?sessionId=${code}&userId=${participant.id}`);
  } catch (error) {
    setError("Session introuvable ou inactive");
  }
};
```

#### Modifier `ParticipantView.tsx`

```typescript
const { slides, currentSlideIndex } = useSlideSync(sessionId, false);
const { messages, sendMessage } = useChat(sessionId);
const { isConnected } = useRealtimeConnection();

// Afficher le slide actif
const currentSlide = slides[currentSlideIndex];
```

---

### Phase 6 : Tests de Validation (30 min)

#### Test 1 : Connexion Supabase

```bash
# Dans console navigateur
window.supabase // Doit exister
await window.supabase.from('sessions').select('*') // OK
```

#### Test 2 : Création Session

```bash
1. Ouvrir AdminDashboard
2. Vérifier qu'une session est créée
3. Noter le code de session (ex: ABC123)
```

#### Test 3 : Multi-fenêtres

```bash
1. Fenêtre 1 : AdminDashboard (admin)
2. Fenêtre 2 : Ouvrir en navigation privée
3. Aller sur #join
4. Entrer nom + code session ABC123
5. Vérifier que le participant apparaît dans Admin
```

#### Test 4 : Synchronisation Slides

```bash
1. Admin : Naviguer avec flèches gauche/droite
2. Participant : Vérifier que le slide change automatiquement
```

#### Test 5 : Chat Temps Réel

```bash
1. Participant : Envoyer message "Bonjour"
2. Admin : Voir le message apparaître instantanément
3. Admin : Répondre
4. Participant : Voir la réponse
```

---

## E. Premier Test de Validation

### Scénario de Test Simple

**Objectif :** Valider la synchronisation de base admin ↔ participant

**Prérequis :**

- `.env.local` configuré
- Migrations exécutées
- Hooks créés
- Composants adaptés

**Étapes :**

1. **Préparation**

```bash
# Terminal 1
cd destino-ia---atelier-interactif
npm run dev
```

2. **Admin : Créer Session**

```bash
# Navigateur 1 (Chrome)
http://localhost:5173/#admin

→ Une session est créée automatiquement
→ Noter le code : ABC123
→ Attendre que "Participants: 0" s'affiche
```

3. **Participant : Rejoindre**

```bash
# Navigateur 2 (Chrome Incognito)
http://localhost:5173/#join

→ Entrer nom: "Alice"
→ Entrer code: ABC123
→ Cliquer "Participar"
→ Redirection vers #workshop
```

4. **Vérification Admin**

```bash
# Navigateur 1
→ "Participants: 1" s'affiche
→ Liste montre "Alice" avec statut "online"
```

5. **Test Synchronisation**

```bash
# Admin : Naviguer au slide 2
→ Cliquer flèche droite

# Participant : Observer
→ Le slide change automatiquement
→ "Slide 2/10" s'affiche
```

6. **Test Chat**

```bash
# Participant : Envoyer message
→ Taper "Bonjour!" dans chat
→ Envoyer

# Admin : Vérifier réception
→ Message apparaît avec nom "Alice"
→ Timestamp correct

# Admin : Répondre
→ Taper "Bienvenue Alice!"
→ Envoyer

# Participant : Vérifier
→ Message apparaît instantanément
```

**Critères de Succès :**

- ✅ Participant ajouté en temps réel
- ✅ Navigation synchronisée (< 500ms latence)
- ✅ Chat bidirectionnel fonctionnel
- ✅ Pas d'erreurs console
- ✅ Statut "Connecté" affiché côté admin

**En cas d'échec :**

1. Vérifier console navigateur (F12)
2. Vérifier logs Supabase Dashboard > Logs
3. Tester `await supabase.from('sessions').select('*')` dans console
4. Vérifier que RLS est bien configuré

---

## F. Checklist Finale

### Configuration ✅

- [ ] Projet Supabase créé
- [ ] `.env.local` avec les bonnes clés
- [ ] Serveur Vite redémarré
- [ ] Pas d'erreur "Supabase non configuré"

### Base de Données ✅

- [ ] Migration 001 exécutée (exercise_system)
- [ ] Migration 002 exécutée (ai_examples)
- [ ] Migration 003 exécutée (core_session_system)
- [ ] 7 tables visibles dans Table Editor
- [ ] RLS activé sur toutes les tables
- [ ] Index créés

### Storage ✅

- [ ] Bucket `workshop-content` créé
- [ ] Public access : OUI
- [ ] Policies configurées
- [ ] Upload test réussi

### Code ✅

- [ ] Hook `useSession` créé
- [ ] Hook `useParticipants` créé
- [ ] Hook `useSlideSync` créé
- [ ] Hook `useChat` créé
- [ ] `AdminDashboard.tsx` adapté
- [ ] `JoinForm.tsx` adapté
- [ ] `ParticipantView.tsx` adapté

### Tests ✅

- [ ] Connexion Supabase validée
- [ ] Session créée avec code
- [ ] Participant peut rejoindre
- [ ] Liste participants temps réel
- [ ] Navigation synchronisée
- [ ] Chat bidirectionnel
- [ ] Test multi-fenêtres réussi

---

## G. Ressources et Support

### Documentation Supabase

- [Quickstart](https://supabase.com/docs/guides/getting-started)
- [Realtime](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

### Commandes Utiles

```bash
# Vérifier connexion Supabase
npm run dev
# Dans console navigateur :
window.supabase.auth.getSession()

# Tester requête
await supabase.from('sessions').select('*')

# Vérifier Realtime
const channel = supabase.channel('test')
channel.on('broadcast', (payload) => console.log(payload))
channel.subscribe()
```

### Debug

```typescript
// Logger tous les events Supabase
supabase
  .channel("debug")
  .on("*", (payload) => console.log("[Supabase Event]", payload))
  .subscribe();

// Vérifier état connexion
console.log("Configured:", isSupabaseConfigured());
console.log("Client:", supabase);
```

---

## H. Prochaines Étapes (Post-Connexion)

Une fois la connexion validée, voici les améliorations recommandées :

### Court Terme (1 semaine)

1. **Authentification Admin**

   - Ajouter auth Supabase pour admins
   - Protéger routes admin
   - RLS basé sur user_id

2. **Gestion Avancée Sessions**

   - Archiver sessions terminées
   - Historique des sessions
   - Export des données

3. **Notifications**
   - Toast pour nouveau participant
   - Son pour nouveau message
   - Badge compteur non lus

### Moyen Terme (1 mois)

1. **Module Quiz Complet**

   - Table `quiz_questions`
   - Table `quiz_responses`
   - Classement temps réel

2. **Analytics**

   - Temps moyen par slide
   - Taux d'engagement
   - Questions fréquentes

3. **Export PDF**
   - Rapport de session
   - Certificats participants

### Long Terme (3 mois)

1. **Mode Hors-Ligne (PWA)**
2. **Application Mobile**
3. **Intégration Calendrier**
4. **Multi-sessions simultanées**

---

**📊 Estimation Temps Total de Mise en Œuvre**

- Configuration Supabase : 30 min
- Migrations : 15 min
- Création hooks : 3h
- Adaptation composants : 2h
- Tests et debug : 1h
- **TOTAL : ~7 heures de développement**

---

<div align="center">

**🎯 Document d'Analyse Complet**

_Destino IA - Ready for Connection_

Version 1.0 | 11 janvier 2026

</div>
