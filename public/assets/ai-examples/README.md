# 📁 Assets AI Examples - Guide d'Utilisation

## Structure des Dossiers

```
public/
└── assets/
    └── ai-examples/
        ├── examples.json      # Catalogue des exemples (metadata)
        ├── images/            # Images statiques (.webp recommandé)
        │   ├── exercise-01-intro.webp
        │   ├── exercise-02-corporate.webp
        │   └── ...
        └── videos/            # Vidéos de démonstration (.mp4)
            ├── exercise-05-i2v.mp4
            └── ...
```

## Pourquoi des Assets Statiques ?

### 🔴 Problème Initial
Les exemples AI stockés dans Supabase Storage consommaient le quota egress (2 GB/mois gratuit) à chaque téléchargement.

### ✅ Solution
- **Assets statiques dans `/public`** → Servis via CDN Vercel (100 GB/mois gratuit)
- **Egress Supabase = 0** pour ces assets
- **Cache mondial** → Chargement ultra-rapide
- **Pas de requête API** → Pas de latence

## Utilisation dans le Code

### Hook `useAIExamples`

```tsx
import { useAIExamples } from '@/hooks';

function MyComponent() {
  const { examples, gallery, isLoading, getExampleById } = useAIExamples();

  if (isLoading) return <Loader />;

  // Récupérer un exemple par ID
  const example = getExampleById('01');

  return (
    <img 
      src={example?.url} 
      alt={example?.title} 
    />
  );
}
```

### Accès Direct (URL statique)

```tsx
// Image
<img src="/assets/ai-examples/images/exercise-01-intro.webp" />

// Vidéo
<video src="/assets/ai-examples/videos/exercise-05-i2v.mp4" />
```

## Ajouter un Nouvel Exemple

### 1. Ajouter le fichier média

```bash
# Image (recommandé: WebP pour compression optimale)
public/assets/ai-examples/images/mon-exemple.webp

# Vidéo (MP4 H.264 pour compatibilité maximale)
public/assets/ai-examples/videos/mon-video.mp4
```

### 2. Mettre à jour `examples.json`

```json
{
  "exercises": {
    "mon-id": {
      "id": "mon-id",
      "type": "image",
      "title": "Mon Exemple",
      "tool": "Midjourney v6",
      "url": "/assets/ai-examples/images/mon-exemple.webp",
      "prompt": "A stunning landscape...",
      "description": "Description de l'exemple"
    }
  }
}
```

### 3. Invalider le cache (optionnel)

```tsx
import { invalidateAIExamplesCache } from '@/hooks';

// Après mise à jour admin
invalidateAIExamplesCache();
```

## Formats Recommandés

| Type | Format | Qualité | Taille Max |
|------|--------|---------|------------|
| Image | WebP | 80-85% | 500 KB |
| Thumbnail | WebP | 75% | 100 KB |
| Vidéo | MP4 (H.264) | 720p | 5 MB |

### Conversion WebP (ImageMagick)

```bash
# Convertir PNG/JPG vers WebP
convert input.png -quality 85 output.webp

# Redimensionner + WebP
convert input.png -resize 1080x1920 -quality 80 output.webp
```

### Compression Vidéo (FFmpeg)

```bash
# MP4 optimisé web
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4
```

## Quand Utiliser Supabase Storage ?

| Use Case | Asset Statique | Supabase Storage |
|----------|---------------|------------------|
| Exemples de démo (admin) | ✅ | ❌ |
| Galerie d'inspiration | ✅ | ❌ |
| Uploads participants | ❌ | ✅ |
| Contenu dynamique | ❌ | ✅ |
| Résultats de session | ❌ | ✅ |

## Impact FinOps

| Avant | Après |
|-------|-------|
| ~1.5 GB egress/mois | 0 GB egress |
| $0 → $25 risque | $0 garanti |
| Latence API | Cache CDN mondial |

---

**Note:** Ce dossier est versionné avec Git. Les assets volumineux (>5MB) devraient utiliser Git LFS ou être exclus via `.gitignore`.
