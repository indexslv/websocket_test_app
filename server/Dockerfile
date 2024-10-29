# Dockerfile for Node.js Backend
FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["node", "index.js"]
