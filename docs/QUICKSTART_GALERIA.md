# 🚀 Quick Start - Galería Colaborativa

## Étapes Rapides pour Activer

### 1️⃣ Exécuter la Migration (2 min)

```bash
# Dans Supabase Dashboard > SQL Editor
# Copier/coller tout le contenu de:
supabase/migrations/004_gallery_system.sql

# Cliquer "Run"
# ✅ Vérifier: Tables créées (exercise_submissions, gallery_broadcast_state)
```

### 2️⃣ Tester en Local (5 min)

```bash
# Terminal
npm run dev

# Navigateur 1 (Admin)
http://localhost:5173/#admin
→ Onglet "Galería" doit être visible

# Navigateur 2 (Participant)
http://localhost:5173/#join
→ Champ email obligatoire maintenant visible
→ Entrer: nom + email
→ Rejoindre workshop
```

### 3️⃣ Test Soumission Image

```bash
Admin:
1. Naviguer vers slide de type "exercise"

Participant:
2. Voir zone drag & drop apparaître
3. Glisser une image (PNG/JPG)
4. Voir upload + confirmation

Admin:
5. Onglet "Galería"
6. Voir image apparaître en temps réel ✨
```

### 4️⃣ Test Diffusion

```bash
Admin:
1. Clic étoile sur image → Favori
2. Clic "Difundir Favoritos"

Participant:
3. Écran bascule automatiquement
4. Voir galerie + indicateur "EN VIVO" 🔴
5. Sa création mise en évidence

Admin:
6. Clic "Detener Difusión"

Participant:
7. Retour automatique au slide normal
```

---

## ✅ Checklist Finale

- [ ] Migration 004 exécutée
- [ ] Bucket Storage "workshop-content" existe (et public)
- [ ] .env.local configuré avec SUPABASE_URL + ANON_KEY
- [ ] `npm run dev` fonctionne sans erreur
- [ ] Onglet "Galería" visible dans admin
- [ ] Champ email visible dans formulaire join
- [ ] Zone drag & drop apparaît sur slides exercice
- [ ] Upload image fonctionne
- [ ] Image visible dans galerie admin temps réel
- [ ] Diffusion galerie synchronise participant

---

## 🎯 Fonctionnalités Prêtes

✅ **Email obligatoire** → Reconnexion automatique  
✅ **Soumission images** → Drag & drop + validation  
✅ **Galerie admin** → Temps réel + favoris  
✅ **Diffusion** → 3 modes (toutes/favoris/unique)  
✅ **Persistance** → Participant ne perd jamais ses soumissions  

---

## 📖 Docs Complètes

Voir [GALERIA_COLABORATIVA.md](./GALERIA_COLABORATIVA.md) pour:
- Architecture détaillée
- Guide utilisateur complet
- Troubleshooting
- Améliorations futures

---

**Temps total installation: ~7 minutes** ⚡
