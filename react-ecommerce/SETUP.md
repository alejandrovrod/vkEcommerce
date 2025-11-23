# Setup Guide for React E-commerce Example

## Quick Start

### Step 1: Get a GitHub Personal Access Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Name it (e.g., "npm-packages-read")
4. Select scope: `read:packages`
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

### Step 2: Set the Token as Environment Variable

#### Windows PowerShell:
```powershell
$env:GITHUB_TOKEN="ghp_your_token_here"
```

#### Windows CMD:
```cmd
set GITHUB_TOKEN=ghp_your_token_here
```

#### Linux/Mac:
```bash
export GITHUB_TOKEN=ghp_your_token_here
```

**To make it permanent:**

- **Windows**: Add it via System Properties → Environment Variables
- **Linux/Mac**: Add `export GITHUB_TOKEN="ghp_your_token_here"` to your `~/.bashrc` or `~/.zshrc`

### Step 3: Install Dependencies

```bash
cd react-ecommerce
npm install
```

### Step 4: Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Troubleshooting

### Error: "401 Unauthorized" or "authentication token not provided"

**Solution:** Make sure you've set the `GITHUB_TOKEN` environment variable and it's available in your current terminal session.

**Verify the token is set:**
- Windows PowerShell: `echo $env:GITHUB_TOKEN`
- Windows CMD: `echo %GITHUB_TOKEN%`
- Linux/Mac: `echo $GITHUB_TOKEN`

**If not set, set it again in the same terminal session before running `npm install`.**

### Error: "404 Not Found" or "package not found"

**Possible causes:**
1. The packages haven't been published to GitHub Packages yet
2. The package name/scope is incorrect
3. The token doesn't have the correct permissions

**Solution:** Verify the packages exist at: `https://github.com/alejandrovrod/vkEcommerce/packages`

### Token expires or is revoked

If your token expires or is revoked, you'll need to:
1. Generate a new token
2. Update the `GITHUB_TOKEN` environment variable
3. Run `npm install` again

## Alternative: Using .npmrc with token directly (NOT RECOMMENDED)

⚠️ **Warning:** Never commit tokens to version control!

If you must use a token directly in `.npmrc` (not recommended), you can temporarily add:

```
@alejandrovrod:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_your_token_here
```

**But make sure to:**
1. Add `.npmrc` to `.gitignore` (it's already there)
2. Never commit this file
3. Use environment variables instead when possible


