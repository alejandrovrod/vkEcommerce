# Guía de Desarrollo

Esta guía está dirigida a desarrolladores que quieren contribuir o trabajar en el proyecto vkecomblocks.

## 📋 Tabla de Contenidos

- [Requisitos](#requisitos)
- [Configuración del Entorno](#configuración-del-entorno)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts Disponibles](#scripts-disponibles)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Convenciones de Código](#convenciones-de-código)
- [Testing](#testing)
- [Publicación](#publicación)

## Requisitos

- **Node.js**: >=18.0.0 (recomendado: 20.x o 22.x)
- **pnpm**: >=8.0.0
- **TypeScript**: >=5.6.0

## Configuración del Entorno

### 1. Clonar el Repositorio

```bash
git clone https://github.com/alejandrovrod/vkEcommerce.git
cd vkEcommerce
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Verificar Instalación

```bash
pnpm build
pnpm test
```

## Estructura del Proyecto

```
vkecomblocks/
├── packages/
│   ├── blocks-core/          # Lógica core (TypeScript puro)
│   ├── blocks-react/         # Wrapper para React
│   ├── blocks-vue/           # Wrapper para Vue 3
│   └── blocks-angular/       # Wrapper para Angular
├── docs/                     # Documentación
├── .github/
│   └── workflows/           # GitHub Actions
├── package.json             # Configuración del monorepo
└── pnpm-workspace.yaml      # Configuración de pnpm workspace
```

### Estructura de un Paquete

```
packages/blocks-{framework}/
├── src/
│   ├── index.ts             # Exports principales
│   ├── hooks/               # Hooks/composables (React/Vue)
│   ├── services/            # Servicios (Angular)
│   ├── components/          # Componentes
│   └── __tests__/           # Tests
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## Scripts Disponibles

### En la Raíz del Proyecto

```bash
# Instalar dependencias
pnpm install

# Compilar todos los paquetes
pnpm build

# Ejecutar todos los tests
pnpm test

# Ejecutar tests en modo watch
pnpm test:watch

# Verificar tipos TypeScript
pnpm typecheck

# Limpiar builds
pnpm clean
```

### En un Paquete Específico

```bash
# Compilar un paquete específico
pnpm --filter @alejandrovrod/blocks-core build

# Ejecutar tests de un paquete
pnpm --filter @alejandrovrod/blocks-react test

# Verificar tipos
pnpm --filter @alejandrovrod/blocks-vue typecheck
```

## Flujo de Trabajo

### 1. Crear una Rama

```bash
git checkout -b feature/nueva-funcionalidad
```

### 2. Desarrollar

- Escribe código siguiendo las convenciones
- Añade tests para nuevas funcionalidades
- Actualiza la documentación si es necesario

### 3. Verificar

```bash
# Compilar
pnpm build

# Ejecutar tests
pnpm test

# Verificar tipos
pnpm typecheck
```

### 4. Commit

```bash
git add .
git commit -m "feat: descripción de la funcionalidad"
```

### 5. Push y Crear Pull Request

```bash
git push origin feature/nueva-funcionalidad
```

## Convenciones de Código

### TypeScript

- Usar TypeScript estricto
- Preferir `type` sobre `interface` para tipos simples
- Exportar tipos explícitamente cuando sea necesario
- Usar JSDoc para documentar funciones públicas

### Nombres

- **Componentes**: PascalCase (`CartView`, `ProductCard`)
- **Hooks/Composables**: camelCase con prefijo `use` (`useCart`, `useProducts`)
- **Servicios**: PascalCase con sufijo `Service` (`CartService`, `ProductService`)
- **Funciones**: camelCase (`createCartManager`, `addItem`)
- **Tipos**: PascalCase (`CartState`, `Product`)

### Estructura de Archivos

```typescript
// 1. Imports externos
import { useState } from 'react';

// 2. Imports internos
import { useCart } from '../hooks/useCart';

// 3. Imports de tipos
import type { Product } from '@alejandrovrod/blocks-core';

// 4. Tipos/Interfaces
export interface ComponentProps {
  // ...
}

// 5. Componente/Función
export function Component(props: ComponentProps) {
  // ...
}
```

### Documentación JSDoc

```typescript
/**
 * Descripción breve de la función
 * 
 * @param product - El producto a agregar al carrito
 * @param quantity - Cantidad a agregar (default: 1)
 * @returns El ID del item agregado
 * 
 * @example
 * ```tsx
 * const { addItem } = useCart();
 * addItem(product, 2);
 * ```
 */
export function addItem(product: Product, quantity: number = 1): string {
  // ...
}
```

## Testing

### Escribir Tests

Los tests se escriben usando **Vitest**. Ubica los tests en `__tests__/` dentro de cada paquete.

```typescript
import { describe, it, expect } from 'vitest';
import { useCart } from '../hooks/useCart';

describe('useCart', () => {
  it('should add item to cart', () => {
    // Test implementation
  });
});
```

### Ejecutar Tests

```bash
# Todos los tests
pnpm test

# Tests en modo watch
pnpm test:watch

# Tests de un paquete específico
pnpm --filter @alejandrovrod/blocks-core test
```

## Publicación

### Proceso de Publicación

1. **Crear un Release en GitHub**
   - Ir a "Releases" → "Create a new release"
   - Crear un tag con formato semver: `v0.1.0`, `v0.1.0-alpha`, etc.
   - El workflow se ejecutará automáticamente

2. **Publicación Manual**
   - Ir a "Actions" → "Publish Packages to GitHub Packages"
   - Click en "Run workflow"
   - Ingresar la versión (ej: `0.1.0`)

### Versionado

Seguimos [Semantic Versioning](https://semver.org/):
- **MAJOR**: Cambios incompatibles
- **MINOR**: Nuevas funcionalidades compatibles
- **PATCH**: Correcciones de bugs

Para pre-releases: `0.1.0-alpha`, `0.1.0-beta.1`, etc.

## Recursos Adicionales

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Semantic Versioning](https://semver.org/)



