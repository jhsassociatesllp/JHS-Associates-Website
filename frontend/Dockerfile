# ==========================================
# BUILD STAGE
# ==========================================

FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# IMPORTANT
ARG VITE_API_BASE_URL
ARG VITE_TURNSTILE_SITE_KEY

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY

RUN npm run build

# list of real page URLs, so the web server can answer unknown URLs with HTTP 404
RUN node scripts/gen-known-routes.mjs

# ==========================================
# NGINX STAGE
# ==========================================

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY security-headers.conf /etc/nginx/security-headers.conf

COPY --from=build /app/known-routes.inc /etc/nginx/conf.d/known-routes.inc

EXPOSE 80