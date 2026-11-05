# ---------- Build Stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package descriptors
COPY package.json pnpm-lock.yaml ./

# Install dependencies using frozen lockfile
RUN pnpm install --frozen-lockfile

# Build arguments for Vite environment variables
ARG VITE_API_URL
ARG VITE_BACKEND_URL
ARG VITE_SOCKET_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

# Copy client source code
COPY . .

# Build client production bundle
RUN pnpm run build

# ---------- Production Stage ----------
FROM nginx:stable-alpine AS prod

# Copy compiled static assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy customized NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]