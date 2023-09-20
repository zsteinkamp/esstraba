FROM node:latest AS base

WORKDIR /app
#COPY package*.json .
COPY . .
RUN npm ci

FROM base AS prod
CMD npm run build
