# Documentación de vkecomblocks

Bienvenido a la documentación completa de **vkecomblocks**, un conjunto de paquetes modulares para construir funcionalidades de ecommerce en React, Vue y Angular.

## 📚 Estructura de Documentación

### Para Desarrolladores (Usuarios de los Paquetes)

- **[Guía de Instalación](./INSTALLATION.md)** - Cómo instalar y configurar los paquetes
- **[API Reference](./API/)** - Documentación completa de la API de cada paquete
  - [Core API](./API/core/README.md) - Funciones y tipos del paquete core
  - [React API](./API/react/README.md) - Hooks y componentes de React
  - [Vue API](./API/vue/README.md) - Composables y componentes de Vue
  - [Angular API](./API/angular/README.md) - Servicios y componentes de Angular

### Para Contribuidores (Desarrolladores del Proyecto)

- **[Guía de Desarrollo](./DEVELOPMENT.md)** - Cómo contribuir y desarrollar en el proyecto
- **[Arquitectura](./ARCHITECTURE.md)** - Estructura y diseño del proyecto
- **[Guía de Testing](./TESTING.md)** - Cómo escribir y ejecutar tests

## 🚀 Inicio Rápido

### Instalación

```bash
# Configurar registry
echo "@alejandrovrod:registry=https://npm.pkg.github.com" > .npmrc

# Instalar paquetes (ejemplo para React)
npm install @alejandrovrod/blocks-core @alejandrovrod/blocks-react
```

### Uso Básico

**React:**
```tsx
import { useCart } from '@alejandrovrod/blocks-react';

function App() {
  const { items, addItem, total } = useCart();
  // ...
}
```

**Vue:**
```vue
<script setup>
import { useCart } from '@alejandrovrod/blocks-vue';

const { items, addItem, total } = useCart();
</script>
```

**Angular:**
```typescript
import { CartService } from '@alejandrovrod/blocks-angular';

constructor(public cart: CartService) {
  // Usar cart.items(), cart.addItem(), etc.
}
```

## 📦 Paquetes Disponibles

- **@alejandrovrod/blocks-core** - Lógica core framework-agnostic
- **@alejandrovrod/blocks-react** - Hooks y componentes para React
- **@alejandrovrod/blocks-vue** - Composables y componentes para Vue 3
- **@alejandrovrod/blocks-angular** - Servicios y componentes para Angular

## 🔗 Enlaces Rápidos

- [Repositorio GitHub](https://github.com/alejandrovrod/vkEcommerce)
- [GitHub Packages](https://github.com/alejandrovrod?tab=packages)
- [Reportar un Issue](https://github.com/alejandrovrod/vkEcommerce/issues)



