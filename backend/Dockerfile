# ---------- Dependencies Stage ----------
    FROM node:20-alpine AS deps
    WORKDIR /app
    
    # Install pnpm once
    RUN npm install -g pnpm
    RUN ls /usr/local/bin

    # Copy only lockfile + package.json to leverage caching
    COPY pnpm-lock.yaml package.json ./
    
    # Install dependencies but NOT devDependencies
    RUN pnpm install --frozen-lockfile --prod
    
    # ---------- Builder Stage (Optional if you compile code like TS) ----------
    # FROM node:20-alpine AS build
    # WORKDIR /app
    # COPY --from=deps /app/node_modules ./node_modules
    # COPY . .
    # RUN pnpm build
    
    # ---------- Production Stage ----------
    FROM node:20-alpine AS prod
    WORKDIR /app
    
    # Copy pnpm binary from deps stage to avoid re-installing
    RUN npm install -g pnpm
    RUN ls /usr/local/bin

    # Copy compiled app or full source if not using TS
    COPY --from=deps /app/package.json ./
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    RUN rm -f .env
    
    # Set environment variables if needed
    # ENV NODE_ENV=production
    
    EXPOSE 5000
    
    CMD ["pnpm", "start"]
    