FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /backend

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 8004
CMD ["npm", "start"]