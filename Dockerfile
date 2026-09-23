FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY server/package.json ./server/
RUN cd server && npm install --production
COPY . .
CMD ["node", "server/app.js"]

