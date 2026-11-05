# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package manifests
COPY package.json pnpm-lock.yaml ./

# Install dependencies (including devDependencies required for TypeScript compilation)
RUN pnpm install --frozen-lockfile

# Copy tsconfig and source files
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript to dist/
RUN pnpm run build

# Remove development dependencies to keep final image minimal
RUN pnpm prune --prod

# ---------- Production Stage ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Install pnpm for running scripts if needed
RUN npm install -g pnpm

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Copy production dependencies and compiled output
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Ensure directories for static/upload storage exist
RUN mkdir -p uploads images

EXPOSE 5000

CMD ["node", "dist/server.js"]