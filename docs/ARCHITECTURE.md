# 🏗️ Arquitectura - Destino IA

## Visión General

Este documento describe las decisiones arquitectónicas del proyecto y sirve como guía para mantener la consistencia a medida que el proyecto crece.

> **Nota:** Este proyecto utiliza solo **PDF.js + Supabase**. No incluye funcionalidades de IA.

## Principios de Diseño

### 1. Separación por Responsabilidad

Cada carpeta y archivo tiene **una única razón de existir**. No mezclamos:

- Lógica de negocio con UI
- Configuración con código de aplicación

### 2. Feature-First Architecture

En lugar de agrupar por tipo de archivo (components/, hooks/, utils/), agrupamos por **funcionalidad**:

```
❌ Evitamos:
components/
├── AdminDashboard.tsx
├── ParticipantView.tsx
├── JoinForm.tsx
└── ChatRoom.tsx

✅ Preferimos:
features/
├── admin/
│   └── components/AdminDashboard.tsx
├── workshop/
│   └── components/ParticipantView.tsx
└── auth/
    └── components/JoinForm.tsx
```

**Beneficios:**

- Cada feature es auto-contenida
- Fácil de eliminar o mover features completas
- Reduce conflictos en trabajo paralelo
- Escalabilidad horizontal natural

### 3. PDF Processing

Procesamiento de documentos PDF usando PDF.js cargado via CDN:

```
App.tsx
    ↓ usa
features/admin
    ↓ usa
hooks/useSlideGeneration
    ↓ procesa con
PDF.js (CDN global)
```

### 4. Barrel Exports

Cada carpeta expone su API pública a través de `index.ts`:

```typescript
// ❌ Evitamos imports profundos
import { Button } from "@/components/ui/Button";

// ✅ Preferimos imports desde barrel
import { Button } from "@/components/ui";
```

## Capas de la Aplicación

```
┌─────────────────────────────────────────────┐
│                   UI Layer                   │
│  (App.tsx, features/*/components)           │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│               Feature Layer                  │
│  (features/*/hooks, features/*/utils)       │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│              Services Layer                  │
│  (services/supabase)                        │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│              Config Layer                    │
│  (config/env, config/constants)             │
└─────────────────────────────────────────────┘
```

### Reglas de Dependencia

| Capa     | Puede importar de                      |
| -------- | -------------------------------------- |
| UI       | Features, Components, Services, Config |
| Features | Services, Types, Hooks, Lib, Config    |
| Services | Config, Types                          |
| Config   | (ninguna)                              |

## Procesamiento de PDFs

### Cómo Funciona

El hook `useSlideGeneration` extrae texto de documentos PDF y crea slides automáticamente:

1. **Carga del PDF**: Usando PDF.js via CDN
2. **Extracción de texto**: Página por página
3. **Creación de slides**: Un slide por página con título y contenido

```typescript
const { isProcessing, error, processDocument } = useSlideGeneration({
  onSuccess: (slides) => setSlides(slides),
});

// Procesar un archivo PDF
await processDocument(pdfFile);
```

## Estado y Datos

### Estado Local (useState)

- UI state (modals abiertos, tabs activos)
- Form state temporal
- Estado efímero

### Estado Persistente (localStorage)

- Preferencias de usuario
- Cache de datos no críticos

### Estado Global (Context/Zustand) - Futuro

- Sesión del taller
- Usuario autenticado
- Configuración global

### Estado Servidor (Supabase)

- Slides y contenido
- Participantes
- Mensajes de chat

## Convenciones de Código

### Archivos

```
ComponentName.tsx      # Componente React
useHookName.ts         # Custom hook
utilityName.ts         # Función utilitaria
CONSTANT_NAME.ts       # Constantes (si es archivo dedicado)
types.ts               # Definiciones de tipos
index.ts               # Barrel export
```

### Componentes

```typescript
/**
 * @file Button.tsx
 * @description Componente de botón reutilizable
 */

interface ButtonProps {
  variant?: "primary" | "secondary";
  // ...
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  // ...
}) => {
  // Implementación
};
```

### Hooks

```typescript
/**
 * Hook para manejar generación de slides
 */
export function useSlideGeneration(options: Options): Return {
  // 1. Estado
  const [state, setState] = useState();

  // 2. Efectos
  useEffect(() => {}, []);

  // 3. Callbacks
  const handleAction = useCallback(() => {}, []);

  // 4. Return
  return { state, handleAction };
}
```

## Testing Strategy (Futuro)

```
__tests__/
├── unit/           # Tests de funciones puras
├── integration/    # Tests de hooks y servicios
└── e2e/            # Tests end-to-end
```

### Prioridad de Tests

1. **Hooks**: Lógica de negocio
2. **Utils**: Funciones utilitarias
3. **Components**: Comportamiento crítico

## Performance

### Code Splitting

```typescript
// Lazy loading de features pesadas
const AdminDashboard = lazy(() => import("@/features/admin"));
```

### Bundle Optimization

```typescript
// vite.config.ts
rollupOptions: {
  output: {
    manualChunks: {
      vendor: ['react', 'react-dom'],
      ui: ['lucide-react'],
    },
  },
}
```

## Evolución del Proyecto

### Agregar Nueva Feature

1. Crear `src/features/nueva-feature/`
2. Implementar componentes, hooks, types
3. Exportar desde `index.ts`
4. Integrar en App.tsx

### Agregar Nuevo Servicio

1. Crear `src/services/nuevo-servicio/`
2. Implementar client.ts con singleton
3. Exportar desde index.ts
4. Configurar en `config/env.ts`

---

_Última actualización: Enero 2026_
