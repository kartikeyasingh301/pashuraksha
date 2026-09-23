FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY . .
ENV PORT=3000
EXPOSE $PORT
CMD ["node", "app.js"]

