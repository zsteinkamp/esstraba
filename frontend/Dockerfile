FROM node:latest AS base

WORKDIR /app
COPY package*.json .
RUN npm ci
CMD npm start

FROM base AS builder
COPY . .
RUN npm run build

FROM nginx:latest AS prod
COPY --from=builder /app/build /var/www/html
