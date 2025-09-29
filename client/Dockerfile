# ---------- Dependencies Stage ----------
    
    FROM node:20-alpine AS build


    WORKDIR /app
    
    # Install pnpm globally
    # RUN npm install -g pnpm
    

    
    # Reuse pnpm from deps stage (no need to install again)
    # RUN npm install -g pnpm
    COPY package-lock.json package.json ./

    RUN npm install --legacy-peer-deps
    
    # Copy the rest of the app (this could change your cache layer)
    COPY . .
    RUN rm -fr .env 
    
    # Run build (no need for offline install if the dependencies were already installed)
    RUN npm run build && chmod -R 755 dist
    
    # ---------- Production Stage ----------
    FROM nginx:stable-alpine AS prod
    
    # Copy built static files to nginx directory
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Optional: Replace default NGINX config with a custom one
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    