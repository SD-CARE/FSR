FROM node:16-alpine AS build-server
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
ENV .env/ .env
EXPOSE 8080
CMD ["npm", "run", "dev"]