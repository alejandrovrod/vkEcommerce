# Instalación de Paquetes

Los paquetes de `@vk/blocks-*` están publicados en GitHub Packages. Para instalarlos en tu proyecto, necesitas configurar npm/pnpm para usar el registry de GitHub Packages.

## Configuración Inicial

### 1. Crear un Personal Access Token (PAT) en GitHub

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Crea un nuevo token con el scope `read:packages`
3. Copia el token generado

### 2. Configurar el Registry

#### Para npm:

Crea o edita el archivo `.npmrc` en la raíz de tu proyecto:

```
@vk:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=TU_TOKEN_AQUI
```

#### Para pnpm:

Crea o edita el archivo `.npmrc` en la raíz de tu proyecto:

```
@vk:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=TU_TOKEN_AQUI
```

#### Para yarn:

Crea o edita el archivo `.yarnrc.yml` en la raíz de tu proyecto:

```yaml
npmScopes:
  vk:
    npmRegistryServer: "https://npm.pkg.github.com"
```

Y configura el token en `.npmrc`:

```
//npm.pkg.github.com/:_authToken=TU_TOKEN_AQUI
```

### 3. Configurar el Token de Forma Segura

**⚠️ IMPORTANTE:** Nunca commits el token directamente en `.npmrc`. Usa variables de entorno:

#### Opción 1: Variable de entorno (Recomendado)

En tu `.npmrc`:
```
@vk:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Luego configura la variable de entorno:
```bash
# Linux/Mac
export GITHUB_TOKEN=tu_token_aqui

# Windows (PowerShell)
$env:GITHUB_TOKEN="tu_token_aqui"

# Windows (CMD)
set GITHUB_TOKEN=tu_token_aqui
```

#### Opción 2: Usar archivo local (no versionado)

Crea un `.npmrc.local` (agregado a `.gitignore`):
```
@vk:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=tu_token_aqui
```

Y en tu `.npmrc` principal:
```
@vk:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## Instalación de Paquetes

Una vez configurado el registry, puedes instalar los paquetes normalmente:

### React

```bash
npm install @vk/blocks-core @vk/blocks-react
# o
pnpm add @vk/blocks-core @vk/blocks-react
# o
yarn add @vk/blocks-core @vk/blocks-react
```

### Vue

```bash
npm install @vk/blocks-core @vk/blocks-vue
# o
pnpm add @vk/blocks-core @vk/blocks-vue
# o
yarn add @vk/blocks-core @vk/blocks-vue
```

### Angular

```bash
npm install @vk/blocks-core @vk/blocks-angular
# o
pnpm add @vk/blocks-core @vk/blocks-angular
# o
yarn add @vk/blocks-core @vk/blocks-angular
```

## Uso en el Código

### React

```tsx
import { useCart } from '@vk/blocks-react';
import { ProductCard } from '@vk/blocks-react';
```

### Vue

```vue
<script setup>
import { useCart } from '@vk/blocks-vue';
import ProductCard from '@vk/blocks-vue/components/ProductCard.vue';
</script>
```

### Angular

```typescript
import { CartService } from '@vk/blocks-angular';
import { ProductCardComponent } from '@vk/blocks-angular';
```

## Versiones Disponibles

Para ver las versiones disponibles:

```bash
npm view @vk/blocks-core versions --registry=https://npm.pkg.github.com
```

## Troubleshooting

### Error: 401 Unauthorized

- Verifica que tu token tenga el scope `read:packages`
- Asegúrate de que el token esté configurado correctamente en `.npmrc`
- Verifica que el scope `@vk` esté configurado correctamente

### Error: 404 Not Found

- Verifica que el paquete esté publicado en GitHub Packages
- Asegúrate de tener acceso al repositorio `alejandrovrod/vkEcommerce`
- Verifica que estés usando la versión correcta del paquete

### Error: Package not found

- Asegúrate de que el registry esté configurado correctamente
- Verifica que el scope `@vk` esté en tu `.npmrc`

## Publicar Nuevas Versiones

Las nuevas versiones se publican automáticamente cuando se crea un release en GitHub. Para publicar manualmente:

1. Ve a GitHub Actions
2. Selecciona el workflow "Publish Packages to GitHub Packages"
3. Haz clic en "Run workflow"
4. Ingresa la versión a publicar (ej: `0.1.0`)

