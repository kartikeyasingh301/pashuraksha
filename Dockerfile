FROM node:24-alpine
WORKDIR /app
COPY package.json ./
COPY server/package.json ./server/
RUN cd server && npm install --production
COPY . .
CMD ["node", "server/app.js"]
