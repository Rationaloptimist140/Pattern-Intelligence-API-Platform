# Pattern Intelligence Frontend (Next.js 14)

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3001

## Build for production

```bash
npm run build
npm run start
```

## Docker

```bash
docker build -t pattern-intelligence-frontend .
docker run --rm -p 3001:3001 --env-file .env.example pattern-intelligence-frontend
```
