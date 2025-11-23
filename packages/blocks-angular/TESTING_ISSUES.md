# Problemas de Testing en Angular 21 con Vitest

## Resumen

Los tests de componentes Angular que usan `templateUrl` externos fallan en el entorno de Vitest debido a cómo Angular 21 analiza los componentes durante la importación, antes de que cualquier override pueda aplicarse.

## Estado Actual

- ✅ **Tests del servicio (`CartService`)**: ✅ 11 tests pasando
- ❌ **Tests de componentes**: ❌ 29 tests fallando
  - `CartItemComponent`: 8 tests fallando
  - `CartSummaryComponent`: 13 tests fallando
  - `CartViewComponent`: 8 tests fallando

## Problema Técnico

### Causa Raíz

Angular 21 analiza los componentes cuando se importan en `configureTestingModule`, **antes** de que cualquier override pueda aplicarse. El error ocurre durante el análisis del decorador `@Component`, cuando Angular intenta resolver el `templateUrl`:

```
Error: Component 'CartItemComponent' is not resolved:
 - templateUrl: ./cart-item.component.html
Did you run and wait for 'resolveComponentResources()'?
```

### Intentos de Solución

Se han intentado múltiples enfoques:

1. **ResourceLoader personalizado**: Configurado en `setup.ts`, pero no se usa durante el análisis de componentes
2. **`overrideTemplate`**: No funciona porque el análisis ocurre antes de `configureTestingModule`
3. **`overrideComponent` con `remove`/`add`**: No funciona porque el análisis ocurre durante la importación
4. **`NO_ERRORS_SCHEMA`**: No previene el error durante el análisis
5. **`@analogjs/vitest-angular`**: No compatible con la versión actual de Vite/Vitest

### Por Qué No Funciona

El flujo de Angular es:
1. **Importación del componente** → Angular analiza el decorador `@Component`
2. **Análisis del decorador** → Angular intenta resolver `templateUrl` inmediatamente
3. **Error** → El ResourceLoader no está disponible durante este análisis
4. **`configureTestingModule`** → Se ejecuta después, demasiado tarde

## Soluciones Potenciales

### Opción 1: Templates Inline en Componentes de Prueba (Recomendado)

Crear componentes de prueba con templates inline directamente, sin usar `templateUrl`:

```typescript
@Component({
  selector: 'vk-cart-item-test',
  standalone: true,
  template: `<!-- template inline aquí -->`
})
class TestCartItemComponent extends CartItemComponent {}
```

**Ventajas**: Funciona inmediatamente, no requiere cambios en componentes de producción  
**Desventajas**: Duplica código de templates, requiere mantenimiento

### Opción 2: Esperar a `@analogjs/vitest-angular`

Esperar a que `@analogjs/vitest-angular` tenga mejor soporte para Angular 21 y resolución de templates.

**Ventajas**: Solución oficial, sin cambios en código  
**Desventajas**: Requiere esperar actualizaciones del paquete

### Opción 3: Usar Angular CLI para Tests

Usar `ng test` en lugar de Vitest para los tests de componentes Angular.

**Ventajas**: Funciona nativamente con Angular  
**Desventajas**: Requiere configuración adicional, no integrado con el resto del monorepo

## Configuración Actual

### `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/__tests__/**/*.test.ts'],
  },
  resolve: {
    conditions: ['default', 'import', 'module', 'browser', 'style'],
  },
  optimizeDeps: {
    include: [
      '@angular/core',
      '@angular/common',
      '@angular/compiler',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      'zone.js',
    ],
  },
  esbuild: {
    target: 'es2020',
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        useDefineForClassFields: false,
      },
    },
  },
});
```

### `setup.ts`

Configurado con:
- ResourceLoader personalizado (`VitestResourceLoader`)
- Inicialización del entorno de testing de Angular
- Configuración del compilador con ResourceLoader

## Referencias

- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Vitest Angular Integration](https://vitest.dev/guide/integrations/angular.html)
- [@analogjs/vitest-angular](https://github.com/analogjs/analog/tree/main/packages/vitest-angular)

## Próximos Pasos

1. Decidir qué solución implementar (Opción 1, 2 o 3)
2. Actualizar la documentación cuando se resuelva
3. Continuar con otras partes del proyecto mientras tanto

---

**Última actualización**: Noviembre 2025  
**Versión de Angular**: 21.0.0  
**Versión de Vitest**: 2.1.9



