FROM node:latest AS base

WORKDIR /app
COPY package*.json .
RUN npm ci

FROM base AS prod
COPY . .
RUN npm run build
