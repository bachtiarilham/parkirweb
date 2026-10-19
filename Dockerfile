# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package definitions
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application source code
COPY . .

# Build SvelteKit standalone node output (adapter-node)
RUN pnpm build

# Prune devDependencies to keep image lightweight
RUN pnpm prune --prod

# Stage 2: Production Runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy node_modules and built output from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build

# Security: run as non-root user
USER node

EXPOSE 3000

CMD ["node", "build"]
