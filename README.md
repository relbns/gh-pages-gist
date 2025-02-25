# Gist Storage App

A React application that uses GitHub Gists as a backend for storage and includes client-side authentication for password protection.

## Features

- Uses GitHub Gists as a backend storage solution
- Client-side authentication with username/password
- Protected routes with authentication checks
- HashRouter for GitHub Pages compatibility
- Simple CRUD operations for data management

## Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/gist-storage-app.git
cd gist-storage-app
npm install
```

### 2. GitHub Personal Access Token

Create a GitHub Personal Access Token with the 'gist' scope:

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate a new token with the "gist" scope
3. Create a `.env.local` file in the project root with:

```
VITE_GITHUB_TOKEN=your_github_personal_access_token_here
```

### 3. Development

Start the development server:

```bash
npm run dev
```

### 4. GitHub Pages Deployment

Update the repository name in `vite.config.js`:

```js
base: '/your-repo-name/',
```

Then deploy with:

```bash
npm run deploy
```

Or push to the main branch to trigger the GitHub Actions workflow.

## Authentication

This project uses a client-side authentication system:

- First-time users create credentials
- Authentication state is stored in localStorage
- Login state is tracked in sessionStorage

**Note:** This is not a production-grade authentication system. It's suitable for personal projects but not for protecting truly sensitive data.

## Security Considerations

- Client-side only: All authentication happens in the browser
- Local storage: Credentials are stored locally with simple hashing
- No backend validation: For truly sensitive data, use a proper backend authentication system

## License

MIT
