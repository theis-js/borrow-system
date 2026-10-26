# Build context is the repo root (npm workspaces share one root package-lock.json)
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json frontend/
COPY admin/package.json admin/
COPY backend/package.json backend/
RUN npm ci -w backend --omit=dev

COPY backend/ backend/

WORKDIR /app/backend
EXPOSE 8004
CMD ["npm", "start"]
