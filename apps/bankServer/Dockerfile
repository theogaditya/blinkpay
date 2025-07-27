FROM node:23-alpine AS builder

WORKDIR /repo
COPY package.json package-lock.json yarn.lock ./

COPY packages/db/package.json packages/db/tsconfig.json ./packages/db/
COPY packages/db/prisma ./packages/db/prisma
COPY packages/db/src ./packages/db/src
COPY packages/db/.env ./packages/db/.env

COPY apps/bankServer/package.json apps/bankServer/tsconfig.json ./apps/bankServer/
COPY apps/bankServer/src ./apps/bankServer/src
COPY apps/bankServer/.env ./apps/bankServer/.env


RUN yarn install --frozen-lockfile

WORKDIR /repo/packages/db
RUN npm run build
RUN npx prisma generate

WORKDIR /repo/apps/bankServer 
RUN npm run build

FROM node:23-alpine AS runner

WORKDIR /repo

COPY --from=builder /repo/node_modules ./node_modules

COPY --from=builder /repo/apps/bankServer/package.json ./package.json
COPY --from=builder /repo/apps/bankServer/node_modules ./node_modules
COPY --from=builder /repo/apps/bankServer/dist ./dist
COPY --from=builder /repo/apps/bankServer/.env ./.env

COPY --from=builder /repo/packages/db/package.json ./packages/db/package.json
COPY --from=builder /repo/packages/db/prisma ./packages/db/prisma
COPY --from=builder /repo/packages/db/dist ./packages/db/dist
COPY --from=builder /repo/packages/db/.env ./packages/db/.env


EXPOSE 3004
CMD ["node", "dist/index.js"]
