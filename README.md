# KnowledgeTrace Client

React + Vite frontend application for KnowledgeTrace platform.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` file (see `.env.example` for reference)

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

Create `.env.local` file with:
```
VITE_API_BASE_URL=https://knowledgetrace-server.onrender.com/api
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## Deployment

See `../DEPLOY.md` for detailed deployment instructions.

The app is configured for Netlify deployment with:
- `netlify.toml` - Build configuration
- `public/_redirects` - SPA routing support
