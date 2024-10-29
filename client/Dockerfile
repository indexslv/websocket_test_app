# Dockerfile for React Frontend
# FROM node:latest
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build
# EXPOSE 3000
# CMD ["npx", "serve", "-s", "build", "-l", "3000"]

FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]