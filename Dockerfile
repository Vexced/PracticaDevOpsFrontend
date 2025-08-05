# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY public ./public
COPY src ./src
COPY index.html .

RUN npm run build

# Production image
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración custom para permitir React Router (opcional)
RUN echo "server {\
  listen 80;\
  server_name localhost;\
  location / {\
    root /usr/share/nginx/html;\
    index index.html index.htm;\
    try_files \$uri /index.html;\
  }\
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
