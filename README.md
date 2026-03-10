# Pattern Intelligence API Platform

A production-ready Node.js/Express API written in TypeScript for pattern analysis across text payloads.

## Features

- Express.js + TypeScript architecture
- Main analysis endpoint: `POST /api/analyze`
- Supports **plain text** and **regex** pattern matching
- Returns occurrences, match positions, and up to 5 samples per pattern
- Request validation with descriptive 400 errors
- Rate limiting: 100 requests per 15 minutes per IP
- CORS enabled for all origins
- HTTP request logging via Morgan
- Health endpoint: `GET /health`
- Unit + integration tests with Jest + Supertest
- Docker multi-stage production image and docker-compose setup

## Project Structure

```text
.
├── src
│   ├── index.ts
│   ├── middleware
│   │   └── validator.ts
│   ├── routes
│   │   └── analyze.ts
│   ├── services
│   │   └── patternDetector.ts
│   └── types
│       └── index.ts
├── tests
│   └── analyze.test.ts
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── jest.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Requirements

- Node.js 18+
- npm 9+
- (Optional) Docker + Docker Compose

## Environment Variables

Copy and customize:

```bash
cp .env.example .env
```

Variables:

- `PORT` (default: `3000`)
- `NODE_ENV` (`development`, `test`, `production`)

## Local Setup

```bash
npm install
npm run dev
```

The API runs on `http://localhost:3000`.

## Scripts

- `npm run dev` - start in development with nodemon + ts-node
- `npm run build` - compile TypeScript into `dist/`
- `npm run start` - run compiled production build
- `npm test` - run tests with coverage thresholds

## API

### Health Check

`GET /health`

Response:

```json
{
  "status": "ok",
  "environment": "development"
}
```

### Analyze Text

`POST /api/analyze`

Request body format:

```json
{
  "text": "string",
  "patterns": ["string"]
}
```

Response body format:

```json
{
  "matches": [
    {
      "pattern": "string",
      "occurrences": 0,
      "positions": [0],
      "samples": ["string"]
    }
  ],
  "metadata": {
    "totalPatterns": 1,
    "processingTime": "0.14ms"
  }
}
```

## Example cURL Calls (3 Use Cases)

1. **Plain text matching**

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "error info error warning error",
    "patterns": ["error"]
  }'
```

2. **Regex matching** (email detection)

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "Users: a@b.com, c@d.org",
    "patterns": ["/[a-z]+@[a-z]+\\.[a-z]+/g"]
  }'
```

3. **Mixed patterns**

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "alpha beta alpha 123 beta",
    "patterns": ["alpha", "/\\d+/g", "beta"]
  }'
```

## Validation Rules

- `text` must be a non-empty string
- `text` max length: 50,000 chars
- `patterns` must be an array
- `patterns` size: 1 to 10
- every pattern must be a non-empty string

Invalid input returns HTTP `400` with a descriptive error message.

## Testing

```bash
npm test
```

Coverage thresholds are enforced globally at **80%** for branches, functions, lines, and statements.

## Docker

Build and run:

```bash
docker-compose up --build
```

Service exposed at `http://localhost:3000`.

Health check:

```bash
curl http://localhost:3000/health
```
