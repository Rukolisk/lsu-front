# backend/Dockerfile

# --- 1) Dépendances complètes (dev) pour compiler TS ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- 2) Build TypeScript -> dist/ ---
FROM node:20-alpine AS build
WORKDIR /app
# on a besoin des node_modules + du package.json pendant le build
COPY --from=deps /app/node_modules node_modules
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# --- 3) Runner prod : deps prod uniquement + dist ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# installer uniquement les deps prod (pas besoin de prune après)
COPY package*.json ./
RUN npm ci --omit=dev

# copier le code compilé
COPY --from=build /app/dist dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
