FROM node:16-alpine AS client

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2 - the production environment

FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=client /app/build ./build

EXPOSE 3000

CMD [ "npm", "start" ]

