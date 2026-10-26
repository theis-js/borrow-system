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

# Generate info.json from the workspace package.json versions, without the "-dev" suffix
RUN node -e ' \
  const fs = require("fs"); \
  const v = (p) => "v" + JSON.parse(fs.readFileSync(p + "/package.json")).version.replace(/-dev$/, ""); \
  fs.writeFileSync("backend/info.json", JSON.stringify({ \
    "backend-info": { version: v("backend") }, \
    "frontend-info": { version: v("frontend") }, \
    "admin-panel-info": { version: v("admin") } \
  }, null, 4)); \
'

WORKDIR /app/backend
EXPOSE 8004
CMD ["npm", "start"]
