FROM node:20-alpine

WORKDIR /backend

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8102

CMD ["npm", "start"]