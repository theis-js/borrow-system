# Build context is the repo root (npm workspaces share one root package-lock.json)
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json frontend/
COPY admin/package.json admin/
COPY backend/package.json backend/
RUN npm ci -w frontend

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

COPY frontend/ frontend/
RUN npm run build -w frontend

FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/frontend/dist .

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
