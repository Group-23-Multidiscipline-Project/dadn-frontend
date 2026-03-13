# syntax=docker/dockerfile:1

# base stage with dependencies
FROM node:20-alpine AS base
WORKDIR /app

# copy only package manifests first to leverage caching
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# development stage (run `npm run dev` with volume mounts)
FROM base AS development
EXPOSE 5173
CMD ["npm", "run", "dev"]

# build stage to produce static assets
FROM base AS build
RUN npm run build

# production image serves built files with nginx
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
