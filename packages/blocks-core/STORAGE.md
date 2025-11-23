# Estrategias de Almacenamiento para el Carrito

El módulo de carrito soporta múltiples estrategias de persistencia, permitiendo flexibilidad según las necesidades de tu aplicación.

## Estrategias Disponibles

### 1. MemoryStorage (Por Defecto)
**Sin persistencia** - Los datos se pierden al recargar la página.

```typescript
import { createCartManager } from '@alejandrovrod/blocks-core';

// Por defecto, sin persistencia
const manager = createCartManager();
```

**Cuándo usar:**
- SSR (Server-Side Rendering)
- Testing
- Aplicaciones que no necesitan persistencia
- Prototipos rápidos

---

### 2. LocalStorage
**Persistencia en el navegador** - Los datos persisten entre sesiones.

```typescript
import { createCartManager } from '@alejandrovrod/blocks-core';

// Con localStorage (explícito)
const manager = createCartManager({ persist: true });

// Con clave personalizada
const manager = createCartManager({ 
  persist: true, 
  storageKey: 'mi-tienda-cart' 
});
```

**Cuándo usar:**
- Aplicaciones cliente-side
- Cuando necesitas persistencia simple
- Carritos de usuarios no autenticados

**Limitaciones:**
- ~5-10MB de espacio
- Solo strings (serialización JSON)
- Síncrono (puede bloquear el hilo principal)

---

### 3. SessionStorage
**Persistencia por sesión** - Los datos se pierden al cerrar la pestaña.

```typescript
import { createCartManager, SessionStorageCartStorage } from '@alejandrovrod/blocks-core';

const storage = new SessionStorageCartStorage('mi-cart');
const manager = createCartManager({ storage });
```

**Cuándo usar:**
- Carritos temporales
- Cuando no quieres que los datos persistan entre sesiones
- Flujos de checkout que deben reiniciarse

---

### 4. IndexedDB
**Almacenamiento robusto** - Soporta más datos y mejor rendimiento.

```typescript
import { createCartManager, IndexedDBCartStorage } from '@alejandrovrod/blocks-core';

const storage = new IndexedDBCartStorage('mi-tienda-db', 'cart');

// Inicializar antes de usar
await storage.initialize();

const manager = createCartManager({ storage });
```

**Cuándo usar:**
- Carritos grandes (muchos items)
- Necesitas mejor rendimiento
- Aplicaciones complejas
- Cuando localStorage no es suficiente

**Ventajas:**
- Hasta varios GB de espacio
- Mejor rendimiento
- Soporte para tipos complejos
- Asíncrono (no bloquea)

---

### 5. API REST (Custom Storage)
**Sincronización con backend** - Los datos se guardan en el servidor.

```typescript
import { createCartManager, type CartStorage, type CartState } from '@alejandrovrod/blocks-core';

class ApiCartStorage implements CartStorage {
  constructor(
    private userId: string,
    private apiUrl: string = '/api/cart'
  ) {}

  save(state: CartState): void {
    // Sincronizar con API en background
    fetch(`${this.apiUrl}/${this.userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    }).catch(error => {
      console.error('Failed to sync cart:', error);
    });
  }

  load(): CartState | null {
    // Cargar estado inicial antes de crear el manager
    // Ver ejemplo completo abajo
    return null;
  }

  clear(): void {
    fetch(`${this.apiUrl}/${this.userId}`, {
      method: 'DELETE',
    }).catch(error => {
      console.error('Failed to clear cart:', error);
    });
  }
}

// Uso:
const storage = new ApiCartStorage('user-123');
const manager = createCartManager({ storage });
```

**Cuándo usar:**
- Aplicaciones con autenticación
- Necesitas sincronización multi-dispositivo
- Carritos compartidos entre usuarios
- Integración con backend existente

---

## Ejemplo Completo: API Storage con Carga Inicial

```typescript
import { createCartManager, type CartStorage, type CartState } from '@alejandrovrod/blocks-core';

class ApiCartStorage implements CartStorage {
  private cachedState: CartState | null = null;

  constructor(
    private userId: string,
    private apiUrl: string = '/api/cart'
  ) {}

  async loadInitialState(): Promise<CartState | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${this.userId}`);
      if (!response.ok) return null;
      const state = await response.json();
      this.cachedState = state;
      return state;
    } catch (error) {
      console.error('Failed to load cart from API:', error);
      return null;
    }
  }

  save(state: CartState): void {
    this.cachedState = state; // Cache local inmediato
    // Sincronizar en background
    fetch(`${this.apiUrl}/${this.userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    }).catch(error => {
      console.error('Failed to sync cart:', error);
    });
  }

  load(): CartState | null {
    return this.cachedState;
  }

  clear(): void {
    this.cachedState = null;
    fetch(`${this.apiUrl}/${this.userId}`, {
      method: 'DELETE',
    }).catch(error => {
      console.error('Failed to clear cart:', error);
    });
  }
}

// Uso:
const storage = new ApiCartStorage('user-123');
const initialState = await storage.loadInitialState();
const manager = createCartManager({ storage });

// Si hay estado inicial, restaurarlo
if (initialState) {
  initialState.items.forEach(item => {
    manager.addItem(item.product, item.quantity);
  });
}
```

---

## Comparación de Estrategias

| Estrategia | Persistencia | Capacidad | Rendimiento | Complejidad |
|------------|--------------|-----------|-------------|-------------|
| **Memory** | ❌ No | Ilimitada (RAM) | ⚡⚡⚡ Muy rápido | ⭐ Simple |
| **LocalStorage** | ✅ Sí | ~5-10MB | ⚡⚡ Rápido | ⭐ Simple |
| **SessionStorage** | ⚠️ Sesión | ~5-10MB | ⚡⚡ Rápido | ⭐ Simple |
| **IndexedDB** | ✅ Sí | Varios GB | ⚡⚡⚡ Muy rápido | ⭐⭐ Media |
| **API REST** | ✅ Sí | Ilimitada | ⚡ Depende de red | ⭐⭐⭐ Compleja |

---

## Recomendaciones

### Para Desarrollo/Testing
```typescript
// Sin persistencia - más rápido para desarrollo
const manager = createCartManager();
```

### Para Producción Simple
```typescript
// localStorage - suficiente para la mayoría de casos
const manager = createCartManager({ persist: true });
```

### Para Aplicaciones Grandes
```typescript
// IndexedDB - mejor rendimiento y capacidad
const storage = new IndexedDBCartStorage();
await storage.initialize();
const manager = createCartManager({ storage });
```

### Para Aplicaciones con Backend
```typescript
// API Storage - sincronización con servidor
const storage = new ApiCartStorage(userId);
await storage.loadInitialState();
const manager = createCartManager({ storage });
```

---

## Notas Importantes

1. **SSR/Next.js**: Usa `MemoryCartStorage` o carga el estado después del mount
2. **Privacidad**: SessionStorage es mejor si no quieres datos persistentes
3. **Performance**: IndexedDB es mejor para carritos grandes (>100 items)
4. **Sincronización**: API Storage requiere manejo de errores y retry logic









